import { kv } from '@vercel/kv'
import { StreamingTextResponse, Message, experimental_StreamData, createStreamDataTransformer } from 'ai'
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema'
import { ChatOllama } from 'langchain/chat_models/ollama'
import { BytesOutputParser } from 'langchain/schema/output_parser'
import { searchVectorDB } from './vector-db'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { getSystemInstructions, getSearchModelContext } from './prompts';

// export const runtime = 'edge'

export async function POST(req: Request) {
  const json = await req.json()
  const { messages } = json as { messages: Message[], previewToken: string }
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    });
  }

  const contextSearchModel = new ChatOllama({
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: process.env.OLLAMA_MODEL_NAME,
    temperature: 0,
  });

  const chatModel = new ChatOllama({
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: process.env.OLLAMA_MODEL_NAME,
    temperature: 0.5,
  });

  const data = new experimental_StreamData();

  // Extract a standalone question for context search.
  const answer = await contextSearchModel.call(
    parseMessages([
      ...messages,
      {
        id: '0',
        role: 'system',
        content: getSearchModelContext,
      },
    ])
  );

  // Get the standalone question and search the vector db.
  const topDocumentsLimit = 3
  // const context = "somethghin something something"
  console.log("answer: ", answer)
  const context = await searchVectorDB(answer.content, topDocumentsLimit);

  console.log("context: ", context)
  data.append(JSON.stringify({ context }));

  const contextString = context
    .map(
      (x) => `
## ${x?.payload?.article}
${x?.payload?.content}

---

[Source link](${x?.payload?.link})
`
    )
    .join("----\n");

  const systemInstructions = getSystemInstructions(topDocumentsLimit, contextString)

  // Call and stream the LLM with the instructions, context and user messages.
  const stream = await chatModel
    .pipe(new BytesOutputParser())
    .stream(
      parseMessages([
        { id: "instructions", role: "system", content: systemInstructions },
        ...messages,
      ]),
      {
        callbacks: [{
          handleLLMEnd: async (output, runId) => {

            const llmResponses = output.generations.map(g => g.map(gen => gen.text).join('\n')).join('\n');
            messages.push({
                content: llmResponses,
                role: 'assistant'
            });
            console.log(messages)

            const title = messages[0]?.content.substring(0, 100) || 'New Chat'
            const id = messages.id ?? nanoid()
            const createdAt = Date.now()
            const path = `/chat/${id}`
            const payload = {
              id,
              title,
              userId,
              createdAt,
              path,
              messages,
              sources: context
            };
            await kv.hmset(`chat:${id}`, payload);
            await kv.zadd(`user:chat:${userId}`, {
              score: createdAt,
              member: `chat:${id}`
            });
            data.close();
          }
        }]
      }
    );

  return new StreamingTextResponse(
    stream.pipeThrough(createStreamDataTransformer(true)),
    {},
    data
  );
}

function parseMessages(messages: Message[]) {
  return messages.map((m) =>
    m.role == "user"
      ? new HumanMessage(m.content)
      : m.role == "system"
      ? new SystemMessage(m.content)
      : new AIMessage(m.content)
  );
}

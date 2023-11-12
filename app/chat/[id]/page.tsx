import React from 'react'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    return redirect(`/sign-in?next=/chat/${params.id}`);
  }

  const chat = await getChat(params.id, session.user.id);

  // Handle chat not found or access denied scenario
  if (!chat || chat?.userId.toString() !== session?.user?.id.toString()) {
    // Option 1: Return a custom 404 component or error message
    return <div>Chat not found or access denied</div>;

    // Option 2: Redirect to a custom error page or home page
    // return redirect('/some-error-page');
  }

  return <Chat id={chat.id} initialMessages={chat.messages} initialSources={chat.sources}/>;
}

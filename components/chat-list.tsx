import { type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import SourcesSection from "@/components/sourceBox";
import React from "react";

interface Payload {
  article: string
  content: string
  headings: string[]
  link: string
  title: string
}

interface Source {
  id: number
  version: number
  score: number
  payload: Payload
  vector: any
}

export interface ChatList {
  messages: Message[]
  sources: Source[]
}

export interface ChatListProps {
  messages: Message[]
  sources: Source[]
}

export function ChatList({ messages, sources }: ChatListProps) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
      <SourcesSection sources={sources} />
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { ChatMessage } from "@/components/community-page/chat-message"


interface User {
    id: string
    full_name: string
    avatar_url?: string
    email?: string
    created_at?: string
    updated_at?: string
  }
interface Message {
  id: string
  content: string
  created_at: string
  timestamp: string
  user_id: string
  event_id: number
  sender: {
    id: string
    name: string  // Changed from full_name to name
    avatar_url: string
  }
}

interface Event {
  id: number
  title: string
  description: string
  start_time: string
  end_time: string
  community_id: number
  created_by: number
  address?: string
  is_online: boolean
  max_attendees?: number
}

interface EventChatProps {
  event: Event
  currentUser: User
  isModerator: boolean
}

export function EventChat({ event, currentUser, isModerator }: EventChatProps) {
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // This will be replaced with Supabase subscription later
  useEffect(() => {
    // Simulate initial messages
    const demoMessages: Message[] = [
      {
        id: "1",
        content: "Welcome to the event chat!",
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        user_id: "1",
        event_id: event.id,
        sender: {
          id: "1",
          name: "Demo User",  // Changed from full_name to name
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
        }
      }
    ]
    setMessages(demoMessages)
  }, [event.id])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    // This will be replaced with Supabase insert later
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: messageInput,
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      user_id: currentUser.id,
      event_id: event.id,
      sender: {
        id: currentUser.id,
        name: currentUser.full_name,  // Changed from full_name to name
        avatar_url: currentUser.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"
      }
    }

    setMessages((prev) => [...prev, newMessage])
    setMessageInput("")
  }

  return (
    <div className="flex flex-col h-full overflow-hidden border rounded-md">
      <div className="p-3 border-b bg-muted/30">
        <h3 className="font-medium">Event Chat - {event.title}</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
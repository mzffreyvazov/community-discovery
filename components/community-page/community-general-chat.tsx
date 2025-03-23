"use client"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, MessageSquare } from "lucide-react"
import { ChatMessage } from "@/components/community-page/chat-message"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: User;
  read?: boolean;
  reactions?: Reaction[];
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // User IDs who reacted
}

interface ChatRoom {
  id: string;
  name: string;
  isModeratorOnly?: boolean;
  messages?: Message[];
}

interface Moderator {
  id: string;
  name: string;
  avatar?: string;
}

interface Community {
  id: string;
  name: string;
  chatRooms: ChatRoom[];
  moderators?: Moderator[];
}

interface CommunityGeneralChatProps {
  community: Community
}

export function CommunityGeneralChat({ community }: CommunityGeneralChatProps) {
  const [messageInput, setMessageInput] = useState("")
  const [activeChatRoomId, setActiveChatRoomId] = useState(community.chatRooms[0]?.id || "")
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock current user - in a real app, this would come from auth
  const currentUser: User = {
    id: "current-user",
    name: "You",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  // Check if user is a moderator
  const isModerator = community.moderators?.some((mod) => mod.id === currentUser.id) || false

  // Initialize messages for each chat room
  useEffect(() => {
    const initialMessages: Record<string, Message[]> = {}
    community.chatRooms.forEach((room) => {
      initialMessages[room.id] = room.messages || []
    })
    setMessages(initialMessages)
  }, [community.chatRooms])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeChatRoomId])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const activeRoom = community.chatRooms.find((room) => room.id === activeChatRoomId)

    // Check if the chat is moderator-only and the user is not a moderator
    if (activeRoom?.isModeratorOnly && !isModerator) {
      return
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: messageInput,
      sender: currentUser,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => ({
      ...prev,
      [activeChatRoomId]: [...(prev[activeChatRoomId] || []), newMessage],
    }))

    setMessageInput("")
  }

  const activeRoom = community.chatRooms.find((room) => room.id === activeChatRoomId)
  const currentMessages = messages[activeChatRoomId] || []

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-background">
      <div className="p-3 border-b bg-muted/20 flex items-center justify-between">
        <div>
          <h3 className="font-medium">Community Chat</h3>
          {activeRoom?.isModeratorOnly && (
            <p className="text-xs text-muted-foreground">Only moderators can send messages in this channel.</p>
          )}
        </div>

        <Select value={activeChatRoomId} onValueChange={setActiveChatRoomId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent>
            {community.chatRooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {room.name} {room.isModeratorOnly ? "(Mod Only)" : ""}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {currentMessages.length > 0 ? (
            currentMessages.map((message) => <ChatMessage key={message.id} message={message} />)
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No messages yet.{" "}
              {activeRoom?.isModeratorOnly ? "Moderators can start the conversation." : "Start the conversation!"}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t bg-muted/10">
        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder={
              activeRoom?.isModeratorOnly && !isModerator ? "Only moderators can send messages" : "Type your message..."
            }
            disabled={activeRoom?.isModeratorOnly && !isModerator}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={(activeRoom?.isModeratorOnly && !isModerator) || !messageInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}


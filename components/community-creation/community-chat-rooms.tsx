"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Trash2, Plus } from "lucide-react"
import type { CommunityData } from "@/components/community-creation/create-community-modal"

interface CommunityChatRoomsProps {
  data: CommunityData
  updateData: (data: Partial<CommunityData>) => void
}

export function CommunityChatRooms({ data, updateData }: CommunityChatRoomsProps) {
  const addChatRoom = () => {
    updateData({
      chatRooms: [...data.chatRooms, { name: "", type: "text" }],
    })
  }

  const removeChatRoom = (index: number) => {
    const newRooms = [...data.chatRooms]
    newRooms.splice(index, 1)
    updateData({ chatRooms: newRooms })
  }

  const updateChatRoom = (index: number, field: "name" | "type", value: string) => {
    const newRooms = [...data.chatRooms]
    if (field === "type" && (value === "text" || value === "voice" || value === "video")) {
      newRooms[index].type = value
    } else if (field === "name") {
      newRooms[index].name = value
    }
    updateData({ chatRooms: newRooms })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Chat Rooms</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Set up chat rooms for your community members to communicate in.
        </p>
      </div>

      <div className="space-y-4">
        {data.chatRooms.map((room, index) => (
          <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />

            <div className="flex-1">
              <Input
                value={room.name}
                onChange={(e) => updateChatRoom(index, "name", e.target.value)}
                placeholder="Room name"
                className="mb-2"
              />
            </div>

            <div className="w-32">
              <Select value={room.type} onValueChange={(value) => updateChatRoom(index, "type", value)}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="text">Text</SelectItem>
                  <SelectItem className="cursor-pointer" value="voice">Voice</SelectItem>
                  <SelectItem className="cursor-pointer" value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeChatRoom(index)}
              disabled={data.chatRooms.length === 1}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addChatRoom} className="cursor-pointer w-full flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" />
        Add Chat Room
      </Button>
    </div>
  )
}


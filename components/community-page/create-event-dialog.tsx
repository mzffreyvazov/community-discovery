"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: User;
}

interface ChatRoom {
  id: string;
  name: string;
  type: "text" | "voice" | "video";
  messages: Message[];
  isModeratorOnly: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number | null;
  attendees: User[];
  organizer: User;
  chatRoom: ChatRoom;
}

// Mock function type definition
function addEvent(communityId: string, event: Event): void {
  // Implementation would be elsewhere
  console.log(`Adding event to community ${communityId}:`, event);
}

interface CreateEventDialogProps {
  communityId: string
}

export function CreateEventDialog({ communityId }: CreateEventDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxAttendees: "",
  })

  const handleCreateEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date.trim()) return

    // Create a chat room for the event
    const chatRoom: ChatRoom = {
      id: `chat-event-${Date.now()}`,
      name: `event-chat-${newEvent.title.toLowerCase().replace(/\s+/g, "-")}`,
      type: "text",
      messages: [],
      isModeratorOnly: false,
    }

    const newEventObj: Event = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      maxAttendees: Number.parseInt(newEvent.maxAttendees) || null,
      attendees: [],
      organizer: {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      chatRoom,
    }

    // Add the event to our mock data
    addEvent(communityId, newEventObj)

    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      maxAttendees: "",
    })

    setIsOpen(false)

    // Navigate to the new event page
    router.push(`/community/${communityId}/event/${newEventObj.id}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger id="create-event-dialog" className="hidden">
        Create Event
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="What's your event called?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Provide details about your event..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              placeholder="Where is the event taking place?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAttendees">Maximum Attendees (optional)</Label>
            <Input
              id="maxAttendees"
              type="number"
              value={newEvent.maxAttendees}
              onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: e.target.value })}
              placeholder="Leave empty for unlimited"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateEvent}>Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


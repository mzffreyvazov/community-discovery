"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"

export interface User {
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

export interface ChatRoom {
  id: string;
  name: string;
  type: "text" | "voice" | "video";
  messages: Message[]; // Updated from any[] to Message[]
  isModeratorOnly: boolean;
}

export interface Event {
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

export interface Community {
  id: string;
  name: string;
  description: string;
  members: User[];
  events: Event[];
  // Other community properties
}

// Mock function type definition
function getCommunityById(communityId: string): Community | undefined {
  // Implementation would be elsewhere
  console.log(`Getting community with ID: ${communityId}`);
  return undefined;
}

interface EventsListDialogProps {
  communityId: string
}

export function EventsListDialog({ communityId }: EventsListDialogProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const community = getCommunityById(communityId)
    setEvents(community?.events || [])
  }, [communityId, isOpen])

  // Sort events by date (upcoming first)
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger id="show-all-events" className="hidden">
        Show All Events
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">All Events</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
              <p className="text-muted-foreground mb-4">Create an event to bring community members together!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Organized by {event.organizer.name}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="whitespace-pre-line line-clamp-3">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(event.date).toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {event.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.attendees.length} attending
                          {event.maxAttendees !== null &&
                            ` (${Math.max(0, event.maxAttendees - event.attendees.length)} spots left)`}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <div className="flex -space-x-2">
                      {event.attendees.slice(0, 5).map((attendee, index) => (
                        <div key={index} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                          <img
                            src={attendee.avatar || "/placeholder.svg?height=32&width=32"}
                            alt={attendee.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {event.attendees.length > 5 && (
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                          +{event.attendees.length - 5}
                        </div>
                      )}
                    </div>

                    <Button asChild onClick={() => setIsOpen(false)}>
                      <Link href={`/community/${communityId}/event/${event.id}`}>View Event</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


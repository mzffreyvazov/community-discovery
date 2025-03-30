"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase"
import { SortOption } from "@/components/event-creation/event-filter"
import React from "react"

interface User {
  id: string;
  name: string;
  avatar: string;
  clerk_user_id?: string;
}

interface EventAttendee {
  user_id: number;
  event_id: number;
  rsvp_status: string;
  rsvp_time: string;
  user: {
    name: string;
    image_url?: string;
  };
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
  isOnline: boolean;
  createdAt: string;
}

interface EventsPreviewProps {
  communityId: string;
  sortOption: SortOption;
  refreshKey?: number; // Add a refresh key to force re-fetch
  onEventCountChange?: (count: number) => void; // Add callback prop
}

export function EventsPreview({ 
  communityId, 
  sortOption, 
  refreshKey = 0,
  onEventCountChange 
}: EventsPreviewProps): JSX.Element {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllEvents, setShowAllEvents] = useState(false)

  // Fix the dependency array issue by ensuring refreshKey is always included
  const effectDependencies = React.useMemo(() => [communityId, refreshKey], [communityId, refreshKey]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const supabase = createBrowserClient()
        
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            created_by_user:created_by(*),
            event_attendees(
              *,
              user:user_id(*)
            )
          `)
          .eq('community_id', communityId)
          .order('created_at', { ascending: false }) // Order by creation date, newest first
        
        if (error) throw error
        
        if (data && data.length > 0) {
          const formattedEvents = data.map(event => {
            const startDate = new Date(event.start_time)
            const locationParts = [event.address, event.city, event.country].filter(Boolean)
            const locationString = locationParts.join(', ') || (event.is_online ? 'Online Event' : 'Location not specified')

            const attendees = event.event_attendees?.map((attendee: EventAttendee) => ({
              id: attendee.user_id,
              name: attendee.user?.name || 'Anonymous',
              avatar: attendee.user?.image_url || '/placeholder.svg'
            })) || []

            return {
              id: event.id,
              title: event.title,
              description: event.description,
              date: startDate.toISOString(),
              time: startDate.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              location: locationString,
              maxAttendees: event.max_attendees,
              isOnline: event.is_online,
              attendees,
              organizer: {
                id: event.created_by,
                name: event.created_by_user?.name || "Event Organizer",
                avatar: event.created_by_user?.image_url || '/placeholder.svg'
              },
              createdAt: event.created_at // Add created_at to formatted events
            }
          })
          
          setEvents(formattedEvents)
        } else {
          setEvents([])
        }
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events")
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, effectDependencies) // Use the memoized dependencies array

  // Effect to update parent component with event count
  useEffect(() => {
    if (onEventCountChange) {
      onEventCountChange(events.length);
    }
  }, [events.length, onEventCountChange]);

  // Sort events based on provided sort option
  const sortedEvents = [...events].sort((a, b) => {
    if (sortOption === 'newest') {
      // Sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      // Sort by event date (upcoming first)
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
  })
  
  const eventsToShow = showAllEvents ? sortedEvents : sortedEvents.slice(0, 3)

  if (loading) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Loading events...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2 text-destructive">Error loading events</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (eventsToShow.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
        <p className="text-muted-foreground mb-4">Create an event to bring community members together!</p>
        <Button className="cursor-pointer" onClick={() => document.getElementById("create-event-dialog")?.click()}>
          Create Event
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {eventsToShow.map((event) => (
        <Link key={event.id} href={`/community/${communityId}/event/${event.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(event.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                {event.time && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{event.time}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.isOnline ? "Online Event" : event.location}</span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{event.description}</p>

              <div className="flex -space-x-2 mt-3">
                {event.attendees.slice(0, 5).map((attendee, index) => (
                  <div key={index} className="w-7 h-7 rounded-full border-2 border-background overflow-hidden">
                    <img
                      src={attendee.avatar || "/placeholder.svg?height=28&width=28"}
                      alt={attendee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {event.attendees.length > 5 && (
                  <div className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                    +{event.attendees.length - 5}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}

      {sortedEvents.length > 3 && (
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          onClick={() => setShowAllEvents(!showAllEvents)}
        >
          {showAllEvents 
            ? "Show less" 
            : `View all events (${sortedEvents.length})`}
        </Button>
      )}
    </div>
  )
}


import { getEventWithDetails } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Heart, Share2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EventChat } from "@/components/event-page/event-chat"
interface EventDetailProps {
  communityId: string
  eventId: string
}

export async function EventDetail({ communityId, eventId }: EventDetailProps) {
  const event = await getEventWithDetails(eventId)

  if (!event) {
    return <div>Event not found</div>
  }
  
  const placeholderMapUrl = "community-discovery\components\event-page\file.jpeg"
  console.log("Event data:", event);
  console.log("Address:", event.address);
  return (
    <div className="space-y-6">
      {/* Event Header Banner */}
      <div className="relative w-full h-48 bg-black mb-6 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl font-bold">{event.title}</h1>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Event Information */}
        <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">About this event</h2>
                <p className="text-muted-foreground">{event.description}</p>
            </Card>

            {/* Event Details Card */}
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Event Details</h2>
                <div className="space-y-4">


                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">
                            {new Date(event.start_time).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            </p>
                        </div>
                    </div>
                
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">
                            {new Date(event.start_time).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                                timeZone: 'UTC'
                            })} - {new Date(event.end_time).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                                timeZone: 'UTC'
                            })}
                            </p>
                        </div>
                    </div>

                    {event.address && (
                        <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">{event.address}</p>
                        </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                        <p className="font-medium">
                            {event.attendees?.length || 0} attendees
                        </p>
                        </div>
                    </div>  

                </div>
            </Card>
                      
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Location</h2>
                <div className="rounded-md overflow-hidden">
                    <img
                    src="/placeholder-map.jpeg" // Fix image path to use web-friendly format
                    alt="Event location map"
                    className="w-full h-[200px] object-cover"
                    />
                </div>
                <div className="mt-3 flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                    {event.address || "Address not provided for this event"}
                    </p>
                </div>
            </Card>
        </div>
            
        {/* Right Column */}
        <div className="md:col-span-1">
        <Card className="overflow-hidden">
            {/* Organizer Info */}
            <div className="p-4 border-b" >
            <h2 className="text-lg font-semibold mb-3">Organized by</h2>
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback>O</AvatarFallback>
                </Avatar>
                <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">Organizer</p>
                </div>
            </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-b space-y-2">
            <Button
                variant="default"
                className="w-full bg-black hover:bg-black/90 text-white"
                size="default"
            >
                RSVP to Event
            </Button>

            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full" size="sm">
                <Heart className="h-4 w-4 mr-1.5" />
                Save
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                <Share2 className="h-4 w-4 mr-1.5" />
                Share
                </Button>
            </div>
            </div>

            {/* Community Info */}
            <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">Community</h2>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center text-base font-bold">
                    C
                </div>
                </div>
                <div>
                <p className="font-medium">Tech Community</p>
                <p className="text-sm text-muted-foreground">234 members</p>
                </div>
            </div>
            </div>
        </Card>
        </div>
      </div>
    </div>
  )
}


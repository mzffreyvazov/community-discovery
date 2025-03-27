import { EventDetail } from "@/components/event-page/event-detail"
import { notFound } from "next/navigation"
import { createAdminClient } from '@/lib/supabase'
import { createClerkClient } from '@clerk/nextjs/server'

// Fetch community data
async function getCommunity(communityId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('communities')
    .select(`
      *,
      owner:owner_id(*),
      members:community_members(*)
    `)
    .eq('id', communityId)
    .single()

  if (error) {
    console.error('Error fetching community:', error)
    return null
  }

  return data
}

// Fetch event data
async function getEvent(eventId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      created_by_user:created_by(*)
    `)
    .eq('id', eventId)
    .single()

  if (error) {
    console.error('Error fetching event:', error)
    return null
  }

  return data
}

// Add this new function to fetch event attendees
async function getEventAttendees(eventId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('event_attendees')
    .select(`
      *,
      user:user_id(*)
    `)
    .eq('event_id', eventId)

  if (error) {
    console.error('Error fetching event attendees:', error)
    return []
  }

  return data
}

export default async function EventDetailPage({ params }: { params: { id: string; eventId: string } }) {
  const { id, eventId } = await params

  // Update Promise.all to include attendees
  const [community, event, attendees] = await Promise.all([
    getCommunity(id),
    getEvent(eventId),
    getEventAttendees(eventId)
  ])

  if (!community || !event) {
    return notFound()
  }

  // New: Initialize Clerk client with secret key
  const clerkUserId = event.created_by_user.clerk_user_id
  console.log("Clerk User ID:", clerkUserId)
  let organizerUsername = 'Unknown Organizer'
  let organizerImage = '' 
  
  if (clerkUserId) {
    try {
      const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
      const user = await client.users.getUser(clerkUserId)
      organizerUsername = user.username || 'Unknown Organizer'
    } catch (err) {
      console.error('Error fetching clerk user info:', err)
    }
  } else {
    console.error("No clerk_user_id found in event.created_by_user:", event.created_by_user)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <EventDetail 
          communityId={community.id}
          eventId={eventId}
          organizerUsername={organizerUsername}
          organizerImage={organizerImage}
          communityName={community.name}
          communityImage={community.image_url}
          communityMemberCount={community.member_count}
          attendees={attendees}
        />
      </main>
    </div>
  )
}


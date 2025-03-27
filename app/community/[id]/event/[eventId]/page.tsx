import { EventDetail } from "@/components/event-page/event-detail"
import { notFound } from "next/navigation"
import { createAdminClient } from '@/lib/supabase'

// Fetch community data
async function getCommunity(communityId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('communities')
    .select(`
      *,
      owner:owner_id(*)
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

export default async function EventDetailPage({ params }: { params: { id: string; eventId: string } }) {
    // Await the params object
    const { id, eventId } = await params
  
    const [community, event] = await Promise.all([
      getCommunity(id),
      getEvent(eventId)
    ])
  
    if (!community || !event) {
      return notFound()
    }
  
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <EventDetail communityId={community.id} eventId={eventId} />
        </main>
      </div>
    )
  }


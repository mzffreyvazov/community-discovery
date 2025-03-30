/* File: d:\Downloads\code\code\Extra-Projects\community-discover-2\community-discovery\app\community\[id]\event\[eventId]\page.tsx */

// --- SINGLE SET OF IMPORTS ---
import { EventDetail } from "@/components/event-page/event-detail";
import { notFound } from "next/navigation";
import { createAdminClient } from '@/lib/supabase';
import { createClerkClient } from '@clerk/nextjs/server';

// --- Interface Definition (Corrected to reflect runtime requirement) ---
interface EventDetailPageProps {
  // params IS a Promise in this runtime environment
  params: Promise<{
    id: string;
    eventId: string;
  }>;
  // searchParams might also need to be a Promise if the same pattern applies,
  // but we'll keep it as is unless errors indicate otherwise.
  searchParams?: { [key: string]: string | string[] | undefined };
}

// --- Fetching functions (Keep as is) ---
async function getCommunity(communityId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('communities')
    .select(`*, owner:owner_id(*), members:community_members(*)`)
    .eq('id', communityId)
    .single();
  if (error) { console.error('Error fetching community:', error); return null; }
  return data;
}

async function getEvent(eventId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('events')
    .select(`*, created_by_user:created_by(*)`)
    .eq('id', eventId)
    .single();
  if (error) { console.error('Error fetching event:', error); return null; }
  return data;
}

async function getEventAttendees(eventId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('event_attendees')
    .select(`*, user:user_id(*)`)
    .eq('event_id', eventId);
  if (error) { console.error('Error fetching event attendees:', error); return []; }
  return data;
}

// --- Page Component Definition ---
export default async function EventDetailPage({ params }: EventDetailPageProps) {
  // Await params as required by the runtime error
  const { id, eventId } = await params; // <-- Added await here

  // Fetch data using the now correctly awaited id and eventId
  const [community, event, attendees] = await Promise.all([
    getCommunity(id),
    getEvent(eventId),
    getEventAttendees(eventId)
  ]);

  // Check results
  if (!community || !event) {
    return notFound();
  }

  // Fetch organizer details
  const clerkUserId = event.created_by_user?.clerk_user_id;
  let organizerUsername = 'Unknown Organizer';
  let organizerImageFromClerk: string | null | undefined = undefined;

  if (clerkUserId) {
    try {
      const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const user = await client.users.getUser(clerkUserId);
      organizerUsername = user.username || 'Unknown Organizer';
      organizerImageFromClerk = user.imageUrl;
    } catch (err) {
      console.error('Error fetching clerk user info:', err);
    }
  } else {
    console.warn("No clerk_user_id found for the event organizer:", event.created_by_user);
  }

  // Define fallbacks
  const defaultOrganizerImage = '/images/default-avatar.png'; // Adjust path if needed
  const defaultCommunityImage = '/images/default-community.png'; // Adjust path if needed

  // Render the EventDetail component
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <EventDetail
          // Pass IDs
          communityId={community.id}
          eventId={eventId}

          // Pass Event Details (ensure these match EventDetail's props)
          eventTitle={event.title}
          eventDescription={event.description}
          eventStartTime={event.start_time}
          eventEndTime={event.end_time}
          eventAddress={event.address}
          eventCity={event.city}
          eventCountry={event.country}
          eventLocationUrl={event.location_url}
          eventMaxAttendees={event.max_attendees}

          // Pass Organizer Details
          organizerUsername={organizerUsername}
          organizerImage={organizerImageFromClerk ?? defaultOrganizerImage}

          // Pass Community Details (ensure these match EventDetail's props)
          communityName={community.name}
          communityImage={community.image_url ?? defaultCommunityImage}
          communityMemberCount={community.member_count ?? 0} // Assuming member_count exists

          // Pass Attendees
          attendees={attendees}
        />
      </main>
    </div>
  );
}
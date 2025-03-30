/* File: app/community/[id]/event/[eventId]/page.tsx */

// --- SINGLE SET OF IMPORTS ---
import { EventDetail } from "@/components/event-page/event-detail";
import { notFound } from "next/navigation";
import { createAdminClient } from '@/lib/supabase';
import { createClerkClient } from '@clerk/nextjs/server';

// --- Interface Definition (Keep as is) ---
interface EventDetailPageProps {
  params: {
    id: string;
    eventId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// --- Fetching functions (Keep as is - ensure they are defined only ONCE) ---

async function getCommunity(communityId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('communities')
    .select(`
      *,
      owner:owner_id(*),
      members:community_members(*)
    `)
    .eq('id', communityId)
    .single();

  if (error) {
    console.error('Error fetching community:', error);
    return null;
  }
  return data;
}

async function getEvent(eventId: string) {
  const supabase = createAdminClient();
  // Ensure you select all necessary event fields here
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      created_by_user:created_by(*)
    `)
    .eq('id', eventId)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }
  return data;
}

async function getEventAttendees(eventId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('event_attendees')
    .select(`
      *,
      user:user_id(*)
    `)
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching event attendees:', error);
    return [];
  }
  return data;
}

// --- Page Component Definition (Ensure it is defined only ONCE) ---
export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id, eventId } = params;  // Remove await since params is not a Promise

  const [community, event, attendees] = await Promise.all([
    getCommunity(id),
    getEvent(eventId),
    getEventAttendees(eventId)
  ]);

  if (!community || !event) {
    return notFound();
  }

  const clerkUserId = event.created_by_user?.clerk_user_id;
  console.log("Clerk User ID:", clerkUserId);
  let organizerUsername = 'Unknown Organizer';
  let organizerImageFromClerk: string | null | undefined = undefined; // Store Clerk result separately

  if (clerkUserId) {
    try {
      const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const user = await client.users.getUser(clerkUserId);
      organizerUsername = user.username || 'Unknown Organizer';
      organizerImageFromClerk = user.imageUrl; // Get potential image URL
    } catch (err) {
      console.error('Error fetching clerk user info:', err);
    }
  } else {
    console.error("No clerk_user_id found in event.created_by_user:", event.created_by_user);
  }

  // Define a fallback image URL (replace with your actual path or URL)
  const defaultOrganizerImage = '/images/default-avatar.png';

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <EventDetail
          communityId={community.id}
          eventId={eventId}
          organizerUsername={organizerUsername}
          organizerImage={organizerImageFromClerk ?? defaultOrganizerImage}
          communityName={community.name}
          communityImage={community.image_url ?? '/images/default-community.png'}
          communityMemberCount={community.member_count ?? 0}
          attendees={attendees}
        />
      </main>
    </div>
  );
}
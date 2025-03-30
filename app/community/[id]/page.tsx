export const dynamic = 'force-dynamic';

import { createAdminClient } from '@/lib/supabase'
import { createClerkClient } from '@clerk/nextjs/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CommunityAbout } from '@/components/community-page/community-about'
import EventsSectionWrapper from '@/components/event-creation/event-section-wrapper'
import { ScrollToTop } from '@/components/shared/scroll-to-top'

// Define interfaces for TypeScript

interface CommunityTagWithDetails {
  tag_id: string;
  tags: {
    id: string;
    name: string;
  };
}

interface Moderator {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// Separate metadata generation function
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createAdminClient()
  const { id } = await params
  
  const { data: community } = await supabase
    .from('communities')
    .select('name')
    .eq('id', id)
    .single()

  return {
    title: community?.name || 'Community',
    description: `View details about ${community?.name}`
  }
}

async function getCommunityWithModerator(communityId: string) {
  const supabase = createAdminClient()
  const { data: community, error } = await supabase
    .from('communities')
    .select(`
      *,
      owner:owner_id(
        useri_id,
        clerk_user_id
      ),
      community_tags(
        tag_id,
        tags(
          id,
          name
        )
      )
    `)
    .eq('id', communityId)
    .single()

  if (error || !community) {
    console.error('Error fetching community:', error)
    return null
  }

  // Format tags from the community_tags relation
  const tags = community.community_tags?.map((ct: CommunityTagWithDetails) => ct.tags?.name).filter(Boolean) || []
  community.tags = tags

  // Fetch moderator info from Clerk
  let moderator: Moderator | undefined = undefined;
  if (community.owner?.clerk_user_id) {
    try {
      const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
      const user = await client.users.getUser(community.owner.clerk_user_id)
      moderator = {
        id: community.owner.useri_id.toString(),
        name: user.username || 'Unknown',
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        avatar: user.imageUrl || undefined
      }
    } catch (err) {
      console.error('Error fetching clerk user info:', err)
    }
  }

  return { community, moderator }
}

export default async function CommunityPage({ params }: PageProps) {
  const { id } = await params
  const data = await getCommunityWithModerator(id)
  if (!data) return notFound()

  const formattedCommunity = {
    id: data.community.id,
    name: data.community.name,
    description: data.community.description,
    memberCount: data.community.member_count || 0,
    tags: data.community.tags || [],
    image: null,
    rules: [],
    createdAt: data.community.created_at,
    owner: {
      useri_id: data.community.owner.useri_id,
      clerk_user_id: data.community.owner.clerk_user_id
    },
    chatRooms: [
      {
        id: 'general',
        name: 'General',
        isModeratorOnly: false,
        messages: []
      },
      {
        id: 'announcements',
        name: 'Announcements',
        isModeratorOnly: true,
        messages: []
      }
    ],
    moderators: [
      {
        id: data.moderator?.id || 'mod-1',
        name: data.moderator?.name || 'Community Admin',
        avatar: data.moderator?.avatar || '/placeholder.svg'
      }
    ]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Add ScrollToTop component to reset scroll position */}
      <ScrollToTop />
      
      {/* Main Content Area */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <EventsSectionWrapper communityId={formattedCommunity.id} />
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="md:col-span-1">
        <CommunityAbout 
          community={formattedCommunity}
          moderator={data.moderator}
        />
      </div>
    </div>
  )
}

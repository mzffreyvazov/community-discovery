import { createAdminClient } from '@/lib/supabase'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CommunityAbout } from '@/components/community-page/community-about'

// Define interfaces for TypeScript
interface Tag {
  id: string;
  name: string;
}

interface CommunityTag {
  tag_id: string;
  tags: Tag;
}

interface PageProps {
  params: {
    id: string
  }
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
    title: `Chat - ${community?.name || 'Community'}`,
    description: `Chat with members of ${community?.name}`
  }
}

export default async function CommunityChatPage({ params }: PageProps) {
  const supabase = createAdminClient()
  const { id } = await params;
  
  // Fetch community data including tags
  const { data: community, error } = await supabase
    .from('communities')
    .select(`
      *,
      community_tags(
        tag_id,
        tags:tag_id(
          id,
          name
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  if (!community) {
    notFound()
  }

  // Transform community data to match the component props structure
  const formattedCommunity = {
    id: community.id,
    name: community.name,
    description: community.description,
    memberCount: community.member_count || 0,
    tags: community.community_tags?.map((tag: CommunityTag) => tag.tags?.name || 'Unknown') || [],
    image: null,
    rules: [],
    createdAt: community.created_at,
    // Mock data for chat system
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
        id: 'mod-1',
        name: 'Community Admin',
        avatar: '/placeholder.svg'
      }
    ]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Content Area */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Community Chat</h2>
          <p className="text-muted-foreground">Chat functionality will be implemented here.</p>
          {/* Chat component will go here */}
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="md:col-span-1">
        <CommunityAbout community={formattedCommunity} />
      </div>
    </div>
  )
}

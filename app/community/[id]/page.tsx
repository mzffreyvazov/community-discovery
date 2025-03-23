import { createAdminClient } from '@/lib/supabase'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Users, Calendar, ArrowLeft } from 'lucide-react'

// Define interfaces for TypeScript
interface Tag {
  id: string;
  name: string;
}

interface CommunityTag {
  tag_id: string;
  tags: Tag;
}

interface Community {
  id: string;
  name: string;
  description: string;
  created_at: string;
  city: string | null;
  state: string | null;
  country: string | null;
  member_count: number | null;
  activity_level: string | null;
  community_tags: CommunityTag[];
}

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: { id: string }
}): Promise<Metadata> {
  const supabase = createAdminClient()
  const { data: community } = await supabase
    .from('communities')
    .select('name')
    .eq('id', params.id)
    .single()

  if (!community) {
    return {
      title: 'Community Not Found'
    }
  }

  return {
    title: `${community.name} | Community Discovery`,
    description: `Learn more about ${community.name} and join the community.`
  }
}

export default async function CommunityPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  
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
    .eq('id', params.id)
    .single()

  // If community not found, show 404 page
  if (error || !community) {
    notFound()
  }

  const formattedDate = new Date(community.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Get location string
  const location = [community.city, community.state, community.country]
    .filter(Boolean)
    .join(', ') || 'Global'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link href="/discover" className="flex items-center text-primary hover:underline mb-6 gap-1">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Communities</span>
      </Link>

      {/* Community header */}
      <header className="mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-secondary rounded-lg"></div>
          <div>
            <h1 className="text-3xl font-bold">{community.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{community.member_count || 0} members</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">{community.description}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Community Activity</h2>
            <div className="p-6 border rounded-lg">
              <p className="text-muted-foreground">
                Activity Level: {community.activity_level || 'New'}
              </p>
              <div className="mt-4">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ 
                      width: community.activity_level === 'High' ? '80%' : 
                             community.activity_level === 'Medium' ? '50%' : 
                             community.activity_level === 'Low' ? '30%' : '10%' 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
            <div className="border rounded-lg p-6 text-center text-muted-foreground">
              <p>No posts yet</p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div>
          <div className="border rounded-lg p-6 mb-6">
            <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg mb-4 font-medium">
              Join Community
            </button>
            <button className="w-full border py-2 rounded-lg font-medium">
              Message
            </button>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <h3 className="font-medium mb-3">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {community.community_tags?.map((tagRelation: CommunityTag) => (
                <span
                  key={tagRelation.tag_id}
                  className="px-3 py-1 bg-secondary rounded-full text-sm"
                >
                  {tagRelation.tags?.name || 'Unknown Tag'}
                </span>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-medium mb-3">Similar Communities</h3>
            <p className="text-sm text-muted-foreground">
              No similar communities found
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

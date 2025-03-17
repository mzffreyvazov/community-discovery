import { createAdminClient } from '@/lib/supabase'
import { Search } from 'lucide-react'
import { CategoryScroll } from '@/components/CategoryScroll'

// Add these interfaces at the top of your file
interface Tag {
  id: string;
  name: string;
}

interface CommunityTag {
  tag_id: string;
  tags: Tag;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars

export default async function DiscoverPage() {
  const supabase = createAdminClient()

  // Fetch both communities and tags
  const [{ data: communities }, { data: categories }] = await Promise.all([
    supabase
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
      `),
    supabase
      .from('tags')
      .select('*')
      .order('name')
  ])

  return (
    <div className="max-w-7xl mx-auto px-4"> {/* Removed py-8 from here */}
      {/* --- HEADER --- */}
      <header className="mb-8 border-b pb-4"> {/* No changes needed *inside* the header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Discover Communities</h1>
            <p className="text-muted-foreground">
              Find and join communities that match your interests and location
            </p>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/80 transition-colors">
            + Create Community
          </button>
        </div>

        {/* Search and Filters Row - remains the same */}
        <div className="flex gap-4 items-center mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search communities, interests, or keywords"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-secondary/20 transition-colors">
            Filters
          </button>
          <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-secondary/20 transition-colors">
            Near Me
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT ---  Add padding/margin here! */}
      <main className="py-8"> {/* Add padding here */}
        {/* --- CATEGORIES --- */}
        <section className="mb-8">
          <CategoryScroll categories={categories || []} />
        </section>

        {/* --- TABS --- */}
        <div className="border-b mb-8">
          {/* Tabs remain the same */}
          <div className="flex gap-6">
            {['All Communities', 'Trending', 'Newly Created', 'Nearby'].map((tab) => (
              <button
                key={tab}
                className={`pb-2 px-1 ${
                  tab === 'All Communities'
                    ? 'border-b-2 border-black font-medium'
                    : 'text-muted-foreground hover:text-foreground transition-colors'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- COMMUNITY CARDS --- Updated to use real tags */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities?.map((community) => (
            <div
              key={community.id}
              className="
                border rounded-lg p-6
                transition-transform duration-200
                hover:-translate-y-1 hover:shadow-lg
                relative z-20
              "
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary rounded-lg" />
                <div>
                  <h3 className="font-semibold text-lg">{community.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{community.member_count || 0} members</span>
                    <span>•</span>
                    <span>{community.activity_level || 'New'}</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                {community.description}
              </p>
              {/* Tags - Now using actual tags from the database */}
              <div className="flex flex-wrap gap-2 mb-4">
              {community.community_tags?.map((tagRelation: CommunityTag) => (
                <span
                  key={tagRelation.tag_id}
                  className="px-3 py-1 bg-secondary rounded-full text-sm"
                >
                  {tagRelation.tags?.name || 'Unknown Tag'}
                </span>
              ))}
              </div>
              {/* Location and View Details */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {community.city || 'Global'}
                </span>
                <button className="text-primary hover:underline">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
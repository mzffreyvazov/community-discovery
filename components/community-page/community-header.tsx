
interface Moderator {
  id: string;
  name: string;
  avatar?: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  tags: string[];
  image: string | null | undefined
  moderators?: Moderator[];
  rules?: string[];
  createdAt?: Date | string;
}

interface CommunityHeaderProps {
  community: Community
}

export function CommunityHeader({ community }: CommunityHeaderProps) {
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md overflow-hidden bg-primary/10 flex items-center justify-center">
          {community.image ? (
            <img
              src={community.image || "/placeholder.svg"}
              alt={community.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary">
              {community.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold">{community.name}</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{community.memberCount} members</span>
          </div>
        </div>
      </div>
    </div>
  )
}


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users } from "lucide-react"

interface Moderator {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  tags: string[];
  moderators?: Moderator[];
  rules?: string[];
  createdAt?: Date | string;
  owner: {
    useri_id: number;
    clerk_user_id: string;
  };
}

interface CommunityAboutProps {
  community: Community;
  moderator?: Moderator;
}

export async function CommunityAbout({ community, moderator }: CommunityAboutProps) {
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-3">About Community</h2>
          <p className="text-sm text-muted-foreground mb-4">{community.description}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground py-3 border-t">
            <Calendar className="h-4 w-4" />
            <span>Created Jan 1, 2023</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground py-3 border-t border-b">
            <Users className="h-4 w-4" />
            <span>{community.memberCount} members</span>
          </div>
        </div>

        <div className="pt-0">
          <h2 className="text-lg font-semibold mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {community.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {moderator && (
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-3">Moderators</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={moderator.avatar} alt={moderator.name} />
                  <AvatarFallback>
                    {moderator.firstName?.[0] || moderator.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {moderator.firstName && moderator.lastName 
                    ? `${moderator.firstName} ${moderator.lastName}`
                    : moderator.name}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-3">Community Rules</h2>
          <ol className="space-y-2 pl-5 list-decimal text-sm">
            {community.rules?.map((rule, index) => <li key={index}>{rule}</li>) || (
              <>
                <li>Be respectful and kind to other members</li>
                <li>No spam or self-promotion without permission</li>
                <li>Stay on topic in discussions</li>
              </>
            )}
          </ol>
        </div>
      </div>
    </div>
  )
}


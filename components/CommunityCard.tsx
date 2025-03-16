import { formatDistance } from 'date-fns'

// Define the interfaces for your community data structure
interface Interest {
  id: string;
  interest: {
    name: string;
  };
}

interface Event {
  title: string;
  start_time: string;
  attendees_count: number;
}

interface Community {
  name: string;
  member_count: number;
  activity_level: string;
  description: string;
  interests?: Interest[];
  events?: Event[];
}

export default function CommunityCard({ community }: { community: Community }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <div>
          <h3 className="font-semibold">{community.name}</h3>
          <p className="text-sm text-gray-600">
            {community.member_count} members • {community.activity_level}
          </p>
        </div>
        <button className="ml-auto bg-black text-white px-4 py-1 rounded">
          Join
        </button>
      </div>
      <p className="text-gray-700 mb-4">{community.description}</p>
      <div className="flex gap-2 mb-4">
        {community.interests?.map((interest) => (
          <span
            key={interest.id}
            className="text-sm bg-gray-100 px-2 py-1 rounded"
          >
            {interest.interest.name}
          </span>
        ))}
      </div>
      {community.events?.[0] && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Upcoming Events</h4>
          <div className="text-sm">
            <p className="font-medium">{community.events[0].title}</p>
            <p className="text-gray-600">
              {formatDistance(
                new Date(community.events[0].start_time),
                new Date(),
                { addSuffix: true }
              )}
              • {community.events[0].attendees_count} attending
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
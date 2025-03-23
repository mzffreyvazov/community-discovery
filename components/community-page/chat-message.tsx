import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // User IDs who reacted
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: User;
  read?: boolean;
  reactions?: Reaction[];
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex items-start gap-3 group">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
        <AvatarFallback>{message.sender.name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{message.sender.name}</span>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
        
        <div className="text-sm mt-1">
          {message.content}
        </div>
        
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                className="inline-flex items-center px-2 py-0.5 bg-secondary rounded-full text-xs"
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


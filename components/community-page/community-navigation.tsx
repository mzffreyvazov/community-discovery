"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare } from "lucide-react"

interface CommunityNavigationProps {
  communityId: string
}

export function CommunityNavigation({ communityId }: CommunityNavigationProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: `/community/${communityId}`,
      icon: <Home className="h-4 w-4" />,
      exact: true,
    },
    {
      name: "Chat",
      href: `/community/${communityId}/chat`,
      icon: <MessageSquare className="h-4 w-4" />,
      exact: true,
    },
  ]

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

  return (
    <nav className="bg-card rounded-lg p-4 shadow-sm mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                isActive(item)
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}


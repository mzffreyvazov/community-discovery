'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryScrollProps {
  categories: Category[]
}

export function CategoryScroll({ categories }: CategoryScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hoverStates, setHoverStates] = useState<{ [key: string]: { x: number, y: number } }>({})

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLAnchorElement>, categoryId: string) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    setHoverStates(prev => ({
      ...prev,
      [categoryId]: { x, y }
    }))
  }

  const handleMouseLeave = (categoryId: string) => {
    setHoverStates(prev => {
      const newState = { ...prev }
      delete newState[categoryId]
      return newState
    })
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Browse by Category</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 border rounded-lg hover:bg-secondary/20 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 border rounded-lg hover:bg-secondary/20 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth -mx-4 px-4"
      >
        {categories?.map((category) => (
          <Link
            key={category.id}
            href={`/discover?category=${category.id}`}
            className="flex-none w-[200px] flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md hover:border-primary relative overflow-hidden group transition-shadow duration-200"
            onMouseEnter={(e) => handleMouseEnter(e, category.id)}
            onMouseLeave={() => handleMouseLeave(category.id)}
          >
            {hoverStates[category.id] && (
              <div 
                className="absolute inset-0 bg-primary/10 transition-transform duration-500 origin-center rounded-lg" 
                style={{
                  transform: 'scale(10)',
                  transformOrigin: `${hoverStates[category.id].x}px ${hoverStates[category.id].y}px`,
                  opacity: 0.1,
                  zIndex: -1
                }}
              />
            )}
            <span className="text-2xl mb-2 relative z-10">{category.icon || '📎'}</span>
            <span className="text-sm relative z-10">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

interface CategoryScrollProps {
  categories: any[]
}

export function CategoryScroll({ categories }: CategoryScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
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
        style={{ 
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        {categories?.map((category) => (
          <Link
            key={category.id}
            href={`/discover?category=${category.id}`}
            className="
              flex-none w-[200px]
              flex flex-col items-center justify-center p-4 border rounded-lg 
              hover:bg-secondary/20 transition-transform duration-200
              hover:-translate-y-1 hover:shadow-lg
            "
          >
            <span className="text-2xl mb-2">{category.icon || '📎'}</span>
            <span className="text-sm">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState, useCallback } from 'react'
import { SortOption } from './event-filter'
import { EventsPreview } from '@/components/community-page/events-preview'
import EventFilterControl from './event-filter-control'
import { CreateEventButton } from './create-event-button'
import { CreateEventDialog } from '@/components/community-page/create-event-dialog'

interface EventsSectionWrapperProps {
  communityId: string
}

export default function EventsSectionWrapper({ communityId }: EventsSectionWrapperProps) {
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [refreshKey, setRefreshKey] = useState(0) // Add refresh key state
  
  // Create a callback for event creation
  const handleEventCreated = useCallback(() => {
    // Increment refresh key to trigger re-fetch
    setRefreshKey(prev => prev + 1)
  }, [])
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        <div className="flex items-center gap-2">
          <EventFilterControl 
            sortOption={sortOption} 
            onSortChange={setSortOption} 
          />
          <CreateEventButton />
        </div>
      </div>
      <EventsPreview 
        communityId={communityId} 
        sortOption={sortOption} 
        refreshKey={refreshKey}
      />
      
      {/* Include the dialog here instead of in the page component for better state management */}
      <CreateEventDialog 
        communityId={communityId} 
        onEventCreated={handleEventCreated} 
      />
    </>
  )
}

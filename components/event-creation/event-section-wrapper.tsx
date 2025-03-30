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
  const [refreshKey, setRefreshKey] = useState(0)
  const [eventCount, setEventCount] = useState(0) // Add state to track event count
  
  // Create a callback for event creation
  const handleEventCreated = useCallback(() => {
    // Increment refresh key to trigger re-fetch
    setRefreshKey(prev => prev + 1)
  }, [])
  
  // Handle event count updates
  const handleEventCountChange = useCallback((count: number) => {
    setEventCount(count)
  }, [])
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        
        {/* Only show controls when there are events */}
        {eventCount > 0 && (
          <div className="flex items-center gap-2">
            <EventFilterControl 
              sortOption={sortOption} 
              onSortChange={setSortOption} 
            />
            <CreateEventButton />
          </div>
        )}
      </div>
      
      <EventsPreview 
        communityId={communityId} 
        sortOption={sortOption} 
        refreshKey={refreshKey}
        onEventCountChange={handleEventCountChange} // Pass the callback
      />
      
      <CreateEventDialog 
        communityId={communityId} 
        onEventCreated={handleEventCreated} 
      />
    </>
  )
}

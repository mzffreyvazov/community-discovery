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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h2 className="text-xl font-bold sm:text-left w-full sm:w-auto">Upcoming Events</h2>
        
        {/* Only show controls when there are events */}
        {eventCount > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto sm:justify-end">
            <EventFilterControl 
              sortOption={sortOption} 
              onSortChange={setSortOption} 
            />
            <CreateEventButton />
          </div>
        )}
      </div>
      
      {/* Add mobile-specific styles to the wrapper for better containment */}
      <div className="sm:p-0 -mx-2 sm:mx-0 px-2 sm:px-0">
        <EventsPreview 
          communityId={communityId} 
          sortOption={sortOption} 
          refreshKey={refreshKey}
          onEventCountChange={handleEventCountChange} // Pass the callback
        />
      </div>
      
      {/* Show button centered on mobile when no events */}
      {eventCount === 0 && (
        <div className="mt-4 flex justify-center sm:justify-start">
          <CreateEventButton />
        </div>
      )}
      
      <CreateEventDialog 
        communityId={communityId} 
        onEventCreated={handleEventCreated} 
      />
    </>
  )
}

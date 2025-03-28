"use client"

import { EventFilter, SortOption } from './event-filter'

interface EventFilterControlProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export default function EventFilterControl({ sortOption, onSortChange }: EventFilterControlProps) {
  return (
    <EventFilter 
      sortOption={sortOption} 
      onSortChange={onSortChange} 
    />
  )
}

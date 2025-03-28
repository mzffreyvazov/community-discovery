"use client"

import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export type SortOption = 'newest' | 'date'

interface EventFilterProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export function EventFilter({ sortOption, onSortChange }: EventFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className={sortOption === 'newest' ? 'bg-muted' : ''}
          onClick={() => onSortChange('newest')}
        >
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={sortOption === 'date' ? 'bg-muted' : ''}
          onClick={() => onSortChange('date')}
        >
          By Event Date
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

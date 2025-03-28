"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function CreateEventButton() {
  return (
    <Button
      onClick={() => document.getElementById('create-event-dialog')?.click()}
      variant="default"
      size="sm"
      className="gap-2 cursor-pointer"
    >
      <Plus className="h-4 w-4" />
      Create Event
    </Button>
  )
}

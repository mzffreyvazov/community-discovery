"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CreateCommunityModal } from "@/components/community-creation/create-community-modal"

export function CreateCommunityButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 cursor-pointer">
        <PlusCircle className="h-4 w-4" />
        Create Community
      </Button>
      <CreateCommunityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}


"use client"

import * as React from "react"
import { Camera } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { fetchInterests } from "@/lib/supabase"

interface InterestTag {
  id: string
  label: string
}

// const defaultInterests: InterestTag[] = [
//   { id: "tech", label: "Technology" },
//   { id: "travel", label: "Travel" },
//   { id: "food", label: "Food & Cooking" },
//   { id: "fitness", label: "Fitness" },
//   { id: "art", label: "Art & Design" },
//   { id: "music", label: "Music" },
//   { id: "books", label: "Books" },
//   { id: "nature", label: "Nature" },
// ]

interface UserInfoFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSave?: (data: { bio: string; interests: string[]; profilePhoto?: File }) => void
  initialBio?: string
  initialInterests?: string[]
}

export function UserInfoForm({
  className,
  onSave,
  initialBio = "",
  initialInterests = [],
  ...props
}: UserInfoFormProps) {
  const [interests, setInterests] = React.useState<InterestTag[]>([])
  const [bio, setBio] = React.useState(initialBio)
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>(initialInterests)
  const [profilePhoto, setProfilePhoto] = React.useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Fetch interests when component mounts
    React.useEffect(() => {
        async function loadInterests() {
            const interestsData = await fetchInterests()
            setInterests(interestsData)
        }
        loadInterests()
        }, [])
    
  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePhoto(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

//   const handleRemovePhoto = () => {
//     setProfilePhoto(null)
//     setPhotoPreview(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }

  const handleSave = () => {
    if (onSave) {
      onSave({
        bio,
        interests: selectedInterests,
        profilePhoto: profilePhoto || undefined,
      })
    }
  }

  return (
    <div className={cn("w-full max-w-md mx-auto bg-card rounded-lg shadow-lg p-8", className)} {...props}>
      <h1 className="text-2xl font-bold text-center mb-6 text-foreground">Tell us more about yourself</h1>

      <div className="space-y-6">
        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border border-border shadow-md">
              {photoPreview ? (
                <Image src={photoPreview || "/placeholder.svg"} alt="Profile preview" fill className="object-cover" />
              ) : (
                <div className="h-24 w-24 bg-muted flex items-center justify-center text-4xl">👤</div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="profile-photo-input"
            />

            <label
              htmlFor="profile-photo-input"
              className="absolute bottom-0 right-0 rounded-full bg-background text-foreground p-2 cursor-pointer shadow-md border border-border"
            >
              <Camera className="h-4 w-4" />
            </label>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-2">
          <h3 className="text-base font-medium text-foreground">Bio</h3>
          <Textarea
            placeholder="Share a little about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="min-h-[120px] resize-none border border-border rounded-md focus:ring-1 focus:ring-ring focus:border-ring shadow-sm bg-background text-foreground"
          />
        </div>

        {/* Interests Section */}
        <div className="space-y-2">
          <h3 className="text-base font-medium text-foreground">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
                <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={cn(
                    "px-4 py-2 text-sm transition-colors border rounded-full shadow-sm cursor-pointer",
                    selectedInterests.includes(interest.id)
                    ? "bg-primary text-primary-foreground border-primary "
                    : "bg-background text-foreground border-border hover:bg-muted"
                )}
                >
                {interest.label}
                </button>
            ))}
            </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8">
        <Button 
          onClick={handleSave} 
          className="w-full cursor-pointer"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}


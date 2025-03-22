"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CommunityBasicInfo } from "./community-basic-info"
import { CommunityChatRooms } from "./community-chat-rooms"
import { CommunitySettings } from "./community-settings"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { createFullCommunity, getCurrentUserId, uploadCommunityImage } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Add these interfaces at the top of the file
interface LocationItem {
  value: string
  label: string
  fullName?: string
}

interface CountryData {
  cca2: string
  name: {
    common: string
  }
}

interface StateData {
  name: string
}

interface LoadingState {
  countries: boolean
  cities: boolean
  submit: boolean
}

// Update the CommunityData type to include location fields
export type CommunityData = {
  name: string
  description: string
  tags: string[]
  image: string | undefined
  country: string
  city: string
  chatRooms: { name: string; type: "text" | "voice" | "video" }[]
  isPrivate: boolean
}

// Update the defaultCommunityData to include empty location fields
const defaultCommunityData: CommunityData = {
  name: "",
  description: "",
  tags: [],
  image: undefined,
  country: "",
  city: "",
  chatRooms: [{ name: "general", type: "text" }],
  isPrivate: false,
}

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

interface CreateCommunityModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateCommunityModal({ isOpen, onClose }: CreateCommunityModalProps) {
  const [activeTab, setActiveTab] = useState("basic-info")
  const [communityData, setCommunityData] = useState<CommunityData>(defaultCommunityData)
  const router = useRouter()

  // Add location data states
  const [countries, setCountries] = useState<LocationItem[]>([])
  const [cities, setCities] = useState<LocationItem[]>([])
  const [loading, setLoading] = useState<LoadingState>({ 
    countries: false, 
    cities: false,
    submit: false
  })
  const [countryOpen, setCountryOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  
  // Keep track of the raw file for uploading
  const [imageFile, setImageFile] = useState<File | null>(null)

  const getScrollbarWidth = () => {
    const outer = document.createElement("div")
    outer.style.visibility = "hidden"
    outer.style.overflow = "scroll"
    document.body.appendChild(outer)

    const inner = document.createElement("div")
    outer.appendChild(inner)

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

    outer.parentNode?.removeChild(outer)

    return scrollbarWidth
  }

  useEffect(() => {
    if (isOpen) {
      const scrollWidth = getScrollbarWidth()
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = `${scrollWidth}px`
    } else {
      document.body.style.overflow = "auto"
      document.body.style.paddingRight = `0`
    }
    return () => {
      document.body.style.overflow = "auto"
      document.body.style.paddingRight = `0`
    }
  }, [isOpen])

  // Add useEffect for fetching countries
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading((prevState) => ({ ...prevState, countries: true }))
      try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        if (!response.ok) throw new Error("Failed to fetch countries")
        const data = await response.json()

        const formattedCountries = data
          .map((country: CountryData) => ({
            value: country.cca2,
            label: country.name.common,
            fullName: country.name.common,
          }))
          .sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label))

        setCountries(formattedCountries)
      } catch (error) {
        console.error("Error fetching countries:", error)
        toast.error("Failed to fetch countries. Please try again.")
      } finally {
        setLoading((prevState) => ({ ...prevState, countries: false }))
      }
    }

    fetchCountries()
  }, [])

  // Add useEffect for fetching cities
  useEffect(() => {
    const fetchCities = async () => {
      if (!communityData.country) {
        setCities([])
        return
      }

      setLoading((prevState) => ({ ...prevState, cities: true }))
      try {
        const selectedCountry = countries.find((c) => c.value === communityData.country)
        if (!selectedCountry) {
          throw new Error("Country not found")
        }

        const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country: selectedCountry.fullName }),
        })

        if (!response.ok) throw new Error("Failed to fetch states")
        const data = await response.json()

        if (!data.data?.states) {
          throw new Error("No states data found")
        }

        const formattedCities = data.data.states
          .map((state: StateData) => ({
            value: state.name,
            label: state.name,
          }))
          .sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label))

        setCities(formattedCities)
      } catch (error) {
        console.error("Error fetching states:", error)
        toast.error("Failed to fetch states. Please try again.")
      } finally {
        setLoading((prevState) => ({ ...prevState, cities: false }))
      }
    }

    if (communityData.country) {
      fetchCities()
    }
  }, [communityData.country, countries])

  const handleSave = async () => {
    // Validate required fields
    if (!communityData.name.trim()) {
      toast.error("Please provide a name for your community.")
      setActiveTab("basic-info")
      return
    }

    if (communityData.chatRooms.some(room => !room.name.trim())) {
      toast.error("All chat rooms must have a name.")
      setActiveTab("chat-rooms")
      return
    }

    // Set loading state
    setLoading(prev => ({ ...prev, submit: true }))

    try {
      // Get the current user ID from Supabase
      const userId = await getCurrentUserId()
      
      if (!userId) {
        throw new Error("User not found. Please sign in again.")
      }

      // Prepare community data
      let coverImageUrl = undefined

      // Upload the image if it exists
      if (imageFile) {
        const { url, error } = await uploadCommunityImage(imageFile, userId)
        if (error) {
          throw new Error("Failed to upload community image.")
        }
        coverImageUrl = url
      }

      // Get country and city full names
      const countryName = communityData.country ? 
        countries.find(c => c.value === communityData.country)?.fullName || "" :
        ""
      
      const cityName = communityData.city || ""

      // Save the community data
      const { success, communityId, error } = await createFullCommunity(
        {
          name: communityData.name,
          description: communityData.description,
          owner_id: userId,
          city: cityName,
          country: countryName,
          cover_image_url: undefined,
          is_online: false // Default to false, you can add a field for this later
        },
        communityData.chatRooms,
        communityData.tags
      )

      if (!success || error) {
        throw new Error(error?.message || "Failed to create community.")
      }

      // Show success toast
      toast.success("Your community has been created successfully!")

      // Close the modal and reset form
      onClose()
      router.refresh();
      setTimeout(() => {
        router.refresh();
      }, 300);
      setCommunityData(defaultCommunityData)
      setActiveTab("basic-info")
      setImageFile(null)
    } catch (error) {
      console.error("Error saving community:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create community. Please try again.")
    } finally {
      setLoading(prev => ({ ...prev, submit: false }))
    }
  }

  const updateCommunityData = (data: Partial<CommunityData>) => {
    setCommunityData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (activeTab === "basic-info") {
      // Validate basic info before proceeding
      if (!communityData.name.trim()) {
        toast.error("Please provide a name for your community.")
        return
      }
      setActiveTab("chat-rooms")
    }
    else if (activeTab === "chat-rooms") {
      // Validate chat rooms before proceeding
      if (communityData.chatRooms.some(room => !room.name.trim())) {
        toast.error("All chat rooms must have a name.")
        return
      }
      setActiveTab("settings")
    }
  }

  const handleBack = () => {
    if (activeTab === "chat-rooms") setActiveTab("basic-info")
    else if (activeTab === "settings") setActiveTab("chat-rooms")
  }

  // Function to handle image upload from community-basic-info
  const handleImageUpload = (file: File) => {
    setImageFile(file)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Community</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Custom tabs implementation for better animation control */}
          <div className="flex mb-6 p-1 bg-muted/20 rounded-lg relative">
            {/* The animated background pill */}
            <motion.div
              className="absolute h-[85%] top-[7.5%] rounded-md bg-white dark:bg-slate-800 shadow-sm z-0"
              animate={{
                left: activeTab === "basic-info" ? "0%" : activeTab === "chat-rooms" ? "33.333%" : "66.666%",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1,
              }}
              style={{ width: "33.333%" }}
            />

            {/* Tab buttons */}
            <button
              onClick={() => setActiveTab("basic-info")}
              className={`cursor-pointer flex-1 py-2 z-10 relative text-sm font-medium transition-colors rounded-md
                ${activeTab === "basic-info" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab("chat-rooms")}
              className={`cursor-pointer flex-1 py-2 z-10 relative text-sm font-medium transition-colors rounded-md
                ${activeTab === "chat-rooms" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Chat Rooms
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`cursor-pointer flex-1 py-2 z-10 relative text-sm font-medium transition-colors rounded-md
                ${activeTab === "settings" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Settings
            </button>
          </div>

          {/* Tab content with animations */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "basic-info" && (
                <CommunityBasicInfo
                  data={communityData}
                  updateData={updateCommunityData}
                  countries={countries}
                  cities={cities}
                  loading={loading}
                  countryOpen={countryOpen}
                  setCountryOpen={setCountryOpen}
                  cityOpen={cityOpen}
                  setCityOpen={setCityOpen}
                  onImageUpload={handleImageUpload}
                />
              )}
              {activeTab === "chat-rooms" && (
                <CommunityChatRooms data={communityData} updateData={updateCommunityData} />
              )}
              {activeTab === "settings" && <CommunitySettings data={communityData} updateData={updateCommunityData} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-6">
          {activeTab !== "basic-info" ? (
            <Button variant="outline" onClick={handleBack} disabled={loading.submit}>
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {activeTab !== "settings" ? (
            <Button onClick={handleNext} disabled={loading.submit}>Next</Button>
          ) : (
            <Button 
              onClick={handleSave} 
              disabled={loading.submit}
              className="flex items-center gap-2"
            >
              {loading.submit && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading.submit ? "Creating..." : "Create Community"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
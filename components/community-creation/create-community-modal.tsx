"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CommunityBasicInfo } from "./community-basic-info"
import { CommunityChatRooms } from "./community-chat-rooms"
import { CommunitySettings } from "./community-settings"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

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
}

// Update the CommunityData type to include location fields
export type CommunityData = {
  name: string
  description: string
  tags: string[]
  image: string | null
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
  image: null,
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

  // Add location data states
  const [countries, setCountries] = useState<LocationItem[]>([])
  const [cities, setCities] = useState<LocationItem[]>([])
  const [loading, setLoading] = useState<LoadingState>({ countries: false, cities: false })
  const [countryOpen, setCountryOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)

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
      } finally {
        setLoading((prevState) => ({ ...prevState, cities: false }))
      }
    }

    if (communityData.country) {
      fetchCities()
    }
  }, [communityData.country, countries])

  const handleSave = () => {
    // Here you would typically save the community data to your backend
    console.log("Community data:", communityData)
    onClose()
    // Reset form
    setCommunityData(defaultCommunityData)
    setActiveTab("basic-info")
  }

  const updateCommunityData = (data: Partial<CommunityData>) => {
    setCommunityData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (activeTab === "basic-info") setActiveTab("chat-rooms")
    else if (activeTab === "chat-rooms") setActiveTab("settings")
  }

  const handleBack = () => {
    if (activeTab === "chat-rooms") setActiveTab("basic-info")
    else if (activeTab === "settings") setActiveTab("chat-rooms")
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
              className={`flex-1 py-2 z-10 relative text-sm font-medium transition-colors rounded-md
                ${activeTab === "basic-info" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab("chat-rooms")}
              className={`flex-1 py-2 z-10 relative text-sm font-medium transition-colors rounded-md
                ${activeTab === "chat-rooms" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Chat Rooms
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-2 z-10 relative text-sm font-medium transition-colors rounded-md
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
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {activeTab !== "settings" ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSave}>Create Community</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


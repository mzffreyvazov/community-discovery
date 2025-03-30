/* File: [Your Path]/create-event-dialog.tsx */

"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { createBrowserClient, getCurrentUserId } from "@/lib/supabase"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { cn } from "@/lib/utils"

// Define the specific validation errors interface for this form
interface EventValidationErrors {
  title?: string;
  description?: string;
  startDate?: string;
  address?: string;
  city?: string;
  country?: string;
  maxAttendees?: string;
  locationUrl?: string; // Optional validation
}

// Define the state type for the form data
interface EventFormData {
  title: string;
  description: string;
  city: string;
  country: string;
  address: string;
  locationUrl: string;
  maxAttendees: string;
}

interface CreateEventDialogProps {
  communityId: string
  onEventCreated?: () => void
}

export function CreateEventDialog({ communityId, onEventCreated }: CreateEventDialogProps) {
  const router = useRouter()
  const { userId } = useAuth() // Keep Clerk's userId for checking login status
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null) // Supabase integer ID
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  // Use the specific validation errors type
  const [validationErrors, setValidationErrors] = useState<EventValidationErrors>({})

  // Initial state for the form data
  const initialEventState = useMemo<EventFormData>(() => ({
    title: "",
    description: "",
    city: "",
    country: "",
    address: "",
    locationUrl: "",
    maxAttendees: "",
  }), [])

  const [newEvent, setNewEvent] = useState<EventFormData>(initialEventState)

  // Function to reset form state
  const resetForm = useCallback(() => {
    setNewEvent(initialEventState)
    setStartDate(undefined)
    setEndDate(undefined)
    setValidationErrors({}) // Reset validation errors
    setIsLoading(false)
  }, [initialEventState])

  // Handle dialog open/close changes
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetForm()
    }
  }, [resetForm])

  const handleCancel = useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  // Effect for body scroll lock
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  // Effect to fetch Supabase user ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getCurrentUserId()
        setCurrentUserId(id)
      } catch (error) {
        console.error("Error fetching Supabase user ID:", error)
        // Optionally handle the case where the ID cannot be fetched
        // toast.error("Could not verify user session.");
      }
    }
    if (userId) { // Only fetch if Clerk user ID exists
      fetchUserId()
    } else {
      setCurrentUserId(null)
    }
  }, [userId]) // Depend on Clerk's userId

  // Update form data and clear validation error for the specific field
  const updateEventData = (field: keyof EventFormData, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }))
    // Clear validation error for this field when it's changed
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Validation function (similar to CreateCommunityModal)
  const validateForm = (): boolean => {
    const errors: EventValidationErrors = {}

    // Title validation
    if (!newEvent.title.trim()) {
      errors.title = "Event title is required"
    } else if (newEvent.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters"
    }

    // Description validation
    if (!newEvent.description.trim()) {
      errors.description = "Event description is required"
    }

    // Start Date validation
    if (!startDate) {
      errors.startDate = "Start date/time is required"
    } else if (endDate && startDate > endDate) {
        // Add validation if end date exists and is before start date
        errors.startDate = "Start date cannot be after end date";
        // Optionally add error to endDate too: errors.endDate = "End date cannot be before start date";
    }

    // Address validation
    if (!newEvent.address.trim()) {
      errors.address = "Address is required"
    }

    // City validation
    if (!newEvent.city.trim()) {
      errors.city = "City is required"
    }

    // Country validation
    if (!newEvent.country.trim()) {
      errors.country = "Country is required"
    }

    // Max Attendees validation (optional field, but validate if provided)
    if (newEvent.maxAttendees) {
        const max = parseInt(newEvent.maxAttendees, 10);
        if (isNaN(max) || max <= 0) {
            errors.maxAttendees = "Maximum attendees must be a positive number";
        }
    }

    // Optional: Location URL validation (e.g., check if it's a valid URL format)
    if (newEvent.locationUrl.trim()) {
        try {
            new URL(newEvent.locationUrl.trim());
        } catch (_) {
            errors.locationUrl = "Please enter a valid URL (e.g., https://maps.google.com)";
        }
    }


    setValidationErrors(errors)
    return Object.keys(errors).length === 0 // Return true if no errors
  }

  // Event creation logic
  const handleCreateEvent = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.")
      // Optional: Focus the first field with an error
      const firstErrorField = Object.keys(validationErrors)[0] as keyof EventValidationErrors | undefined;
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.focus();
        // Special focus handling for DateTimePicker might be needed if the above doesn't work
        if (firstErrorField === 'startDate') {
            const datePickerButton = document.querySelector('#startDate button'); // Adjust selector as needed
            (datePickerButton as HTMLElement)?.focus();
        }
      }
      return
    }

    if (!currentUserId) {
      toast.error("Authentication error. Please ensure you are logged in.")
      // Consider prompting re-login or refreshing the page
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const supabase = createBrowserClient()

    const eventData = {
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      start_time: startDate!.toISOString(), // Non-null assertion validated by validateForm
      end_time: endDate ? endDate.toISOString() : null,
      community_id: parseInt(communityId), // Ensure communityId is a number
      created_by: currentUserId, // Use the fetched Supabase integer ID
      address: newEvent.address.trim(),
      city: newEvent.city.trim(),
      country: newEvent.country.trim(),
      is_online: false, // Assuming physical event based on fields
      location_url: newEvent.locationUrl.trim() || null,
      max_attendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : null,
    }

    console.log("Creating event with data:", eventData)

    try {
      const { data, error } = await supabase.from("events")
        .insert(eventData)
        .select()
        .single()

      if (error) {
        console.error("Error creating event:", error)
        toast.error(`Failed to create event: ${error.message}`)
        // Keep dialog open on error
      } else if (data) {
        console.log("Event created successfully:", data)
        toast.success("Event created successfully!")
        handleOpenChange(false) // Close dialog on success (will trigger resetForm)

        if (onEventCreated) {
          onEventCreated()
        }
        router.refresh() // Refresh data on the page
        // Optional delay for refresh if needed
        // setTimeout(() => router.refresh(), 300);
      }
    } catch (error) {
      console.error("Unexpected error creating event:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false) // Ensure loading state is reset
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* DialogTrigger remains hidden, opened programmatically */}
      <DialogTrigger id="create-event-dialog" className="hidden">
        Create Event
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Event</DialogTitle>
        </DialogHeader>

        {/* Form Area - Make it scrollable */}
        {/* Increased spacing with space-y-6 between form groups */}
        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-6 py-4"> {/* Increased spacing */}
          <style jsx global>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          {/* Title */}
          {/* Increased space between label and input using space-y-2 */}
          <div className="space-y-2"> {/* Increased spacing */}
            {/* Asterisk removed */}
            <Label htmlFor="title" className="flex items-center font-medium">
              Event Title
            </Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) => updateEventData("title", e.target.value)}
              placeholder="What's your event called?"
              className={cn(validationErrors.title && "border-destructive focus-visible:ring-destructive")}
              aria-invalid={Boolean(validationErrors.title)}
              aria-describedby="title-error"
              required // Keep HTML required for semantics/browser hints if desired
            />
            {validationErrors.title && (
              <p id="title-error" className="text-sm text-destructive mt-1">{validationErrors.title}</p>
            )}
          </div>

          {/* Description */}
          {/* Increased space between label and input using space-y-2 */}
          <div className="space-y-2"> {/* Increased spacing */}
            {/* Asterisk removed */}
            <Label htmlFor="description" className="flex items-center font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => updateEventData("description", e.target.value)}
              placeholder="Provide details about your event..."
              rows={4}
              className={cn(validationErrors.description && "border-destructive focus-visible:ring-destructive")}
              aria-invalid={Boolean(validationErrors.description)}
              aria-describedby="description-error"
              required // Keep HTML required
            />
            {validationErrors.description && (
              <p id="description-error" className="text-sm text-destructive mt-1">{validationErrors.description}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center font-medium">
                Start Date/Time
              </Label>
              <div id="startDate" className={cn(validationErrors.startDate && "border-destructive")}>
                <DateTimePicker
                  value={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    // Clear validation error for this field when it's changed
                    if (validationErrors.startDate) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.startDate;
                        return newErrors;
                      });
                    }
                  }}
                  aria-describedby="startDate-error"
                  label="Start Time"
                />
              </div>
              {validationErrors.startDate && (
                <p id="startDate-error" className="text-sm text-destructive mt-1">{validationErrors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDateTime" className="font-medium">End Date/Time</Label>
              <DateTimePicker
                value={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  // Check if this resolves any validation errors with the start date
                  if (validationErrors.startDate && startDate && date && startDate <= date) {
                    setValidationErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.startDate;
                      return newErrors;
                    });
                  }
                }}
                label="End Time"
              />
              {/* Placeholder for potential end date errors */}
            </div>
          </div>

           {/* Address */}
           {/* Increased space between label and input using space-y-2 */}
           <div className="space-y-2"> {/* Increased spacing */}
             {/* Asterisk removed */}
             <Label htmlFor="address" className="flex items-center font-medium">
               Address
             </Label>
             <Input
               id="address"
               value={newEvent.address}
               onChange={(e) => updateEventData("address", e.target.value)}
               placeholder="Enter street address"
               className={cn(validationErrors.address && "border-destructive focus-visible:ring-destructive")}
               aria-invalid={Boolean(validationErrors.address)}
               aria-describedby="address-error"
               required // Keep HTML required
             />
             {validationErrors.address && (
               <p id="address-error" className="text-sm text-destructive mt-1">{validationErrors.address}</p>
             )}
           </div>

           {/* City / Country */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Increased space between label and input using space-y-2 */}
             <div className="space-y-2"> {/* Increased spacing */}
               {/* Asterisk removed */}
               <Label htmlFor="city" className="flex items-center font-medium">
                 City
               </Label>
               <Input
                 id="city"
                 value={newEvent.city}
                 onChange={(e) => updateEventData("city", e.target.value)}
                 placeholder="City name"
                 className={cn(validationErrors.city && "border-destructive focus-visible:ring-destructive")}
                 aria-invalid={Boolean(validationErrors.city)}
                 aria-describedby="city-error"
                 required // Keep HTML required
               />
               {validationErrors.city && (
                 <p id="city-error" className="text-sm text-destructive mt-1">{validationErrors.city}</p>
               )}
             </div>
             {/* Increased space between label and input using space-y-2 */}
             <div className="space-y-2"> {/* Increased spacing */}
               {/* Asterisk removed */}
               <Label htmlFor="country" className="flex items-center font-medium">
                 Country
               </Label>
               <Input
                 id="country"
                 value={newEvent.country}
                 onChange={(e) => updateEventData("country", e.target.value)}
                 placeholder="Country name"
                 className={cn(validationErrors.country && "border-destructive focus-visible:ring-destructive")}
                 aria-invalid={Boolean(validationErrors.country)}
                 aria-describedby="country-error"
                 required // Keep HTML required
               />
               {validationErrors.country && (
                 <p id="country-error" className="text-sm text-destructive mt-1">{validationErrors.country}</p>
               )}
             </div>
           </div>

           {/* Location URL */}
           {/* Increased space between label and input using space-y-2 */}
           <div className="space-y-2"> {/* Increased spacing */}
            <Label htmlFor="locationUrl" className="font-medium">Place Location URL</Label>
            <Input
              id="locationUrl"
              value={newEvent.locationUrl}
              onChange={(e) => updateEventData("locationUrl", e.target.value)}
              placeholder="e.g., https://maps.google.com/your-place"
              className={cn(validationErrors.locationUrl && "border-destructive focus-visible:ring-destructive")}
              aria-invalid={Boolean(validationErrors.locationUrl)}
              aria-describedby="locationUrl-error"
            />
            {validationErrors.locationUrl && (
              <p id="locationUrl-error" className="text-sm text-destructive mt-1">{validationErrors.locationUrl}</p>
            )}
          </div>


          {/* Max Attendees */}
          {/* Increased space between label and input using space-y-2 */}
          <div className="space-y-2"> {/* Increased spacing */}
            <Label htmlFor="maxAttendees" className="font-medium">Maximum Attendees</Label>
            <Input
              id="maxAttendees"
              type="number"
              min="1"
              value={newEvent.maxAttendees}
              onChange={(e) => updateEventData("maxAttendees", e.target.value)}
              placeholder="Leave empty for unlimited"
              className={cn(validationErrors.maxAttendees && "border-destructive focus-visible:ring-destructive")}
              aria-invalid={Boolean(validationErrors.maxAttendees)}
              aria-describedby="maxAttendees-error"
            />
            {validationErrors.maxAttendees && (
              <p id="maxAttendees-error" className="text-sm text-destructive mt-1">{validationErrors.maxAttendees}</p>
            )}
          </div>
        </div> {/* End Scrollable Area */}

        {/* Footer with Buttons */}
        {/* Adjusted Footer Spacing */}
        <DialogFooter className="pt-6 border-t mt-4"> {/* Adjusted spacing */}
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            type="button"
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateEvent}
            disabled={isLoading}
            className="cursor-pointer flex items-center gap-2"
            type="button"
          >
            {/* ... loading spinner ... */}
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
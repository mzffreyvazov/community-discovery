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

interface CreateEventDialogProps {
  communityId: string
  onEventCreated?: () => void
}

export function CreateEventDialog({ communityId, onEventCreated }: CreateEventDialogProps) {
  const router = useRouter()
  const { userId } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const initialEventState = useMemo(() => ({
    title: "",
    description: "",
    city: "",
    country: "",
    address: "",
    locationUrl: "",
    maxAttendees: "",
  }), [])

  const [newEvent, setNewEvent] = useState(initialEventState)

  // Function to reset form state
  const resetForm = useCallback(() => {
    setNewEvent(initialEventState)
    setStartDate(undefined)
    setEndDate(undefined)
    setErrors({})
    setTouched({})
    setIsLoading(false) // Also reset loading state if dialog closes unexpectedly
  }, [initialEventState])

  // Handle dialog open/close changes
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsOpen(open);
  }, [resetForm]);

  const handleCancel = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  // Effect for body scroll lock (remains the same)
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      // Cleanup happens when isOpen becomes false
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    // Cleanup function for when component unmounts or isOpen changes again
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen]) // Dependency on isOpen

  // Effect to fetch user ID (remains the same)
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getCurrentUserId()
        setCurrentUserId(id)
      } catch (error) {
        console.error("Error fetching user ID:", error)
      }
    }
    fetchUserId()
  }, [userId])

  // Field handling and validation logic (remains the same)
  const handleFieldChange = (field: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }))
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }))
    }
    // Clear error for this field upon change
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field)
  }

  const validateField = (field: string): boolean => {
    let error = ""

    switch (field) {
      case "title":
        if (!newEvent.title.trim()) error = "Event title is required";
        else if (newEvent.title.trim().length < 3) error = "Title must be at least 3 characters";
        break
      case "description":
        if (!newEvent.description.trim()) error = "Event description is required";
        break
      case "startDate":
        if (!startDate) error = "Start date/time is required";
        break
      case "address":
        if (!newEvent.address.trim()) error = "Address is required";
        break
      case "city":
        if (!newEvent.city.trim()) error = "City is required";
        break
      case "country":
        if (!newEvent.country.trim()) error = "Country is required";
        break
      case "maxAttendees":
        const max = newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : NaN;
        if (newEvent.maxAttendees && (isNaN(max) || max <= 0)) error = "Maximum attendees must be a positive number";
        break
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
      return false
    } else {
      // Ensure error is removed if validation passes
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
      return true
    }
  }

  const validateForm = () => {
    const fieldsToValidate = ["title", "description", "startDate", "address", "city", "country", "maxAttendees"]
    let isValid = true

    // Mark all fields as touched to show errors
    const allTouched = fieldsToValidate.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);


    // Validate each field and update errors state
    fieldsToValidate.forEach(field => {
        // Ensure validateField updates the errors state directly
        if (!validateField(field)) {
            isValid = false;
        }
    });


    // Check for start date specifically if not handled by validateField logic above
     if (!startDate) {
        setErrors(prev => ({ ...prev, startDate: "Start date/time is required" }));
        isValid = false;
     }


    return isValid
  }


  // Event creation logic (remains the same)
  const handleCreateEvent = async () => {
    // Ensure all relevant fields are marked as touched before validation
     setTouched({
       title: true,
       description: true,
       startDate: true,
       address: true,
       city: true,
       country: true,
       maxAttendees: true,
     });


    if (!validateForm()) {
      // Find the first element with an error and focus it
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      const firstErrorElement = firstErrorField ? document.getElementById(firstErrorField) : null;


      // Special handling for date picker focusing might be needed if it's complex
      // This focuses the wrapper div for the date picker
      const datePickerElement = document.getElementById('startDate'); // Ensure the div has this id


      if (firstErrorField === 'startDate' && datePickerElement) {
         datePickerElement.focus(); // Or find a focusable element within it
         // Example: datePickerElement.querySelector('button')?.focus();
      } else if (firstErrorElement) {
         firstErrorElement.focus();
      }
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsLoading(true)

    if (!currentUserId) {
      toast.error("You must be logged in to create an event")
      setIsLoading(false)
      return
    }

    const supabase = createBrowserClient()

    const eventData = {
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      start_time: startDate!.toISOString(), // Non-null assertion because validateForm checks it
      end_time: endDate ? endDate.toISOString() : null,
      community_id: parseInt(communityId),
      created_by: currentUserId,
      address: newEvent.address.trim(),
      city: newEvent.city.trim(),
      country: newEvent.country.trim(),
      is_online: false, // Assuming physical event based on fields
      location_url: newEvent.locationUrl.trim() || null, // Add locationUrl
      max_attendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : null,
    }

    console.log("Creating event with data:", eventData)

    try {
      const { data, error } = await supabase.from("events")
        .insert(eventData)
        .select()
        .single(); // Use single() if you expect only one row back

      if (error) {
        console.error("Error creating event:", error)
        toast.error(`Failed to create event: ${error.message}`)
        return // Keep dialog open on error
      }

      if (data) {
        console.log("Event created successfully:", data)
        toast.success("Event created successfully!")
        setIsOpen(false) // Close dialog on success
        // Note: resetForm will be called by handleOpenChange when isOpen becomes false

        if (onEventCreated) {
          onEventCreated()
        }
        router.refresh() // Refresh data on the page
      }
    } catch (error) {
      console.error("Unexpected error creating event:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      // Only set isLoading to false here, let handleOpenChange handle reset
      setIsLoading(false)
    }
  }


  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange} // Use the unified handler
    >
      <DialogTrigger id="create-event-dialog" className="hidden">
        Create Event
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Event</DialogTitle>
        </DialogHeader>

        {/* Form fields remain the same */}
        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center">
              Event Title <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              placeholder="What's your event called?"
              className={cn(touched.title && errors.title && "border-destructive")}
              aria-invalid={Boolean(touched.title && errors.title)}
              required
            />
            {touched.title && errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center">
              Description <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder="Provide details about your event..."
              rows={4}
              className={cn(touched.description && errors.description && "border-destructive")}
              aria-invalid={Boolean(touched.description && errors.description)}
              required // Added required for standard HTML validation hint
            />
            {touched.description && errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center">
                Start Date/Time <span className="text-destructive ml-1">*</span>
              </Label>
              <div
                id="startDate" // Added ID here for focusing
                tabIndex={-1} // Make div focusable if needed, but prefer focusing inner button
                className={cn(
                  touched.startDate && errors.startDate && "rounded-md border border-destructive ring-destructive ring-1" // Enhanced error indication
                )}
                 // Removed onBlur here, handleBlur('startDate') is called via validateForm/validateField
              >
                <DateTimePicker
                  value={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    if (!touched.startDate) setTouched(prev => ({ ...prev, startDate: true }));
                    // Clear error manually or let validateField handle it
                    if (date && errors.startDate) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.startDate;
                        return newErrors;
                      });
                    }
                     // Re-validate on change if touched
                     if (touched.startDate) {
                       validateField("startDate");
                     }
                  }}
                  label="Start Time"
                />
              </div>
              {touched.startDate && errors.startDate && (
                <p className="text-sm text-destructive mt-1">{errors.startDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDateTime">End Date/Time</Label>
              <DateTimePicker
                value={endDate}
                onChange={setEndDate}
                label="End Time"
              />
            </div>
          </div>

           {/* Address */}
           <div className="space-y-2">
             <Label htmlFor="address" className="flex items-center">
               Address <span className="text-destructive ml-1">*</span>
             </Label>
             <Input
               id="address"
               value={newEvent.address}
               onChange={(e) => handleFieldChange("address", e.target.value)}
               onBlur={() => handleBlur("address")}
               placeholder="Enter street address"
               className={cn(touched.address && errors.address && "border-destructive")}
               aria-invalid={Boolean(touched.address && errors.address)}
               required
             />
             {touched.address && errors.address && (
               <p className="text-sm text-destructive mt-1">{errors.address}</p>
             )}
           </div>

           {/* City / Country */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="city" className="flex items-center">
                 City <span className="text-destructive ml-1">*</span>
               </Label>
               <Input
                 id="city"
                 value={newEvent.city}
                 onChange={(e) => handleFieldChange("city", e.target.value)}
                 onBlur={() => handleBlur("city")}
                 placeholder="City name"
                 className={cn(touched.city && errors.city && "border-destructive")}
                 aria-invalid={Boolean(touched.city && errors.city)}
                 required
               />
               {touched.city && errors.city && (
                 <p className="text-sm text-destructive mt-1">{errors.city}</p>
               )}
             </div>
             <div className="space-y-2">
               <Label htmlFor="country" className="flex items-center">
                 Country <span className="text-destructive ml-1">*</span>
               </Label>
               <Input
                 id="country"
                 value={newEvent.country}
                 onChange={(e) => handleFieldChange("country", e.target.value)}
                 onBlur={() => handleBlur("country")}
                 placeholder="Country name"
                 className={cn(touched.country && errors.country && "border-destructive")}
                 aria-invalid={Boolean(touched.country && errors.country)}
                 required
               />
               {touched.country && errors.country && (
                 <p className="text-sm text-destructive mt-1">{errors.country}</p>
               )}
             </div>
           </div>

           {/* Location URL */}
           <div className="space-y-2">
            <Label htmlFor="locationUrl">Place Location URL</Label>
            <Input
              id="locationUrl" // Added ID for consistency
              value={newEvent.locationUrl}
              onChange={(e) => handleFieldChange("locationUrl", e.target.value)}
              onBlur={() => handleBlur("locationUrl")} // Optional: Add validation if needed
              placeholder="e.g., Google Maps link"
              className={cn(touched.locationUrl && errors.locationUrl && "border-destructive")}
              aria-invalid={Boolean(touched.locationUrl && errors.locationUrl)}
            />
            {touched.locationUrl && errors.locationUrl && (
              <p className="text-sm text-destructive mt-1">{errors.locationUrl}</p>
            )}
          </div>


          {/* Max Attendees */}
          <div className="space-y-2">
            <Label htmlFor="maxAttendees">Maximum Attendees</Label>
            <Input
              id="maxAttendees"
              type="number"
              min="1"
              value={newEvent.maxAttendees}
              onChange={(e) => handleFieldChange("maxAttendees", e.target.value)}
              onBlur={() => handleBlur("maxAttendees")}
              placeholder="Leave empty for unlimited"
              className={cn(touched.maxAttendees && errors.maxAttendees && "border-destructive")}
              aria-invalid={Boolean(touched.maxAttendees && errors.maxAttendees)}
            />
            {touched.maxAttendees && errors.maxAttendees && (
              <p className="text-sm text-destructive mt-1">{errors.maxAttendees}</p>
            )}
          </div>
        </div>


        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            type="button" // Important: Prevent default form submission behavior
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateEvent}
            disabled={isLoading}
            className="cursor-pointer"
            type="button" // Explicitly type button if not inside a form, good practice
          >
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
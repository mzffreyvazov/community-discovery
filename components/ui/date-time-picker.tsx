/* File: [Your Path]/date-time-picker.tsx */

"use client";

import * as React from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { format, isValid } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string; // Keep label prop as it might be used by parent
  // Add aria-describedby for accessibility if linking to error messages
  'aria-describedby'?: string;
}

export function DateTimePicker({
  value,
  onChange,
  label = "Select date and time",
  'aria-describedby': ariaDescribedby // Destructure aria-describedby
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = React.useState(false);
  const [view, setView] = React.useState<"date" | "time">("date");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [timeInputs, setTimeInputs] = React.useState({ hour: "", minute: "" });

  // Effect to sync internal state when external value prop changes OR when opening
  React.useEffect(() => {
    // If the popover is not open, ensure internal state matches external value
    // Or if the external value changes while it IS open, update internal state
    if (!isOpen || (value !== selectedDate)) {
        if (value && (!selectedDate || value.getTime() !== selectedDate.getTime())) {
          console.log("[DateTimePicker] Syncing internal state from prop value:", value);
          setSelectedDate(value);
        } else if (!value && selectedDate) {
          console.log("[DateTimePicker] Clearing internal state as prop value is undefined");
          setSelectedDate(undefined);
        }
    }
  }, [value, isOpen]); // Add isOpen dependency here

  // Effect to update time inputs display when internal selectedDate changes
  React.useEffect(() => {
    if (selectedDate && isValid(selectedDate)) {
      const hours = selectedDate.getHours();
      const displayHour = hours % 12 || 12; // Convert 0 hour (midnight) to 12 for display
      setTimeInputs({
        hour: String(displayHour),
        minute: String(selectedDate.getMinutes()).padStart(2, '0')
      });
    } else {
      // Clear inputs if date is cleared
      setTimeInputs({ hour: "", minute: "" });
    }
  }, [selectedDate]);

  const handleDateSelect = React.useCallback((newCalDate: Date | undefined) => {
    if (!newCalDate) {
        // Handle case where date might be cleared from calendar? (If calendar allows deselect)
        setSelectedDate(undefined); // Clear internal state if calendar date is cleared
        // Optionally call onChange immediately if clearing is desired without confirm?
        // if (onChange) onChange(undefined);
        return;
    };

    // Preserve existing time or default to midnight if no time set yet
    const currentHours = selectedDate?.getHours() ?? 0;
    const currentMinutes = selectedDate?.getMinutes() ?? 0;

    const newFullDate = new Date(newCalDate);
    // Set time, making sure to respect the date part from the calendar
    newFullDate.setHours(currentHours, currentMinutes, 0, 0);

    console.log("[DateTimePicker] Date selected:", newFullDate);
    setSelectedDate(newFullDate);
    if (isMobile) setView("time"); // Switch to time view on mobile after date pick

  }, [selectedDate, isMobile]); // Removed onChange from dependencies

  const handleTimeInput = React.useCallback((type: "hour" | "minute", inputValue: string) => {
    // Ensure we have a base date to modify, default to now if none selected yet?
    // OR maybe disable time input if no date selected? Let's assume disable is handled.
    const baseDate = selectedDate || new Date(); // Use selectedDate if available
    const newDate = new Date(baseDate);
    let valueUpdated = false;
    const updatedTimeInputs = { ...timeInputs }; // Create copy to modify

    if (type === "hour") {
      updatedTimeInputs.hour = inputValue; // Update display input immediately
      const numValue = parseInt(inputValue);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
        const currentHours = newDate.getHours();
        const isPM = currentHours >= 12;
        let newHour24 = numValue % 12; // 12 becomes 0 here
        if (isPM) newHour24 += 12;
        if (numValue === 12) { // Special handling for 12 AM (0) and 12 PM (12)
             newHour24 = isPM ? 12 : 0;
        }
        newDate.setHours(newHour24);
        valueUpdated = true;
      }
       // Allow empty input without clearing date, just update display state
       // If input becomes invalid but not empty, don't update Date object

    } else if (type === "minute") {
      updatedTimeInputs.minute = inputValue; // Update display input immediately
      const numValue = parseInt(inputValue);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 59) {
        newDate.setMinutes(numValue);
        // Keep the input value as potentially single digit during typing
        // Pad only when finalised or maybe on blur? Let's keep it simple for now.
        updatedTimeInputs.minute = String(numValue).padStart(2, '0'); // Pad on valid input
        valueUpdated = true;
      }
      // Allow empty/invalid input without clearing date, just update display state
    }

    // Update the visual input state regardless of Date validity
    setTimeInputs(updatedTimeInputs);

    if (valueUpdated) {
      newDate.setSeconds(0, 0); // Reset seconds/ms
      console.log("[DateTimePicker] Time input updated:", newDate);
      setSelectedDate(newDate); // Update internal state
    }
  }, [selectedDate, timeInputs]);

  const handleAMPM = React.useCallback((value: "AM" | "PM") => {
    if (!selectedDate) return; // Do nothing if no date selected

    const newDate = new Date(selectedDate);
    const currentHours = newDate.getHours();
    const isCurrentlyPM = currentHours >= 12;
    const shouldBePM = value === "PM";

    if (shouldBePM && !isCurrentlyPM) { // Changing AM to PM
        newDate.setHours(currentHours + 12);
    } else if (!shouldBePM && isCurrentlyPM) { // Changing PM to AM
        newDate.setHours(currentHours - 12);
    } else {
        return; // Already correct state
    }

    newDate.setSeconds(0, 0);
    console.log("[DateTimePicker] AM/PM updated:", newDate);
    setSelectedDate(newDate); // Update internal state

  }, [selectedDate]);


  // *** MODIFIED Confirmation Handler ***
  const handleConfirm = React.useCallback(() => {
      console.log("[DateTimePicker] Confirm clicked. Internal selectedDate:", selectedDate);
      if (onChange && selectedDate && isValid(selectedDate)) {
          console.log("[DateTimePicker] Calling onChange with:", selectedDate);
          onChange(selectedDate);
      } else if (onChange && !selectedDate) {
          // If confirmation happens when date is cleared internally
          console.log("[DateTimePicker] Calling onChange with undefined (cleared)");
          onChange(undefined);
      } else if (!onChange) {
          console.warn("[DateTimePicker] No onChange handler provided.");
      }
      setIsOpen(false); // Close the popover
  }, [onChange, selectedDate]); // Depend on onChange and selectedDate


  // Handle popover open/close state changes ONLY (no onChange call here)
  const handleOpenChange = React.useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset mobile view when closing for any reason
      setView("date");
      // Reset internal state to external value IF confirm wasn't clicked?
      // This becomes tricky. Let's rely on the effect syncing on open.
      console.log("[DateTimePicker] Popover closed.");
    } else {
       // Effect hook with [value, isOpen] dependency handles resetting internal state
       console.log("[DateTimePicker] Popover opened.");
    }
  }, []); // No dependencies needed now

  // Determine display value shown in the trigger button
  const displayValue = value && isValid(value) ? format(value, "MMM dd, yyyy hh:mm aa") : <span>{label}</span>;

  // Determine if the currently selected internal date is PM for button styling
  const isCurrentPM = selectedDate && isValid(selectedDate) ? selectedDate.getHours() >= 12 : false;

  // Disable confirmation if no valid date is selected internally
  const isConfirmDisabled = !selectedDate || !isValid(selectedDate);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground" // Style if no value from parent
          )}
          aria-label={label}
          // Pass through aria-describedby for accessibility
          aria-describedby={ariaDescribedby}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {!isMobile && (
          <div className="flex flex-row">
            {/* Calendar Part */}
            <Calendar
              mode="single"
              selected={selectedDate} // Use internal state for selection display
              onSelect={handleDateSelect} // Updates internal state
              initialFocus={isOpen}
              defaultMonth={selectedDate || value || new Date()} // Default view month
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Example: disable past dates
            />
            {/* Time Selection Part (Desktop) */}
            <div className="flex flex-col border-l p-4 min-w-[180px]">
               <div className="text-sm font-medium mb-4 text-center">Select time</div>
                {/* Time Inputs */}
                <div className="grid grid-cols-[1fr_auto_1fr] gap-1 items-center">
                   <div className="flex flex-col items-center">
                    <Label htmlFor="dtp-hour-desktop" className="text-xs text-muted-foreground mb-1">Hour</Label>
                    <Input id="dtp-hour-desktop" type="number" min={1} max={12} value={timeInputs.hour} onChange={(e) => handleTimeInput("hour", e.target.value)} placeholder="--" className="text-center h-9 px-2" aria-label="Hour" disabled={!selectedDate} />
                  </div>
                  <div className="text-center font-bold pt-5">:</div>
                  <div className="flex flex-col items-center">
                    <Label htmlFor="dtp-minute-desktop" className="text-xs text-muted-foreground mb-1">Minute</Label>
                    <Input id="dtp-minute-desktop" type="number" min={0} max={59} step={1} value={timeInputs.minute} onChange={(e) => handleTimeInput("minute", e.target.value)} placeholder="--" className="text-center h-9 px-2" aria-label="Minute" disabled={!selectedDate} />
                  </div>
                </div>
                {/* AM/PM Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                   <Button variant={selectedDate && !isCurrentPM ? "default" : "outline"} onClick={() => handleAMPM("AM")} size="sm" disabled={!selectedDate}>AM</Button>
                  <Button variant={selectedDate && isCurrentPM ? "default" : "outline"} onClick={() => handleAMPM("PM")} size="sm" disabled={!selectedDate}>PM</Button>
                </div>
                {/* Confirm Button */}
                <Button
                  className="mt-4"
                  size="sm"
                  // Call the explicit confirmation handler
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                >
                  Confirm
                </Button>
            </div>
          </div>
        )}
        {isMobile && (
            <div>
             {view === "date" ? (
               <>
                 <div className="p-3 border-b flex items-center justify-between">
                   <div className="text-sm font-medium">Select date</div>
                   {/* Enable Next only if a date is selected */}
                   <Button variant="ghost" size="sm" onClick={() => setView("time")} disabled={!selectedDate}>Next <ChevronRightIcon className="ml-1 h-4 w-4" /></Button>
                 </div>
                 <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus={isOpen && view === 'date'} defaultMonth={selectedDate || value || new Date()} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
               </>
             ) : (
               <>
                  <div className="p-3 border-b flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => setView("date")}><ChevronLeftIcon className="mr-1 h-4 w-4" /> Back</Button>
                    <div className="text-sm font-medium">Select time</div>
                    {/* Placeholder to balance header */}
                    <div style={{ width: '60px' }}></div>
                  </div>
                  <div className="p-4">
                    {/* Time Inputs (Mobile) */}
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-1 items-center">
                        <div className="flex flex-col items-center">
                         <Label htmlFor="dtp-hour-mobile" className="text-xs text-muted-foreground mb-1">Hour</Label>
                         <Input id="dtp-hour-mobile" type="number" min={1} max={12} value={timeInputs.hour} onChange={(e) => handleTimeInput("hour", e.target.value)} placeholder="--" className="text-center h-9 px-2" aria-label="Hour" disabled={!selectedDate} />
                      </div>
                      <div className="text-center font-bold pt-5">:</div>
                      <div className="flex flex-col items-center">
                         <Label htmlFor="dtp-minute-mobile" className="text-xs text-muted-foreground mb-1">Minute</Label>
                         <Input id="dtp-minute-mobile" type="number" min={0} max={59} step={1} value={timeInputs.minute} onChange={(e) => handleTimeInput("minute", e.target.value)} placeholder="--" className="text-center h-9 px-2" aria-label="Minute" disabled={!selectedDate} />
                       </div>
                    </div>
                    {/* AM/PM Buttons (Mobile) */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                       <Button variant={selectedDate && !isCurrentPM ? "default" : "outline"} onClick={() => handleAMPM("AM")} disabled={!selectedDate}>AM</Button>
                       <Button variant={selectedDate && isCurrentPM ? "default" : "outline"} onClick={() => handleAMPM("PM")} disabled={!selectedDate}>PM</Button>
                    </div>
                    {/* Done Button (Mobile) */}
                    <Button
                      className="w-full mt-4"
                      // Call the explicit confirmation handler
                      onClick={handleConfirm}
                      disabled={isConfirmDisabled}
                    >
                      Done
                    </Button>
                   </div>
               </>
             )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
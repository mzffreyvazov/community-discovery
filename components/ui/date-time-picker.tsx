"use client";

import * as React from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
}

export function DateTimePicker({ value, onChange, label = "Select date and time" }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = React.useState(false);
  const [view, setView] = React.useState<"date" | "time">("date");
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  const [timeInputs, setTimeInputs] = React.useState({
    hour: "",
    minute: ""
  });

  // Update the displayed time inputs when the date changes
  React.useEffect(() => {
    if (date) {
      setTimeInputs({
        hour: String(date.getHours() % 12 || 12),
        minute: String(date.getMinutes()).padStart(2, '0')
      });
    }
  }, [date]);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  React.useEffect(() => {
    if (onChange && date) {
      onChange(date);
    }
  }, [date, onChange]);

  // Reset to date view when closing the popover
  React.useEffect(() => {
    if (!isOpen) {
      setView("date");
    }
  }, [isOpen]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Preserve time if we already had a date selected
      if (date) {
        selectedDate.setHours(date.getHours());
        selectedDate.setMinutes(date.getMinutes());
      }
      setDate(selectedDate);
      
      // On mobile, switch to time view after selecting date
      if (isMobile) {
        setView("time");
      }
    }
  };

  const handleTimeInput = (
    type: "hour" | "minute",
    value: string
  ) => {
    // Update the input fields immediately for better UX
    setTimeInputs(prev => ({ ...prev, [type]: value }));
    
    // Only update the actual date when the input is valid
    if (!date) return;
    
    const newDate = new Date(date);
    let isValidInput = false;
    
    if (type === "hour") {
      const hourValue = parseInt(value);
      if (!isNaN(hourValue) && hourValue >= 1 && hourValue <= 12) {
        // Convert to 24-hour format, preserving AM/PM
        const isPM = newDate.getHours() >= 12;
        newDate.setHours((hourValue % 12) + (isPM ? 12 : 0));
        isValidInput = true;
      }
    } else if (type === "minute") {
      const minuteValue = parseInt(value);
      if (!isNaN(minuteValue) && minuteValue >= 0 && minuteValue <= 59) {
        newDate.setMinutes(minuteValue);
        isValidInput = true;
      }
    }
    
    if (isValidInput) {
      setDate(newDate);
    }
  };

  const handleAMPM = (value: "AM" | "PM") => {
    if (!date) return;
    
    const newDate = new Date(date);
    const currentHours = newDate.getHours();
    const isPM = value === "PM";
    
    // If it's already AM and we selected AM, or already PM and we selected PM, no change needed
    if ((currentHours < 12 && !isPM) || (currentHours >= 12 && isPM)) {
      return;
    }
    
    // Convert between AM and PM
    if (isPM) {
      // Convert to PM: Add 12 hours if it's currently AM
      newDate.setHours(currentHours + 12);
    } else {
      // Convert to AM: Subtract 12 hours if it's currently PM
      newDate.setHours(currentHours - 12);
    }
    
    setDate(newDate);
  };

  const handleConfirm = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "MMM dd, yyyy hh:mm aa")
          ) : (
            <span>{label}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {/* Desktop layout (side by side) */}
        {!isMobile && (
          <div className="flex flex-row">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
            <div className="flex flex-col border-l p-4 min-w-[200px]">
              <div className="text-sm font-medium mb-4">Select time</div>
              
              <div className="grid grid-cols-5 gap-2 items-center">
                {/* Hour Input */}
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Hour</label>
                  <Input
                    type="number" 
                    min={1}
                    max={12}
                    value={timeInputs.hour}
                    onChange={(e) => handleTimeInput("hour", e.target.value)}
                    placeholder="HH"
                    className="text-center"
                  />
                </div>
                
                <div className="text-center font-bold">:</div>
                
                {/* Minute Input */}
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Minute</label>
                  <Input
                    type="number" 
                    min={0}
                    max={59}
                    value={timeInputs.minute}
                    onChange={(e) => handleTimeInput("minute", e.target.value)}
                    placeholder="MM"
                    className="text-center"
                  />
                </div>
              </div>
              
              {/* AM/PM Selection */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  variant={date && date.getHours() < 12 ? "default" : "outline"}
                  onClick={() => handleAMPM("AM")}
                  size="sm"
                >
                  AM
                </Button>
                <Button
                  variant={date && date.getHours() >= 12 ? "default" : "outline"}
                  onClick={() => handleAMPM("PM")}
                  size="sm"
                >
                  PM
                </Button>
              </div>
              
              <Button className="mt-4" onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        )}
        
        {/* Mobile layout (switching between date and time) */}
        {isMobile && (
          <div>
            {view === "date" ? (
              <>
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="text-sm font-medium">Select date</div>
                  {date && (
                    <Button variant="ghost" size="sm" onClick={() => setView("time")}>
                      Next <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </>
            ) : (
              <>
                <div className="p-3 border-b flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setView("date")}>
                    <ChevronLeftIcon className="mr-1 h-4 w-4" /> Back
                  </Button>
                  <div className="text-sm font-medium">Select time</div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-5 gap-2 items-center">
                    {/* Hour Input */}
                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground mb-1 block">Hour</label>
                      <Input
                        type="number" 
                        min={1}
                        max={12}
                        value={timeInputs.hour}
                        onChange={(e) => handleTimeInput("hour", e.target.value)}
                        placeholder="HH"
                        className="text-center"
                      />
                    </div>
                    
                    <div className="text-center font-bold">:</div>
                    
                    {/* Minute Input */}
                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground mb-1 block">Minute</label>
                      <Input
                        type="number" 
                        min={0}
                        max={59}
                        value={timeInputs.minute}
                        onChange={(e) => handleTimeInput("minute", e.target.value)}
                        placeholder="MM"
                        className="text-center"
                      />
                    </div>
                  </div>
                  
                  {/* AM/PM Selection */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      variant={date && date.getHours() < 12 ? "default" : "outline"}
                      onClick={() => handleAMPM("AM")}
                    >
                      AM
                    </Button>
                    <Button
                      variant={date && date.getHours() >= 12 ? "default" : "outline"}
                      onClick={() => handleAMPM("PM")}
                    >
                      PM
                    </Button>
                  </div>
                  
                  <Button className="w-full mt-4" onClick={handleConfirm}>
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

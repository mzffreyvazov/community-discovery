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
  label?: string;
}

export function DateTimePicker({ value, onChange, label = "Select date and time" }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = React.useState(false);
  const [view, setView] = React.useState<"date" | "time">("date");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [timeInputs, setTimeInputs] = React.useState({ hour: "", minute: "" });

  // Effect to sync internal state when external value prop changes
  React.useEffect(() => {
    if (value !== selectedDate) {
         if (!value && selectedDate) {
             setSelectedDate(undefined);
         } else if (value && (!selectedDate || value.getTime() !== selectedDate.getTime())) {
           setSelectedDate(value);
         }
     }
  }, [value]);

  // Effect to update time inputs when internal selectedDate changes
  React.useEffect(() => {
    if (selectedDate && isValid(selectedDate)) {
      setTimeInputs({
        hour: String(selectedDate.getHours() % 12 || 12),
        minute: String(selectedDate.getMinutes()).padStart(2, '0')
      });
    } else {
      setTimeInputs({ hour: "", minute: "" });
    }
  }, [selectedDate]);

  const handleDateSelect = React.useCallback((newCalDate: Date | undefined) => {
    if (!newCalDate) return;
    const currentHours = selectedDate?.getHours() ?? 0;
    const currentMinutes = selectedDate?.getMinutes() ?? 0;
    const newFullDate = new Date(newCalDate);
    newFullDate.setHours(currentHours, currentMinutes, 0, 0);
    setSelectedDate(newFullDate);
    if (isMobile) setView("time");
  }, [selectedDate, isMobile]);

  const handleTimeInput = React.useCallback((type: "hour" | "minute", inputValue: string) => {
    const baseDate = selectedDate || new Date();
    const newDate = new Date(baseDate);
    let valueUpdated = false;
    const currentInputValue = { ...timeInputs };

    if (type === "hour") {
      currentInputValue.hour = inputValue;
      const numValue = parseInt(inputValue);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
        const currentHours = newDate.getHours();
        const isPM = currentHours >= 12;
        const newHour24 = (numValue % 12) + (isPM ? 12 : 0);
         if (numValue === 12) {
              newDate.setHours(isPM ? 12 : 0);
          } else {
              newDate.setHours(newHour24);
          }
        valueUpdated = true;
      } else if (inputValue === "") {
         setTimeInputs(currentInputValue);
         return;
      }
    } else if (type === "minute") {
      currentInputValue.minute = inputValue;
      const numValue = parseInt(inputValue);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 59) {
        newDate.setMinutes(numValue);
        currentInputValue.minute = String(numValue).padStart(2, '0');
        valueUpdated = true;
      } else if (inputValue === "") {
        setTimeInputs(currentInputValue);
        return;
      }
    }

    setTimeInputs(currentInputValue);

    if (valueUpdated) {
      newDate.setSeconds(0, 0);
      setSelectedDate(newDate);
    }
  }, [selectedDate, timeInputs]);

  const handleAMPM = React.useCallback((value: "AM" | "PM") => {
    const baseDate = selectedDate || new Date();
    const newDate = new Date(baseDate);
    const currentHours = newDate.getHours();
    const isPM = value === "PM";
    if ((isPM && currentHours < 12) || (!isPM && currentHours >= 12)) {
      newDate.setHours(currentHours + (isPM ? 12 : -12));
      newDate.setSeconds(0, 0);
      setSelectedDate(newDate);
    }
  }, [selectedDate]);

  // *** REVISED handleOpenChange ***
  const handleOpenChange = React.useCallback((open: boolean) => {
    setIsOpen(open); // Update the open state

    if (!open) { // Popover is closing (triggered by Confirm, Done, overlay click, Esc, etc.)
      console.log(`[DateTimePicker] Closing. Internal selectedDate: ${selectedDate}`);

      // Always call onChange with the current internal state when closing.
      if (onChange && selectedDate && isValid(selectedDate)) {
        console.log("[DateTimePicker] onChange called with:", selectedDate);
        onChange(selectedDate); // Always send the final selected state up when confirmed
      } else if (onChange && !selectedDate && value) {
        console.log("[DateTimePicker] onChange called with undefined (clearing)");
        onChange(undefined);
      } else if (!onChange) {
        console.warn("[DateTimePicker] No onChange handler provided.");
      }
      
      setView("date"); // Reset mobile view
    } else { // Popover is opening
      console.log(`[DateTimePicker] Opening. Setting internal state to value: ${value}`);
      setSelectedDate(value); // Reset internal state to match current prop value on open
    }
  }, [onChange, selectedDate, value]);

  const displayValue = value && isValid(value) ? format(value, "MMM dd, yyyy hh:mm aa") : <span>{label}</span>;
  const isCurrentPM = selectedDate && isValid(selectedDate) ? selectedDate.getHours() >= 12 : false;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          aria-label={label}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {!isMobile && (
          <div className="flex flex-row">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus={isOpen}
              defaultMonth={selectedDate || value || new Date()}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
            <div className="flex flex-col border-l p-4 min-w-[180px]">
               <div className="text-sm font-medium mb-4 text-center">Select time</div>
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
                <div className="grid grid-cols-2 gap-2 mt-4">
                   <Button variant={selectedDate && !isCurrentPM ? "default" : "outline"} onClick={() => handleAMPM("AM")} size="sm" disabled={!selectedDate}>AM</Button>
                  <Button variant={selectedDate && isCurrentPM ? "default" : "outline"} onClick={() => handleAMPM("PM")} size="sm" disabled={!selectedDate}>PM</Button>
                </div>
                <Button 
                  className="mt-4" 
                  size="sm" 
                  onClick={() => setIsOpen(false)} 
                  disabled={!selectedDate || !isValid(selectedDate)}
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
                   {selectedDate && isValid(selectedDate) && (<Button variant="ghost" size="sm" onClick={() => setView("time")}>Next <ChevronRightIcon className="ml-1 h-4 w-4" /></Button>)}
                 </div>
                 <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus={isOpen && view === 'date'} defaultMonth={selectedDate || value || new Date()} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
               </>
             ) : (
               <>
                  <div className="p-3 border-b flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => setView("date")}><ChevronLeftIcon className="mr-1 h-4 w-4" /> Back</Button>
                    <div className="text-sm font-medium">Select time</div>
                    <div style={{ width: '60px' }}></div>
                  </div>
                  <div className="p-4">
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
                    <div className="grid grid-cols-2 gap-2 mt-4">
                       <Button variant={selectedDate && !isCurrentPM ? "default" : "outline"} onClick={() => handleAMPM("AM")} disabled={!selectedDate}>AM</Button>
                       <Button variant={selectedDate && isCurrentPM ? "default" : "outline"} onClick={() => handleAMPM("PM")} disabled={!selectedDate}>PM</Button>
                    </div>
                    <Button className="w-full mt-4" onClick={() => setIsOpen(false)} disabled={!selectedDate || !isValid(selectedDate)}>Done</Button>
                   </div>
               </>
             )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
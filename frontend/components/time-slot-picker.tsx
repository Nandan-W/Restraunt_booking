"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const timeSlots = [
  "11:30", "12:00", "12:30", "13:00", "13:30",
  "18:00", "18:30", "19:00", "19:30", "20:00",
  "20:30", "21:00", "21:30"
];

interface TimeSlotPickerProps {
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  disabledTimeSlots: string[]; 
}

export default function TimeSlotPicker({ selectedTime, onTimeSelect, disabledTimeSlots }: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {timeSlots.map((time) => (
        <Button
        key={time}
        variant="outline"
        disabled={disabledTimeSlots.includes(time)}  // Disable the button if it's in the disabledTimeSlots array
        className={cn(
          "h-10",
          selectedTime === time && "bg-primary text-primary-foreground"
        )}
        onClick={() => onTimeSelect(time)}  // Handle time selection
      >
          {time}
        </Button>
      ))}
    </div>
  );
}
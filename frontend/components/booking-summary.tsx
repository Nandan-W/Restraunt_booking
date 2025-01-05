"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface BookingSummaryProps {
  booking: {
    date: string;
    time: string;
    guests: string;
    name: string;
    email: string;
    phone: string;
  };
  onClose: () => void;
}

export default function BookingSummary({ booking, onClose }: BookingSummaryProps) {
  const bookingDate = new Date(booking.date);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-primary" />
          <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for choosing La Belle Table. We look forward to serving you!
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Reservation Details</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Date:</dt>
                <dd>{format(bookingDate, 'MMMM d, yyyy')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Time:</dt>
                <dd>{booking.time}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Guests:</dt>
                <dd>{booking.guests}</dd>
              </div>
            </dl>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Guest Information</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Name:</dt>
                <dd>{booking.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email:</dt>
                <dd className="break-all">{booking.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Phone:</dt>
                <dd>{booking.phone}</dd>
              </div>
            </dl>
          </div>
        </div>

        <Button onClick={onClose} className="w-full">
          Make Another Reservation
        </Button>
      </Card>
    </div>
  );
}
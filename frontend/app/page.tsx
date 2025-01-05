"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Utensils, Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";
import BookingSummary from "@/components/booking-summary";
import TimeSlotPicker from "@/components/time-slot-picker";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [showSummary, setShowSummary] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); 
  const [bookedTimes, setBookedTimes] = useState<any[]>([]);

  useEffect(() => {
    // Fetching current bookings
    async function fetchBookings() {
      try {
        const response = await fetch(`${API_URL}/api/bookings`);
        const data = await response.json();

        setBookings(data); // Store the bookings in the state
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }

    fetchBookings();
  }, []);

  const bookingsByDate = bookings.reduce((acc: any, booking) => {
    const date = format(new Date(booking.date), "yyyy-MM-dd");

    if (!acc[date]) 
      acc[date] = [];

    acc[date].push(booking); // Group bookings by date

    return acc;
  }, {});

  // disabled times for a specific day
  const handleDateClick = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    setSelectedDate(date); // Setting the clicked date as selected

    if (bookingsByDate[dateString]) {
      setBookedTimes(bookingsByDate[dateString]); // Get all bookings for the selected date
    } 
    else {
      setBookedTimes([]); 
    }
  };

  // Deletion of a booking
  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted booking from the state
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
        setBookedTimes(bookedTimes.filter((booking) => booking._id !== bookingId));
      } 
      else {
        console.error("Failed to delete booking");
      }
    } 
    catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const booking = {
      date: date?.toISOString(),
      time: selectedTime,
      guests,
      name,
      email,
      phone
    };

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingData(data);
        setShowSummary(true);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  // Return an array of time slots that are already booked for a specific date
  const disabledTimeSlots = (date: Date | undefined) => {
    if (!date) return [];
    const dateString = format(date, "yyyy-MM-dd");
    return bookingsByDate[dateString]?.map((booking: any) => booking.time) || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <Utensils className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-center mb-2">The Restraunt</h1>
          <p className="text-muted-foreground text-center">Reserve your perfect dining experience</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Select Date</h2>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                onDayClick={handleDateClick} // Corrected event handler
              />      
            </div>

            {/* Display selected date's bookings */}
            {selectedDate && (
              <div className="bookings-list mt-4">
                <h3>Bookings for {format(selectedDate, "yyyy-MM-dd")}</h3>
                {bookedTimes.length > 0 ? (
                  <ul>
                    {bookedTimes.map((booking) => (
                      <li key={booking._id} className="flex items-center justify-between">
                        <span>
                          {booking.time} - {booking.name} ({booking.guests} guests)
                        </span>
                        <FaTrash
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="text-red-500 cursor-pointer"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No bookings for this day.</p>
                )}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Select Time</h2>
                </div>
                <TimeSlotPicker
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  disabledTimeSlots={disabledTimeSlots(selectedDate)} 
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Guest Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!date || !selectedTime || !name || !email || !phone}
              >
                Complete Reservation
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

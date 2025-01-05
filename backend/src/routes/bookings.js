const { Router } = require('express');
const Booking = require('../models/bookings');

const router = Router();



router.post('/', async (req, res) => {
  try {
    const booking = req.body;
    
    if (!booking.date || !booking.time || !booking.guests || !booking.name || !booking.email || !booking.phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const isDoubleBooked = await Booking.findOne({
      date: booking.date,
      time: booking.time,
    });

    if (isDoubleBooked) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const newBooking = new Booking({
      ...booking,
      date: new Date(booking.date),
    });

    await newBooking.save();

    res.status(201).json(newBooking);

  } 
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/date', async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  try {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    res.json(bookings);
  } 
  catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } 
  catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

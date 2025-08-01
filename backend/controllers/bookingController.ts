import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { generateTimeSlots } from '../utils/timeUtils';
import { z } from 'zod';

const bookingService = new BookingService();

const bookingSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  callType: z.enum(['onboarding', 'follow-up']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:mm format')
});

export const getBookingsForDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const bookings = await bookingService.getBookingsForDate(date);
    const timeSlots = generateTimeSlots(date, bookings);
    
    res.json({ bookings, timeSlots });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const validatedData = bookingSchema.parse(req.body);
    const booking = await bookingService.createBooking(validatedData);
    res.status(201).json(booking);
  } catch (error: any) {
    console.error('Error creating booking:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    res.status(400).json({ error: error.message || 'Failed to create booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await bookingService.deleteBooking(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
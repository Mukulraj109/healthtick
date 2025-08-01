import { db } from '../firebase';
import { Booking, BookingRequest, Client } from '../types';
import {  checkOverlap, getCallDuration } from '../utils/timeUtils';
import dayjs from 'dayjs';

export class BookingService {
  private collection = db.collection('bookings');

  async getBookingsForDate(date: string): Promise<Booking[]> {
    
    const directBookings = await this.collection
      .where('date', '==', date)
      .get();

    const directResults = directBookings.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Booking));

    const recurringBookings = await this.collection
      .where('recurring', '==', true)
      .get();

    const recurringResults = recurringBookings.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Booking))
      .filter(booking => {
        const bookingDate = dayjs(booking.date);
        const targetDate = dayjs(date);
        
        
        return targetDate.isAfter(bookingDate, 'day') && 
               targetDate.day() === bookingDate.day();
      })
      .map(booking => ({
        ...booking,
        date,
        id: `${booking.id}-${date}` 
      }));

    return [...directResults, ...recurringResults];
  }

  async createBooking(request: BookingRequest): Promise<Booking> {
    const client = await this.getClientById(request.clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const duration = getCallDuration(request.callType);
    const endTime = dayjs(`${request.date} ${request.startTime}`)
      .add(duration, 'minute')
      .format('HH:mm');

    const newBooking: Omit<Booking, 'id'> = {
      clientId: request.clientId,
      clientName: client.name,
      clientPhone: client.phone,
      callType: request.callType,
      date: request.date,
      startTime: request.startTime,
      endTime,
      duration,
      recurring: request.callType === 'follow-up',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.validateNoOverlap(newBooking);

    const docRef = await this.collection.add(newBooking);
    return {
      id: docRef.id,
      ...newBooking
    };
  }

  async deleteBooking(id: string): Promise<void> {
    
    if (id.includes('-')) {
      const [originalId] = id.split('-');
      await this.collection.doc(originalId).delete();
    } else {
      await this.collection.doc(id).delete();
    }
  }

  private async validateNoOverlap(booking: Omit<Booking, 'id'>): Promise<void> {
    const existingBookings = await this.getBookingsForDate(booking.date);
    
    for (const existing of existingBookings) {
      if (checkOverlap(booking, existing)) {
        throw new Error(
          `Booking conflicts with existing ${existing.callType} call for ${existing.clientName} at ${existing.startTime}`
        );
      }
    }
  }

  private async getClientById(clientId: string): Promise<Client | null> {
    const doc = await db.collection('clients').doc(clientId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } as Client : null;
  }
}
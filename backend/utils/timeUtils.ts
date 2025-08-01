import dayjs from 'dayjs';
import { Booking, TimeSlot } from '../types';

export const TIME_SLOTS = [
  '10:30', '10:50', '11:10', '11:30', '11:50',
  '12:10', '12:30', '12:50', '13:10', '13:30',
  '13:50', '14:10', '14:30', '14:50', '15:10',
  '15:30', '15:50', '16:10', '16:30', '16:50',
  '17:10', '17:30', '17:50', '18:10', '18:30',
  '18:50', '19:10', '19:30'
];

export function getCallDuration(callType: 'onboarding' | 'follow-up'): number {
  return callType === 'onboarding' ? 40 : 20;
}

export function generateTimeSlots(date: string, bookings: Booking[]): TimeSlot[] {
  return TIME_SLOTS.map(time => {
    const booking = bookings.find(b => b.startTime === time);
    return {
      time,
      available: !booking && !isTimeSlotBlocked(time, bookings),
      booking
    };
  });
}

export function isTimeSlotBlocked(timeSlot: string, bookings: Booking[]): boolean {
  const slotStart = dayjs(`2000-01-01 ${timeSlot}`);
  const slotEnd = slotStart.add(20, 'minute');

  return bookings.some(booking => {
    const bookingStart = dayjs(`2000-01-01 ${booking.startTime}`);
    const bookingEnd = dayjs(`2000-01-01 ${booking.endTime}`);

    // Check if slot overlaps with any part of the booking
    return slotStart.isBefore(bookingEnd) && slotEnd.isAfter(bookingStart);
  });
}

export function checkOverlap(booking1: Omit<Booking, 'id'>, booking2: Booking): boolean {
  if (booking1.date !== booking2.date) return false;

  const start1 = dayjs(`2000-01-01 ${booking1.startTime}`);
  const end1 = dayjs(`2000-01-01 ${booking1.endTime}`);
  const start2 = dayjs(`2000-01-01 ${booking2.startTime}`);
  const end2 = dayjs(`2000-01-01 ${booking2.endTime}`);

  return start1.isBefore(end2) && end1.isAfter(start2);
}

export function formatTimeSlot(time: string): string {
  return dayjs(`2000-01-01 ${time}`).format('h:mm A');
}
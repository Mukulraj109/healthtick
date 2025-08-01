export interface Client {
  id: string;
  name: string;
  phone: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  callType: 'onboarding' | 'follow-up';
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  recurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  booking?: Booking;
}

export interface BookingRequest {
  clientId: string;
  callType: 'onboarding' | 'follow-up';
  date: string;
  startTime: string;
}

export interface BookingsResponse {
  bookings: Booking[];
  timeSlots: TimeSlot[];
}
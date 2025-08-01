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
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  duration: number; // minutes
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
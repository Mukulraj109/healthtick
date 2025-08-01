import { db } from './firebase';
import dayjs from 'dayjs';
import { getCallDuration } from './utils/timeUtils';

interface Client {
  name: string;
  phone: string;
}

async function seedBooking(clientId: string): Promise<void> {
  const clientSnap = await db.collection('clients').doc(clientId).get();

  if (!clientSnap.exists) {
    console.error('❌ Client not found');
    return;
  }

  const client = clientSnap.data() as Client;

  const date = dayjs().format('YYYY-MM-DD');
  const startTime = '10:00';
  const duration = getCallDuration('onboarding');
  const endTime = dayjs(`${date} ${startTime}`).add(duration, 'minute').format('HH:mm');

  const booking = {
    clientId,
    clientName: client.name,
    clientPhone: client.phone,
    callType: 'onboarding',
    date,
    startTime,
    endTime,
    duration,
    recurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const docRef = await db.collection('bookings').add(booking);
  console.log('✅ Booking created with ID:', docRef.id);
}

seedBooking('6mj8HtWsVJEc9nq4b1Fd').catch(console.error);

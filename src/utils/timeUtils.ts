import dayjs from 'dayjs';

export function formatTimeSlot(time: string): string {
  return dayjs(`2000-01-01 ${time}`).format('h:mm A');
}

export function formatDate(date: string): string {
  return dayjs(date).format('dddd, MMMM D, YYYY');
}

export function getCallTypeColor(callType: 'onboarding' | 'follow-up'): string {
  return callType === 'onboarding' 
    ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' 
    : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
}

export function getCallTypeDuration(callType: 'onboarding' | 'follow-up'): number {
  return callType === 'onboarding' ? 40 : 20;
}
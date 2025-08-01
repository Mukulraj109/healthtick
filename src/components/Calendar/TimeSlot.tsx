
import { TimeSlot } from '../../types';
import { formatTimeSlot, getCallTypeColor } from '../../utils/timeUtils';
import { Clock, User, Phone, Trash2, Repeat, Plus, Calendar } from 'lucide-react';

interface TimeSlotProps {
  slot: TimeSlot;
  onTimeSlotClick: (time: string) => void;
  onDeleteClick: (bookingId: string, clientName: string) => void;
}

export default function TimeSlotComponent({ slot, onTimeSlotClick, onDeleteClick }: TimeSlotProps) {
  if (slot.available) {
    return (
      <button
        onClick={() => onTimeSlotClick(slot.time)}
        className="group relative p-6 bg-white/60 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 text-left shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-gray-500 group-hover:text-blue-600 transition-colors">
            <Clock className="h-5 w-5" />
            <span className="font-semibold text-lg">{formatTimeSlot(slot.time)}</span>
          </div>
          <div className="p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
            <Plus className="h-4 w-4 text-blue-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 group-hover:text-blue-600 font-medium transition-colors">
          Available • Click to book
        </p>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/5 group-hover:to-indigo-400/5 rounded-2xl transition-all duration-300"></div>
      </button>
    );
  }
const booking = slot.booking;
if (!booking) return null;
  const isRecurring = booking?.recurring ?? false;
  
  return (
    <div className="relative p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 whitespace-nowrap">{formatTimeSlot(slot.time)}</span>

          {isRecurring && (
            <div className="p-1 rounded-full bg-blue-100" title="Recurring booking" >
              <Repeat className="h-3 w-3 text-blue-600" />
            </div>
          )}
        </div>
        <button
          onClick={() => onDeleteClick(booking.id, booking.clientName)}
          className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          title="Delete booking"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-full bg-gray-100">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <span className="font-semibold text-gray-900">{booking.clientName}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-full bg-gray-100">
            <Phone className="h-4 w-4 text-gray-600" />
          </div>
          <span className="text-sm text-gray-700">{booking.clientPhone}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full ${getCallTypeColor(booking.callType)} shadow-sm`}>
            {booking.callType === 'onboarding' ? 'Onboarding' : 'Follow-up'}
          </span>
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {booking.duration} min
          </span>
        </div>
        
        {isRecurring && (
          <div className="flex items-center space-x-2 text-xs text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-xl border border-blue-200">
            <Calendar className="h-3 w-3" />
            <span className="font-medium">Weekly recurring</span>
          </div>
        )}
      </div>
      
      
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20 rounded-2xl pointer-events-none"></div>
    </div>
  );
}
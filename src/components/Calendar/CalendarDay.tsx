import { useState, useEffect } from 'react';
import { TimeSlot, BookingsResponse } from '../../types';
import {  formatDate } from '../../utils/timeUtils';
import { api } from '../../services/api';
import TimeSlotComponent from './TimeSlot';
import BookingModal from '../BookingModal/BookingModal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Calendar, ChevronLeft, ChevronRight,  Clock, Users } from 'lucide-react';
import dayjs from 'dayjs';

interface CalendarDayProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function CalendarDay({ selectedDate, onDateChange }: CalendarDayProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<{ id: string; clientName: string } | null>(null);

  useEffect(() => {
    loadBookings();
  }, [selectedDate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: BookingsResponse = await api.bookings.getForDate(selectedDate);
      setTimeSlots(response.timeSlots);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotClick = (time: string) => {
    setSelectedTimeSlot(time);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedTimeSlot(null);
    loadBookings();
  };

  const handleDeleteClick = (bookingId: string, clientName: string) => {
    setBookingToDelete({ id: bookingId, clientName });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;

    try {
      await api.bookings.delete(bookingToDelete.id);
      setShowDeleteModal(false);
      setBookingToDelete(null);
      loadBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to delete booking');
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = dayjs(selectedDate);
    const newDate =
      direction === 'prev' ? currentDate.subtract(1, 'day') : currentDate.add(1, 'day');
    onDateChange(newDate.format('YYYY-MM-DD'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  HealthTick Calendar
                </h1>
                <p className="text-gray-600 mt-1">Manage your coaching appointments</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white min-w-[120px] shadow-md">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">Today</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {timeSlots.filter((slot) => !slot.available).length}
                </p>
                <p className="text-blue-100 text-xs">Bookings</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white min-w-[120px] shadow-md">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">Available</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {timeSlots.filter((slot) => slot.available).length}
                </p>
                <p className="text-green-100 text-xs">Slots</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Picker & Navigation */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateDate('prev')}
              className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transition"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                {formatDate(selectedDate)}
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
              />
            </div>

            <button
              onClick={() => navigateDate('next')}
              className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transition"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-xl text-red-700 font-medium shadow">
            {error}
          </div>
        )}

        {/* Time Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {timeSlots.map((slot) => (
            <TimeSlotComponent
              key={slot.time}
              slot={slot}
              onTimeSlotClick={handleTimeSlotClick}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      {showBookingModal && selectedTimeSlot && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedTimeSlot(null);
          }}
          selectedDate={selectedDate}
          selectedTime={selectedTimeSlot}
          onSuccess={handleBookingSuccess}
        />
      )}

      {showDeleteModal && bookingToDelete && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setBookingToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Booking"
          message={`Are you sure you want to delete the booking for ${bookingToDelete.clientName}?`}
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  );
}

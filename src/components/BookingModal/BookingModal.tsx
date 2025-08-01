import React, { useState, useEffect } from 'react';
import { Client, BookingRequest } from '../../types';
import { api } from '../../services/api';
import { formatTimeSlot, getCallTypeDuration } from '../../utils/timeUtils';
import ClientSelect from './ClientSelect';
import { X, Calendar, Clock, User, PhoneCall, RefreshCcw } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  selectedTime: string;
  onSuccess: () => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onSuccess
}: BookingModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [callType, setCallType] = useState<'onboarding' | 'follow-up'>('onboarding');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) loadClients();
  }, [isOpen]);

  const loadClients = async () => {
    try {
      const clientsData = await api.clients.getAll();
      setClients(clientsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load clients');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient) {
      setError('Please select a client');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookingRequest: BookingRequest = {
        clientId: selectedClient.id,
        callType,
        date: selectedDate,
        startTime: selectedTime
      };

      await api.bookings.create(bookingRequest);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedClient(null);
    setCallType('onboarding');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-in slide-in-from-bottom-4 duration-300 scale-95 hover:scale-100 transition-transform scrollbar-hide">
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Book Appointment
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 sm:p-8">
          {/* Booking Date and Time */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-blue-900">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-blue-900">
                {formatTimeSlot(selectedTime)}
              </span>
            </div>
          </div>

          {/* Client Select */}
          <div className="mb-8">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <span>Select Client</span>
            </label>
            <ClientSelect
              clients={clients}
              selectedClient={selectedClient}
              onSelectClient={setSelectedClient}
            />
          </div>

          {/* Call Type */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Call Type
            </label>
            <div className="space-y-4">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <input
                  type="radio"
                  name="callType"
                  value="onboarding"
                  checked={callType === 'onboarding'}
                  onChange={() => setCallType('onboarding')}
                  className="mr-4 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div className="flex items-center space-x-3">
                  <PhoneCall className="text-blue-600 w-5 h-5" />
                  <div>
                    <span className="font-semibold text-gray-900 group-hover:text-blue-700">Onboarding Call</span>
                    <p className="text-sm text-gray-600 mt-1">40 minutes • One-time session</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <input
                  type="radio"
                  name="callType"
                  value="follow-up"
                  checked={callType === 'follow-up'}
                  onChange={() => setCallType('follow-up')}
                  className="mr-4 text-green-600 focus:ring-green-500 w-4 h-4"
                />
                <div className="flex items-center space-x-3">
                  <RefreshCcw className="text-green-600 w-5 h-5" />
                  <div>
                    <span className="font-semibold text-gray-900 group-hover:text-green-700">Follow-up Call</span>
                    <p className="text-sm text-gray-600 mt-1">20 minutes • Weekly recurring</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-700">
              <strong className="text-gray-900">Duration:</strong> {getCallTypeDuration(callType)} minutes
              {callType === 'follow-up' && (
                <span className="block mt-2 text-green-600 font-medium">
                  This will create a weekly recurring appointment
                </span>
              )}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-xl flex items-center space-x-2">
              <X className="h-5 w-5 text-red-600" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedClient}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        <Loader2 className="h-6 w-6 text-blue-600 absolute top-3 left-3 animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">Loading calendar...</p>
        <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your appointments</p>
      </div>
    </div>
  );
}
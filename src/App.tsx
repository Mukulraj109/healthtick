import React, { useState } from 'react';
import CalendarDay from './components/Calendar/CalendarDay';
import dayjs from 'dayjs';

function App() {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  return (
    <div className="min-h-screen bg-gray-50">
      <CalendarDay selectedDate={selectedDate} onDateChange={setSelectedDate} />
    </div>
  );
}

export default App;
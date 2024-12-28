import React, { useState } from 'react';
import { format, addDays, subDays, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DiaryCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DiaryCalendar: React.FC<DiaryCalendarProps> = ({ 
  selectedDate, 
  onDateChange 
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePreviousDay = () => {
    const previousDay = subDays(selectedDate, 1);
    onDateChange(startOfDay(previousDay));
  };

  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    onDateChange(startOfDay(nextDay));
  };

  const handleDateSelect = (date: Date) => {
    onDateChange(startOfDay(date));
    setIsCalendarOpen(false);
  };

  return (
    <div className="relative flex items-center space-x-4">
      <button 
        onClick={handlePreviousDay}
        className="text-gray-600 hover:text-gray-800"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="flex items-center text-lg font-semibold text-gray-800 hover:text-gray-600"
        >
          <CalendarIcon size={20} className="mr-2" />
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </button>
      </div>

      <button 
        onClick={handleNextDay}
        className="text-gray-600 hover:text-gray-800"
      >
        <ChevronRight size={24} />
      </button>

      {isCalendarOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-4 z-10">
          {/* Basic calendar grid - can be enhanced with more advanced calendar library */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {Array.from({ length: 31 }, (_, i) => {
              const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
              return (
                <button
                  key={i}
                  onClick={() => handleDateSelect(date)}
                  className={`
                    p-2 rounded-md 
                    ${date.toDateString() === selectedDate.toDateString() 
                      ? 'bg-green-500 text-white' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryCalendar; 
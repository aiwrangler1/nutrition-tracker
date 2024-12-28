import React from 'react';
import { Calendar } from 'lucide-react';

const Diary: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Food Diary</h1>
          <div className="flex items-center text-gray-600">
            <Calendar size={20} className="mr-2" />
            <span>March 2024</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Calendar Header */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {Array.from({ length: 35 }, (_, i) => (
            <button
              key={i}
              className={`aspect-square p-2 rounded-lg hover:bg-green-50 
                ${i + 1 <= 31 ? 'text-gray-700' : 'text-gray-300'} 
                ${i + 1 === 15 ? 'bg-green-100 font-semibold' : ''}`}
            >
              {i + 1 <= 31 ? i + 1 : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">March 15, 2024</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">Total Calories</h3>
              <p className="text-gray-600">1,850 / 2,000</p>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
            </div>
          </div>
          
          {/* Macronutrient Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium">Protein</h4>
              <p className="text-gray-600">120g / 150g</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium">Carbs</h4>
              <p className="text-gray-600">200g / 250g</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium">Fat</h4>
              <p className="text-gray-600">55g / 70g</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diary;
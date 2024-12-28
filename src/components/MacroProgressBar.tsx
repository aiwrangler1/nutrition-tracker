import React from 'react';
import { UserSettings } from '../types';

interface MacroProgressBarProps {
  userSettings: UserSettings;
  currentMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const MacroProgressBar: React.FC<MacroProgressBarProps> = ({ 
  userSettings, 
  currentMacros 
}) => {
  const calculatePercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <span className="mr-2">Calories:</span>
        <div className="flex-grow bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full progress-bar" 
            style={{ 
              width: `${calculatePercentage(currentMacros.calories, userSettings.dailyCalorieGoal)}%` 
            }}
          />
        </div>
        <span className="ml-2">
          {currentMacros.calories} / {userSettings.dailyCalorieGoal}
        </span>
      </div>

      <div className="flex items-center">
        <span className="mr-2">Protein:</span>
        <div className="flex-grow bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-600 h-2.5 rounded-full progress-bar" 
            style={{ 
              width: `${calculatePercentage(currentMacros.protein, userSettings.proteinTarget)}%` 
            }}
          />
        </div>
        <span className="ml-2">
          {currentMacros.protein} / {userSettings.proteinTarget}g
        </span>
      </div>

      <div className="flex items-center">
        <span className="mr-2">Carbs:</span>
        <div className="flex-grow bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-yellow-600 h-2.5 rounded-full progress-bar" 
            style={{ 
              width: `${calculatePercentage(currentMacros.carbs, userSettings.carbsTarget)}%` 
            }}
          />
        </div>
        <span className="ml-2">
          {currentMacros.carbs} / {userSettings.carbsTarget}g
        </span>
      </div>

      <div className="flex items-center">
        <span className="mr-2">Fat:</span>
        <div className="flex-grow bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-red-600 h-2.5 rounded-full progress-bar" 
            style={{ 
              width: `${calculatePercentage(currentMacros.fat, userSettings.fatTarget)}%` 
            }}
          />
        </div>
        <span className="ml-2">
          {currentMacros.fat} / {userSettings.fatTarget}g
        </span>
      </div>
    </div>
  );
};

export default MacroProgressBar; 
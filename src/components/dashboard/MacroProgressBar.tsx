import React from 'react';
import { UserSettings } from '../../types';

interface MacroProgressBarProps {
  userSettings: UserSettings;
  currentMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const calculatePercentage = (current: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min((current / target) * 100, 100);
};

const MacroProgressBar: React.FC<MacroProgressBarProps> = ({ userSettings, currentMacros }) => {
  return (
    <div className="space-y-4">
      {/* Calories Progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Calories</span>
          <span>{currentMacros.calories} / {userSettings.daily_calorie_goal}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{
              width: `${calculatePercentage(currentMacros.calories, userSettings.daily_calorie_goal)}%`
            }}
          ></div>
        </div>
      </div>

      {/* Protein Progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Protein</span>
          <span>{currentMacros.protein} / {userSettings.protein_target}g</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              width: `${calculatePercentage(currentMacros.protein, userSettings.protein_target)}%`
            }}
          ></div>
        </div>
      </div>

      {/* Carbs Progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Carbs</span>
          <span>{currentMacros.carbs} / {userSettings.carbs_target}g</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-yellow-500 rounded-full"
            style={{
              width: `${calculatePercentage(currentMacros.carbs, userSettings.carbs_target)}%`
            }}
          ></div>
        </div>
      </div>

      {/* Fat Progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Fat</span>
          <span>{currentMacros.fat} / {userSettings.fat_target}g</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-red-500 rounded-full"
            style={{
              width: `${calculatePercentage(currentMacros.fat, userSettings.fat_target)}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MacroProgressBar; 
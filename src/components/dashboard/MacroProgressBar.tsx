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
  const calculatePercentage = (current: number, target: number) => 
    Math.min((current / target) * 100, 100);

  return (
    <div className="macro-progress-container">
      <div className="macro-progress">
        <div 
          className="progress-bar calories" 
          style={{ width: `${calculatePercentage(currentMacros.calories, userSettings.dailyCalorieGoal)}%` }}
        >
          Calories: {currentMacros.calories} / {userSettings.dailyCalorieGoal}
        </div>
        <div 
          className="progress-bar protein" 
          style={{ width: `${calculatePercentage(currentMacros.protein, userSettings.proteinTarget)}%` }}
        >
          Protein: {currentMacros.protein} / {userSettings.proteinTarget}g
        </div>
        <div 
          className="progress-bar carbs" 
          style={{ width: `${calculatePercentage(currentMacros.carbs, userSettings.carbsTarget)}%` }}
        >
          Carbs: {currentMacros.carbs} / {userSettings.carbsTarget}g
        </div>
        <div 
          className="progress-bar fat" 
          style={{ width: `${calculatePercentage(currentMacros.fat, userSettings.fatTarget)}%` }}
        >
          Fat: {currentMacros.fat} / {userSettings.fatTarget}g
        </div>
      </div>
    </div>
  );
};

export default MacroProgressBar; 
import React from 'react';
import { UserSettings } from '../../types';
import MacroProgressBar from './MacroProgressBar';

interface NutritionSummaryProps {
  settings: UserSettings;
  currentMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ settings, currentMacros }) => {
  const macroData = [
    {
      label: 'Calories',
      current: currentMacros.calories,
      target: settings.daily_calorie_goal,
      unit: 'kcal'
    },
    {
      label: 'Protein',
      current: currentMacros.protein,
      target: settings.protein_target,
      unit: 'g'
    },
    {
      label: 'Carbs',
      current: currentMacros.carbs,
      target: settings.carbs_target,
      unit: 'g'
    },
    {
      label: 'Fat',
      current: currentMacros.fat,
      target: settings.fat_target,
      unit: 'g'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Progress</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="order-2 lg:order-1">
          <MacroProgressBar userSettings={settings} currentMacros={currentMacros} />
        </div>
        <div className="order-1 lg:order-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4">
            {macroData.map((macro) => (
              <div 
                key={macro.label} 
                className="bg-gray-50 rounded-lg p-3 sm:p-4"
              >
                <h3 className="text-sm font-medium text-gray-600 mb-1">{macro.label}</h3>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-1">
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {macro.current}
                  </p>
                  <p className="text-sm text-gray-600">
                    / {macro.target} {macro.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;
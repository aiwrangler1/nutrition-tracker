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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <MacroProgressBar userSettings={settings} currentMacros={currentMacros} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {macroData.map((macro) => (
            <div key={macro.label} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600">{macro.label}</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {macro.current} / {macro.target} {macro.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;
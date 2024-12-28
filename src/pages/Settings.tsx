import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import MacroProgressBar from '../components/dashboard/MacroProgressBar';
import NutritionSummary from '../components/dashboard/NutritionSummary';
import { exportMealsToCsv } from '../utils/dataExport';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();

  if (!settings) return <div>Loading settings...</div>;

  const handleExport = () => {
    // TODO: Implement export functionality
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Nutrition Goals</h2>
        
        {/* Daily Calorie Goal */}
        <div className="space-y-4">
          <div>
            <label htmlFor="daily_calorie_goal" className="block text-sm font-medium text-gray-700">
              Daily Calorie Goal
            </label>
            <input
              type="number"
              id="daily_calorie_goal"
              name="daily_calorie_goal"
              min="0"
              value={settings.daily_calorie_goal}
              onChange={(e) => updateSettings({ daily_calorie_goal: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Protein Target */}
          <div>
            <label htmlFor="protein_target" className="block text-sm font-medium text-gray-700">
              Protein Target (g)
            </label>
            <input
              type="number"
              id="protein_target"
              name="protein_target"
              min="0"
              value={settings.protein_target}
              onChange={(e) => updateSettings({ protein_target: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Carbs Target */}
          <div>
            <label htmlFor="carbs_target" className="block text-sm font-medium text-gray-700">
              Carbs Target (g)
            </label>
            <input
              type="number"
              id="carbs_target"
              name="carbs_target"
              min="0"
              value={settings.carbs_target}
              onChange={(e) => updateSettings({ carbs_target: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Fat Target */}
          <div>
            <label htmlFor="fat_target" className="block text-sm font-medium text-gray-700">
              Fat Target (g)
            </label>
            <input
              type="number"
              id="fat_target"
              name="fat_target"
              min="0"
              value={settings.fat_target}
              onChange={(e) => updateSettings({ fat_target: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>
        <NutritionSummary
          settings={settings}
          currentMacros={{
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          }}
        />
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Export</h2>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Export Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
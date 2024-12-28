import React, { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import MacronutrientChart from '../components/charts/MacronutrientChart';
import CalorieProgressChart from '../components/charts/CalorieProgressChart';
import WeightTrackingChart from '../components/charts/WeightTrackingChart';
import { DataExporter } from '../utils/dataExport';
import { useMeals } from '../hooks/useMeals';
import { MealEntry } from '../types';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [weightEntries, setWeightEntries] = useState([
    { date: '2024-01-01', weight: 70 },
    { date: '2024-02-01', weight: 69.5 },
    { date: '2024-03-01', weight: 69 }
  ]);
  const [newWeight, setNewWeight] = useState('');

  const { meals } = useMeals(new Date());

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    setWeightEntries([
      ...weightEntries, 
      { date: today, weight: parseFloat(newWeight) }
    ]);
    setNewWeight('');
  };

  const handleExportMealEntries = () => {
    const csvContent = DataExporter.exportMealEntries(meals as MealEntry[]);
    DataExporter.downloadFile(
      csvContent, 
      `meal_entries_${new Date().toISOString().split('T')[0]}.csv`, 
      'text/csv'
    );
  };

  const handleExportSettings = () => {
    if (settings) {
      const csvContent = DataExporter.exportUserSettings(settings);
      DataExporter.downloadFile(
        csvContent, 
        `user_settings_${new Date().toISOString().split('T')[0]}.csv`, 
        'text/csv'
      );
    }
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          // Update settings logic
        }} className="space-y-4">
          <div>
            <label htmlFor="dailyCalorieGoal" className="block text-sm font-medium text-gray-700">
              Daily Calorie Goal
            </label>
            <input
              type="number"
              id="dailyCalorieGoal"
              value={settings.dailyCalorieGoal}
              onChange={(e) => updateSettings({ dailyCalorieGoal: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="proteinTarget" className="block text-sm font-medium text-gray-700">
              Protein Target (g)
            </label>
            <input
              type="number"
              id="proteinTarget"
              value={settings.proteinTarget}
              onChange={(e) => updateSettings({ proteinTarget: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="carbsTarget" className="block text-sm font-medium text-gray-700">
              Carbs Target (g)
            </label>
            <input
              type="number"
              id="carbsTarget"
              value={settings.carbsTarget}
              onChange={(e) => updateSettings({ carbsTarget: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="fatTarget" className="block text-sm font-medium text-gray-700">
              Fat Target (g)
            </label>
            <input
              type="number"
              id="fatTarget"
              value={settings.fatTarget}
              onChange={(e) => updateSettings({ fatTarget: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Save Settings
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Data Visualization</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Macronutrient Breakdown</h3>
            <MacronutrientChart 
              protein={settings.proteinTarget} 
              carbs={settings.carbsTarget} 
              fat={settings.fatTarget} 
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Calorie Progress</h3>
            <CalorieProgressChart 
              dailyGoal={settings.dailyCalorieGoal} 
              consumedCalories={1500}  // This would come from actual data
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Weight Tracking</h2>
        
        <form onSubmit={handleWeightSubmit} className="mb-6 flex space-x-4">
          <input
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Enter weight (kg)"
            className="flex-grow rounded-md border-gray-300"
          />
          <button 
            type="submit" 
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Weight
          </button>
        </form>

        <WeightTrackingChart weightData={weightEntries} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Data Export</h2>
        <div className="space-y-4">
          <button 
            onClick={handleExportMealEntries}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Export Meal Entries
          </button>
          <button 
            onClick={handleExportSettings}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Export User Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
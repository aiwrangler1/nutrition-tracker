import React, { useState } from 'react';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    dailyCalorieGoal: 2000,
    proteinTarget: 150,
    carbsTarget: 250,
    fatTarget: 70,
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save settings to Supabase
    console.log('Saving settings:', settings);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Daily Goals Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Daily Goals</h2>
            
            <div>
              <label htmlFor="dailyCalorieGoal" className="block text-sm font-medium text-gray-700">
                Daily Calorie Goal
              </label>
              <input
                type="number"
                id="dailyCalorieGoal"
                name="dailyCalorieGoal"
                value={settings.dailyCalorieGoal}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                min="0"
              />
            </div>
          </div>

          {/* Macronutrient Targets */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Macronutrient Targets (grams)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="proteinTarget" className="block text-sm font-medium text-gray-700">
                  Protein
                </label>
                <input
                  type="number"
                  id="proteinTarget"
                  name="proteinTarget"
                  value={settings.proteinTarget}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="carbsTarget" className="block text-sm font-medium text-gray-700">
                  Carbs
                </label>
                <input
                  type="number"
                  id="carbsTarget"
                  name="carbsTarget"
                  value={settings.carbsTarget}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="fatTarget" className="block text-sm font-medium text-gray-700">
                  Fat
                </label>
                <input
                  type="number"
                  id="fatTarget"
                  name="fatTarget"
                  value={settings.fatTarget}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Additional Notes</h2>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Dietary Preferences/Restrictions
              </label>
              <textarea
                id="notes"
                name="notes"
                value={settings.notes}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Enter any dietary preferences or restrictions..."
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Save size={20} className="mr-2" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
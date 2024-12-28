import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Food, MealEntry } from '../../types';
import { format } from 'date-fns';

interface MealEntryFormProps {
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  onEntryAdded?: (entry: MealEntry) => void;
  onClose: () => void;
}

const MealEntryForm: React.FC<MealEntryFormProps> = ({ 
  date, 
  mealType, 
  onEntryAdded, 
  onClose 
}) => {
  const [foods, setFoods] = useState<Omit<Food, 'id'>[]>([
    {
      name: '',
      serving_size: 100,
      serving_unit: 'g',
      number_of_servings: 1,
      fat: 0,
      protein: 0,
      carbs: 0,
      calories: 0
    }
  ]);

  const handleFoodChange = (index: number, updates: Partial<Omit<Food, 'id'>>) => {
    const updatedFoods = [...foods];
    updatedFoods[index] = { ...updatedFoods[index], ...updates };
    
    // Auto-calculate calories
    if ('fat' in updates || 'protein' in updates || 'carbs' in updates) {
      updatedFoods[index].calories = 
        (updatedFoods[index].fat * 9) + 
        (updatedFoods[index].protein * 4) + 
        (updatedFoods[index].carbs * 4);
    }

    setFoods(updatedFoods);
  };

  const addFoodRow = () => {
    setFoods([...foods, {
      name: '',
      serving_size: 100,
      serving_unit: 'g',
      number_of_servings: 1,
      fat: 0,
      protein: 0,
      carbs: 0,
      calories: 0
    }]);
  };

  const removeFoodRow = (index: number) => {
    const updatedFoods = foods.filter((_, i) => i !== index);
    setFoods(updatedFoods);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create meal entry
      const { data: mealEntryData, error: mealEntryError } = await supabase
        .from('meal_entries')
        .insert({
          type: mealType,
          date: format(date, 'yyyy-MM-dd')
        })
        .select()
        .single();

      if (mealEntryError) throw mealEntryError;

      // Add foods to the meal entry
      const foodInserts = foods.map(food => ({
        ...food,
        meal_entry_id: mealEntryData.id
      }));

      const { error: foodError } = await supabase
        .from('foods')
        .insert(foodInserts);

      if (foodError) throw foodError;

      // Notify parent component
      if (onEntryAdded && mealEntryData) {
        onEntryAdded({
          ...mealEntryData,
          foods: foodInserts as Food[]
        });
      }

      onClose();
    } catch (error) {
      console.error('Error adding meal entry:', error);
      // TODO: Add user-friendly error handling
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-xl font-semibold mb-4">
          Add {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Meal - {format(date, 'MMMM d, yyyy')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {foods.map((food, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 items-center">
              <input
                type="text"
                placeholder="Food Name"
                value={food.name}
                onChange={(e) => handleFoodChange(index, { name: e.target.value })}
                className="col-span-2 rounded-md border-gray-300"
                required
              />
              <input
                type="number"
                placeholder="Serving Size"
                value={food.serving_size}
                onChange={(e) => handleFoodChange(index, { serving_size: Number(e.target.value) })}
                className="rounded-md border-gray-300"
                required
              />
              <select
                value={food.serving_unit}
                onChange={(e) => handleFoodChange(index, { serving_unit: e.target.value })}
                className="rounded-md border-gray-300"
              >
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="oz">oz</option>
              </select>
              <input
                type="number"
                placeholder="Servings"
                value={food.number_of_servings}
                onChange={(e) => handleFoodChange(index, { number_of_servings: Number(e.target.value) })}
                className="rounded-md border-gray-300"
                required
              />
              <button 
                type="button" 
                onClick={() => removeFoodRow(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <button 
              type="button" 
              onClick={addFoodRow}
              className="text-green-600 hover:text-green-800"
            >
              + Add Another Food
            </button>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealEntryForm; 
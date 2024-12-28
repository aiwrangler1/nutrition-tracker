import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Food } from '../../types';
import { calculateCalories } from '../../utils/calculations';
import { useAuth } from '../../contexts/AuthContext';

interface AddFoodModalProps {
  mealType: string;
  onClose: () => void;
  onFoodAdded: () => void;
}

type NewFood = {
  name: string;
  serving_size: number;
  serving_unit: string;
  number_of_servings: number;
  fat: number;
  protein: number;
  carbs: number;
  calories: number;
};

const AddFoodModal: React.FC<AddFoodModalProps> = ({ mealType, onClose, onFoodAdded }) => {
  const { user } = useAuth();
  const [food, setFood] = useState<NewFood>({
    name: '',
    serving_size: 100,
    serving_unit: 'g',
    number_of_servings: 1,
    fat: 0,
    protein: 0,
    carbs: 0,
    calories: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numberFields = ['serving_size', 'number_of_servings', 'fat', 'protein', 'carbs'];
    
    setFood(prev => {
      const newFood = {
        ...prev,
        [name]: numberFields.includes(name) ? Number(value) : value,
      };
      
      // Auto-calculate calories when macros change
      if (['fat', 'protein', 'carbs'].includes(name)) {
        newFood.calories = calculateCalories(newFood.fat, newFood.protein, newFood.carbs);
      }
      
      return newFood;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      // First create the meal entry
      const { data: mealEntry, error: mealError } = await supabase
        .from('meal_entries')
        .insert([{ 
          type: mealType.toLowerCase(),
          user_id: user.id,
          date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (mealError) throw mealError;

      // Then add the food to the meal entry
      const { error: foodError } = await supabase
        .from('foods')
        .insert([{ ...food, meal_entry_id: mealEntry.id }]);

      if (foodError) throw foodError;

      onFoodAdded();
      onClose();
    } catch (error) {
      console.error('Error adding food:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Food to {mealType}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Food Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={food.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="serving_size" className="block text-sm font-medium text-gray-700">
                Serving Size
              </label>
              <input
                type="number"
                id="serving_size"
                name="serving_size"
                required
                min="0"
                value={food.serving_size}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="serving_unit" className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <select
                id="serving_unit"
                name="serving_unit"
                value={food.serving_unit}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="g">grams</option>
                <option value="ml">milliliters</option>
                <option value="oz">ounces</option>
                <option value="cup">cups</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="number_of_servings" className="block text-sm font-medium text-gray-700">
              Number of Servings
            </label>
            <input
              type="number"
              id="number_of_servings"
              name="number_of_servings"
              required
              min="0"
              step="0.1"
              value={food.number_of_servings}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="protein" className="block text-sm font-medium text-gray-700">
                Protein (g)
              </label>
              <input
                type="number"
                id="protein"
                name="protein"
                required
                min="0"
                value={food.protein}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">
                Carbs (g)
              </label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                required
                min="0"
                value={food.carbs}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="fat" className="block text-sm font-medium text-gray-700">
                Fat (g)
              </label>
              <input
                type="number"
                id="fat"
                name="fat"
                required
                min="0"
                value={food.fat}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Calories (calculated)
            </label>
            <input
              type="number"
              value={food.calories}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Add Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFoodModal;
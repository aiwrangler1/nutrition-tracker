import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Food } from '../../types';
import { calculateCalories } from '../../utils/calculations';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, isSubmitting]);

  // Trap focus within modal
  useEffect(() => {
    const modal = document.getElementById('add-food-modal');
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    firstFocusable.focus();

    return () => modal.removeEventListener('keydown', handleTab);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numberFields = ['serving_size', 'number_of_servings', 'fat', 'protein', 'carbs'];
    
    setFood(prev => {
      const newFood = {
        ...prev,
        [name]: numberFields.includes(name) ? Number(value) : value,
      };
      
      if (['fat', 'protein', 'carbs'].includes(name)) {
        newFood.calories = calculateCalories(newFood.fat, newFood.protein, newFood.carbs);
      }
      
      return newFood;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!food.name.trim()) {
      setError('Food name is required');
      return false;
    }
    if (food.serving_size <= 0) {
      setError('Serving size must be greater than 0');
      return false;
    }
    if (food.number_of_servings <= 0) {
      setError('Number of servings must be greater than 0');
      return false;
    }
    if (food.protein < 0 || food.carbs < 0 || food.fat < 0) {
      setError('Macronutrient values cannot be negative');
      return false;
    }
    return true;
  }, [food]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      setError('Please sign in to add food items');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
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

      const { error: foodError } = await supabase
        .from('foods')
        .insert([{ 
          ...food, 
          meal_entry_id: mealEntry.id
        }]);

      if (foodError) throw foodError;

      toast.success('Food added successfully');
      onFoodAdded();
      onClose();
    } catch (error) {
      console.error('Error adding food:', error);
      toast.error('Failed to save food item');
      setError('Failed to save food item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-required-title"
      >
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h2 id="auth-required-title" className="text-center text-red-600">
            Please sign in to add food items
          </h2>
          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-food-title"
      id="add-food-modal"
      data-testid="add-food-modal"
    >
      <div className="bg-white rounded-lg w-full max-w-lg mx-auto my-8">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 id="add-food-title" className="text-xl font-semibold">
              Add Food to {mealType}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
              aria-label="Close modal"
              data-testid="close-modal"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div 
              className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded"
              role="alert"
              data-testid="error-message"
            >
              {error}
            </div>
          )}

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
                disabled={isSubmitting}
                data-testid="food-name-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  disabled={isSubmitting}
                  data-testid="serving-size-input"
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
                  disabled={isSubmitting}
                  data-testid="serving-unit-select"
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
                disabled={isSubmitting}
                data-testid="servings-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  disabled={isSubmitting}
                  data-testid="protein-input"
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
                  disabled={isSubmitting}
                  data-testid="carbs-input"
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
                  disabled={isSubmitting}
                  data-testid="fat-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
                Calories (calculated)
              </label>
              <input
                type="number"
                id="calories"
                value={food.calories}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                aria-label="Calculated calories"
                data-testid="calories-input"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                disabled={isSubmitting}
                data-testid="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="add-food-submit"
              >
                {isSubmitting ? 'Adding...' : 'Add Food'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFoodModal;
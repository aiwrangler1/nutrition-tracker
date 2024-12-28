import React from 'react';
import { Trash2 } from 'lucide-react';
import { Food } from '../../types';
import { supabase } from '../../lib/supabase';

interface FoodListProps {
  foods: Food[];
  onFoodDeleted: () => void;
}

export default function FoodList({ foods, onFoodDeleted }: FoodListProps) {
  const handleDelete = async (foodId: string) => {
    try {
      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('id', foodId);

      if (error) throw error;
      onFoodDeleted();
    } catch (err) {
      console.error('Error deleting food:', err);
    }
  };

  if (foods.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No foods added yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {foods.map((food) => (
        <div
          key={food.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <h4 className="font-medium text-gray-900">{food.name}</h4>
            <p className="text-sm text-gray-600">
              {food.number_of_servings} × {food.serving_size}{food.serving_unit} 
              • {food.calories} kcal
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
            </p>
            <button
              onClick={() => handleDelete(food.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
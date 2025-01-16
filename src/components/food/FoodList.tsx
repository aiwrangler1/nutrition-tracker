import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Food } from '../../types';
import { supabase } from '../../lib/supabase';
import { FoodItemSkeleton } from '../ui/Skeleton';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface FoodListProps {
  foods: Food[];
  onFoodDeleted: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function FoodList({ foods, onFoodDeleted, isLoading = false, className }: FoodListProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = async (foodId: string) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) {
      return;
    }

    setDeletingIds(prev => new Set([...prev, foodId]));
    
    try {
      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('id', foodId);

      if (error) throw error;
      
      onFoodDeleted();
      toast.success('Food item deleted successfully');
    } catch (err) {
      console.error('Error deleting food:', err);
      toast.error('Failed to delete food item');
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(foodId);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2" data-testid="food-list-loading">
        {Array.from({ length: 3 }).map((_, i) => (
          <FoodItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8" data-testid="food-list-empty">
        No foods added yet
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)} data-testid="food-list">
      {foods.map((food) => {
        const isDeleting = deletingIds.has(food.id);
        
        return (
          <div
            key={food.id}
            data-testid="food-item"
            className={cn(
              "flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0",
              isDeleting && "opacity-50"
            )}
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{food.name}</h4>
              <p className="text-sm text-gray-600">
                {food.number_of_servings} × {food.serving_size}{food.serving_unit} 
                • {food.calories} kcal
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <p className="text-sm text-gray-600 whitespace-nowrap" data-testid="food-macros">
                <span className="inline-block sm:hidden md:inline-block">Macros: </span>
                P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
              </p>
              <button
                onClick={() => handleDelete(food.id)}
                className="text-red-500 hover:text-red-700 sm:ml-2 disabled:opacity-50"
                disabled={isDeleting}
                data-testid="delete-food-button"
                aria-label="Delete food"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
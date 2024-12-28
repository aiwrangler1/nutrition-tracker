import { useMemo } from 'react';
import { Food } from '../types';

interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function useDailyNutrition(foods: Food[]): NutritionTotals {
  return useMemo(() => {
    return foods.reduce(
      (totals, food) => ({
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        carbs: totals.carbs + food.carbs,
        fat: totals.fat + food.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [foods]);
}
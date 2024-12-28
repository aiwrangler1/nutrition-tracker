import { Food, MealEntry } from '../types';

export function exportMealsToCsv(meals: MealEntry[]): string {
  const headers = [
    'Date',
    'Meal Type',
    'Food Name',
    'Servings',
    'Calories',
    'Protein (g)',
    'Carbs (g)',
    'Fat (g)'
  ].join(',');

  const rows = meals.flatMap(meal => 
    meal.foods.map(food => ({
      date: meal.date,
      type: meal.type,
      name: food.name,
      servings: `${food.number_of_servings} ${food.serving_unit}`,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat
    }))
  );

  const csvRows = rows.map(row => 
    [
      row.date,
      row.type,
      row.name,
      row.servings,
      row.calories,
      row.protein,
      row.carbs,
      row.fat
    ].join(',')
  );

  return [headers, ...csvRows].join('\n');
} 
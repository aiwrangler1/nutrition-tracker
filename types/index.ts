export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface UserGoals {
  id: string;
  user_id: string;
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_carb_goal: number;
  daily_fat_goal: number;
  updated_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  date: string;
  meal_type: MealType;
  entries: MealEntry[];
}

export interface MealEntry {
  id: string;
  meal_id: string;
  food_name: string;
  serving_size: string;
  servings: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  created_at: string;
}

export interface NutritionSummary {
  calories: {
    current: number;
    goal: number;
  };
  macros: {
    protein: { current: number; goal: number };
    carbs: { current: number; goal: number };
    fat: { current: number; goal: number };
  };
}

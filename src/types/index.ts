export interface Food {
  id: string;
  name: string;
  serving_size: number;
  serving_unit: string;
  number_of_servings: number;
  fat: number;
  protein: number;
  carbs: number;
  calories: number;
  meal_entry_id?: string;
}

export interface MealEntry {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  foods: Food[];
  date: string;
  user_id: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  daily_calorie_goal: number;
  protein_target: number;
  carbs_target: number;
  fat_target: number;
  notes?: string;
}
export interface Food {
  id: string;
  name: string;
  servingSize: number;
  servingUnit: string;
  numberOfServings: number;
  fat: number;
  protein: number;
  carbs: number;
  calories: number;
}

export interface MealEntry {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  foods: Food[];
  date: string;
  userId: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  dailyCalorieGoal: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  notes?: string;
}
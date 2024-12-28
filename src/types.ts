export interface UserSettings {
  dailyCalorieGoal: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  numberOfServings: number;
  servingUnit: string;
}

export interface MealEntry {
  id: string;
  userId: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  date: string;
  foods: Food[];
} 
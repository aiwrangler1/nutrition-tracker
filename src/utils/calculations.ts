export const calculateCalories = (fat: number, protein: number, carbs: number): number => {
  return fat * 9 + protein * 4 + carbs * 4;
};

export const calculateProgress = (consumed: number, goal: number): number => {
  if (goal <= 0) return 0;
  return Math.min((consumed / goal) * 100, 100);
};
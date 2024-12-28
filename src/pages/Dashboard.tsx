import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import MealSection from '../components/food/MealSection';
import NutritionSummary from '../components/dashboard/NutritionSummary';
import { useMeals } from '../hooks/useMeals';
import { useDailyNutrition } from '../hooks/useDailyNutrition';

export default function Dashboard() {
  const today = useMemo(() => new Date(), []);
  const { meals, loading } = useMeals(today);

  const allFoods = useMemo(() => 
    meals.flatMap(meal => meal.foods || []),
    [meals]
  );

  const nutritionTotals = useDailyNutrition(allFoods);

  const mealFoods = useMemo(() => {
    const foodsByMeal = {
      breakfast: [] as typeof allFoods,
      lunch: [] as typeof allFoods,
      dinner: [] as typeof allFoods,
      snacks: [] as typeof allFoods,
    };

    meals.forEach(meal => {
      if (meal.foods) {
        foodsByMeal[meal.type as keyof typeof foodsByMeal].push(...meal.foods);
      }
    });

    return foodsByMeal;
  }, [meals]);

  const handleFoodChange = useCallback(() => {
    // The useMeals hook will automatically refresh the data
    // due to the Supabase real-time subscription
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Today's Progress
          </h1>
          <div className="text-gray-600">
            {format(today, 'EEEE, MMMM d, yyyy')}
          </div>
        </div>
        
        <NutritionSummary consumed={nutritionTotals} />
      </div>

      {Object.entries(mealFoods).map(([type, foods]) => (
        <MealSection
          key={type}
          title={type.charAt(0).toUpperCase() + type.slice(1)}
          foods={foods}
          onFoodAdded={handleFoodChange}
          onFoodDeleted={handleFoodChange}
        />
      ))}
    </div>
  );
}
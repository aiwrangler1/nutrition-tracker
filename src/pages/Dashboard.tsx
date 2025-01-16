import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import MealSection from '../components/food/MealSection';
import NutritionSummary from '../components/dashboard/NutritionSummary';
import { useMeals } from '../hooks/useMeals';
import { useSettings } from '../hooks/useSettings';
import { FoodItemSkeleton, NutritionSummarySkeleton } from '../components/ui/Skeleton';

const Dashboard: React.FC = () => {
  const { meals, isLoading: mealsLoading, error: mealsError, addMeal, deleteMeal, addFood, deleteFood } = useMeals(new Date());
  const { settings, isLoading: settingsLoading, error: settingsError } = useSettings();

  const nutritionTotals = useMemo(() => {
    return meals.reduce((totals, meal) => {
      meal.foods.forEach(food => {
        totals.calories += food.calories;
        totals.protein += food.protein;
        totals.carbs += food.carbs;
        totals.fat += food.fat;
      });
      return totals;
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    });
  }, [meals]);

  const handleFoodAdded = useCallback(() => {
    // The useMeals hook will automatically refresh the data
  }, []);

  const handleFoodDeleted = useCallback(() => {
    // The useMeals hook will automatically refresh the data
  }, []);

  if (mealsError) return <div className="text-red-600">Error loading meals: {mealsError.message}</div>;
  if (settingsError) return <div className="text-red-600">Error loading settings: {settingsError.message}</div>;

  if (mealsLoading || settingsLoading || !settings) {
    return (
      <div className="space-y-6">
        <NutritionSummarySkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              {Array.from({ length: 2 }).map((_, j) => (
                <FoodItemSkeleton key={j} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div data-testid="dashboard" className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard - {format(new Date(), 'MMMM d, yyyy')}
        </h1>
      </div>

      <NutritionSummary
        data-testid="nutrition-summary"
        settings={settings}
        currentMacros={nutritionTotals}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MealSection
          data-testid="breakfast-section"
          title="Breakfast"
          foods={meals.filter(m => m.type === 'breakfast').flatMap(m => m.foods)}
          onFoodAdded={handleFoodAdded}
          onFoodDeleted={handleFoodDeleted}
        />
        <MealSection
          data-testid="lunch-section"
          title="Lunch"
          foods={meals.filter(m => m.type === 'lunch').flatMap(m => m.foods)}
          onFoodAdded={handleFoodAdded}
          onFoodDeleted={handleFoodDeleted}
        />
        <MealSection
          data-testid="dinner-section"
          title="Dinner"
          foods={meals.filter(m => m.type === 'dinner').flatMap(m => m.foods)}
          onFoodAdded={handleFoodAdded}
          onFoodDeleted={handleFoodDeleted}
        />
        <MealSection
          data-testid="snacks-section"
          title="Snacks"
          foods={meals.filter(m => m.type === 'snacks').flatMap(m => m.foods)}
          onFoodAdded={handleFoodAdded}
          onFoodDeleted={handleFoodDeleted}
        />
      </div>
    </div>
  );
};

export default Dashboard;
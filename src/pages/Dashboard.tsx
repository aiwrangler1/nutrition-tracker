import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import MealSection from '../components/food/MealSection';
import NutritionSummary from '../components/dashboard/NutritionSummary';
import { useMeals } from '../hooks/useMeals';
import { useSettings } from '../hooks/useSettings';

const Dashboard: React.FC = () => {
  const { meals, loading, error } = useMeals(new Date());
  const { settings } = useSettings();

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
    // Refresh meals
  }, []);

  const handleFoodDeleted = useCallback(() => {
    // Refresh meals
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading meals</div>;
  if (!settings) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard - {format(new Date(), 'MMMM d, yyyy')}
        </h1>
      </div>

      <NutritionSummary
        settings={settings}
        currentMacros={nutritionTotals}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MealSection
          title="Breakfast"
          foods={meals.filter(m => m.type === 'breakfast').flatMap(m => m.foods)}
          onFoodAdded={handleFoodAdded}
          onFoodDeleted={handleFoodDeleted}
        />
        <MealSection
          title="Lunch"
          foods={meals.filter(m => m.type === 'lunch').flatMap(m => m.foods)}
          onFoodAdded={handleFoodAdded}
          onFoodDeleted={handleFoodDeleted}
        />
        <MealSection
          title="Dinner"
          foods={meals.filter(m => m.type === 'dinner').flatMap(m => m.foods)}
          onFoodAdded={handleFoodAdded}
          onFoodDeleted={handleFoodDeleted}
        />
        <MealSection
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
import React, { useState, useMemo } from 'react';
import DiaryCalendar from '../components/diary/DiaryCalendar';
import MealEntryForm from '../components/diary/MealEntryForm';
import { useMeals } from '../hooks/useMeals';
import { format } from 'date-fns';

const Diary: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');

  const { meals, loading, error } = useMeals(selectedDate);

  const mealTotals = useMemo(() => {
    return meals.reduce((totals, meal) => {
      const mealCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
      totals[meal.type] = mealCalories;
      return totals;
    }, {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0
    });
  }, [meals]);

  const handleAddMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => {
    setSelectedMealType(mealType);
    setIsAddMealModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading meals</div>;

  return (
    <div className="space-y-6">
      <DiaryCalendar 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />

      {/* Daily Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {format(selectedDate, 'MMMM d, yyyy')}
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">Total Calories</h3>
              <p className="text-gray-600">
                {Object.values(mealTotals).reduce((a, b) => a + b, 0)} / 2,000
              </p>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ 
                  width: `${Math.min(
                    (Object.values(mealTotals).reduce((a, b) => a + b, 0) / 2000) * 100, 
                    100
                  )}%` 
                }}
              ></div>
            </div>
          </div>
          
          {/* Macronutrient Summary */}
          <div className="grid grid-cols-3 gap-4">
            {['Protein', 'Carbs', 'Fat'].map((macro) => (
              <div key={macro} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium">{macro}</h4>
                <p className="text-gray-600">120g / 150g</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meal Sections */}
      {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((mealType) => (
        <div key={mealType} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </h2>
            <button 
              onClick={() => handleAddMeal(mealType)}
              className="text-green-600 hover:text-green-700"
            >
              + Add Meal
            </button>
          </div>

          {/* Meal Foods List */}
          {meals
            .filter(meal => meal.type === mealType)
            .flatMap(meal => meal.foods)
            .map((food, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-3 border-b last:border-b-0"
              >
                <div>
                  <h3 className="font-medium">{food.name}</h3>
                  <p className="text-gray-600">
                    {food.numberOfServings} × {food.servingSize}{food.servingUnit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{food.calories} cal</p>
                </div>
              </div>
            ))}
        </div>
      ))}

      {/* Meal Entry Modal */}
      {isAddMealModalOpen && (
        <MealEntryForm
          date={selectedDate}
          mealType={selectedMealType}
          onClose={() => setIsAddMealModalOpen(false)}
          onEntryAdded={() => {
            // Trigger meal refresh or update
            setIsAddMealModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Diary;
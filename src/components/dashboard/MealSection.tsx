import React, { useState } from 'react';
import { MealEntry, Food } from '../types';
import AddFoodModal from '../food/AddFoodModal';

interface MealSectionProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  mealEntries: MealEntry[];
  onAddFood: (food: Food) => void;
  onDeleteFood: (foodId: string) => void;
}

const MealSection: React.FC<MealSectionProps> = ({ 
  mealType, 
  mealEntries, 
  onAddFood, 
  onDeleteFood 
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const totalMacros = mealEntries.reduce((acc, entry) => {
    entry.foods.forEach(food => {
      acc.calories += food.calories;
      acc.protein += food.protein;
      acc.carbs += food.carbs;
      acc.fat += food.fat;
    });
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="meal-section">
      <h2>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h2>
      <div className="meal-totals">
        <p>Calories: {totalMacros.calories}</p>
        <p>Protein: {totalMacros.protein}g</p>
        <p>Carbs: {totalMacros.carbs}g</p>
        <p>Fat: {totalMacros.fat}g</p>
      </div>
      <button onClick={() => setIsAddModalOpen(true)}>Add Food</button>
      
      {isAddModalOpen && (
        <AddFoodModal 
          mealType={mealType}
          onClose={() => setIsAddModalOpen(false)}
          onFoodAdded={(food) => {
            onAddFood(food);
            setIsAddModalOpen(false);
          }}
        />
      )}

      <div className="food-list">
        {mealEntries.flatMap(entry => 
          entry.foods.map(food => (
            <div key={food.id} className="food-item">
              <span>{food.name}</span>
              <span>{food.numberOfServings} {food.servingUnit}</span>
              <button onClick={() => onDeleteFood(food.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MealSection; 
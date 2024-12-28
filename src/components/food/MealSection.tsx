import React from 'react';
import AddFoodButton from './AddFoodButton';
import FoodList from './FoodList';
import { Food } from '../../types';

interface MealSectionProps {
  title: string;
  foods: Food[];
  onFoodAdded: () => void;
  onFoodDeleted: () => void;
}

export default function MealSection({ 
  title, 
  foods, 
  onFoodAdded, 
  onFoodDeleted 
}: MealSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <AddFoodButton mealType={title} onFoodAdded={onFoodAdded} />
      </div>
      
      <FoodList foods={foods} onFoodDeleted={onFoodDeleted} />
    </div>
  );
}
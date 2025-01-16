import React, { useState } from 'react';
import AddFoodModal from './AddFoodModal';
import FoodList from './FoodList';
import { Food } from '../../types';

interface MealSectionProps {
  title: string;
  foods: Food[];
  onFoodAdded: () => void;
  onFoodDeleted: () => void;
}

export default function MealSection({ title, foods, onFoodAdded, onFoodDeleted }: MealSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          data-testid={`add-food-${title.toLowerCase()}`}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Add Food
        </button>
      </div>
      
      {isModalOpen && (
        <AddFoodModal
          mealType={title}
          onClose={() => setIsModalOpen(false)}
          onFoodAdded={() => {
            onFoodAdded();
            setIsModalOpen(false);
          }}
        />
      )}

      <FoodList 
        foods={foods} 
        onFoodDeleted={onFoodDeleted}
        data-testid={`${title.toLowerCase()}-food-list`}
      />
    </div>
  );
}
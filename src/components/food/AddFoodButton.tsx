import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import AddFoodModal from './AddFoodModal';

interface AddFoodButtonProps {
  mealType: string;
  onFoodAdded: () => void;
}

const AddFoodButton: React.FC<AddFoodButtonProps> = ({ mealType, onFoodAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center text-green-600 hover:text-green-700"
      >
        <PlusCircle size={20} className="mr-1" />
        Add Food
      </button>

      {isModalOpen && (
        <AddFoodModal
          mealType={mealType}
          onClose={() => setIsModalOpen(false)}
          onFoodAdded={() => {
            onFoodAdded();
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default AddFoodButton;
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import FoodList from './FoodList';
import { Food } from '../../types';
import { supabase } from '../../lib/supabase';

// Mock Supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null })
      })
    })
  }
}));

describe('FoodList', () => {
  const mockFoods: Food[] = [
    {
      id: '1',
      name: 'Chicken Breast',
      serving_size: 100,
      serving_unit: 'g',
      number_of_servings: 1,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      calories: 165
    },
    {
      id: '2',
      name: 'Brown Rice',
      serving_size: 100,
      serving_unit: 'g',
      number_of_servings: 1,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      calories: 111
    }
  ];

  const mockOnFoodDeleted = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no foods are provided', () => {
    render(<FoodList foods={[]} onFoodDeleted={mockOnFoodDeleted} />);
    expect(screen.getByText('No foods added yet')).toBeInTheDocument();
  });

  it('renders list of foods correctly', () => {
    render(<FoodList foods={mockFoods} onFoodDeleted={mockOnFoodDeleted} />);

    // Check if food names are rendered
    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
    expect(screen.getByText('Brown Rice')).toBeInTheDocument();

    // Check if serving information is rendered
    expect(screen.getByText('1 × 100g • 165 kcal')).toBeInTheDocument();
    expect(screen.getByText('1 × 100g • 111 kcal')).toBeInTheDocument();

    // Check if macros are rendered
    expect(screen.getByText('P: 31g • C: 0g • F: 3.6g')).toBeInTheDocument();
    expect(screen.getByText('P: 2.6g • C: 23g • F: 0.9g')).toBeInTheDocument();
  });

  it('handles food deletion correctly', async () => {
    render(<FoodList foods={mockFoods} onFoodDeleted={mockOnFoodDeleted} />);

    // Click delete button for the first food
    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);

    // Wait for the deletion to complete and callback to be called
    await waitFor(() => {
      expect(mockOnFoodDeleted).toHaveBeenCalledTimes(1);
    });
  });

  it('handles deletion error gracefully', async () => {
    // Mock console.error to prevent error output in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Override the Supabase mock for this test only
    const originalFrom = supabase.from;
    supabase.from = vi.fn().mockReturnValue({
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: new Error('Deletion failed') })
      })
    });

    render(<FoodList foods={mockFoods} onFoodDeleted={mockOnFoodDeleted} />);

    // Click delete button
    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);

    // Wait for error to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error deleting food:',
        expect.any(Error)
      );
    });

    // Cleanup
    consoleSpy.mockRestore();
    supabase.from = originalFrom;
  });

  it('renders correct number of food items', () => {
    render(<FoodList foods={mockFoods} onFoodDeleted={mockOnFoodDeleted} />);
    const foodItems = screen.getAllByRole('heading', { level: 4 });
    expect(foodItems).toHaveLength(2);
  });

  it('applies correct styling to food items', () => {
    render(<FoodList foods={mockFoods} onFoodDeleted={mockOnFoodDeleted} />);
    
    const foodItems = screen.getAllByRole('heading', { level: 4 });
    const containers = foodItems.map(item => item.closest('div'));
    
    containers.forEach(container => {
      expect(container).toHaveClass('flex', 'items-center', 'justify-between', 'p-3', 'bg-gray-50', 'rounded-lg');
    });
  });
}); 
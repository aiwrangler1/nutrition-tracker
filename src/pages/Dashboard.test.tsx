import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import { useMeals } from '../hooks/useMeals';
import { useSettings } from '../hooks/useSettings';
import { format } from 'date-fns';
import { MealEntry, UserSettings } from '../types';

// Mock the hooks
vi.mock('../hooks/useMeals', () => ({
  useMeals: vi.fn()
}));

vi.mock('../hooks/useSettings', () => ({
  useSettings: vi.fn()
}));

describe('Dashboard', () => {
  const mockSettings: UserSettings = {
    id: '1',
    user_id: '1',
    daily_calorie_goal: 2000,
    protein_target: 150,
    carbs_target: 250,
    fat_target: 70,
    notes: ''
  };

  const mockMeals: MealEntry[] = [
    {
      id: '1',
      type: 'breakfast',
      foods: [
        {
          id: '1',
          name: 'Eggs',
          serving_size: 100,
          serving_unit: 'g',
          number_of_servings: 1,
          protein: 13,
          carbs: 1,
          fat: 11,
          calories: 155
        }
      ],
      date: '2024-03-20',
      user_id: '1'
    },
    {
      id: '2',
      type: 'lunch',
      foods: [
        {
          id: '2',
          name: 'Chicken Salad',
          serving_size: 200,
          serving_unit: 'g',
          number_of_servings: 1,
          protein: 25,
          carbs: 10,
          fat: 8,
          calories: 220
        }
      ],
      date: '2024-03-20',
      user_id: '1'
    }
  ];

  const mockUpdateSettings = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    vi.mocked(useMeals).mockReturnValue({
      meals: mockMeals,
      loading: false,
      error: null
    });
    vi.mocked(useSettings).mockReturnValue({
      settings: mockSettings,
      loading: false,
      error: null,
      updateSettings: mockUpdateSettings
    });
  });

  it('renders dashboard with correct date', () => {
    render(<Dashboard />);
    const today = format(new Date(), 'MMMM d, yyyy');
    expect(screen.getByText(`Dashboard - ${today}`)).toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    vi.mocked(useMeals).mockReturnValue({
      meals: [],
      loading: true,
      error: null
    });

    render(<Dashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    vi.mocked(useMeals).mockReturnValue({
      meals: [],
      loading: false,
      error: new Error('Failed to load meals')
    });

    render(<Dashboard />);
    expect(screen.getByText('Error loading meals')).toBeInTheDocument();
  });

  it('renders settings loading state correctly', () => {
    vi.mocked(useSettings).mockReturnValue({
      settings: null,
      loading: true,
      error: null,
      updateSettings: mockUpdateSettings
    });

    render(<Dashboard />);
    expect(screen.getByText('Loading settings...')).toBeInTheDocument();
  });

  it('calculates and displays nutrition totals correctly', async () => {
    render(<Dashboard />);

    // Total macros from mock meals:
    // Protein: 13 + 25 = 38g
    // Carbs: 1 + 10 = 11g
    // Fat: 11 + 8 = 19g
    // Calories: 155 + 220 = 375

    await waitFor(() => {
      expect(screen.getByText('38 / 150g')).toBeInTheDocument(); // Protein
      expect(screen.getByText('11 / 250g')).toBeInTheDocument(); // Carbs
      expect(screen.getByText('19 / 70g')).toBeInTheDocument();  // Fat
      expect(screen.getByText('375 / 2000')).toBeInTheDocument(); // Calories
    });
  });

  it('renders all meal sections', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    expect(screen.getByText('Snacks')).toBeInTheDocument();
  });

  it('displays foods in correct meal sections', () => {
    render(<Dashboard />);
    
    // Check if foods are in correct sections
    const breakfastSection = screen.getByText('Breakfast').closest('div');
    const lunchSection = screen.getByText('Lunch').closest('div');
    
    expect(breakfastSection).toHaveTextContent('Eggs');
    expect(lunchSection).toHaveTextContent('Chicken Salad');
  });

  it('handles empty meals correctly', () => {
    vi.mocked(useMeals).mockReturnValue({
      meals: [],
      loading: false,
      error: null
    });

    render(<Dashboard />);
    
    // Check if "No foods added yet" message appears in each section
    const noFoodsMessage = screen.getAllByText('No foods added yet');
    expect(noFoodsMessage).toHaveLength(4); // One for each meal section
  });
}); 
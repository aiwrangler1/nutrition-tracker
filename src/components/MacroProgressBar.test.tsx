import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MacroProgressBar from './dashboard/MacroProgressBar';
import { UserSettings } from '../types';

describe('MacroProgressBar', () => {
  const mockSettings: UserSettings = {
    id: '1',
    user_id: '1',
    daily_calorie_goal: 2000,
    protein_target: 150,
    carbs_target: 250,
    fat_target: 70,
    notes: ''
  };

  it('renders progress bars with correct values', () => {
    const mockMacros = {
      calories: 1000,
      protein: 75,
      carbs: 125,
      fat: 35
    };

    render(
      <MacroProgressBar
        userSettings={mockSettings}
        currentMacros={mockMacros}
      />
    );

    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Protein')).toBeInTheDocument();
    expect(screen.getByText('Carbs')).toBeInTheDocument();
    expect(screen.getByText('Fat')).toBeInTheDocument();

    expect(screen.getByText('1000 / 2000')).toBeInTheDocument();
    expect(screen.getByText('75 / 150g')).toBeInTheDocument();
    expect(screen.getByText('125 / 250g')).toBeInTheDocument();
    expect(screen.getByText('35 / 70g')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    const mockMacros = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };

    render(
      <MacroProgressBar
        userSettings={mockSettings}
        currentMacros={mockMacros}
      />
    );

    expect(screen.getByText('0 / 2000')).toBeInTheDocument();
    expect(screen.getByText('0 / 150g')).toBeInTheDocument();
    expect(screen.getByText('0 / 250g')).toBeInTheDocument();
    expect(screen.getByText('0 / 70g')).toBeInTheDocument();
  });

  it('handles exceeding target values', () => {
    const mockMacros = {
      calories: 2500,
      protein: 200,
      carbs: 300,
      fat: 100
    };

    render(
      <MacroProgressBar
        userSettings={mockSettings}
        currentMacros={mockMacros}
      />
    );

    expect(screen.getByText('2500 / 2000')).toBeInTheDocument();
    expect(screen.getByText('200 / 150g')).toBeInTheDocument();
    expect(screen.getByText('300 / 250g')).toBeInTheDocument();
    expect(screen.getByText('100 / 70g')).toBeInTheDocument();
  });

  it('displays correct progress percentages', () => {
    const mockMacros = {
      calories: 1000,
      protein: 75,
      carbs: 125,
      fat: 35
    };

    render(
      <MacroProgressBar
        userSettings={mockSettings}
        currentMacros={mockMacros}
      />
    );

    // Check progress bar widths
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars[0]).toHaveStyle({ width: '50%' }); // Calories: 1000/2000
    expect(progressBars[1]).toHaveStyle({ width: '50%' }); // Protein: 75/150
    expect(progressBars[2]).toHaveStyle({ width: '50%' }); // Carbs: 125/250
    expect(progressBars[3]).toHaveStyle({ width: '50%' }); // Fat: 35/70
  });

  it('handles decimal values correctly', () => {
    const mockMacros = {
      calories: 1000.5,
      protein: 75.5,
      carbs: 125.5,
      fat: 35.5
    };

    render(
      <MacroProgressBar
        userSettings={mockSettings}
        currentMacros={mockMacros}
      />
    );

    expect(screen.getByText('1001 / 2000')).toBeInTheDocument(); // Rounded up
    expect(screen.getByText('76 / 150g')).toBeInTheDocument(); // Rounded up
    expect(screen.getByText('126 / 250g')).toBeInTheDocument(); // Rounded up
    expect(screen.getByText('36 / 70g')).toBeInTheDocument(); // Rounded up
  });

  it('applies correct color coding based on progress', () => {
    const mockMacros = {
      calories: 2200, // Over target
      protein: 75,    // Under target
      carbs: 250,     // At target
      fat: 80        // Over target
    };

    render(
      <MacroProgressBar
        userSettings={mockSettings}
        currentMacros={mockMacros}
      />
    );

    const progressBars = screen.getAllByRole('progressbar');
    
    // Check for appropriate color classes
    expect(progressBars[0]).toHaveClass('bg-red-500');    // Over target
    expect(progressBars[1]).toHaveClass('bg-yellow-500'); // Under target
    expect(progressBars[2]).toHaveClass('bg-green-500');  // At target
    expect(progressBars[3]).toHaveClass('bg-red-500');    // Over target
  });
}); 
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MacroProgressBar from './dashboard/MacroProgressBar';
import { UserSettings } from '../types';

describe('MacroProgressBar', () => {
  it('renders progress bars with correct values', () => {
    const mockSettings: UserSettings = {
      id: '1',
      user_id: '1',
      daily_calorie_goal: 2000,
      protein_target: 150,
      carbs_target: 250,
      fat_target: 70,
      notes: ''
    };

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

    // Check if all macro labels are rendered
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Protein')).toBeInTheDocument();
    expect(screen.getByText('Carbs')).toBeInTheDocument();
    expect(screen.getByText('Fat')).toBeInTheDocument();

    // Check if current/target values are rendered
    expect(screen.getByText('1000 / 2000')).toBeInTheDocument();
    expect(screen.getByText('75 / 150g')).toBeInTheDocument();
    expect(screen.getByText('125 / 250g')).toBeInTheDocument();
    expect(screen.getByText('35 / 70g')).toBeInTheDocument();
  });
}); 
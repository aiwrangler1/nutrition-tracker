import { render, screen } from '@testing-library/react';
import MacroProgressBar from './MacroProgressBar';
import { describe, it, expect } from 'vitest';

describe('MacroProgressBar', () => {
  const mockSettings = {
    dailyCalorieGoal: 2000,
    proteinTarget: 150,
    carbsTarget: 250,
    fatTarget: 70
  };

  const mockMacros = {
    calories: 1500,
    protein: 100,
    carbs: 180,
    fat: 50
  };

  it('renders correctly', () => {
    render(
      <MacroProgressBar 
        userSettings={mockSettings} 
        currentMacros={mockMacros} 
      />
    );

    expect(screen.getByText(/Calories: 1500 \/ 2000/)).toBeInTheDocument();
    expect(screen.getByText(/Protein: 100 \/ 150g/)).toBeInTheDocument();
  });

  it('calculates progress percentages correctly', () => {
    const { container } = render(
      <MacroProgressBar 
        userSettings={mockSettings} 
        currentMacros={mockMacros} 
      />
    );

    const progressBars = container.querySelectorAll('.progress-bar');
    
    // Check if progress bars have correct widths
    expect(progressBars[0]).toHaveStyle('width: 75%');
    expect(progressBars[1]).toHaveStyle('width: 66.67%');
  });
}); 
/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFoodModal from './AddFoodModal';
import { useAuth } from '../../lib/auth';

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com'
    },
    signIn: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn()
  })
}));

// Mock Supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      insert: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
      select: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
      single: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null })
    })
  }
}));

describe('AddFoodModal', () => {
  const mockProps = {
    mealType: 'Breakfast',
    onClose: vi.fn(),
    onFoodAdded: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<AddFoodModal {...mockProps} />);
    expect(screen.getByText(/Add Food to Breakfast/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Food Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Serving Size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Servings/i)).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    render(<AddFoodModal {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Food Name/i), {
      target: { value: 'Test Food' }
    });
    fireEvent.change(screen.getByLabelText(/Serving Size/i), {
      target: { value: '100' }
    });
    fireEvent.change(screen.getByLabelText(/Serving Unit/i), {
      target: { value: 'g' }
    });
    fireEvent.change(screen.getByLabelText(/Number of Servings/i), {
      target: { value: '1' }
    });
    fireEvent.change(screen.getByLabelText(/Protein/i), {
      target: { value: '20' }
    });
    fireEvent.change(screen.getByLabelText(/Carbs/i), {
      target: { value: '30' }
    });
    fireEvent.change(screen.getByLabelText(/Fat/i), {
      target: { value: '10' }
    });

    fireEvent.click(screen.getByText('Add Food'));

    await waitFor(() => {
      expect(mockProps.onFoodAdded).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Food',
        serving_size: 100,
        serving_unit: 'g',
        number_of_servings: 1,
        protein: 20,
        carbs: 30,
        fat: 10,
        calories: 290
      }));
    });
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('validates required fields', async () => {
    render(<AddFoodModal {...mockProps} />);
    
    fireEvent.click(screen.getByText('Add Food'));
    
    await waitFor(() => {
      expect(screen.getByText(/Food name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Serving size is required/i)).toBeInTheDocument();
    });
    
    expect(mockProps.onFoodAdded).not.toHaveBeenCalled();
    expect(mockProps.onClose).not.toHaveBeenCalled();
  });

  it('calculates calories correctly with different macros', () => {
    render(<AddFoodModal {...mockProps} />);
    
    // Test case 1: All macros
    fireEvent.change(screen.getByLabelText(/Protein/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/Carbs/i), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Fat/i), { target: { value: '10' } });
    expect(screen.getByLabelText(/Calories/i)).toHaveValue(290);

    // Test case 2: Zero macros
    fireEvent.change(screen.getByLabelText(/Protein/i), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(/Carbs/i), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(/Fat/i), { target: { value: '0' } });
    expect(screen.getByLabelText(/Calories/i)).toHaveValue(0);
  });

  it('handles negative values correctly', async () => {
    render(<AddFoodModal {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Protein/i), { target: { value: '-10' } });
    
    await waitFor(() => {
      expect(screen.getByText(/Value cannot be negative/i)).toBeInTheDocument();
    });
  });

  it('handles decimal values correctly', async () => {
    render(<AddFoodModal {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Protein/i), { target: { value: '20.5' } });
    fireEvent.change(screen.getByLabelText(/Carbs/i), { target: { value: '30.5' } });
    fireEvent.change(screen.getByLabelText(/Fat/i), { target: { value: '10.5' } });
    
    const expectedCalories = Math.round((20.5 * 4) + (30.5 * 4) + (10.5 * 9));
    expect(screen.getByLabelText(/Calories/i)).toHaveValue(expectedCalories);
  });

  it('handles form reset correctly', () => {
    render(<AddFoodModal {...mockProps} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/Food Name/i), { target: { value: 'Test Food' } });
    fireEvent.change(screen.getByLabelText(/Protein/i), { target: { value: '20' } });
    
    // Reset form
    fireEvent.click(screen.getByText(/Cancel/i));
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });
}); 
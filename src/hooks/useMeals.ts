import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { MealEntry } from '../types';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useMeals(date: Date) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const formattedDate = date.toISOString().split('T')[0];
  const queryKey = ['meals', user?.id, formattedDate];

  const { data: meals = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('meal_entries')
        .select(`
          *,
          foods (*)
        `)
        .eq('user_id', user.id)
        .eq('date', formattedDate);

      if (error) throw error;
      return data as MealEntry[];
    },
    enabled: !!user,
  });

  const addMeal = useMutation({
    mutationFn: async (newMeal: Omit<MealEntry, 'id'>) => {
      const { data, error } = await supabase
        .from('meal_entries')
        .insert([newMeal])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Meal added successfully');
    },
    onError: (error) => {
      console.error('Error adding meal:', error);
      toast.error('Failed to add meal');
    },
  });

  const deleteMeal = useMutation({
    mutationFn: async (mealId: string) => {
      const { error } = await supabase
        .from('meal_entries')
        .delete()
        .eq('id', mealId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Meal deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting meal:', error);
      toast.error('Failed to delete meal');
    },
  });

  const addFood = useMutation({
    mutationFn: async ({ mealId, food }: { mealId: string; food: Omit<MealEntry['foods'][0], 'id'> }) => {
      const { data, error } = await supabase
        .from('foods')
        .insert([{ ...food, meal_entry_id: mealId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Food added successfully');
    },
    onError: (error) => {
      console.error('Error adding food:', error);
      toast.error('Failed to add food');
    },
  });

  const deleteFood = useMutation({
    mutationFn: async (foodId: string) => {
      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('id', foodId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Food deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting food:', error);
      toast.error('Failed to delete food');
    },
  });

  return {
    meals,
    isLoading,
    error,
    addMeal,
    deleteMeal,
    addFood,
    deleteFood,
  };
}
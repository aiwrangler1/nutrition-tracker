import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MealEntry } from '../types';

export function useRealtimeUpdates(onMealUpdate: (meal: MealEntry) => void) {
  useEffect(() => {
    const subscription = supabase
      .channel('meal_entries')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_entries'
        },
        (payload) => {
          onMealUpdate(payload.new as MealEntry);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [onMealUpdate]);
} 
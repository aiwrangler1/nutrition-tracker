import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MealEntry } from '../types';

export function useMeals(date: Date) {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const { data, error } = await supabase
          .from('meal_entries')
          .select(`
            *,
            foods (*)
          `)
          .eq('date', date.toISOString().split('T')[0]);

        if (error) throw error;
        setMeals(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch meals'));
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();

    // Subscribe to changes
    const subscription = supabase
      .channel('meal_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'meal_entries' },
        fetchMeals
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [date]);

  return { meals, loading, error };
}
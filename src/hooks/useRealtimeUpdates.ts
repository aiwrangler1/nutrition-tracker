import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useMealEntriesSubscription = (userId: string) => {
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchMealEntries = async () => {
      const { data, error } = await supabase
        .from('meal_entries')
        .select('*, foods(*)')
        .eq('userId', userId)
        .eq('date', new Date().toISOString().split('T')[0]);

      if (data) setMealEntries(data);
    };

    // Real-time subscription
    const subscription = supabase
      .channel('meal_entries')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'meal_entries',
          filter: `userId=eq.${userId}`
        },
        (payload) => {
          // Handle real-time updates
          switch (payload.eventType) {
            case 'INSERT':
              setMealEntries(prev => [...prev, payload.new]);
              break;
            case 'UPDATE':
              setMealEntries(prev => 
                prev.map(entry => 
                  entry.id === payload.new.id ? payload.new : entry
                )
              );
              break;
            case 'DELETE':
              setMealEntries(prev => 
                prev.filter(entry => entry.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    fetchMealEntries();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  return mealEntries;
}; 
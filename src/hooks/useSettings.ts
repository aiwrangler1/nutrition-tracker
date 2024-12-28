import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserSettings } from '../types';
import { useAuth } from '../lib/auth';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchSettings = async () => {
      const result = await asyncErrorHandler(
        async () => {
          const { data, error } = await supabase
            .from('users_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          return data;
        },
        { userId: user.id, operation: 'fetchSettings' }
      );

      if (result) {
        setSettings(result);
      }
      setLoading(false);
    };

    fetchSettings();
  }, [user]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    const result = await asyncErrorHandler(
      async () => {
        const { error } = await supabase
          .from('users_settings')
          .upsert({
            user_id: user.id,
            ...newSettings
          });

        if (error) throw error;
        setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      },
      { 
        userId: user.id, 
        operation: 'updateSettings',
        settings: newSettings 
      }
    );
  };

  return { settings, loading, error, updateSettings };
}
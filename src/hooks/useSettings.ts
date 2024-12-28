import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserSettings } from '../types';
import { useAuth } from '../lib/auth';

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('users_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users_settings')
        .upsert({
          user_id: user.id,
          ...newSettings
        });

      if (error) throw error;
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update settings');
    }
  };

  return { settings, loading, error, updateSettings };
}
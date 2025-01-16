import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { UserSettings } from '../types';
import { useAuth } from '../lib/auth';
import toast from 'react-hot-toast';

export function useSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['settings', user?.id];

  const { data: settings, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('users_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // If no settings exist, create default settings
      if (!data) {
        const defaultSettings: Omit<UserSettings, 'id'> = {
          user_id: user.id,
          daily_calorie_goal: 2000,
          protein_target: 150,
          carbs_target: 250,
          fat_target: 70,
          notes: '',
        };

        const { data: newSettings, error: createError } = await supabase
          .from('users_settings')
          .insert([defaultSettings])
          .select()
          .single();

        if (createError) throw createError;
        return newSettings;
      }

      return data;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      if (!user || !settings) throw new Error('User not authenticated or settings not found');

      const { data, error } = await supabase
        .from('users_settings')
        .update(newSettings)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings,
  };
}
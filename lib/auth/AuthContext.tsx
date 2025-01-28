'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError, Provider } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { authLogger } from '../utils/logger';

interface AuthState {
  user: User | null;
  loading: boolean;
  signInAttempts: number;
  lastAttemptTime: number | null;
}

interface AuthContextType extends Omit<AuthState, 'signInAttempts' | 'lastAttemptTime'> {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null; needsEmailVerification?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  resendVerificationEmail: () => Promise<{ error: AuthError | null }>;
  isEmailVerified: () => boolean;
  refreshSession: () => Promise<{ error: AuthError | null }>;
  signInWithProvider: (provider: Provider) => Promise<{ error: AuthError | null }>;
  getRemainingAttempts: () => number;
  getTimeUntilUnlock: () => number | null;
}

const MAX_SIGN_IN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    signInAttempts: 0,
    lastAttemptTime: null,
  });

  const resetAttempts = () => {
    setState(prev => ({ ...prev, signInAttempts: 0, lastAttemptTime: null }));
  };

  const incrementAttempts = () => {
    setState(prev => ({
      ...prev,
      signInAttempts: prev.signInAttempts + 1,
      lastAttemptTime: Date.now(),
    }));
  };

  const getRemainingAttempts = () => {
    return MAX_SIGN_IN_ATTEMPTS - state.signInAttempts;
  };

  const getTimeUntilUnlock = () => {
    if (!state.lastAttemptTime || state.signInAttempts < MAX_SIGN_IN_ATTEMPTS) {
      return null;
    }
    const timeElapsed = Date.now() - state.lastAttemptTime;
    return Math.max(0, LOCKOUT_DURATION - timeElapsed);
  };

  const isLockedOut = () => {
    const timeUntilUnlock = getTimeUntilUnlock();
    return timeUntilUnlock !== null && timeUntilUnlock > 0;
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setState(prev => ({ ...prev, user: session?.user ?? null }));
      } catch (error) {
        authLogger.logAuthError('initializeAuth', error as AuthError);
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState(prev => ({ 
        ...prev, 
        user: session?.user ?? null,
        loading: false 
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setState(prev => ({ ...prev, user: session?.user ?? null }));
      return { error: null };
    } catch (error) {
      authLogger.logAuthError('refreshSession', error as AuthError);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (isLockedOut()) {
        const timeUntilUnlock = getTimeUntilUnlock();
        throw new Error(`Account locked. Try again in ${Math.ceil(timeUntilUnlock! / 60000)} minutes`);
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        incrementAttempts();
        throw error;
      }

      resetAttempts();
      return { error: null };
    } catch (error) {
      authLogger.logAuthError('signIn', error as AuthError);
      return { error: error as AuthError };
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      authLogger.logAuthError('signInWithProvider', error as AuthError);
      return { error: error as AuthError };
    }
  };

  const value = {
    user: state.user,
    loading: state.loading,
    signIn: signIn,
    signUp: async (email: string, password: string) => {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });
      authLogger.logAuthError('signUp', error);
      return { 
        error,
        needsEmailVerification: data.user?.email_confirmed_at === null,
        errorMessage: error ? getErrorMessage(error) : null 
      };
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
    resetPassword: async (email: string) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        authLogger.logAuthError('resetPassword', error);
        
        return { 
          error,
          errorMessage: error ? getErrorMessage(error) : null 
        };
      } catch (err) {
        const error = err as AuthError;
        authLogger.logAuthError('resetPassword', error);
        return { 
          error,
          errorMessage: error.message || 'Failed to send reset password email' 
        };
      }
    },
    updatePassword: async (password: string) => {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      return { error };
    },
    resendVerificationEmail: async () => {
      if (!state.user || !state.user.email) {
        return { error: { name: 'Error', message: 'No user email found' } as AuthError };
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: state.user.email
      });

      return { error };
    },
    isEmailVerified: () => {
      return state.user?.email_confirmed_at !== null;
    },
    refreshSession,
    signInWithProvider,
    getRemainingAttempts,
    getTimeUntilUnlock,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Utility function to translate Supabase errors to user-friendly messages
const getErrorMessage = (error: AuthError | null): string => {
  if (!error) return '';

  switch (error.code) {
    case 'invalid_login_credentials':
      return 'Invalid email or password. Please try again.';
    case 'user_already_exists':
      return 'An account with this email already exists.';
    case 'network_error':
      return 'Network error. Please check your connection and try again.';
    case 'rate_limit_exceeded':
      return 'Too many attempts. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

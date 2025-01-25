'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { authLogger } from '../utils/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null, needsEmailVerification?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  resendVerificationEmail: () => Promise<{ error: AuthError | null }>;
  isEmailVerified: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authLogger.logAuthError('signIn', error);
      return { 
        error,
        errorMessage: error ? getErrorMessage(error) : null 
      };
    },
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
      if (!user || !user.email) {
        return { error: { name: 'Error', message: 'No user email found' } as AuthError };
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      return { error };
    },
    isEmailVerified: () => {
      return user?.email_confirmed_at !== null;
    },
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

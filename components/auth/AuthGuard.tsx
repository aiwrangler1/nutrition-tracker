'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Spin, Alert } from 'antd';
import { authLogger } from '@/lib/utils/logger';
import { AuthError } from '@supabase/supabase-js';

interface AuthGuardProps {
  children: React.ReactNode;
  requireVerified?: boolean;
}

const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email'
];

export default function AuthGuard({ children, requireVerified = true }: AuthGuardProps) {
  const { user, loading, isEmailVerified, refreshSession } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Don't redirect if on public routes
        if (PUBLIC_ROUTES.includes(pathname)) {
          return;
        }

        // If not loading and no user, redirect to login
        if (!loading && !user) {
          authLogger.logAuthEvent('AUTH_GUARD', 'Redirecting to login - No user found');
          router.push('/auth/login');
          return;
        }

        // Check email verification if required
        if (!loading && user && requireVerified && !isEmailVerified()) {
          authLogger.logAuthEvent('AUTH_GUARD', 'Redirecting to verify email - Email not verified');
          router.push('/auth/verify-email');
          return;
        }

        // Refresh session if user exists
        if (user) {
          const { error: refreshError } = await refreshSession();
          if (refreshError) {
            throw refreshError;
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Authentication error occurred';
        setError(errorMessage);
        authLogger.logAuthError('AUTH_GUARD', error as AuthError);
      }
    };

    checkAuth();
  }, [user, loading, pathname, router, requireVerified, isEmailVerified, refreshSession]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" data-testid="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert
          message="Authentication Error"
          description={error}
          type="error"
          showIcon
          className="max-w-md"
        />
      </div>
    );
  }

  // Allow rendering on public routes regardless of auth state
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  // Only render children if authenticated and meets verification requirements
  if (user && (!requireVerified || isEmailVerified())) {
    return <>{children}</>;
  }

  // Render loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" data-testid="loading-spinner" />
    </div>
  );
}

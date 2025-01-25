'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Spin } from 'antd';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user && !['/auth/login', '/auth/signup'].includes(pathname)) {
      router.push('/auth/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" data-testid="loading-spinner" />
      </div>
    );
  }

  if (!user && !['/auth/login', '/auth/signup'].includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}

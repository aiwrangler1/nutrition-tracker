'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          // Redirect to login if not authenticated
          router.replace('/login');
        }
      }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
      return <div>Loading...</div>; // Replace with a proper loading component
    }

    // Render the wrapped component if authenticated
    return user ? <WrappedComponent {...props} /> : null;
  };
} 
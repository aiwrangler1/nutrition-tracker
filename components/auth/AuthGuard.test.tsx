import { render, screen } from '@testing-library/react';
import AuthGuard from './AuthGuard';
import { useAuth } from '@/lib/auth/AuthContext';

jest.mock('@/lib/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/protected-route',
}));

describe('AuthGuard', () => {
  it('redirects unauthenticated users', () => {
    (useAuth as jest.Mock).mockReturnValue({ 
      user: null, 
      loading: false 
    });

    render(<AuthGuard><div>Protected Content</div></AuthGuard>);
    expect(screen.queryByText('Protected Content')).toBeNull();
  });

  it('shows loading state', () => {
    (useAuth as jest.Mock).mockReturnValue({ 
      user: null, 
      loading: true 
    });

    render(<AuthGuard><div>Protected Content</div></AuthGuard>);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
}); 
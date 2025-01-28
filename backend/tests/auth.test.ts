import { withAuth } from '../auth/withAuth';

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({})
}));

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createServerComponentClient: jest.fn().mockReturnValue({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } })
    }
  })
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}));

describe('withAuth', () => {
  it('should redirect if no session', async () => {
    await withAuth();
    const { redirect } = require('next/navigation');
    expect(redirect).toHaveBeenCalledWith('/auth/login');
  });
}); 
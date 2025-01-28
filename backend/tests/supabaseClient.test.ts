import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockImplementation(() => ({
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }))
}));

describe('Supabase Client', () => {
  let supabase: ReturnType<typeof createClient>;

  beforeEach(() => {
    supabase = createClient('test-url', 'test-key');
  });

  it('should initialize Supabase client', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('should have correct configuration', () => {
    expect(supabase.auth.autoRefreshToken).toBe(true);
    expect(supabase.auth.persistSession).toBe(true);
  });
}); 
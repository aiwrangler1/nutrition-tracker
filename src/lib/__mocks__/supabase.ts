export const mockSupabase = {
  auth: {
    getSession: () => Promise.resolve({
      data: {
        session: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          }
        }
      },
      error: null
    }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      callback('SIGNED_IN', {
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      });
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({
          data: {
            id: 'test-settings-id',
            user_id: 'test-user-id',
            daily_calorie_goal: 2000,
            protein_target: 150,
            carbs_target: 250,
            fat_target: 70
          },
          error: null
        }),
        order: () => Promise.resolve({
          data: [],
          error: null
        })
      })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({
          data: {
            id: 'test-food-id',
            name: 'Test Food',
            serving_size: 100,
            serving_unit: 'g',
            calories: 200,
            protein: 20,
            carbs: 30,
            fat: 10
          },
          error: null
        })
      })
    }),
    delete: () => ({
      eq: () => Promise.resolve({
        error: null
      })
    })
  })
};

export const supabase = mockSupabase; 
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/frontend/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing environment variables');
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  try {
    // Create a test user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'test123',
      email_confirm: true
    });

    if (userError) throw userError;

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({ id: userData.user.id });

    if (profileError) throw profileError;

    // Create user goals
    const { error: goalsError } = await supabase
      .from('user_goals')
      .insert({
        user_id: userData.user.id,
        daily_calorie_goal: 2000,
        daily_protein_goal: 150,
        daily_carb_goal: 200,
        daily_fat_goal: 65
      });

    if (goalsError) throw goalsError;

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase(); 
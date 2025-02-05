import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export type Database = {
  public: {
    Tables: {
      foods: {
        Row: {
          id: string
          name: string
          serving_size: number
          serving_unit: string
          protein: number
          carbs: number
          fat: number
          calories: number
          created_at: string
        }
        Insert: Omit<Foods['Row'], 'id' | 'created_at'>
        Update: Partial<Foods['Insert']>
      }
      meals: {
        Row: {
          id: string
          date: string
          name: string
          foods: {
            food_id: string
            servings: number
          }[]
          created_at: string
        }
        Insert: Omit<Meals['Row'], 'id' | 'created_at'>
        Update: Partial<Meals['Insert']>
      }
      settings: {
        Row: {
          id: string
          protein_goal: number
          carbs_goal: number
          fat_goal: number
          created_at: string
        }
        Insert: Omit<Settings['Row'], 'id' | 'created_at'>
        Update: Partial<Settings['Insert']>
      }
    }
  }
}

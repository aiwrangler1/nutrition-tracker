export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_goals: {
        Row: {
          id: string
          user_id: string
          daily_calorie_goal: number
          daily_protein_goal: number
          daily_carb_goal: number
          daily_fat_goal: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daily_calorie_goal: number
          daily_protein_goal: number
          daily_carb_goal: number
          daily_fat_goal: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daily_calorie_goal?: number
          daily_protein_goal?: number
          daily_carb_goal?: number
          daily_fat_goal?: number
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          date: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
          created_at?: string
        }
      }
      meal_entries: {
        Row: {
          id: string
          meal_id: string
          food_name: string
          serving_size: string | null
          servings: number
          protein: number
          carbs: number
          fat: number
          calories: number
          created_at: string
        }
        Insert: {
          id?: string
          meal_id: string
          food_name: string
          serving_size?: string | null
          servings: number
          protein: number
          carbs: number
          fat: number
          calories: number
          created_at?: string
        }
        Update: {
          id?: string
          meal_id?: string
          food_name?: string
          serving_size?: string | null
          servings?: number
          protein?: number
          carbs?: number
          fat?: number
          calories?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
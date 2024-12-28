/*
  # Initial Schema for Calorie Tracker

  1. New Tables
    - users_settings
      - Stores user preferences and nutritional goals
    - meal_entries
      - Stores daily meal logs
    - foods
      - Stores food items with nutritional information

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Users Settings Table
CREATE TABLE IF NOT EXISTS users_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  daily_calorie_goal integer NOT NULL DEFAULT 2000,
  protein_target integer NOT NULL DEFAULT 150,
  carbs_target integer NOT NULL DEFAULT 250,
  fat_target integer NOT NULL DEFAULT 70,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Meal Entries Table
CREATE TABLE IF NOT EXISTS meal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL CHECK (type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Foods Table
CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_entry_id uuid REFERENCES meal_entries ON DELETE CASCADE,
  name text NOT NULL,
  serving_size numeric NOT NULL,
  serving_unit text NOT NULL,
  number_of_servings numeric NOT NULL DEFAULT 1,
  fat numeric NOT NULL,
  protein numeric NOT NULL,
  carbs numeric NOT NULL,
  calories numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Users Settings Policies
CREATE POLICY "Users can view own settings"
  ON users_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON users_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON users_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Meal Entries Policies
CREATE POLICY "Users can view own meal entries"
  ON meal_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal entries"
  ON meal_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal entries"
  ON meal_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal entries"
  ON meal_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Foods Policies
CREATE POLICY "Users can view foods from their meal entries"
  ON foods FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meal_entries
      WHERE meal_entries.id = foods.meal_entry_id
      AND meal_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert foods to their meal entries"
  ON foods FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_entries
      WHERE meal_entries.id = meal_entry_id
      AND meal_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update foods in their meal entries"
  ON foods FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meal_entries
      WHERE meal_entries.id = foods.meal_entry_id
      AND meal_entries.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_entries
      WHERE meal_entries.id = meal_entry_id
      AND meal_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete foods from their meal entries"
  ON foods FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meal_entries
      WHERE meal_entries.id = foods.meal_entry_id
      AND meal_entries.user_id = auth.uid()
    )
  );

-- Add real-time publication for key tables
CREATE PUBLICATION meal_tracker_publication 
FOR TABLE meal_entries, foods, users_settings;

-- Function to get daily nutrition summary
CREATE OR REPLACE FUNCTION get_daily_nutrition_summary(
  target_user_id uuid, 
  target_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  total_calories numeric,
  total_protein numeric,
  total_carbs numeric,
  total_fat numeric,
  daily_calorie_goal integer,
  protein_target integer,
  carbs_target integer,
  fat_target integer
) AS $$
BEGIN
  RETURN QUERY
  WITH nutrition_totals AS (
    SELECT 
      COALESCE(SUM(f.calories), 0) as total_calories,
      COALESCE(SUM(f.protein), 0) as total_protein,
      COALESCE(SUM(f.carbs), 0) as total_carbs,
      COALESCE(SUM(f.fat), 0) as total_fat
    FROM meal_entries me
    JOIN foods f ON f.meal_entry_id = me.id
    WHERE me.user_id = target_user_id AND me.date = target_date
  )
  SELECT 
    nt.total_calories,
    nt.total_protein,
    nt.total_carbs,
    nt.total_fat,
    us.daily_calorie_goal,
    us.protein_target,
    us.carbs_target,
    us.fat_target
  FROM nutrition_totals nt, users_settings us
  WHERE us.user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track query performance
CREATE OR REPLACE FUNCTION log_query_performance(
  query_name text, 
  execution_time interval
)
RETURNS void AS $$
BEGIN
  INSERT INTO query_performance_logs 
  (query_name, execution_time, logged_at)
  VALUES 
  (query_name, execution_time, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
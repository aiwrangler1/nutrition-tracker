-- Create Users table (extends Supabase auth.users)
create table public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create UserGoals table
create table public.user_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  daily_calorie_goal integer not null,
  daily_protein_goal integer not null,
  daily_carb_goal integer not null,
  daily_fat_goal integer not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Meals table
create table public.meals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  date date not null,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snacks')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create MealEntries table
create table public.meal_entries (
  id uuid default uuid_generate_v4() primary key,
  meal_id uuid references public.meals(id) on delete cascade not null,
  food_name text not null,
  serving_size text,
  servings numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  calories numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index idx_meals_user_date on public.meals(user_id, date);
create index idx_meal_entries_meal on public.meal_entries(meal_id);
create index idx_user_goals_user on public.user_goals(user_id);

-- Set up Row Level Security (RLS)
alter table public.user_profiles enable row level security;
alter table public.user_goals enable row level security;
alter table public.meals enable row level security;
alter table public.meal_entries enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Users can view own goals"
  on public.user_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.user_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.user_goals for update
  using (auth.uid() = user_id);

create policy "Users can view own meals"
  on public.meals for select
  using (auth.uid() = user_id);

create policy "Users can insert own meals"
  on public.meals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own meals"
  on public.meals for update
  using (auth.uid() = user_id);

create policy "Users can delete own meals"
  on public.meals for delete
  using (auth.uid() = user_id);

create policy "Users can view own meal entries"
  on public.meal_entries for select
  using (exists (
    select 1 from public.meals
    where meals.id = meal_entries.meal_id
    and meals.user_id = auth.uid()
  ));

create policy "Users can insert own meal entries"
  on public.meal_entries for insert
  with check (exists (
    select 1 from public.meals
    where meals.id = meal_entries.meal_id
    and meals.user_id = auth.uid()
  ));

create policy "Users can update own meal entries"
  on public.meal_entries for update
  using (exists (
    select 1 from public.meals
    where meals.id = meal_entries.meal_id
    and meals.user_id = auth.uid()
  ));

create policy "Users can delete own meal entries"
  on public.meal_entries for delete
  using (exists (
    select 1 from public.meals
    where meals.id = meal_entries.meal_id
    and meals.user_id = auth.uid()
  ));

-- Create triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_goals_updated_at
  before update on public.user_goals
  for each row
  execute procedure public.handle_updated_at(); 
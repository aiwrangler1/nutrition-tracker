# Nutrition Tracker Development Plan

## Project Overview

We're building a web application that allows users to:
1. Log daily meals under Breakfast, Lunch, Dinner, or Snacks categories.
2. Track macros (protein, carbs, fat) and calculate total calories from them automatically.
3. Visualize daily consumption against user-defined goals (via a dashboard).
4. Access a settings page to configure personal calorie and macro targets.

## Tech Stack

- Next.js (React-based framework for server rendering + routing)
- Ant Design for pre-styled, responsive UI components
- Node.js runtime (included by default in Next.js)
- Supabase for database storage and user authentication
- Simple hosting via GitHub and Render.com

## Data Model

### Users
- id (UUID, PK)
- email (string)
- password_hash (handled by Supabase's built-in auth)
- created_at (timestamp)

### UserGoals
- id (UUID, PK)
- user_id (FK references Users.id)
- daily_calorie_goal (int)
- daily_protein_goal (int)
- daily_carb_goal (int)
- daily_fat_goal (int)
- updated_at (timestamp)

### Meals
- id (UUID, PK)
- user_id (FK references Users.id)
- date (date)
- meal_type (string/enum [breakfast, lunch, dinner, snacks])

### MealEntries
- id (UUID, PK)
- meal_id (FK references Meals.id)
- food_name (string)
- serving_size (numeric/string)
- servings (numeric)
- protein (float)
- carbs (float)
- fat (float)
- calories (float)

## Implementation Status

### 1. Project Setup ✅
- Migrated from Vite to Next.js
- Set up Ant Design with responsive layout
- Configured Supabase client
- Created project structure following Next.js 13+ conventions
- Cleaned up unnecessary files and directories
- Updated all configurations (TypeScript, ESLint)

### 2. Authentication ✅
- ✅ Created comprehensive AuthContext and AuthProvider
  - Manages user authentication state
  - Handles sign-in, sign-up, sign-out flows
  - Provides loading state management
- ✅ Implemented login functionality with error handling
- ✅ Added authentication guard (withAuth HOC)
  - Protects routes
  - Handles unauthenticated user redirects
- ✅ Created protected routes mechanism
- ✅ Added robust loading states and error handling
- ✅ Implemented password reset functionality
- ✅ Implemented sign-up functionality
- ✅ Added email verification flow
  - Resend verification email
  - Check email verification status
- ✅ Implemented comprehensive error handling
  - Centralized logging
  - User-friendly error messages
  - Error code translation

### Authentication Improvements ✅
- ✅ Enhanced error handling with descriptive user feedback
- ✅ Implemented comprehensive email verification flow
- ❌ OAuth provider integration (Deferred)
- ✅ Created granular authentication state management
- 🚧 Future: Integrate advanced monitoring service

### Next Authentication Enhancements ✅
1. Error Handling ✅
   - ✅ Developed user-friendly error messages
   - ✅ Created centralized error handling mechanism
   - ✅ Added comprehensive authentication event logging

2. Email Verification ✅
   - ✅ Implemented email verification process
   - ✅ Added resend verification email functionality
   - ✅ Created verification status tracking

### Future Authentication Improvements
- Integrate third-party monitoring service
- Implement OAuth provider authentication
- Add multi-factor authentication support

### 3. Dashboard ✅
- ✅ Created responsive dashboard layout
- ✅ Implemented calorie progress circle
- ✅ Added macronutrient progress bars
- ✅ Created meal list with edit functionality
- ✅ Added loading states
- ✅ Implemented Supabase data fetching

### 4. Settings Page ✅
- ✅ Created user goals configuration form
- ✅ Added input validation
- ✅ Created loading states
- ✅ Implemented data persistence
- ✅ Added form submission handling

### 5. Food Diary ✅
- ✅ Created responsive food diary table
- ✅ Added meal type categorization
- ✅ Implemented daily totals summary
- ✅ Added date picker for navigation
- ✅ Created edit/delete actions
- ✅ Implemented data persistence with Supabase
- ✅ Added comprehensive meal entry modal
- ✅ Implemented error handling for meal operations

### 6. Deployment 🚧
- Configured Render Web Service
- Set up GitHub Actions workflow
- Added environment variables
- TODO: Set up preview environments
- TODO: Configure health checks

## Next Steps

1. Complete Authentication Flow
   - Implement sign-up functionality
   - Add password reset flow
   - Create email verification
   - Add OAuth providers

2. Data Integration
   - Implement Supabase data fetching
   - Add data persistence
   - Set up real-time updates
   - Add error handling

3. Feature Completion
   - Create meal entry modal
   - Implement edit/delete functionality
   - Add date-based filtering
   - Complete settings persistence

4. Testing & Optimization
   - Set up testing infrastructure
   - Add error boundaries
   - Optimize performance
   - Implement monitoring

## Future Enhancements
- Data Export: CSV or PDF exports of daily logs
- Charts: Weekly or monthly intake trends
- Additional Integrations: Barcode scanner, public nutrition databases
- Push Notifications: Reminders to log meals

## Project Structure Guidelines

### Directory Structure
```
my-meal-logger/
├─ pages/
│  ├─ api/                       # Serverless functions
│  │  └─ auth/
│  │      └─ [...supabase].js    # Custom Supabase auth routes
│  ├─ meals.js                   # API for handling meal data
│  ├─ _app.js                    # Global wrapper for styles and Ant Design
│  ├─ index.js                   # Landing/sign-in screen
│  ├─ dashboard.js               # Dashboard view with meal logs and progress
│  └─ settings.js                # Goals configuration page
├─ components/
│  ├─ Layout.js                  # Global wrapper structure
│  ├─ NavBar.js                  # Reusable navigation component
│  ├─ MealForm.js                # Meal entry form
│  └─ MacrosChart.js             # Macro tracking visualization
├─ lib/
│  └─ supabaseClient.js          # Supabase client initialization
├─ styles/
│  └─ globals.css                # Global application styles
├─ .env.local                    # Local environment variables
├─ package.json                  # Project dependencies and scripts
└─ README.md                     # Project documentation
```

### Folder Management Guidelines
1. Strict Folder Structure
   - No custom subfolders in `/components/`, `/pages/`, or `lib/`
   - Only add folders for core functionality or new reusable components
   - Minimize file count in each directory

2. Component Creation Rules
   - Components must be truly reusable
   - Avoid creating components for single-use scenarios
   - Keep component logic minimal and focused

3. File Addition Policy
   - Any new files must align with core project functionality
   - Require explicit approval before adding
   - Maintain clean, purposeful codebase

4. Naming Conventions
   - Use clear, descriptive names
   - Follow camelCase for JavaScript/TypeScript files
   - Use PascalCase for React component files

### Enforcement
- Regular code reviews to maintain structure
- Automated linting and structure checks
- Immediate removal of unnecessary files
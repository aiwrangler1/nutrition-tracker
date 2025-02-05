# Macro Tracker PWA – Product Requirements Document (PRD)

## Overview
**Product Name**: Macro Tracker PWA  
**Purpose**: A personal, mobile-first Progressive Web App designed to log meals and track macronutrient intake. Initially built for single-user use with the future potential to expand into a multi-user system, including social logins and advanced food integrations.

## Key Features
1. **Meal Logging & Food Entry**
   - **Manual Entry**: Input food details manually (name, serving size, protein, carbs, fats).
   - **Calorie Calculation**: Automatically calculate calories using the formula:  
     `calories = (protein * 4) + (carbs * 4) + (fat * 9)`.
   - **Extensibility**: The architecture is prepared for future integration with food databases or barcode scanning.

2. **Dynamic Progress Indicators**
   - **Real-Time Visualizations**: Display progress using charts and progress bars to compare logged intake with personal macro targets.
   - **Daily Summaries**: Overview of daily macronutrient consumption against targets.

3. **Analytics & Trend Analysis**
   - **Historical Data**: Present trends over time with visualizations (e.g., pie charts for macro distribution, line graphs for calorie trends).
   - **Filtering Options**: Basic filtering to dive into specific timeframes or macro metrics.

4. **Settings & Customization**
   - **Macro Goals**: Configure and update daily macro targets (protein, carbs, fat).
   - **User Preferences**: Manage notification settings and other customizations.

5. **Mobile-First PWA with Offline Support**
   - **Responsive UI**: Built with a mobile-first design using Tailwind CSS.
   - **Offline Functionality**: Minimal offline capabilities using next-pwa, ensuring meal and food entry can occur without an active internet connection.

6. **Future Scalability**
   - **Multi-User Expansion**: Modular architecture to support multiple users and social login integration in future iterations.
   - **Advanced Features**: Prepared to add functionalities such as barcode scanning, third-party food API integration, and trainer-client meal program management.

## Technical Stack
- **Frontend**: Next.js with Tailwind CSS
- **Backend**: Supabase (PostgreSQL, authentication, real-time features)
- **Offline/PWA**: next-pwa integration for offline support
- **Charting**: Chart.js or Recharts for data visualizations

## Milestones
1. **Phase 1 – MVP (4-6 Weeks)**
   - Set up the Next.js project with Tailwind CSS.
   - Implement basic meal logging and food entry with auto-calculation of calories.
   - Create a dashboard to display macronutrient progress.
   - Integrate next-pwa for offline capabilities.
2. **Phase 2 – Enhanced Analytics & Settings (4 Weeks)**
   - Develop analytics pages with historical trend visualizations.
   - Build a settings page for personal customization.
   - Enhance offline functionality based on initial feedback.
3. **Phase 3 – Future-Proofing & Scalability (2-3 Weeks)**
   - Refactor code to support multi-user scenarios.
   - Lay groundwork for advanced features (barcode scanning, food API integration).

## Success Metrics
- **Usage**: Frequency of meal logging and food entry.
- **Performance**: Responsiveness of the UI and offline functionality.
- **User Satisfaction**: Ease of use and successful tracking of macronutrient goals.
/my-macro-tracker-app
├── public/                    # Static assets and PWA manifest files
│   ├── icons/                 # App icons for PWA
│   └── manifest.json          # PWA manifest
├── src/
│   ├── app/                   # Next.js App Directory (if using Next.js 13+ App Router)
│   │   ├── layout.tsx         # Global layout
│   │   ├── page.tsx           # Home/dashboard page
│   │   ├── meals/             # Pages for meal logging and food entry
│   │   │   └── page.tsx       # Meal logging page
│   │   ├── analytics/         # Analytics and trends
│   │   │   └── page.tsx       # Analytics page
│   │   └── settings/          # Settings and customization
│   │       └── page.tsx       # Settings page
│   ├── components/            # Reusable UI components
│   │   ├── Navigation.tsx     
│   │   ├── MealEntryForm.tsx  # Form for entering meals and foods
│   │   ├── FoodEntryForm.tsx  # Form for entering new food items
│   │   ├── ProgressBar.tsx    
│   │   └── Chart.tsx          # Chart component for analytics
│   ├── hooks/                 # Custom React hooks (e.g., useOffline, useMealData)
│   ├── services/              # Modules for API calls & Supabase interactions
│   │   ├── supabaseClient.ts  # Supabase client configuration
│   │   ├── foodService.ts     # CRUD operations for food items
│   │   └── mealService.ts     # CRUD operations for meals
│   ├── styles/                # Tailwind CSS configuration and custom styles
│   ├── utils/                 # Utility functions (e.g., calorie calculations)
│   └── types/                 # TypeScript types/interfaces (if using TypeScript)
├── .github/                   # GitHub Actions workflows for CI/CD
├── .env.local                 # Environment variables (Supabase keys, etc.)
├── next.config.js             # Next.js configuration (including next-pwa settings)
├── package.json               # NPM package manifest
└── README.md                  # Project overview and developer documentation
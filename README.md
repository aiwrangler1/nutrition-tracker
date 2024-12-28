# Nutrition Tracker

A modern web application for tracking nutrition, macros, and health goals with real-time updates.

## Features

- Real-time nutrition tracking
- Customizable macro goals
- Meal planning and logging
- Progress visualization
- Data export capabilities
- Responsive design

## Tech Stack

- Frontend: React + Vite + TypeScript
- Backend: Supabase (Auth, Database, Real-time)
- Styling: TailwindCSS
- Charts: Chart.js
- Error Tracking: Sentry
- CI/CD: GitHub Actions

## Initial Setup

1. Create a new Supabase project at https://supabase.com

2. Clone the repository:
```bash
git clone https://github.com/yourusername/nutrition-tracker.git
cd nutrition-tracker
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Add your Supabase URL and anon key to .env
```

5. Start development server:
```bash
npm run dev
```

## Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_API_URL`: API URL (if needed for external services)
- `SENTRY_DSN`: Sentry error tracking URL

## GitHub Setup

1. Create a new repository on GitHub
2. Initialize and push your local repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/nutrition-tracker.git
git push -u origin main
```

3. Create a develop branch:
```bash
git checkout -b develop
git push -u origin develop
```

4. Add GitHub repository secrets:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SENTRY_DSN

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm test`: Run tests
- `npm run preview`: Preview production build

## Project Structure

```
nutrition-tracker/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/        # Page components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   ├── types/        # TypeScript types
│   └── api/          # Supabase client and queries
├── public/           # Static assets
└── docs/            # Documentation
```

## Database Schema

Managed through Supabase dashboard:
- Users (handled by Supabase Auth)
- Meals
- Foods
- UserSettings
- NutritionGoals

## Testing

- Unit tests: React Testing Library
- Integration tests: Cypress
- Run tests: `npm test`

## Deployment

Automated deployment via GitHub Actions:
1. Push to `main` branch
2. CI/CD pipeline runs tests
3. Builds and deploys to production

## License

MIT 
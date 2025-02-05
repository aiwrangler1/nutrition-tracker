# Macro Tracker PWA

A Progressive Web App for tracking daily macronutrient intake and monitoring nutrition goals. Built with Next.js, Tailwind CSS, and Supabase.

## Features

- 📱 Mobile-first Progressive Web App
- 🍽️ Manual meal and food logging
- 📊 Real-time macro tracking
- 📈 Analytics and trend visualization
- ⚡ Offline support
- 🎯 Customizable macro goals

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Chart.js with react-chartjs-2
- **PWA**: next-pwa
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9.x or later
- A Supabase account and project

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Database Setup

1. Set up your Supabase project
2. Run the database migrations:
   ```bash
   npm run db:migrate
   ```
3. (Optional) Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

## Development

### Project Structure

```
/my-macro-tracker-app
├── public/                # Static assets and PWA manifest
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and database services
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── supabase/            # Supabase configurations
└── ...config files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

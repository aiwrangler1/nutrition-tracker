# Nutrition Tracker

A modern web application for tracking daily nutrition and macronutrients, built with Next.js, Ant Design, and Supabase.

## Features

- Track daily meals and macronutrients
- Visualize nutrition goals and progress
- Mobile-friendly responsive design
- Real-time data synchronization
- Secure user authentication

## Tech Stack

- **Frontend**: Next.js 14, React 18, Ant Design
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Render
- **Language**: TypeScript
- **Testing**: Coming soon

## Project Structure

```
nutrition-tracker/
├── app/                    # Next.js 13+ App Router
│   ├── dashboard/         # Dashboard page
│   ├── diary/            # Food diary page
│   ├── settings/         # User settings page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable components
├── lib/                   # Utility functions and configs
│   └── supabaseClient.ts # Supabase client setup
├── public/               # Static assets
├── styles/               # Global styles
├── supabase/             # Supabase configurations
│   └── migrations/      # Database migrations
└── types/                # TypeScript type definitions
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nutrition-tracker.git
   cd nutrition-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase and Render credentials.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The application is automatically deployed to Render through GitHub Actions when changes are pushed to the main branch. The deployment process:

1. Builds the Next.js application
2. Runs tests and type checking
3. Deploys to Render using the Render Deploy Action

To set up deployment:

1. Create a new Web Service on Render
2. Add your repository to Render
3. Configure the following environment variables in GitHub Actions:
   - `RENDER_API_KEY`: Your Render API key
   - `RENDER_SERVICE_ID`: Your Render service ID
4. Configure the following environment variables in Render:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
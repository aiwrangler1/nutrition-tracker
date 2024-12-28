# Backend Architecture

## Database Schema
- Users managed via Supabase Auth
- Custom tables: users_settings, meal_entries, foods
- Row Level Security implemented

## Key Database Functions
- `get_daily_nutrition_summary()`: Retrieve daily nutrition totals
- `log_query_performance()`: Track query execution times

## Authentication
- Supabase Auth with OAuth support
- Role-based access controls

## Performance Considerations
- Indexed tables
- Real-time publication configured
- Query performance logging

## Migration Strategy
- Incremental schema updates
- Backward compatibility maintained
- Automated backup procedures 
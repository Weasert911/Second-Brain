# Supabase-Expert References

## Official Documentation

- **Supabase Docs**: https://supabase.com/docs - Complete documentation for all Supabase features
- **Database Docs**: https://supabase.com/docs/guides/database - Tables, views, functions, triggers, migrations
- **Auth Docs**: https://supabase.com/docs/guides/auth - Authentication with email, OAuth, magic link, SSO
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security - RLS policies, best practices
- **Realtime Docs**: https://supabase.com/docs/guides/realtime - Broadcast, presence, postgres changes
- **Storage Docs**: https://supabase.com/docs/guides/storage - Buckets, policies, image optimization
- **Edge Functions**: https://supabase.com/docs/guides/functions - Deno-based serverless functions
- **CLI Docs**: https://supabase.com/docs/guides/cli - Local development, migrations, project management
- **Client SDK**: https://supabase.com/docs/reference/javascript/start - JS/TS client API reference
- **Production Checklist**: https://supabase.com/docs/guides/platform/going-into-production

## Terminology

1. **Project**: Supabase instance with database, auth, storage, and edge functions
2. **Row Level Security (RLS)**: Database-level access control that restricts row visibility
3. **Policy**: SQL expression that determines which rows a user can access
4. **auth.uid()**: Function returning the authenticated user's ID
5. **Auth Hook**: Webhook that triggers after auth events (signup, login)
6. **Bucket**: Container for file storage with configurable security policies
7. **Realtime Channel**: WebSocket channel for real-time data synchronization
8. **Presence**: Real-time tracking of online users in a channel
9. **Broadcast**: Send messages to all channel subscribers
10. **Postgres Changes**: Real-time streaming of database insert/update/delete events
11. **Edge Function**: Serverless function running on Deno at the edge
12. **Service Role Key**: Secret key with full database access (never use on client)
13. **Anon Key**: Public key for client-side access (limited by RLS policies)
14. **MFA**: Multi-Factor Authentication for additional login security
15. **Supabase CLI**: Command-line tool for local development and project management

## Architecture Notes

- Supabase is a collection of open-source tools: PostgreSQL, GoTrue (auth), Realtime, Storage, Deno
- RLS is applied at the database level; all data access goes through PostgreSQL
- Client SDK uses anon key + JWT token; RLS determines what data is accessible
- Realtime uses PostgreSQL logical replication (WAL) to stream changes
- Edge Functions run on Deno Deploy globally at the edge
- Storage uses S3-compatible storage with PostgreSQL for metadata and RLS
- Local development uses Docker to run all Supabase services locally
- Migrations track schema changes in version-controlled SQL files

## Key APIs

- `supabase.from('table').select('*')` - Query data with RLS applied
- `supabase.auth.signUp({ email, password })` - Register new user
- `supabase.auth.signInWithPassword({ email, password })` - Login
- `supabase.auth.signInWithOAuth({ provider: 'google' })` - OAuth login
- `supabase.auth.getSession()` - Get current session
- `supabase.auth.onAuthStateChange((event, session) => {})` - Listen for auth changes
- `supabase.channel('room-1').subscribe()` - Subscribe to realtime channel
- `supabase.storage.from('bucket').upload('path', file)` - Upload file
- `supabase.storage.from('bucket').getPublicUrl('path')` - Get public URL
- `supabase.functions.invoke('function-name', { body })` - Call edge function

## Conventions

- **Table naming**: snake_case, plural (users, posts, order_items)
- **Column naming**: snake_case (created_at, first_name, is_active)
- **RLS policy naming**: `{operation}_{table}_{description}` (select_users_for_self, insert_posts_as_authenticated)
- **Bucket naming**: kebab-case (user-avatars, product-images)
- **Edge Function naming**: kebab-case (send-email, process-payment)
- **Migration naming**: timestamp_descriptive_name (20240101000000_add_users_table)
- **Environment variables**: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

## Project Structure Recommendation

```
my-supabase-app/
  supabase/
    config.toml          # Local Supabase configuration
    migrations/          # Database migration files
    seed.sql             # Seed data
    functions/           # Edge Functions
      hello-world/
        index.ts
      send-email/
        index.ts
  src/
    lib/
      supabase.ts        # Supabase client initialization
      supabase-server.ts # Server-side client with service_role
    hooks/
      useAuth.ts         # Auth hooks
      useRealtime.ts     # Realtime subscription hooks
    components/
      AuthGuard.tsx      # Protected route component
    utils/
      rlsHelpers.ts      # RLS helper functions
  supabase.ts            # Client entry point
```

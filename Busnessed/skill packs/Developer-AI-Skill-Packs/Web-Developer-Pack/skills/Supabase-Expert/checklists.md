# Supabase-Expert Checklists

## Pre-Flight Checklist

- [ ] Supabase project created (dashboard or CLI)
- [ ] Local development environment set up (supabase init, supabase start)
- [ ] Environment variables configured (SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] TypeScript types generated from schema (supabase gen types)
- [ ] Client SDK installed (@supabase/supabase-js)
- [ ] Auth providers configured in dashboard (email, OAuth, magic link)
- [ ] Redirect URLs configured for auth callbacks
- [ ] Production security settings reviewed (RLS, service key protection)
- [ ] Spending limits set on project
- [ ] Backup schedule configured

## Implementation Checklist

- [ ] RLS enabled on all tables with appropriate policies
- [ ] RLS policies have separate policies for SELECT, INSERT, UPDATE, DELETE
- [ ] auth.uid() used for user-specific row filtering
- [ ] Storage bucket policies restrict access appropriately
- [ ] Auth session handled with onAuthStateChange listener
- [ ] Auth token refresh handled automatically
- [ ] Real-time subscriptions have filters to limit data flow
- [ ] Real-time subscriptions cleaned up on component unmount
- [ ] Edge Functions have CORS headers and error handling
- [ ] Database functions use SECURITY DEFINER where appropriate
- [ ] Migrations version-controlled and run through CLI
- [ ] Client-side code uses anon key (not service_role key)
- [ ] Service role key used only in server-side/Edge Functions
- [ ] Proper error handling for all Supabase API calls
- [ ] Row-level security tested with anon, authenticated, and admin roles

## Testing Checklist

- [ ] Auth flows tested: signup, login, logout, password reset, OAuth
- [ ] RLS policies tested: user sees own data only, cannot access others'
- [ ] RLS policies tested with unauthenticated requests (anon)
- [ ] Storage tested: upload, download, delete, public URL
- [ ] Realtime tested: insert, update, delete events received
- [ ] Realtime tested with RLS: only authorized data received
- [ ] Edge Functions tested: HTTP requests, auth context, error cases
- [ ] Database functions tested: input validation, output format, edge cases
- [ ] Migrations tested: up and down applied successfully
- [ ] Concurrent access tested: multiple users, simultaneous writes
- [ ] Rate limiting tested: auth endpoints, API calls
- [ ] Session persistence tested: page refresh, browser close/reopen
- [ ] Error states tested: network failure, invalid data, expired session

## Release Checklist

- [ ] All RLS policies verified with security audit
- [ ] Service role key not exposed in client-side code
- [ ] Auth providers configured with production OAuth credentials
- [ ] Redirect URLs updated for production domain
- [ ] Storage bucket policies correct for production data
- [ ] Edge Functions deployed with proper secrets
- [ ] Migrations applied to production database
- [ ] Backup schedule confirmed
- [ ] Point-in-time recovery configured (if needed)
- [ ] Monitoring configured (error tracking, usage alerts)
- [ ] CORS configured for production domain
- [ ] Rate limits appropriate for expected traffic
- [ ] SSL enforced (Supabase default)
- [ ] Changelog updated with changes

## Maintenance Checklist

- [ ] Auth providers reviewed for availability
- [ ] RLS policies reviewed for new features
- [ ] Storage usage monitored
- [ ] Database performance reviewed (slow queries, indexes)
- [ ] Real-time connection count monitored
- [ ] Edge Function invocation counts and errors reviewed
- [ ] Dependencies updated (client SDK, CLI)
- [ ] Migration history reviewed for cleanup opportunities
- [ ] Backup restore tested quarterly
- [ ] Security advisories monitored
- [ ] Spending reviews conducted monthly
- [ ] Schema documentation updated for changes

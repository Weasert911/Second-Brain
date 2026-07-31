---
name: "Supabase-Expert"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when building applications with Supabase for database, authentication, real-time features, storage, or edge functions"
purpose: "Provides comprehensive guidance for building full-stack applications with Supabase including PostgreSQL, Row Level Security, real-time, authentication, storage, and edge functions"
---

## Capabilities

1. Set up Supabase projects via dashboard and CLI with proper configuration
2. Design PostgreSQL schemas using Supabase SQL editor and migrations
3. Implement Row Level Security policies for multi-tenant and user-scoped data access
4. Configure real-time subscriptions for broadcast, presence, and postgres changes
5. Implement authentication with email/password, magic links, OAuth providers, and SSO
6. Manage storage buckets with security policies and file management
7. Develop and deploy Edge Functions with Deno for custom server-side logic
8. Create database functions and triggers for server-side data processing
9. Manage database migrations with Supabase CLI (db diff, db push, db pull)
10. Integrate Supabase client SDK (JS/TS) with proper session management
11. Set up local development environment with Supabase CLI
12. Implement production-ready security with RLS, auth helpers, and proper session handling
13. Configure backup and restore with Supabase dashboard and CLI
14. Apply Row Level Security best practices for multi-tenant applications

## Limitations

1. Cannot replace deep PostgreSQL expertise for complex query optimization
2. Edge Functions have Deno runtime limitations (no Node.js APIs)
3. Self-hosting Supabase requires significantly more infrastructure knowledge
4. Does not cover Supabase Realtime Presence and Broadcast advanced patterns in depth
5. Large-scale migration from other backends (Firebase, custom) requires manual effort
6. Does not cover Supabase Vector (pgvector) for AI/ML features

## Required Tools

- Supabase CLI for local development
- Supabase JavaScript/TypeScript client SDK
- PostgreSQL client (psql)
- Deno for Edge Function development
- Supabase Dashboard for project management
- GitHub for migrations versioning

## Execution Workflow

1. Create Supabase project via dashboard or CLI
2. Set up local development with `supabase init` and `supabase start`
3. Design database schema with proper tables, relations, and constraints
4. Enable Row Level Security on all tables and create policies
5. Set up authentication providers (email, OAuth, magic link)
6. Create storage buckets with security policies for file uploads
7. Subscribe to real-time changes for live-updating features
8. Write Edge Functions for custom API endpoints and webhooks
9. Create database functions and triggers for server-side processing
10. Configure client SDK with proper session handling and auth helpers
11. Test RLS policies with different user roles
12. Write and run database migrations with CLI
13. Set up production environment with proper security and scaling
14. Configure backup schedule and restore procedure
15. Monitor project with Supabase Dashboard analytics

## Decision Tree

1. **Auth provider?** → Email/Password → Built-in Supabase auth → OAuth (Google, GitHub) → Built-in providers → Magic link → Supabase auth (anon) → SSO → SAML/OIDC enterprise
2. **Data access pattern?** → User-specific → RLS with auth.uid() → Multi-tenant → RLS with tenant_id → Public read → RLS with true/false → Admin-only → RLS with custom claim
3. **Real-time need?** → Live data changes → Postgres Changes → User presence → Presence channel → Broadcast messages → Broadcast channel → All three → Realtime channel with all types
4. **File storage?** → Public files → Public bucket → User files → Private bucket with RLS → Profile images → Avatar bucket with resize → Sensitive docs → RLS + server-side access
5. **Server-side logic?** → Simple DB logic → Database functions → HTTP endpoint → Edge Functions → Scheduled tasks → Edge Functions + cron → Webhook handler → Edge Functions with HTTP trigger
6. **Development approach?** → Quick start → Dashboard SQL editor → Version controlled → Supabase CLI + migrations → Team project → CLI + branching → Existing project → db pull then migrations
7. **Production readiness?** → Basic → Default settings → High traffic → Connection pooling + PgBouncer → Enterprise → Multi-region → Compliance → Audit logging + encryption

## Review Checklist

- [ ] Row Level Security enabled on all tables
- [ ] RLS policies tested with anon, authenticated, and service_role keys
- [ ] Auth configured with appropriate providers and redirect URLs
- [ ] Storage bucket policies restrict access to authorized users
- [ ] Real-time subscriptions have proper filters to limit data flow
- [ ] Edge Functions have CORS headers and proper error handling
- [ ] Database functions are SECURITY DEFINER or INVOKER as appropriate
- [ ] Migrations version-controlled and reversible
- [ ] Client SDK uses proper session management (refresh, retry)
- [ ] Environment variables for Supabase URL and anon key
- [ ] RLS policies avoid using service_role key from client
- [ ] Rate limiting considered for auth endpoints
- [ ] Backup configuration verified
- [ ] Local development matches production schema

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| RLS policy returns empty | Policy too restrictive or incorrect | Test with `select * from table` bypassing RLS; check auth.uid() |
| Auth session not persisting | Missing session handling | Use supabase.auth.getSession() on app load; implement refresh |
| Realtime not receiving changes | Missing subscription or RLS | Verify subscription filter; check RLS allows read for the user |
| Storage upload fails | RLS policy blocking upload | Check bucket RLS policy for INSERT; verify user is authenticated |
| Edge Function timeout | Function takes too long | Optimize code; increase timeout; use background processing |
| Migration conflict | Branch schema divergence | Use `supabase db diff` to detect; resolve manually |
| CORS error with Edge Function | Missing CORS headers | Add CORS headers to function response |
| Rate limited by auth | Too many requests | Implement exponential backoff; reduce auth requests |
| Supabase CLI not connecting | Docker not running | Start Docker Desktop; run `supabase start` |
| Database connection pool full | Too many connections | Enable PgBouncer connection pooling in project settings |

## Best Practices

1. Enable RLS on all tables from the start; never use service_role key on client
2. Use auth.uid() in RLS policies for user-specific row filtering
3. Create separate policies for SELECT, INSERT, UPDATE, DELETE operations
4. Use database functions for complex RLS logic instead of inline policies
5. Implement proper session handling with onAuthStateChange listener
6. Use real-time subscriptions sparingly; add filters to limit data flow
7. Use storage RLS policies to restrict file access based on ownership
8. Handle auth errors gracefully with user-friendly messages
9. Use migrations for schema changes, not the dashboard SQL editor
10. Set up local development environment before modifying production
11. Use database functions for server-side validation and data processing
12. Monitor project usage and set spending limits
13. Implement proper error handling in Edge Functions
14. Use Supabase Vault for storing secrets

## Anti-Patterns

1. Using service_role key on client-side code
2. Disabling RLS because "it's easier" during development
3. Storing sensitive data in buckets without RLS
4. Creating overly complex RLS policies (keep them simple and tested)
5. Not handling auth session expiration
6. Using real-time subscriptions for data that rarely changes
7. Making database schema changes directly in production without migrations
8. Exposing service_role key in client-side environment variables
9. Ignoring CORS configuration for Edge Functions
10. Not setting up row-level security from the start (adding it later is harder)

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.

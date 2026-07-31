---
name: "Nextjs-Expert"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when building, optimizing, or debugging Next.js applications with App Router, Server Components, data fetching, or deployment"
purpose: "Provides comprehensive guidance for building production-ready Next.js applications using modern patterns including App Router, Server Components, ISR, middleware, and edge runtime"
---

## Capabilities

1. Design application architecture choosing between App Router and Pages Router with migration strategies
2. Implement Server Components and Client Components with proper boundary placement for optimal performance
3. Build route groups, parallel routes, intercepting routes, and modal patterns with the layout system
4. Create loading, error, and not-found boundaries at every route segment level
5. Implement data fetching patterns including server-side fetch, server actions, route handlers, and third-party API integration
6. Configure ISR (Incremental Static Regeneration), SSG (Static Site Generation), SSR (Server-Side Rendering), and streaming SSR
7. Deploy middleware for auth guards, redirects, rewrites, headers, cookies, and geolocation
8. Optimize images with next/image including remote patterns, blur placeholders, and responsive srcSet
9. Configure SEO with the Metadata API including Open Graph, Twitter cards, JSON-LD structured data, and sitemaps
10. Integrate authentication with NextAuth.js, middleware-based protection, and API route security
11. Build API route handlers with request validation, file uploads, streaming, and WebSocket support
12. Manage rewrites, redirects, headers, and i18n configuration in next.config.js

## Limitations

1. Does not cover full React Native or mobile development (separate skill)
2. Cannot replace domain knowledge of database design, authentication protocols, or third-party APIs
3. Self-hosted deployment configurations for specific cloud providers (AWS, Azure, GCP) may need adaptation
4. Does not include framework-specific testing strategies for Cypress or Playwright
5. Large-scale migration from Pages Router to App Router requires manual refactoring review
6. Edge runtime limitations (no Node.js APIs, no fs, limited crypto) require awareness

## Required Tools

- Node.js 18+ (LTS recommended)
- npm/pnpm/yarn
- Next.js 14+ (App Router)
- TypeScript strict mode
- ESLint with next/core-web-vitals
- Browser DevTools (Network, Performance, Application tabs)
- Vercel or similar hosting account for deployment
- next/image optimization ready (sharp for production)

## Execution Workflow

1. Determine application requirements (static vs dynamic, SEO needs, auth, real-time features)
2. Choose routing strategy (App Router for new projects, Pages Router for legacy migration)
3. Plan route hierarchy with layouts, route groups, and parallel routes
4. Decide Server Component vs Client Component boundaries based on interactivity needs
5. Implement data fetching with appropriate strategy (static, dynamic, ISR, streaming)
6. Set up loading.tsx, error.tsx, and not-found.tsx at each route segment
7. Configure next.config.js with image domains, rewrites, redirects, and headers
8. Implement middleware.ts for auth, redirects, and request manipulation
9. Set up metadata for SEO, Open Graph, and structured data
10. Add image and font optimization with next/image and next/font
11. Implement Server Actions for form handling and mutations
12. Configure API route handlers for third-party integration
13. Set up authentication with NextAuth.js or custom solution
14. Run linting, type checking, and build verification
15. Deploy and verify production behavior (ISR revalidation, caching headers)

## Decision Tree

1. **Routing approach?** → New project → App Router → Existing Pages Router → Migrate when feasible → Hybrid → Both routers coexisting
2. **Rendering strategy?** → Mostly static content → SSG/ISR → Dynamic user-specific → SSR/Streaming → Real-time data → Client-side fetch + SWR
3. **Data fetching?** → Server Component → Direct fetch/DB call → Client Component → Route Handler + fetch → Form submission → Server Action → Third-party webhook → API Route
4. **Auth requirement?** → Simple email/password → NextAuth.js credentials → OAuth providers → NextAuth.js providers → Custom JWT → Middleware + API routes → B2B SSO → Custom OIDC integration
5. **Performance optimization?** → Images → next/image + remotePatterns → Fonts → next/font → Bundle → dynamic imports + React.lazy → Caching → ISR + stale-while-revalidate
6. **SEO requirement?** → Basic → generateMetadata static → Dynamic pages → generateMetadata dynamic → Sitemap → app/sitemap.ts → Structured data → JSON-LD via script tag
7. **Real-time features?** → Server push → WebSocket/SSE via route handler → Polling → Server Action + revalidate → Live cursors → Server-Sent Events

## Review Checklist

- [ ] Server Components used by default; Client Components only with "use client" directive
- [ ] "use client" placed at the lowest possible level in the component tree
- [ ] Layouts properly nested and not unmounting on navigation
- [ ] loading.tsx provides skeleton/spinner for every route segment
- [ ] error.tsx handles errors gracefully with reset functionality
- [ ] not-found.tsx provides meaningful 404 user experience
- [ ] Metadata exported correctly from layout.tsx and page.tsx
- [ ] next/image uses correct width, height, and quality props
- [ ] next/font configured with proper subsets and display strategy
- [ ] Server Actions used with "use server" directive in dedicated actions file
- [ ] Route handlers use correct NextRequest/NextResponse types
- [ ] Middleware matcher configured to limit execution scope
- [ ] ISR revalidation period set appropriately for content freshness
- [ ] Environment variables prefixed with NEXT_PUBLIC_ for client-side access
- [ ] Scripts loaded with next/script using appropriate strategy
- [ ] Dynamic imports used for heavy client components

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Client Component not hydrating | Server HTML mismatch with client | Ensure useEffect not altering layout; use suppressHydrationWarning |
| 404 on dynamic route | Route segment not exported correctly | Check params type matches [param] folder name |
| ISR not revalidating | Wrong revalidate export or cache header | Set `export const revalidate = 3600` in page; check Cache-Control |
| Server Action not working | Missing "use server" directive | Add "use server" to the function or top of file |
| Image optimization failing | Sharp not installed in production | Add sharp as production dependency |
| Middleware not executing | Matcher pattern incorrect | Validate matcher regex in middleware.ts config |
| Layout remounting on navigation | Layout not in root of route group | Move shared layout to highest common route group level |
| API route returning 500 | Server-side error not caught | Wrap handler in try-catch; check server logs |
| Dynamic server usage error | Dynamic function used in static page | Add `export const dynamic = 'force-dynamic'` or use ISR |
| Metadata not generating | Incorrect metadata export | Use `generateMetadata` async function or `export const metadata` object |

## Best Practices

1. Start with Server Components and opt into Client Components only when interactivity is needed
2. Place "use client" boundaries as deep in the tree as possible
3. Use layout.tsx for persistent UI (navbars, sidebars, footers)
4. Export metadata from layout.tsx for shared meta tags; override in page.tsx
5. Use generateStaticParams for SSG with dynamic routes
6. Implement proper loading states with loading.tsx skeletons
7. Use error.tsx with error-boundary pattern for graceful degradation
8. Prefer Server Actions over API routes for form submissions within the app
9. Use middleware for auth checks, redirects, and A/B testing
10. Configure remotePatterns for external image sources in next.config.js
11. Use next/font with preload for critical fonts
12. Implement proper caching headers for ISR routes
13. Use Route Groups to organize routes without affecting URL structure
14. Prefer streaming for data-heavy pages to improve perceived performance

## Anti-Patterns

1. Making entire app client-side rendered (missing Server Component benefits)
2. Placing "use client" at top-level layout (defeats Server Component optimization)
3. Fetching the same data in Server and Client Components (duplicate requests)
4. Using getServerSideProps/getStaticProps in App Router (Pages Router API)
5. Overusing ISR with very short revalidation periods (defeats static caching)
6. Hardcoding API URLs instead of using relative URLs or environment variables
7. Nesting layouts without considering re-render implications
8. Using `<img>` instead of `<Image>` from next/image
9. Placing large dependencies in Server Components when only needed on client
10. Mutating data without revalidating affected routes

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.

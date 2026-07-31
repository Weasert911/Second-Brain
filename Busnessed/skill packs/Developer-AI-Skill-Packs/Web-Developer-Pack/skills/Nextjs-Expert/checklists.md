# Nextjs-Expert Checklists

## Pre-Flight Checklist

- [ ] Node.js 18+ (LTS) installed with compatible package manager
- [ ] Next.js project scaffolded with `create-next-app` using TypeScript and App Router
- [ ] ESLint configured with next/core-web-vitals and TypeScript rules
- [ ] TypeScript strict mode enabled in tsconfig.json
- [ ] Path aliases configured (@ -> src/*) in tsconfig.json and jsconfig.json
- [ ] next.config.ts/mjs configured with appropriate settings (images, rewrites, headers)
- [ ] Environment variables defined with proper NEXT_PUBLIC_ prefix for client variables
- [ ] sharp package installed for production image optimization
- [ ] Package.json scripts defined (dev, build, start, lint, type-check)
- [ ] Analytics tool chosen and environment variables set (Vercel Analytics, GA4, Plausible)
- [ ] Deployment platform selected (Vercel, Netlify, self-hosted)
- [ ] Custom error page (error.tsx) and 404 page (not-found.tsx) created at root level

## Implementation Checklist

- [ ] Root layout includes proper HTML and body tags with lang attribute
- [ ] Server Components used by default; "use client" added only where interactivity needed
- [ ] "use client" placed at the lowest possible component boundary
- [ ] Layouts properly nested and do not unmount on client-side navigation
- [ ] loading.tsx provides meaningful skeleton/spinner for every route segment
- [ ] error.tsx handles errors gracefully with accessible reset button
- [ ] not-found.tsx provides user-friendly 404 experience with navigation
- [ ] Metadata exported correctly from layout.tsx and page.tsx
- [ ] Dynamic metadata generated with generateMetadata async function
- [ ] next/image configured with remotePatterns for external image sources
- [ ] next/font configured with proper subsets and display swap
- [ ] Server Actions in dedicated files with "use server" at top
- [ ] Route handlers use proper NextRequest/NextResponse typed APIs
- [ ] Middleware matcher configured to limit execution to required paths
- [ ] Dynamic imports used for heavy client components (next/dynamic)
- [ ] Scripts loaded with next/script using appropriate strategy

## Testing Checklist

- [ ] Pages render without errors in both development and production builds
- [ ] Server Components return expected HTML (check with curl or browser DevTools)
- [ ] Client Components hydrate without console errors
- [ ] Loading states appear during data fetching (check network throttling)
- [ ] Error boundaries catch and display error messages correctly
- [ ] 404 pages render for non-existent dynamic routes
- [ ] Form submissions succeed with Server Actions and revalidation triggers
- [ ] Middleware performs auth checks and redirects correctly
- [ ] API route handlers return correct status codes and error shapes
- [ ] Image optimization works for both local and external images
- [ ] Open Graph images generate and display correctly on social platforms
- [ ] Sitemap generates all static and dynamic routes
- [ ] RSS feed (if implemented) validates with W3C feed validator
- [ ] Authentication flow end-to-end (login, protected route, logout)
- [ ] Build succeeds with no TypeScript errors, ESLint warnings

## Release Checklist

- [ ] Build passes: `npm run build` (no errors, no warnings)
- [ ] TypeScript compilation: `npx tsc --noEmit` (no errors)
- [ ] ESLint: `npm run lint` (no errors, no warnings)
- [ ] All environment variables set in deployment platform dashboard
- [ ] Remote patterns configured for all external image sources
- [ ] ISR revalidation values appropriate for content freshness needs
- [ ] Caching headers reviewed for API routes (stale-while-revalidate, CDN cache)
- [ ] Analytics events verified for page views and key interactions
- [ ] Performance tested with Lighthouse (target 90+ for all categories)
- [ ] Core Web Vitals checked (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Accessibility tested with axe DevTools (no critical violations)
- [ ] Mobile responsiveness verified across common viewport sizes
- [ ] Preview deployment tested with real data before production
- [ ] Rollback plan documented in case of deployment issues
- [ ] Changelog updated with release notes

## Maintenance Checklist

- [ ] Dependencies updated monthly (Next.js, React, third-party libraries)
- [ ] Breaking changes in Next.js releases reviewed and migration planned
- [ ] Deprecated APIs tracked and replaced proactively
- [ ] Bundle size analyzed quarterly with `@next/bundle-analyzer`
- [ ] Caching strategy reviewed for optimal performance
- [ ] Error rates monitored in production via console or error tracking
- [ ] ISR revalidation times adjusted based on content update frequency
- [ ] Image optimization reviewed for new image sources
- [ ] Accessibility audit performed every quarter
- [ ] Security headers reviewed and updated as needed
- [ ] Middleware rules reviewed for auth and redirect accuracy
- [ ] Server Action error handling improved based on production feedback

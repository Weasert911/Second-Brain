# Nextjs-Expert References

## Official Documentation

- **Next.js Docs**: https://nextjs.org/docs - Complete documentation for App Router, Pages Router, API reference, and guides
- **App Router Overview**: https://nextjs.org/docs/app - File-based routing, layouts, loading UI, error handling
- **Data Fetching**: https://nextjs.org/docs/app/building-your-application/data-fetching - fetch, server actions, route handlers
- **Rendering**: https://nextjs.org/docs/app/building-your-application/rendering - Server Components, Client Components, static/dynamic rendering
- **Metadata API**: https://nextjs.org/docs/app/building-your-application/optimizing/metadata - generateMetadata, metadata object
- **Image Optimization**: https://nextjs.org/docs/app/building-your-application/optimizing/images - next/image component, remotePatterns
- **Font Optimization**: https://nextjs.org/docs/app/building-your-application/optimizing/fonts - next/font, Google Fonts, custom fonts
- **Middleware**: https://nextjs.org/docs/app/building-your-application/routing/middleware - NextResponse, matcher config
- **Server Actions**: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations - use server, revalidatePath
- **Route Handlers**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers - GET, POST, PUT, DELETE handlers

## Terminology

1. **App Router**: New routing paradigm using app/ directory with file-based conventions
2. **Server Component**: React component that runs on the server, reducing client JS bundle
3. **Client Component**: React component with "use client" directive, runs in browser
4. **Layout**: Shared UI that persists across routes and does not re-render on navigation
5. **Template**: Similar to layout but re-mounts on every navigation
6. **Route Group**: Parenthesized folder grouping routes without affecting URL path
7. **Parallel Route**: Multiple pages rendered simultaneously in named slots
8. **Intercepting Route**: Route that intercepts navigation and shows content in a modal
9. **ISR**: Incremental Static Regeneration - update static content without rebuilding
10. **SSG**: Static Site Generation - pre-render pages at build time
11. **SSR**: Server-Side Rendering - render dynamically on each request
12. **Streaming**: Progressive rendering of UI as data becomes available
13. **Server Action**: Server-side function called directly from Client Components
14. **Middleware**: Code that runs before a request is completed, modifying the response
15. **Edge Runtime**: Lightweight runtime for middleware and edge functions running on Vercel Edge Network

## Architecture Notes

- App Router uses a file-based convention where folders define routes and files define UI
- Layouts are nested by default; each layout wraps child layouts and pages
- Data fetching happens at the component level, not at the page level (colocation)
- Server Components can directly access databases, file systems, and backend resources
- Client Components are rendered once on the server (for HTML) and then hydrated on the client
- Route handlers (API routes) use Web API Request/Response standards
- The app/ directory structure directly maps to URL paths
- Static rendering is the default; dynamic rendering is opt-in via dynamic functions
- Caching is enabled by default for fetch requests; opt out with cache: 'no-store'

## Key APIs

- `cookies()` - Read/write cookies in Server Components and Route Handlers
- `headers()` - Read HTTP headers in Server Components and Route Handlers
- `redirect(url)` - Redirect to a URL (works in Server Components, Server Actions, Route Handlers)
- `notFound()` - Trigger 404 not-found UI from a Server Component
- `revalidatePath(path)` - Revalidate cached data for a specific path
- `revalidateTag(tag)` - Revalidate cache tagged with specific tag
- `generateMetadata({ params, searchParams })` - Dynamic metadata generation
- `generateStaticParams()` - Generate static params for SSG at build time
- `unstable_noStore()` - Opt out of static rendering for a Server Component
- `NextRequest` - Extended Request with cookies, geolocation, ip, ua
- `NextResponse` - Extended Response with cookies, redirect, rewrite, headers
- `ImageResponse` - Generate dynamic OG images using JSX

## Conventions

- **File naming**: page.tsx for route UI, layout.tsx for shared layouts, loading.tsx for loading UI, error.tsx for error boundaries, not-found.tsx for 404
- **Route organization**: Group related routes in Route Groups (parentheses), use (main) and (marketing) for separation
- **Component placement**: Keep Server Components in app/ by default, Client Components in app/_components/ or separate directory
- **Server Actions**: Place in a dedicated actions.ts or actions/ directory, each function with "use server" directive
- **Types**: Define shared types in types/ directory, import in Server and Client Components
- **Styles**: Co-locate CSS modules with components, use Tailwind CSS for utility classes
- **Environment variables**: Prefix client-side variables with NEXT_PUBLIC_, server-side without prefix

## Project Structure Recommendation

```
my-next-app/
  app/
    (marketing)/
      page.tsx
      about/
        page.tsx
    (dashboard)/
      layout.tsx
      page.tsx
      settings/
        page.tsx
    api/
      auth/
        [...nextauth]/
          route.ts
      webhooks/
        stripe/
          route.ts
    _components/
      Button.tsx
      Header.tsx
    _lib/
      db.ts
      auth.ts
      utils.ts
    layout.tsx
    page.tsx
    loading.tsx
    error.tsx
    not-found.tsx
    globals.css
  public/
    images/
    fonts/
  actions/
    user.ts
    post.ts
  types/
    index.ts
    user.ts
    post.ts
  middleware.ts
  next.config.ts
  package.json
  tsconfig.json
```

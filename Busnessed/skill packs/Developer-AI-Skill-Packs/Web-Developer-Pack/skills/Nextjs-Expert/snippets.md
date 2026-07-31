# Nextjs-Expert Snippets

## Snippet 1: Dynamic Metadata Generator

```tsx
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(r => r.json());

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}
```

**When to use**: Every dynamic route page that needs SEO metadata based on fetched data.

## Snippet 2: Parallel Route Pattern

```tsx
// app/dashboard/layout.tsx
interface LayoutProps {
  children: React.ReactNode;
  notifications: React.ReactNode;
  revenue: React.ReactNode;
  users: React.ReactNode;
}

export default function DashboardLayout({
  children,
  notifications,
  revenue,
  users,
}: LayoutProps) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-3 gap-4">
        {notifications}
        {revenue}
        {users}
      </div>
    </div>
  );
}
```

**When to use**: When pages have independent sections that can load at their own pace (dashboards, analytics panels).

## Snippet 3: Intercepting Route for Modal

```tsx
// app/feed/page.tsx
export default async function FeedPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());

  return (
    <div>
      <h1>Feed</h1>
      {posts.map((post: any) => (
        <a key={post.id} href={`/feed/${post.id}/photo`}>
          <img src={post.thumbnail} alt={post.title} />
        </a>
      ))}
    </div>
  );
}

// app/feed/(..)photo/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function PhotoModal({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="modal-backdrop" onClick={() => router.back()}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <img src={`/photos/${params.id}`} alt="Photo" />
      </div>
    </div>
  );
}
```

**When to use**: Photo galleries, detail views, or any content that should appear as a modal from one route but as a full page when navigated to directly.

## Snippet 4: Server Action with Form Validation

```tsx
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitContact(prevState: any, formData: FormData) {
  const validated = formSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  try {
    await fetch('https://api.example.com/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated.data),
    });
    revalidatePath('/contact');
    return { success: true };
  } catch {
    return { error: { _form: ['Failed to send message'] } };
  }
}
```

**When to use**: Form submissions that need server-side validation and database/API interaction.

## Snippet 5: Middleware with Geolocation

```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US';
  const city = request.geo?.city || 'Unknown';
  const response = NextResponse.next();

  response.headers.set('x-country', country);
  response.headers.set('x-city', city);

  const preferredCurrency = country === 'US' ? 'USD' : country === 'GB' ? 'GBP' : 'EUR';
  response.cookies.set('currency', preferredCurrency, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });

  if (country === 'DE' && request.nextUrl.pathname.startsWith('/pricing')) {
    return NextResponse.redirect(new URL('/de/pricing', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**When to use**: Localization, currency selection, geo-blocking, regional pricing, or analytics tracking.

## Snippet 6: Edge API Route Handler

```tsx
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
  }

  const results = await fetch(
    `https://api.example.com/search?q=${encodeURIComponent(query)}`,
    { cache: 'no-store' }
  );

  const data = await results.json();
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

**When to use**: Low-latency API routes, search endpoints, or any handler that needs edge network benefits.

## Snippet 7: Dynamic Import with Loading State

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  {
    loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded" />,
    ssr: false,
  }
);

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyComponent />
    </div>
  );
}
```

**When to use**: Components with large dependencies, charts, CodeMirror editors, or components that should not be server-side rendered.

## Snippet 8: Grouped Route with Layout

```tsx
// app/(dashboard)/layout.tsx
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <nav className="w-64 bg-gray-100 p-4">
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/analytics">Analytics</Link>
        <Link href="/dashboard/settings">Settings</Link>
      </nav>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>Marketing Header</header>
      {children}
      <footer>Marketing Footer</footer>
    </div>
  );
}
```

**When to use**: Separating different sections of your app (admin vs public) with different layouts without affecting URL structure.

## Snippet 9: Fetch with Cache Revalidation

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: {
      revalidate: 60,
      tags: ['data-collection'],
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  return res.json();
}

// Trigger revalidation from anywhere
// import { revalidateTag } from 'next/cache';
// revalidateTag('data-collection');
```

**When to use**: On-demand revalidation, tag-based cache invalidation for related data across multiple pages.

## Snippet 10: Client Component for Interactive UI

```tsx
'use client';

import { useState } from 'react';

interface InteractiveCounterProps {
  initialValue?: number;
  label: string;
}

export default function InteractiveCounter({
  initialValue = 0,
  label,
}: InteractiveCounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div>
      <span>{label}: {count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
    </div>
  );
}
```

**When to use**: Interactive UI elements that require state, event handlers, or browser APIs.

## Snippet 11: Generate Static Params

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

// For 1000s of pages, use incremental static generation with fallback
export const dynamicParams = true; // or false for strict SSG
```

**When to use**: Static site generation for dynamic routes where you want to pre-build pages at build time.

## Snippet 12: Streaming with Suspense Boundaries

```tsx
import { Suspense } from 'react';

async function SlowData() {
  const data = await new Promise<string>(resolve =>
    setTimeout(() => resolve('Slow data loaded'), 3000)
  );
  return <div>{data}</div>;
}

async function FastData() {
  const data = await fetch('https://api.example.com/fast').then(r => r.text());
  return <div>{data}</div>;
}

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading fast data...</div>}>
        <FastData />
      </Suspense>
      <Suspense fallback={<div>Loading slow data...</div>}>
        <SlowData />
      </Suspense>
    </div>
  );
}
```

**When to use**: Pages with multiple independent data sources where you want progressive rendering.

## Snippet 13: Metadata with OpenGraph and Twitter Cards

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'Description of my app',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://myapp.com',
    siteName: 'My App',
    title: 'My App',
    description: 'Description of my app',
    images: [
      {
        url: 'https://myapp.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'My App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@myapp',
    creator: '@myapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

**When to use**: Root layout for global metadata defaults; override in specific pages with generateMetadata.

## Snippet 14: Custom 404 Page

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <p className="text-gray-500 mt-2">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
```

**When to use**: Place as `app/not-found.tsx` for global 404, or in route folders for scoped 404.

## Snippet 15: Route Handler with Streaming Response

```tsx
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode('data: Starting stream\n\n'));
      await new Promise(r => setTimeout(r, 1000));
      controller.enqueue(encoder.encode('data: Processing...\n\n'));
      await new Promise(r => setTimeout(r, 1000));
      controller.enqueue(encoder.encode('data: Complete\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
```

**When to use**: Real-time data streaming, server-sent events, progress indicators for long-running operations.

# Nextjs-Expert Templates

## Template 1: Page with Dynamic Metadata

**Name**: `dynamic-page-template`
**Description**: A Next.js page with dynamic metadata generation and route params.

```tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface {{PageName}}Props {
  params: Promise<{ {{paramName}}: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params }: {{PageName}}Props
): Promise<Metadata> {
  const { {{paramName}} } = await params;
  const {{entity}} = await fetch(`https://api.example.com/{{entities}}/${ {{paramName}} }`).then(r => r.json());

  if (!{{entity}}) return { title: 'Not Found' };

  return {
    title: {{entity}}.title,
    description: {{entity}}.description,
    openGraph: {
      title: {{entity}}.title,
      images: [{{entity}}.image],
    },
  };
}

export default async function {{PageName}}({ params }: {{PageName}}Props) {
  const { {{paramName}} } = await params;
  const {{entity}} = await fetch(`https://api.example.com/{{entities}}/${ {{paramName}} }`).then(r => {
    if (!r.ok) notFound();
    return r.json();
  });

  return (
    <div>
      <h1>{{entity}}.title</h1>
      <p>{{entity}}.content</p>
    </div>
  );
}
```

**Usage Notes**: Replace `{{PageName}}` (e.g., `ProductPage`), `{{paramName}}` (e.g., `slug`, `id`), `{{entity}}` (e.g., `product`), `{{entities}}` (e.g., `products`). Add revalidate export for ISR.

## Template 2: Loading Skeleton Component

**Name**: `loading-template`
**Description**: A loading.tsx skeleton for route segments.

```tsx
export default function {{PageName}}Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );
}
```

**Usage Notes**: Place as `loading.tsx` in any route folder. Customize skeleton structure to match your page layout. Use Tailwind CSS classes for consistent styling.

## Template 3: Route Handler with Validation

**Name**: `route-handler-template`
**Description**: A Next.js API route handler with request validation and error handling.

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const {{handlerName}}Schema = z.object({
  {{field1}}: z.string().min(1),
  {{field2}}: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = {{handlerName}}Schema.parse(body);

    const result = await fetch('https://api.example.com/{{resource}}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated),
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: 'External API error' },
        { status: result.status }
      );
    }

    const data = await result.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Usage Notes**: Replace `{{handlerName}}` (e.g., `ContactForm`), `{{field1}}`/`{{field2}}` with actual fields, `{{resource}}` with API endpoint. Place in `app/api/{{route}}/route.ts`.

## Template 4: Server Action for Form Handling

**Name**: `server-action-template`
**Description**: A server action with validation, database interaction, and revalidation.

```tsx
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const {{actionName}}Schema = z.object({
  {{field1}}: z.string().min(1, '{{field1}} is required'),
  {{field2}}: z.string().min(1, '{{field2}} is required'),
});

interface {{ActionName}}Result {
  success: boolean;
  error?: string;
  data?: unknown;
}

export async function {{actionName}}(
  prevState: {{ActionName}}Result | null,
  formData: FormData
): Promise<{{ActionName}}Result> {
  const validated = {{actionName}}Schema.safeParse({
    {{field1}}: formData.get('{{field1}}'),
    {{field2}}: formData.get('{{field2}}'),
  });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors.map(e => e.message).join(', '),
    };
  }

  try {
    const result = await fetch('https://api.example.com/{{resource}}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated.data),
    });

    if (!result.ok) {
      return { success: false, error: 'Failed to submit' };
    }

    const data = await result.json();
    revalidatePath('/{{revalidatePath}}');
    return { success: true, data };
  } catch {
    return { success: false, error: 'Network error' };
  }
}
```

**Usage Notes**: Replace `{{actionName}}` (e.g., `createPost`, `submitContact`), `{{field1}}`/`{{field2}}` with field names, `{{resource}}` with API endpoint, `{{revalidatePath}}` with path to revalidate. Use with useActionState in client component.

## Template 5: Middleware with Auth Protection

**Name**: `middleware-template`
**Description**: Edge middleware for authentication and route protection.

```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/{{protectedPath1}}', '/{{protectedPath2}}'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    const loginUrl = new URL('/{{loginPath}}', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const authPaths = ['/{{loginPath}}', '/{{registerPath}}'];
  const isAuthPage = authPaths.some(path => pathname.startsWith(path));

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/{{defaultRedirect}}', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('x-request-path', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Usage Notes**: Replace `{{protectedPath1}}`/`{{protectedPath2}}` (e.g., `dashboard`, `profile`), `{{loginPath}}` (e.g., `login`), `{{registerPath}}`, `{{defaultRedirect}}` (e.g., `dashboard`). Place at `middleware.ts` in project root.

## Template 6: Error Boundary with Retry

**Name**: `error-template`
**Description**: An error.tsx boundary with reset functionality and error logging.

```tsx
'use client';

import { useEffect } from 'react';

interface {{PageName}}ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function {{PageName}}Error({ error, reset }: {{PageName}}ErrorProps) {
  useEffect(() => {
    console.error('{{PageName}} error:', error);
  }, [error]);

  return (
    <div role="alert">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Usage Notes**: Place as `error.tsx` in any route folder. Replace `{{PageName}}` (e.g., `Dashboard`, `Posts`). The reset function re-renders the failed segment.

## Template 7: Dynamic OG Image Route

**Name**: `og-image-template`
**Description**: Edge-based dynamic Open Graph image generation.

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '{{defaultTitle}}';
  const description = searchParams.get('description') || '{{defaultDescription}}';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '{{bgColor}}',
          fontSize: 60,
          fontWeight: 700,
          color: '{{textColor}}',
          padding: 40,
        }}
      >
        <h1 style={{ margin: 0 }}>{title}</h1>
        <p style={{ fontSize: 30, margin: 10 }}>{description}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**Usage Notes**: Place in `app/{{entity}}/[slug]/opengraph-image.tsx`. Replace `{{defaultTitle}}`, `{{defaultDescription}}`, `{{bgColor}}` (e.g., `#000`), `{{textColor}}` (e.g., `#fff`). Add custom fonts with next/font if needed.

## Template 8: Not Found Page

**Name**: `not-found-template`
**Description**: Custom 404 page for a route segment.

```tsx
import Link from 'next/link';

export default function {{PageName}}NotFound() {
  return (
    <div>
      <h2>{{resourceName}} Not Found</h2>
      <p>The {{resourceName}} you are looking for does not exist or has been removed.</p>
      <Link href="/{{fallbackPath}}">Go to {{fallbackLabel}}</Link>
    </div>
  );
}
```

**Usage Notes**: Place as `not-found.tsx` in any route folder. Replace `{{PageName}}` (e.g., `Product`), `{{resourceName}}` (e.g., `Product`), `{{fallbackPath}}` (e.g., `products`), `{{fallbackLabel}}` (e.g., `Products`).

# Nextjs-Expert Examples

## Beginner: Static Blog Page with ISR

**Description**: A blog page that fetches posts at build time and revalidates every hour.

```tsx
// app/posts/page.tsx
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
}

export const revalidate = 3600;

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://api.example.com/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            <p>{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Explanation**: This demonstrates ISR with revalidate export, server-side data fetching in a Server Component, Link component for client-side navigation, and proper error handling for fetch failures.

## Intermediate: Dashboard with Parallel Routes and Auth

**Description**: A dashboard with parallel route slots for analytics and recent activity, protected by middleware.

```tsx
// app/dashboard/layout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
  analytics: React.ReactNode;
  activity: React.ReactNode;
}

export default function DashboardLayout({
  children,
  analytics,
  activity,
}: DashboardLayoutProps) {
  return (
    <div>
      <nav>Dashboard Navigation</nav>
      <main>{children}</main>
      <aside>
        {analytics}
        {activity}
      </aside>
    </div>
  );
}

// app/dashboard/@analytics/page.tsx
export default async function AnalyticsSlot() {
  const data = await fetch('https://api.example.com/analytics', {
    next: { revalidate: 300 },
  });
  const analytics = await data.json();

  return (
    <div>
      <h2>Analytics</h2>
      <p>Page Views: {analytics.pageViews}</p>
      <p>Users: {analytics.uniqueUsers}</p>
    </div>
  );
}

// app/dashboard/@activity/page.tsx
export default async function ActivitySlot() {
  const data = await fetch('https://api.example.com/activity');
  const activities = await data.json();

  return (
    <div>
      <h2>Recent Activity</h2>
      <ul>
        {activities.map((a: any) => (
          <li key={a.id}>{a.action} - {a.time}</li>
        ))}
      </ul>
    </div>
  );
}

// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session-token');
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

**Explanation**: This demonstrates parallel route slots (@analytics, @activity) rendering independently in the layout, middleware-based auth protection with cookie check, and different revalidation strategies per slot.

## Advanced: Server Actions with Optimistic Updates

**Description**: A comment system using Server Actions with revalidation and optimistic updates.

```tsx
// actions/comments.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const commentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1).max(1000),
  author: z.string().min(2).max(50),
});

interface CommentResult {
  success: boolean;
  error?: string;
  comment?: {
    id: string;
    content: string;
    author: string;
    createdAt: string;
  };
}

export async function addComment(formData: FormData): Promise<CommentResult> {
  const validated = commentSchema.safeParse({
    postId: formData.get('postId'),
    content: formData.get('content'),
    author: formData.get('author'),
  });

  if (!validated.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    const res = await fetch('https://api.example.com/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated.data),
    });

    if (!res.ok) throw new Error('Failed to add comment');

    const comment = await res.json();
    revalidatePath(`/posts/${validated.data.postId}`);
    return { success: true, comment };
  } catch (error) {
    return { success: false, error: 'Failed to submit comment' };
  }
}

// app/posts/[slug]/page.tsx
import { addComment } from '@/actions/comments';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 60 },
  });
  const post = await res.json();

  const commentsRes = await fetch(`https://api.example.com/posts/${slug}/comments`);
  const comments: Comment[] = await commentsRes.json();

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
      <section>
        <h2>Comments</h2>
        <CommentForm postId={post.id} addComment={addComment} />
        <CommentList comments={comments} />
      </section>
    </article>
  );
}

// app/posts/[slug]/CommentForm.tsx
'use client';

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Add Comment'}
    </button>
  );
}

interface CommentFormProps {
  postId: string;
  addComment: (formData: FormData) => Promise<any>;
}

export function CommentForm({ postId, addComment }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        formData.append('postId', postId);
        await addComment(formData);
        formRef.current?.reset();
      }}
    >
      <input name="author" placeholder="Your name" required />
      <textarea name="content" placeholder="Your comment" required />
      <SubmitButton />
    </form>
  );
}
```

**Explanation**: This production-grade example demonstrates Server Actions with validation, revalidatePath for cache invalidation, useFormStatus for loading states, useActionState pattern with form actions, and proper error handling with typed return values.

## Production: Full App with Dynamic OG Images, Streaming, and Edge

**Description**: A complete setup with dynamic Open Graph image generation, streaming SSR, and edge middleware.

```tsx
// app/posts/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Default Title';

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to right, #000, #333)',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}
      >
        {title}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

// app/posts/[slug]/page.tsx with streaming
import { Suspense } from 'react';
import { Skeleton } from '@/app/_components/Skeleton';

async function PostContent({ slug }: { slug: string }) {
  const res = await fetch(`https://api.example.com/posts/${slug}`);
  const post = await res.json();
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}

async function RelatedPosts({ slug }: { slug: string }) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const res = await fetch(`https://api.example.com/posts/${slug}/related`);
  const posts = await res.json();
  return (
    <aside>
      <h2>Related Posts</h2>
      {posts.map((p: any) => <p key={p.id}>{p.title}</p>)}
    </aside>
  );
}

export default async function PostPage({ params }: any) {
  const { slug } = await params;
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <PostContent slug={slug} />
      </Suspense>
      <Suspense fallback={<div>Loading related...</div>}>
        <RelatedPosts slug={slug} />
      </Suspense>
    </div>
  );
}

// middleware.ts with geolocation
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US';
  const response = NextResponse.next();

  response.cookies.set('user-country', country, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  });

  if (country === 'CN' && !request.nextUrl.pathname.startsWith('/cn')) {
    return NextResponse.redirect(new URL('/cn' + request.nextUrl.pathname, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Explanation**: This advanced example shows edge runtime OG image generation, streaming SSR with multiple Suspense boundaries for progressive rendering, and edge middleware with geolocation-based redirects and cookie management.

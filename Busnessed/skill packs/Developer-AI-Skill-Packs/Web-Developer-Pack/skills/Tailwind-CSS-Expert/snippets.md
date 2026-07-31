# Tailwind-CSS-Expert Snippets

## Snippet 1: Container with Max Width and Padding

```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

**When to use**: Every page wrapper needs this standard container pattern for consistent horizontal padding and centering.

## Snippet 2: Responsive Flex Layout

```tsx
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-64 flex-shrink-0">Sidebar</div>
  <div className="flex-1 min-w-0">Content</div>
</div>
```

**When to use**: Sidebar + content layouts, or any row-to-column responsive flex pattern.

## Snippet 3: Card with Hover Effect

```tsx
<div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-xl transition-colors" />
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Title</h3>
  <p className="mt-2 text-gray-600 dark:text-gray-300">Content</p>
</div>
```

**When to use**: Interactive cards, product cards, dashboard widgets that need hover feedback.

## Snippet 4: Sticky Header with Backdrop Blur

```tsx
<header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <span className="font-bold text-xl">Brand</span>
    <nav className="flex gap-6">Nav items</nav>
  </div>
</header>
```

**When to use**: Navigation headers that need to stay visible while scrolling, with glassmorphism effect.

## Snippet 5: Custom Focus Ring for Accessibility

```tsx
<button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg">
  Accessible Button
</button>
```

**When to use**: All interactive elements to ensure visible focus indicators for keyboard users without overriding default focus on mouse click.

## Snippet 6: Aspect Ratio Container

```tsx
<div className="relative aspect-video">
  <iframe
    className="absolute inset-0 w-full h-full"
    src="https://www.youtube.com/embed/..."
    title="Video"
    allowFullScreen
  />
</div>
```

**When to use**: Video embeds, image placeholders, or any media that needs a fixed aspect ratio.

## Snippet 7: Multi-Column Text Layout

```tsx
<div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
  <p className="break-inside-avoid-column mb-4">Column content...</p>
</div>
```

**When to use**: Blog layouts, article text, or any content that benefits from newspaper-style column layout.

## Snippet 8: Truncate Text with Ellipsis

```tsx
<p className="truncate max-w-xs">Very long text that should be truncated with ellipsis when it exceeds the container width</p>

<p className="line-clamp-3">Multi-line text that should be clamped to 3 lines with ellipsis at the end of the third line even though there is much more content to display</p>
```

**When to use**: Card descriptions, table cells, or any text that needs to be constrained to a single line or limited lines.

## Snippet 9: Dark Mode Toggle

```tsx
function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
```

**When to use**: Any application with manual dark mode toggle. Remember to add `darkMode: 'class'` to tailwind.config.

## Snippet 10: Container Query Component

```tsx
<div className="@container">
  <div className="flex flex-col @md:flex-row gap-4 @md:gap-6">
    <div className="@md:w-1/3">
      <img className="w-full h-auto rounded-lg" src="..." alt="" />
    </div>
    <div className="@md:w-2/3">
      <h2 className="text-lg @md:text-xl @lg:text-2xl font-bold">Title</h2>
      <p className="text-sm @md:text-base">Description</p>
    </div>
  </div>
</div>
```

**When to use**: Reusable components that need to adapt to their container width, not the viewport. Requires `@tailwindcss/container-queries` plugin.

## Snippet 11: Gradient Text Effect

```tsx
<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
  Gradient Heading
</h1>
```

**When to use**: Hero sections, branding, or headings that need visual impact.

## Snippet 12: Scrollbar Hide Utility

```tsx
<div className="overflow-y-auto scrollbar-hide">
  {/* Scrollable content with hidden scrollbar */}
</div>

/* Add to global CSS */
/* .scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
} */
```

**When to use**: Custom scrollable areas where the native scrollbar is visually disruptive, like horizontal scrollable tabs or carousels.

## Snippet 13: Responsive Table with Horizontal Scroll

```tsx
<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">John Doe</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Developer</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

**When to use**: Data tables that need to handle many columns on small screens with horizontal scroll.

## Snippet 14: Animated Page Loader

```tsx
<div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
  <div className="flex gap-1">
    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
</div>
```

**When to use**: Loading states, page transitions, or content placeholders.

## Snippet 15: Staggered Children Animation

```tsx
<div className="space-y-4">
  {items.map((item, i) => (
    <div
      key={item.id}
      className="animate-fade-in"
      style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
    >
      {item.content}
    </div>
  ))}
</div>

/* CSS */
/* @keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
} */
```

**When to use**: Lists, grids, or any group of items that should animate in sequentially. Define the `fade-in` animation in tailwind.config keyframes.

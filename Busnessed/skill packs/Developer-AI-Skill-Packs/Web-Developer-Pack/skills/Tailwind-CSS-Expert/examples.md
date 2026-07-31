# Tailwind-CSS-Expert Examples

## Beginner: Responsive Card Component

**Description**: A simple responsive card using Tailwind utilities with hover effects and responsive layout.

```tsx
function ProductCard({ title, price, image }: { title: string; price: string; image: string }) {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      <img
        className="w-full h-48 object-cover"
        src={image}
        alt={title}
      />
      <div className="px-6 py-4">
        <h3 className="font-bold text-xl mb-2 text-gray-800">
          {title}
        </h3>
        <p className="text-gray-600 text-base">{price}</p>
      </div>
      <div className="px-6 pt-4 pb-6">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      <ProductCard title="Product 1" price="$29.99" image="/product1.jpg" />
      <ProductCard title="Product 2" price="$39.99" image="/product2.jpg" />
      <ProductCard title="Product 3" price="$49.99" image="/product3.jpg" />
    </div>
  );
}
```

**Explanation**: This shows mobile-first responsive grid (1 column on mobile, 4 on large screens), hover transitions on shadow and button color, shadow-lg for depth, and proper spacing with gap.

## Intermediate: Dashboard Layout with Dark Mode

**Description**: A dashboard layout with sidebar, header, and content area with dark mode support.

```tsx
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            Analytics
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            Settings
          </a>
        </nav>
      </aside>

      <header className="fixed left-64 top-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Dashboard</h1>
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </header>

      <main className="ml-64 mt-16 p-6 text-gray-800 dark:text-gray-200">
        {children}
      </main>
    </div>
  );
}
```

**Explanation**: This demonstrates comprehensive dark mode with `dark:` variants on all color-related classes, fixed positioning for sidebar and header, proper layout with margin offsets, and hover transitions with `transition-colors`.

## Advanced: Custom Theme with Design Tokens

**Description**: A full design system integration with custom theme, animations, and plugin.

```tsx
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
          dark: '#0f172a',
          'dark-secondary': '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter var', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      screens: {
        xs: '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [
    function({ addUtilities, addVariant, theme }) {
      addUtilities({
        '.text-balance': {
          textWrap: 'balance',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
      addVariant('not-first', '&:not(:first-child)');
      addVariant('not-last', '&:not(:last-child)');
    },
  ],
};

export default config;

// Usage in component
function AnimatedModal({ isOpen, onClose, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-surface dark:bg-surface-dark-secondary rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4 animate-scale-in">
        {children}
      </div>
    </div>
  );
}
```

**Explanation**: This advanced example demonstrates custom brand colors from a design system, custom spacing values, four custom animations with keyframes, extra breakpoints, a plugin adding custom utilities (text-balance, scrollbar-hide) and custom variants (not-first, not-last), and dark mode with CSS custom properties for surfaces.

## Production: Responsive Data Table with Group Modifiers

**Description**: A production-ready data table with sticky headers, row hover, pagination, and responsive handling.

```tsx
function DataTable({ columns, data }: { columns: any[]; data: any[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, i) => (
            <tr
              key={row.id}
              className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
              <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <nav className="relative z-0 inline-flex gap-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 aria-current-page:bg-brand-500 aria-current-page:text-white aria-current-page:border-brand-500"
                aria-current={page === 1 ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
```

**Explanation**: This production example uses group modifiers for row hover text color change, responsive pagination (mobile stacked, desktop inline), aria-current-page for active page styling, dark mode throughout, overflow-x-auto for horizontal scroll on small screens, and whitespace-nowrap for table cells.

# Tailwind-CSS-Expert Templates

## Template 1: Tailwind Configuration

**Name**: `tailwind-config-template`
**Description**: A comprehensive tailwind.config template with theme extension and plugins.

```tsx
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '{{primary50}}',
          100: '{{primary100}}',
          200: '{{primary200}}',
          300: '{{primary300}}',
          400: '{{primary400}}',
          500: '{{primary500}}',
          600: '{{primary600}}',
          700: '{{primary700}}',
          800: '{{primary800}}',
          900: '{{primary900}}',
        },
        secondary: {
          50: '{{secondary50}}',
          500: '{{secondary500}}',
          900: '{{secondary900}}',
        },
      },
      fontFamily: {
        sans: ['{{fontSans}}'],
        display: ['{{fontDisplay}}'],
        mono: ['{{fontMono}}'],
      },
      spacing: {
        '{{customSpacing}}': '{{customSpacingValue}}',
      },
      animation: {
        '{{animationName}}': '{{animationValue}}',
      },
      keyframes: {
        '{{keyframeName}}': {
          '0%': { {{keyframeFrom}} },
          '100%': { {{keyframeTo}} },
        },
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [],
};

export default config;
```

**Usage Notes**: Replace color values with hex/rgb codes, font families with your chosen fonts, spacing with custom size/value pairs, animation names with timing functions, and keyframe values. Add screens only if default breakpoints need extension.

## Template 2: Responsive Navbar Component

**Name**: `navbar-template`
**Description**: A responsive navigation bar with mobile hamburger menu and dropdowns.

```tsx
'use client';

import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface NavbarProps {
  brand: string;
  items: NavItem[];
}

export default function Navbar({ brand, items }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="bg-{{navBg}} dark:bg-{{navBgDark}} border-b border-{{borderColor}} dark:border-{{borderColorDark}}">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-{{brandColor}} font-bold text-xl">
              {brand}
            </a>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {items.map((item) => (
                <div key={item.label} className="relative">
                  <a
                    href={item.href}
                    className="text-{{linkColor}} hover:text-{{linkHoverColor}} px-3 py-2 rounded-md text-sm font-medium"
                    onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.label}
                  </a>
                  {item.children && activeDropdown === item.label && (
                    <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-{{dropdownBg}}">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-{{linkColor}} hover:bg-{{dropdownHoverBg}}"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-{{linkColor}} hover:text-{{linkHoverColor}} hover:bg-{{hoverBg}}"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {items.map((item) => (
              <a key={item.label} href={item.href} className="block px-3 py-2 rounded-md text-base font-medium text-{{linkColor}} hover:text-{{linkHoverColor}} hover:bg-{{hoverBg}}">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
```

**Usage Notes**: Replace `{{navBg}}`, `{{brandColor}}`, `{{linkColor}}`, `{{hoverBg}}`, and `{{dropdownBg}}` with appropriate Tailwind color classes. Supports dark mode with `dark:` variants.

## Template 3: Card Component with Variants

**Name**: `card-template`
**Description**: Reusable card component with multiple style variants.

```tsx
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  default: 'bg-white dark:bg-gray-800 shadow-sm rounded-lg',
  elevated: 'bg-white dark:bg-gray-800 shadow-xl rounded-xl',
  bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg',
  flat: 'bg-gray-50 dark:bg-gray-900 rounded-lg',
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({ children, variant = 'default', padding = 'md', className = '' }: CardProps) {
  return (
    <div className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}
```

**Usage Notes**: Customize variant styles and padding as needed. Add new variants by extending the variantStyles object. Use composition for card headers and footers.

## Template 4: Form Input with Validation States

**Name**: `form-input-template`
**Description**: Form input with label, error state, and help text.

```tsx
interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export default function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  helpText,
  required,
}: FormInputProps) {
  const inputClasses = `block w-full rounded-{{borderRadius}} border-2 px-{{paddingX}} py-{{paddingY}} text-sm
    ${error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 dark:border-gray-600 focus:border-{{focusColor}} focus:ring-{{focusColor}}'
    }
    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
    focus:outline-none focus:ring-2 transition-colors`;

  return (
    <div className="mb-{{inputMargin}}">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : helpText ? `${name}-help` : undefined}
        className={inputClasses}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={`${name}-help`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
}
```

**Usage Notes**: Replace `{{borderRadius}}` (e.g., `lg`), `{{paddingX}}` (e.g., `3`), `{{paddingY}}` (e.g., `2.5`), `{{focusColor}}` (e.g., `blue-500`), `{{inputMargin}}` (e.g., `4`). Extend with textarea, select variants as needed.

## Template 5: Modal Dialog Component

**Name**: `modal-template`
**Description**: Accessible modal dialog with backdrop blur and animations.

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/{{overlayOpacity}} backdrop-blur-{{blurAmount}} transition-opacity"
          onClick={onClose}
        />
        <div
          className={`relative w-full ${sizeClasses[size]} transform rounded-{{radius}} bg-white dark:bg-gray-800 shadow-2xl transition-all animate-{{animation}}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="flex items-center justify-between p-{{headerPadding}} border-b border-gray-200 dark:border-gray-700">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-{{bodyPadding}}">{children}</div>
        </div>
      </div>
    </div>
  );
}
```

**Usage Notes**: Replace `{{overlayOpacity}}` (e.g., `50`), `{{blurAmount}}` (e.g., `sm`), `{{radius}}` (e.g., `2xl`), `{{animation}}` (e.g., `scale-in`), `{{headerPadding}}` (e.g., `6`), `{{bodyPadding}}` (e.g., `6`).

## Template 6: Grid Layout System

**Name**: `grid-template`
**Description**: Responsive grid layout with column and row configuration.

```tsx
interface GridProps {
  children: React.ReactNode;
  cols?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  gap?: number;
  className?: string;
}

export default function Grid({ children, cols = 1, sm, md, lg, xl, gap = 6, className = '' }: GridProps) {
  const gridClasses = [
    'grid',
    `grid-cols-${cols}`,
    sm && `sm:grid-cols-${sm}`,
    md && `md:grid-cols-${md}`,
    lg && `lg:grid-cols-${lg}`,
    xl && `xl:grid-cols-${xl}`,
    `gap-${gap}`,
    className,
  ].filter(Boolean).join(' ');

  return <div className={gridClasses}>{children}</div>;
}

// Usage: <Grid cols={1} sm={2} md={3} lg={4} gap={6}>...</Grid>
```

**Usage Notes**: Column props set responsive breakpoints. Use inline styles or arbitrary values for non-standard column counts (e.g., `className="grid grid-cols-[1fr_2fr_1fr]"`).

## Template 7: Button Component with Full Variants

**Name**: `button-template`
**Description**: Complete button component with variants, sizes, loading state, and icon support.

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-{{primaryBg}} text-white hover:bg-{{primaryHover}} focus:ring-{{primaryRing}} disabled:bg-{{primaryDisabled}}',
  secondary: 'bg-{{secondaryBg}} text-{{secondaryText}} hover:bg-{{secondaryHover}} focus:ring-{{secondaryRing}}',
  outline: 'border-2 border-{{outlineBorder}} text-{{outlineText}} hover:bg-{{outlineHover}} focus:ring-{{outlineRing}}',
  ghost: 'text-{{ghostText}} hover:bg-{{ghostHover}} focus:ring-{{ghostRing}}',
  danger: 'bg-{{dangerBg}} text-white hover:bg-{{dangerHover}} focus:ring-{{dangerRing}}',
};

const sizeClasses = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-{{buttonRadius}} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon ? <span className="mr-2">{leftIcon}</span> : null}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
```

**Usage Notes**: Replace all `{{...Bg}}`, `{{...Hover}}`, `{{...Text}}`, `{{...Ring}}`, `{{...Disabled}}` with appropriate Tailwind color classes. Customize `{{buttonRadius}}` (e.g., `md`, `lg`, `full`).

## Template 8: Badge/Tag Component

**Name**: `badge-template`
**Description**: Small badge or tag component with color variants.

```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function Badge({ children, variant = 'default', size = 'sm', dot, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${badgeVariants[variant]} ${sizeClasses[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}

const dotColors = {
  default: 'bg-gray-400',
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  error: 'bg-red-400',
  info: 'bg-blue-400',
};
```

**Usage Notes**: Use for status indicators, categories, or tags. Dot variant adds a colored circle before text. Extend with additional variants as needed.

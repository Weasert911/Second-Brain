# Tailwind-CSS-Expert Checklists

## Pre-Flight Checklist

- [ ] Tailwind CSS installed via npm and configured in postcss.config
- [ ] tailwind.config.ts created with content paths matching all template files
- [ ] @tailwind base/components/utilities directives added to main CSS file
- [ ] TypeScript types for Tailwind configuration installed (@types/tailwindcss or tailwindcss/types/config)
- [ ] Tailwind CSS IntelliSense VS Code extension installed
- [ ] Design tokens defined (colors, fonts, spacing) before starting implementation
- [ ] Dark mode strategy decided and configured (class vs media)
- [ ] Base font family and color defined in @layer base
- [ ] CSS custom properties defined for runtime theme switching if needed
- [ ] Browserlist configured for CSS compatibility targets
- [ ] PostCSS and autoprefixer configured
- [ ] Production build tested with `NODE_ENV=production`

## Implementation Checklist

- [ ] Mobile-first responsive approach used (base styles for mobile, variants for larger screens)
- [ ] Default theme values preferred over custom values
- [ ] Custom colors added via theme.extend, not as hardcoded arbitrary values
- [ ] Spacing follows the 4px scale ($spacing / 4 = number)
- [ ] Typography uses consistent type scale (text-xs through text-4xl)
- [ ] Layout uses flexbox or grid utilities (not floats or manual positioning)
- [ ] Gap utility used for spacing between flex/grid items
- [ ] Padding and margin use consistent spacing values
- [ ] Hover and focus states defined for all interactive elements
- [ ] Focus-visible styles defined for keyboard navigation accessibility
- [ ] Dark mode overrides provided for all color-based styles
- [ ] Z-index values managed consistently (not arbitrary numbers)
- [ ] Animations respect prefers-reduced-motion media query
- [ ] Container queries used for component-level responsiveness where appropriate
- [ ] Group and peer variants used for parent/sibling dependent styling

## Testing Checklist

- [ ] All breakpoints tested: xs (475px), sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- [ ] Dark mode toggles successfully with no flickering
- [ ] Custom colors render correctly across all variants (hover, focus, dark)
- [ ] Custom animations play smoothly with no jank
- [ ] Custom fonts load correctly with proper fallbacks
- [ ] Container queries respond correctly to container resize
- [ ] Print styles work correctly (@media print)
- [ ] Reduced motion respected (prefers-reduced-motion)
- [ ] High contrast mode compatible (prefers-contrast: more)
- [ ] Touch targets at least 44x44px on mobile
- [ ] Text contrasts meet WCAG AA standards (4.5:1 for normal text)
- [ ] No horizontal scroll on any breakpoint
- [ ] All interactive elements have visible focus indicators

## Release Checklist

- [ ] Production build generates minimal CSS (verify with build output size)
- [ ] Content paths include all new template files
- [ ] No unused custom theme values (check build output for missing entries)
- [ ] Safelist entries reviewed and minimized
- [ ] CSS specificity maintained (no !important in utility classes)
- [ ] No purgeCSS warnings in build output
- [ ] PostCSS build step included in production build process
- [ ] CSS sourcemaps disabled in production
- [ ] Custom fonts preloaded or with proper display strategy
- [ ] Animation performance tested (use transform/opacity only)
- [ ] Bundle size compared with previous build for regressions
- [ ] Changelog updated with CSS/design changes
- [ ] Color contrast verified with automated tools (axe, Lighthouse)
- [ ] Responsive screenshots captured for documentation

## Maintenance Checklist

- [ ] Tailwind CSS version updates reviewed for breaking changes
- [ ] Custom theme values audited quarterly for unused entries
- [ ] New component designs mapped to existing tokens before creating new ones
- [ ] Color palette reviewed for consistency
- [ ] Plugins updated when Tailwind versions change
- [ ] CSS output size monitored for bloat
- [ ] Deprecated utility classes tracked and replaced
- [ ] Accessibility audit repeated after design changes

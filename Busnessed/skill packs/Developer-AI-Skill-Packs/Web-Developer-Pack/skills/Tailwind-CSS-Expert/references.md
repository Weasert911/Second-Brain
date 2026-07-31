# Tailwind-CSS-Expert References

## Official Documentation

- **Tailwind CSS Docs**: https://tailwindcss.com/docs - Complete reference for all utility classes, customization, and guides
- **Installation**: https://tailwindcss.com/docs/installation - PostCSS, CLI, framework-specific guides
- **Configuration**: https://tailwindcss.com/docs/configuration - tailwind.config customization, theme extension
- **Responsive Design**: https://tailwindcss.com/docs/responsive-design - Mobile-first breakpoints, responsive variants
- **Dark Mode**: https://tailwindcss.com/docs/dark-mode - Class vs media strategy, toggling
- **Customization**: https://tailwindcss.com/docs/theme - Custom colors, fonts, spacing, breakpoints
- **Optimization**: https://tailwindcss.com/docs/optimizing-for-production - Content paths, purge, minification
- **Plugins**: https://tailwindcss.com/docs/plugins - Creating custom plugins, utilities, and components
- **Container Queries**: https://tailwindcss.com/docs/container-queries - @container, size-based responsive
- **Animation**: https://tailwindcss.com/docs/animation - Built-in animations, custom keyframes
- **v4 Docs**: https://tailwindcss.com/docs/v4 - CSS-first configuration, new features in v4

## Terminology

1. **Utility Class**: Single-purpose CSS class that applies one specific style (e.g., `text-center`, `bg-blue-500`)
2. **Variant**: Prefix that applies styles conditionally (e.g., `hover:`, `md:`, `dark:`, `focus-visible:`)
3. **Breakpoint**: Responsive threshold at which layout changes (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px)
4. **Arbitrary Value**: Bracket notation for one-off values not in config (e.g., `w-[300px]`, `bg-[#123456]`)
5. **@apply**: Directive to inline utility classes into custom CSS
6. **@layer**: Directive to organize CSS into base, components, and utilities layers
7. **Theme**: Configuration object defining design tokens (colors, fonts, spacing)
8. **Content Paths**: File patterns Tailwind scans for class usage
9. **Safelist**: Array of class patterns always included in CSS (never purged)
10. **JIT**: Just-in-Time compilation engine that generates CSS on demand
11. **Group Modifier**: Variant (`group-hover:`, `group-focus:`) that styles children based on parent state
12. **Peer Modifier**: Variant (`peer-checked:`, `peer-invalid:`) that styles siblings based on sibling state
13. **Container Query**: Size-based responsive queries scoped to a parent container
14. **CSS Layer**: Cascade layer that controls specificity ordering
15. **Design Token**: Named value representing a design decision (color, spacing, typography)

## Architecture Notes

- Tailwind generates CSS based on class usage found in content files
- The default theme provides a comprehensive set of design tokens optimized for common use cases
- Responsive variants are mobile-first; base classes apply to all sizes, variants override upward
- Custom values in config are merged with defaults via `extend` or replace with a custom object
- JIT mode generates CSS on-demand, keeping production builds small regardless of configuration size
- CSS layers control the order: base → components → utilities (Tailwind's utilities always win)
- Container queries are a separate plugin (`@tailwindcss/container-queries`) in v3; built-in in v4
- Dark mode variants (`dark:`) work with both class and media strategies
- The `@apply` directive can only be used within component or utility layers, not base

## Key APIs

- `@tailwind base/components/utilities` - Inject Tailwind's layers
- `@config './tailwind.config.js'` (v4) - Reference config file from CSS
- `@apply text-lg font-bold` - Inline utilities into custom CSS
- `@layer base { ... }` - Add base styles (resets, variables)
- `@layer components { ... }` - Add component classes
- `@layer utilities { ... }` - Add custom utilities
- `theme('colors.blue.500')` - Access theme values in CSS
- `screen(md)` - Reference breakpoint in CSS
- `tailwind.config` with `theme.extend`, `plugins`, `content`, `darkMode`, `safelist`
- `plugin(({ addUtilities, addComponents, addBase, theme }) => { ... })` - Create plugins
- `addVariant('variant-name', '&:state')` - Create custom variants

## Conventions

- **Class ordering**: Layout → Flexbox/Grid → Spacing → Sizing → Typography → Visual → Interactive
- **Responsive prefixes**: Base (smallest) → sm → md → lg → xl → 2xl
- **State prefixes**: hover → focus → focus-visible → active → disabled
- **Color naming**: Descriptive names (primary, secondary, accent) or numbered scales (50-950)
- **Spacing scale**: 4px base (1 = 4px, 2 = 8px, 4 = 16px, 8 = 32px)
- **Component naming**: PascalCase for React components, kebab-case for CSS @apply components
- **Dark mode**: Always define light first, then dark: overrides
- **Custom values**: Use config for repeatable tokens, arbitrary values for one-offs

## Project Structure Recommendation

```
src/
  styles/
    globals.css        # @tailwind directives, base styles, @apply components
    components.css     # Extracted component classes
    utilities.css      # Custom utility classes
  tailwind.config.ts   # Theme configuration, plugins, content paths
  postcss.config.mjs   # PostCSS with tailwindcss and autoprefixer
  components/
    ui/
      Button.tsx       # Component with Tailwind classes
      Card.tsx
      Modal.tsx
    layout/
      Container.tsx
      Grid.tsx
  index.html           # Entry point with content paths
```

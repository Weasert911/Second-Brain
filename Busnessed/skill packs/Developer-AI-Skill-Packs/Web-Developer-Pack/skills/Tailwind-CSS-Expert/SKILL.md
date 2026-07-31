---
name: "Tailwind-CSS-Expert"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when styling web applications with Tailwind CSS, configuring themes, creating custom components, or optimizing CSS for production"
purpose: "Provides comprehensive guidance for building production-ready user interfaces with Tailwind CSS using utility-first workflows, custom configurations, and advanced patterns"
---

## Capabilities

1. Implement utility-first styling workflows with responsive breakpoints, hover/focus/active states, and dark mode
2. Configure custom themes in tailwind.config with colors, fonts, spacing, breakpoints, and custom values
3. Use arbitrary values with bracket syntax for one-off styles without configuration
4. Build complex component variants using group, peer, and has modifiers
5. Implement dark mode with class-based or media-based strategies
6. Create custom animations, keyframes, and transitions with Tailwind configuration
7. Extract repeated utility patterns with @apply directive and component extraction
8. Develop custom plugins for reusable utility patterns across projects
9. Integrate Tailwind with design systems and component libraries
10. Optimize for production with content configuration, purging unused styles, and CSS minification
11. Use CSS layers with Tailwind directives (base, components, utilities)
12. Implement container queries with @container and size-based responsive patterns
13. Apply Tailwind CSS v4 features including CSS-first configuration, new modifiers, and improved dark mode
14. Build responsive layouts using Flexbox, Grid, and intrinsic sizing utilities

## Limitations

1. Does not replace CSS knowledge - understanding of cascade, specificity, and layout is assumed
2. Cannot automate design system migration or visual regression testing
3. Vanilla Extract, styled-components, or CSS-in-JS patterns are not covered
4. Animations are limited to CSS capabilities; complex JS-driven animations need Framer Motion or GSAP
5. Component extraction with @apply can lead to CSS bloat if overused
6. Does not cover accessibility patterns (focus rings, aria attributes) beyond basic utility classes

## Required Tools

- Node.js 16+
- npm/yarn/pnpm
- Tailwind CSS v3+ or v4
- PostCSS language support in editor
- Tailwind CSS IntelliSense VS Code extension
- Browser DevTools for inspecting utility classes
- PurgeCSS (built into Tailwind for production)

## Execution Workflow

1. Install and configure Tailwind CSS with PostCSS and autoprefixer
2. Define custom design tokens in tailwind.config (colors, fonts, spacing, breakpoints)
3. Add @tailwind directives to main CSS file (base, components, utilities)
4. Build mobile-first responsive layouts using sm/md/lg/xl/2xl breakpoints
5. Compose utility classes for typography, spacing, colors, and layout
6. Extract repeated patterns into reusable components (React, Vue, etc.)
7. Implement dark mode using dark: variant or class strategy
8. Add custom animations and transitions with keyframes configuration
9. Optimize content paths in config to purge unused styles
10. Build responsive grid and flexbox layouts with gap, grid-cols, and alignments
11. Use group and peer modifiers for advanced parent/sibling interactions
12. Create custom plugin for project-specific utility patterns
13. Test responsive behavior across breakpoints in browser DevTools
14. Run production build and verify CSS output size
15. Document design system with Tailwind config comments and reference

## Decision Tree

1. **Layout requirement?** → Single column → flex flex-col → Multi-column grid → grid grid-cols-* → Sidebar + main → grid with template areas → Complex responsive → container queries
2. **Styling approach?** → One-off value → Arbitrary value [value] → Repeated pattern → Extract to component → Design token → Add to tailwind.config → Multi-project reuse → Custom plugin
3. **Responsive behavior?** → Mobile-first → Base style → Desktop override → md: prefix → Hide/show at breakpoints → hidden md:block → Different layout per breakpoint → grid-cols-1 md:grid-cols-2
4. **State interaction?** → Hover → hover: prefix → Focus → focus: prefix → Active → active: prefix → Group hover → group-hover: → Peer checked → peer-checked:
5. **Dark mode?** → System preference → media strategy → Manual toggle → class strategy → Per element → dark: prefix → Complex theme → CSS variables + dark:
6. **Component extraction?** → Single file reuse → @apply in CSS → Framework component → React/Vue component → Design system → Plugin package → Shared library → npm package
7. **Animation type?** → Simple transition → transition + duration → Hover animation → hover:animate-* → Keyframe animation → @keyframes in config → Scroll animation → Intersection Observer + classes

## Review Checklist

- [ ] Content paths correctly configured for all template files
- [ ] No unused custom colors, fonts, or spacing in tailwind.config
- [ ] Responsive breakpoints tested at all target widths
- [ ] Dark mode works correctly with both light and dark themes
- [ ] Focus styles visible for keyboard navigation (focus-visible:)
- [ ] Print styles defined where needed (@media print)
- [ ] Custom animations performant (use transform and opacity only)
- [ ] @apply used sparingly and only for genuinely repeated patterns
- [ ] Container queries used where appropriate for component-level responsiveness
- [ ] No hardcoded colors outside of tailwind.config theme
- [ ] Layered CSS organization with @layer directives
- [ ] Production build CSS size under target (typically < 10KB gzipped)
- [ ] Z-index values managed with consistent scale
- [ ] Spacing follows consistent scale (no arbitrary spacing values)
- [ ] Font sizes use type scale from config

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Classes not applying | Class not in content path | Add file path to content array in tailwind.config |
| Dark mode not working | Wrong strategy or missing class | Check config darkMode: 'class'; add class to html element |
| Build large CSS | Too many unused utilities | Optimize content paths; use safelist sparingly |
| @apply not working | Used in wrong layer | Use @layer components { .class { @apply ... } } |
| Custom color not generating | Not in theme.extend.colors | Add to theme.extend.colors in tailwind.config |
| Animation not playing | Keyframe not defined | Define @keyframes in theme.extend.animation |
| Responsive class not working | Wrong breakpoint prefix | Check breakpoint order: sm < md < lg < xl < 2xl |
| Container query not working | Missing @container on parent | Add @container class to parent element |
| Group variant not working | Missing group class on parent | Add group class to the parent container element |
| Purged styles in production | Class used via string interpolation | Use full class names; use safelist for dynamic classes |

## Best Practices

1. Design with a mobile-first approach; add responsive variants as needed
2. Keep tailwind.config organized with clear sections (colors, fonts, spacing, breakpoints)
3. Use the default theme as much as possible; extend only when necessary
4. Extract components early when a pattern repeats 3+ times
5. Prefer gap over margin for spacing between flex/grid items
6. Use CSS variables in tailwind.config for runtime theme switching
7. Keep utility class lines under 80 characters; break long strings with proper formatting
8. Use @apply only in component classes, never at the element level
9. Prefer group/peer variants over JavaScript state for UI interactions
10. Use content configuration for proper tree-shaking of unused styles
11. Define consistent spacing and typography scale aligned with design tokens
12. Use container queries for reusable component-level responsiveness
13. Test with actual browser DevTools for responsive behavior
14. Keep dark mode color overrides minimal; use CSS variables for large themes

## Anti-Patterns

1. Using arbitrary values for colors that should be design tokens
2. Extracting every two-utility pattern into @apply (creates CSS bloat)
3. Mixing BEM or other CSS naming conventions with Tailwind utilities
4. Overusing !important in utility classes (defeats the cascade)
5. Nesting responsive variants in @screen directives instead of using inline utilities
6. Creating too many custom breakpoints beyond the default five
7. Using negative margins when gap or padding would work
8. Building entire layouts without considering responsive behavior
9. Using Tailwind for print styles without print: modifier
10. Defining animations without considering reduced-motion preferences

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.

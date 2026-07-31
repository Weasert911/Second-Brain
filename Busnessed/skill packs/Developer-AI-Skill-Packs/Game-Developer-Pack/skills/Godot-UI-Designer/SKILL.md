---
name: "Godot UI Designer"
version: "1.0.0"
domain: "Game Development"
activation_description: "Godot UI/UX design with Control nodes and themes"
purpose: "Make AI proficient in building responsive game UIs using Godot's Control node system, containers, themes, and localization"
---

## Capabilities
- Build responsive game UIs using Control node hierarchy
- Design layouts with Container nodes (HBox, VBox, Grid, Margin)
- Create and apply theme resources with custom styles
- Implement custom theme overrides per control
- Build responsive UI that adapts to screen resolution
- Implement accessibility features and focus management
- Use RichTextLabel with BBCode for formatted text
- Create custom Control nodes by extending existing ones
- Integrate UI animations with Tween and AnimationPlayer
- Localize UI with TranslationServer and CSV files
- Design touch-friendly UI for mobile platforms

## Limitations
- Does not cover GDScript programming in depth (see GDScript Best Practices)
- Does not cover 3D UI/overlay systems
- Does not cover Godot 3.x Control API differences

## Required Tools
- Godot 4.2+
- Image editor for UI textures/icons
- Font file (.ttf/.otf) for custom typography

## Execution Workflow
1. Design UI layout on paper/wireframe
2. Create root Control with full_rect anchor
3. Add Container nodes for responsive layout
4. Place Control elements (Label, Button, TextureRect, etc.)
5. Configure size flags, stretch ratios, and margins
6. Create theme resource with StyleBox textures
7. Apply theme to scene tree
8. Connect UI signals to game logic
9. Add keyboard/gamepad navigation
10. Implement localization

## Container Types
- HBoxContainer: Horizontal layout
- VBoxContainer: Vertical layout
- GridContainer: Grid layout
- MarginContainer: Adds margin to child
- CenterContainer: Centers single child
- AspectRatioContainer: Preserves aspect ratio

## References
- See references.md for Control node API reference
- See examples.md for common UI implementations
- See templates.md for reusable UI scene templates
- See checklists.md for UI implementation checklist
- See snippets.md for UI code patterns

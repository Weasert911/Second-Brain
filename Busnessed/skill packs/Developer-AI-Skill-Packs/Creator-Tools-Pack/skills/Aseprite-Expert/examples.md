# Aseprite-Expert Examples

## Beginner Example: Simple Game Icon

**Goal:** Create a 32x32 pixel art heart icon for a game UI.

**Steps:**
1. New file: 32x32, RGBA color mode, transparent background
2. Set palette: 8 colors (dark red, mid red, bright red, white, dark outline)
3. Use pencil tool at 1px size, draw heart outline in dark outline color
4. Fill interior with mid red using paint bucket
5. Add highlight pixels in bright red on top-left area
6. Add dark red for shadow on bottom-right
7. Add white specular highlight dot
8. Export as PNG with transparency

**Key Techniques:** Pencil drawing, fill tool, manual shading, small canvas pixel art, transparent export.

---

## Intermediate Example: Character Run Animation

**Goal:** Create a 4-frame run cycle for a 48x48 character sprite.

**Steps:**
1. New file: 48x48, RGBA, 4 frames
2. Draw character standing pose on frame 1 as reference
3. Frame 1: Contact pose (both feet on ground, arms extended)
4. Frame 2: Recover pose (back foot lifting, arms down)
5. Frame 3: Passing pose (feet passing each other, arms up)
6. Frame 4: High point (front foot forward, arms down)
7. Tag frames 1-4 as "Run" with 100ms per frame
8. Use onion skin to check motion flow and fix jitter
9. Export sprite sheet with JSON data at 2x scale

**Key Techniques:** Run cycle animation, frame-by-frame pixel art, onion skin use, motion flow, sprite sheet export.

---

## Advanced Example: Tileset with Auto-Tiling

**Goal:** Create a tileset for a dungeon environment with auto-tile support.

**Steps:**
1. New file: 32x32 tiles in 16x16 pixel resolution
2. Create base tiles: floor (4 variants), wall (4 variants), corner (4), doorway (2)
3. Draw floor tiles with subtle variation for organic look
4. Create wall tiles with stone texture and highlights
5. Add transition tiles for wall-to-floor blending
6. Tag tiles with auto-tile rules (bitmask-based placement)
7. Export as tileset image with tile index map
8. Import into Godot with tilemap node configuration
9. Build test level to verify auto-tile covers all cases

**Key Techniques:** Tileset design, auto-tile bitmask, texture variation, game engine tilemap integration, level testing.

---

## Production Example: Complete Character Asset Pack

**Goal:** Produce a full character asset pack with multiple animations and palette swaps.

**Steps:**
1. Character design: 32x32 base with 4 directional views (down, left, up, right)
2. Animation per direction: Idle (4 frames), Walk (6 frames), Run (4 frames), Attack (8 frames), Hurt (2 frames), Death (4 frames)
3. Create base character in main .aseprite file with all layers organized
4. Use cel layers for animation, groups for body parts (body, head, arms, legs, equipment)
5. Tag all animations: Idle_Down (frames 1-4), Idle_Left (5-8), etc.
6. Create palette swap files: damaged state, poisoned state, power-up state
7. Export individual sprite sheets per character variant
8. Generate JSON metadata with frame dimensions and pivot points
9. Create preview GIF for each animation
10. Document naming conventions and integration guide for game developers

**Key Techniques:** Multi-animation asset pipeline, directional sprites, palette swaps, JSON metadata, production documentation, organized layer structure.

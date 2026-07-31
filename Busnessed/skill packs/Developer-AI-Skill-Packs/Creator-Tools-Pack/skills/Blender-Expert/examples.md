# Blender-Expert Examples

## Beginner Example: Simple Low-Poly Chair

**Goal:** Create a low-poly wooden chair with basic materials.

**Steps:**
1. Add a cube (Shift+A > Mesh > Cube), scale to 0.4 x 0.4 x 0.05 for seat
2. Add four cylinders for legs, scale to 0.03 x 0.03 x 0.4, position at corners
3. Add a cube for backrest, scale 0.4 x 0.02 x 0.3, position tilted back
4. Join all objects (select all, Ctrl+J)
5. Tab into Edit Mode, select all faces, assign a simple wood material (Principled BSDF with brown base color)
6. Add a plane as ground, apply HDRI world lighting
7. Render with EEVEE at 1920x1080

**Key Techniques:** Primitive modeling, basic transforms, simple material assignment, EEVEE rendering.

---

## Intermediate Example: PBR Prop with UV Unwrapping

**Goal:** Create a detailed sci-fi crate with PBR texture maps.

**Steps:**
1. Box model a cube with beveled edges (Ctrl+B), add edge loops for panel details
2. Apply Subdivision Surface modifier with level 2
3. Mark seams along edges, smart UV project with 0.1 margin
4. Create PBR material in Shader Editor: Principled BSDF connected to Image Texture nodes for albedo, roughness, metallic, normal
5. Bake high-poly detail to low-poly using Bake > Normal and Bake > Combined
6. Set up three-point lighting: key, fill, rim
7. Render with Cycles at 200 samples with denoising

**Key Techniques:** Non-destructive modeling, seam-based UV unwrapping, PBR texture baking, three-point lighting.

---

## Advanced Example: Character Rig with IK/FK Switch

**Goal:** Rig a humanoid character with IK/FK switching for arms and legs.

**Steps:**
1. Model base mesh in T-pose with proper edge loops at joints
2. Create armature: spine chain, leg chain (hip-knee-ankle), arm chain (shoulder-elbow-wrist)
3. Set IK constraints on legs with pole targets at knees
4. Set up IK/FK switch using custom properties on arm bones
5. Use drivers to blend between IK and FK constraint influence
6. Weight paint vertex groups: smooth transitions at shoulders and hips
7. Create a simple walk cycle using NLA tracks
8. Test deformation by posing extreme angles

**Key Techniques:** IK chains, pole targets, custom properties, drivers, weight painting, NLA animation.

---

## Production Example: Architectural Visualization Scene

**Goal:** Produce a photorealistic interior render for an architectural project.

**Steps:**
1. Import CAD floor plan as reference, model walls, floor, ceiling
2. Apply Boolean modifiers for windows and door openings
3. Use Array modifier for repeating elements (floorboards, ceiling beams)
4. Assign PBR materials: hardwood floor, painted walls, glass windows
5. Set up HDRI environment with sun lamp for directional light
6. Add interior lights: emission planes for ceiling panels, spot lamps for accent
7. Place camera at eye level, set composition using rule of thirds overlay
8. Configure Cycles: 4096 samples, OptiX denoising, 4K resolution
9. Post-process in Compositor: glare, lens distortion, color grade
10. Export EXR image sequence for archival and client review

**Key Techniques:** CAD integration, Boolean architecture, Array modifier, HDRI + artificial lighting, high-sample Cycles, compositing pipeline.

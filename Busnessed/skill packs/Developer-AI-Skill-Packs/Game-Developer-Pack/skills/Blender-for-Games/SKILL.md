---
name: "Blender for Games"
version: "1.0.0"
domain: "Game Development"
activation_description: "Blender game asset creation for Godot engine"
purpose: "Make AI proficient in creating game-ready 3D assets with Blender, including low-poly modeling, UV mapping, PBR materials, rigging, animation baking, and export to Godot"
---

## Capabilities
- Create low-poly 3D models optimized for real-time rendering
- Apply UV mapping and texture packing for efficient rendering
- Set up PBR materials (metallic/roughness workflow)
- Rig characters with armatures and weight painting
- Bake animations for game engine import
- Use shape keys for facial animation
- Export models as GLTF/GLB for Godot
- Handle FBX export with proper settings
- Generate LOD levels for performance
- Create collision meshes for physics bodies
- Bake textures (normal maps, ambient occlusion, curvature)

## Limitations
- Does not cover Blender sculpting or high-poly modeling in depth
- Does not cover Blender Grease Pencil (2D animation)
- Does not cover Godot engine import pipeline in depth (see Godot 4 Expert)
- Does not cover texture painting in Blender vs external tools

## Required Tools
- Blender 3.6+ (4.0+ recommended)
- Godot 4.2+ for import testing
- Image editor (Photoshop, GIMP, Krita) for texture editing

## Execution Workflow
1. Design asset with tri-count budget in mind
2. Model low-poly base mesh
3. UV unwrap with optimal texel density
4. Bake detail maps (normal, AO) from high-poly (optional)
5. Create PBR texture set (albedo, metallic, roughness, normal)
6. Rig model with armature for animated assets
7. Skin weight painting
8. Create and bake animations
9. Export as GLTF/GLB
10. Import to Godot and verify

## Modeling Guidelines
- Tri count: <10K for characters, <500 for props (mobile)
- Quads preferred for deformation, tris acceptable for static
- Clean topology with edge flow for animated models
- Non-manifold geometry must be fixed
- Scale: 1 Blender unit = 1 Godot unit (meter)

## References
- See references.md for Blender-to-Godot workflow reference
- See examples.md for complete asset creation walkthroughs
- See templates.md for Blender project templates
- See checklists.md for pre-export validation checklist
- See snippets.md for Blender Python scripts

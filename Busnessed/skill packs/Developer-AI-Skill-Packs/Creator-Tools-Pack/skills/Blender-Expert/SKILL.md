---
name: Blender-Expert
version: 1.0.0
domain: Creator Tools
activation_description: Load this skill when the user asks about Blender 3D modeling, sculpting, animation, rendering, geometry nodes, shader nodes, rigging, UV mapping, or Python bpy scripting.
purpose: Provide expert-level guidance on Blender 3D creation workflows including modeling, texturing, rigging, animation, rendering, compositing, and scripting.
---

## Capabilities

- Model 3D objects using box modeling, sculpting, retopology, and curve-based techniques
- Apply and configure modifiers including subdivision surface, mirror, boolean, array, bevel, solidify, and lattice
- Create and edit materials using Principled BSDF, node groups, and custom shader networks
- Perform UV unwrapping with smart UV project, seams, and manual layout
- Paint textures directly onto 3D models in the texture paint workspace
- Rig characters with armatures, IK/FK switching, constraints, and weight painting
- Animate objects and characters using keyframes, graph editor, dope sheet, and NLA tracks
- Build procedural geometry with geometry nodes modifier
- Render scenes using EEVEE and Cycles with optimized sampling settings
- Composite renders with the compositor node graph
- Develop Blender add-ons using Python bpy module
- Generate HDRI lighting setups and PBR material workflows
- Manage complex scenes with collections, linking, and library override
- Create particle systems for hair, fur, and environmental effects
- Optimize viewport performance and render times for production assets

## Limitations

- Cannot execute Blender Python scripts directly; provides code for manual execution
- Rendering guidance is theoretical; actual output depends on hardware and scene complexity
- Physics simulations (cloth, fluid, rigid body) are covered at intermediate depth only
- Cannot replace hands-on experience with Blender's interface and navigation
- Complex character rigging for production may require additional specialized study

## Required Tools

- Blender 4.0+ installed on the user's system
- Python 3.10+ for add-on development and scripting
- Image editor (Photoshop, GIMP, or Krita) for texture creation
- Version control system (Git) for add-on and project files

## Execution Workflow

1. Identify the user's specific task: modeling, texturing, rigging, animation, or rendering
2. Determine the target output medium: game asset, film, motion graphics, or print
3. Select the appropriate Blender workspace (modeling, sculpting, texture paint, shading, layout, animation, rendering, compositing)
4. Establish scene scale and unit settings matching the project requirements
5. Build or import base geometry using chosen modeling methodology
6. Apply modifiers in correct order for non-destructive workflow
7. Unwrap UVs and assign materials with appropriate shader node setups
8. Set up lighting: HDRI environment, area lights, or emission-based illumination
9. Configure camera composition, depth of field, and output resolution
10. Adjust render engine settings (samples, denoising, light paths) for quality/performance balance
11. Export final output: image sequence, video file, or model format as required
12. Review output against reference and iterate on identified issues

## Decision Tree

- Task type → {Modeling, Texturing, Rigging, Animation, Rendering, Scripting}
- Modeling intent → {High-poly sculpt, Low-poly game asset, CAD precision, Organic form}
- Texture need → {Procedural (node-based), Painted, UV-mapped photo, PBR texture set}
- Rig complexity → {Simple bone chain, IK-FK hybrid, Facial rig, Full production rig}
- Animation target → {Keyframe, Physics sim, Motion capture retarget, Procedural (drivers)}
- Render engine → {EEVEE (real-time), Cycles (path-traced), Workbench (preview)}
- Output resolution → {Preview (1080p), Web delivery (4K), Cinema (6K+)}
- Performance issue → {Viewport lag, Long render times, Out-of-memory, Texture baking errors}

## Review Checklist

- [ ] Scene scale and units match real-world proportions
- [ ] Modifier stack order produces correct geometry
- [ ] UV islands have appropriate texel density for intended use
- [ ] Material node tree compiles without errors
- [ ] Armature deforms mesh without vertex pinching
- [ ] Animation curves have proper interpolation (no overshoot)
- [ ] Particle systems respect emission limits
- [ ] Render samples are sufficient for noise-free output
- [ ] Compositor nodes are connected in correct order
- [ ] Export format matches target platform requirements
- [ ] Texture maps are in correct color space (sRGB vs Non-Color)
- [ ] All linked assets are properly packed or referenced

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| Boolean modifier fails | Non-manifold geometry | Apply remesh or cleanup modifier before boolean |
| Sculpt brush unresponsive | Low subdivision level | Apply multi-resolution modifier or dynamic topology |
| UV map stretched | Incorrect seam placement | Adjust seams and re-unwrap with proper island orientation |
| Render has fireflies | High variance in light paths | Increase clamp indirect value or use denoising |
| Weight paint bleeds | Insufficient vertex count | Subdivide mesh or use weight gradient tool |
| Animation jitters | Non-uniform keyframe interpolation | Set interpolation to Bezier and adjust handles |
| Geometry nodes slow | Too many instances | Use realize instances only when necessary |
| Texture paint shows seams | UV island padding too small | Increase bleed margin in bake settings |
| Armature deforms mesh incorrectly | Wrong envelope weights | Clean weight paint or use automatic weights |
| Cycles render very slow | Too many bounces or high sample count | Reduce max bounces and use adaptive sampling |
| Add-on fails to register | Incorrect bl_info or register order | Verify bl_info dictionary and unregister order |
| EEVEE shadows look blocky | Shadow map resolution too low | Increase shadow cube size in render settings |

## Best Practices

- Always use real-world scale for physically accurate lighting and simulation
- Apply transforms (location, rotation, scale) before adding modifiers
- Name objects, materials, and vertex groups descriptively for scene organization
- Use collections to organize scene elements logically
- Enable auto-save and set frequent save intervals under Preferences > Save & Load
- Bake texture maps for consistent results across render engines
- Use reference images in orthographic viewports for modeling accuracy
- Keep vertex counts manageable for viewport performance
- Use linked duplicates (Alt+D) for repeated objects to save memory
- Leverage asset browser for frequently used materials, objects, and node groups

## Anti-Patterns

- Applying subdivision surface modifier before finalizing base mesh shape
- Using ngons in mesh that will be exported to game engines
- Baking textures before UV layout is finalized
- Rigging before model is in final pose (model should be in rest pose)
- Animating directly on bones without using constraints or IK where appropriate
- Neglecting object origin placement causing transform issues later
- Using too many high-resolution textures when lower resolutions suffice
- Creating complex node trees without grouping for reusability
- Ignoring face normals direction causing shading artifacts
- Working without saving backup versions before major changes

## References

Companion files: references.md, examples.md, templates.md, checklists.md, snippets.md

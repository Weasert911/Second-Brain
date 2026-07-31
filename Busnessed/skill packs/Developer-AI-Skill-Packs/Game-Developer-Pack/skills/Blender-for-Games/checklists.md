# Blender for Games - Checklists

## Pre-Export Checklist

### Mesh
- [ ] All normals facing outward (Face Orientation overlay)
- [ ] No duplicate vertices (Merge by Distance)
- [ ] No zero-area faces
- [ ] No loose geometry
- [ ] Scale applied (Ctrl+A > Scale)
- [ ] Rotation applied (Ctrl+A > Rotation)
- [ ] Location applied for animated objects
- [ ] Origin set appropriately (bottom of character)
- [ ] Tri count within budget
- [ ] Quad topology for animated meshes
- [ ] No N-gons (triangulated for game engines)

### UV
- [ ] All faces have UV coordinates
- [ ] No overlapping UV islands
- [ ] Texel density consistent
- [ ] UV islands oriented consistently
- [ ] 2-4px padding between islands
- [ ] UV space efficiently used

### Materials
- [ ] PBR material setup (metallic/roughness)
- [ ] Texture paths are relative (//textures/)
- [ ] Textures in supported format (PNG, JPEG)
- [ ] Material slots named clearly
- [ ] Use Principled BSDF shader

### Rigging
- [ ] Armature modifiers applied correctly
- [ ] Weight painting complete (no stray vertices)
- [ ] Max 4 weights per vertex
- [ ] Bone roll set correctly
- [ ] IK/FK constraints set up if needed
- [ ] Rest pose matches T-pose/A-pose

### Animation
- [ ] All actions named clearly
- [ ] Animation ranges correct
- [ ] Keyframes smooth (no abrupt jumps)
- [ ] Loop animations seamless
- [ ] Root motion handled correctly

### Export Settings
- [ ] GLTF/GLB format (preferred) or FBX
- [ ] Forward axis: -Z
- [ ] Up axis: Y
- [ ] Scale: 1.0
- [ ] Apply modifiers checked
- [ ] Export animations checked
- [ ] Export skinning checked
- [ ] Export shape keys checked (if used)
- [ ] Embed textures (GLB) or reference (GLTF)

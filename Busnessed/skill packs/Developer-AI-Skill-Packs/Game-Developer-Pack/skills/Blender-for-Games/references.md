# Blender for Games - References

## Blender Setup for Game Development

### Recommended Add-ons
- Node Wrangler (built-in)
- UV Squares
- LoopTools
- GLTF Export (built-in)
- Better FBX Importer/Exporter

### Viewport Settings
- Viewport Shading: Solid for modeling, Material Preview for texturing
- Overlays: Enable Face Orientation for normals check
- Transform: Set to Global for initial layout

## Low-Poly Modeling

### Modeling Principles
```
Quads preferred for animation deformation
Tris acceptable for static objects
Edge flow follows muscle/mechanical structure
No NGons (faces with >4 vertices)
All normals facing outward
No internal faces
Minimum viable geometry
```

### Tri-Count Budgets
| Platform | Character | Prop | Environment (per scene) |
|----------|-----------|------|------------------------|
| Mobile | 2K-5K | 100-500 | 50K-100K |
| Desktop | 5K-15K | 500-2K | 100K-500K |
| VR | 3K-10K | 200-1K | 50K-200K |

### Modifier Stack
```
1. Mirror (symmetry)
2. Subdivision Surface (if needed)
3. Bevel (edge rounding)
4. Decimate (tri reduction)
5. Armature (rigging)
6. Triangulate (for export)
```

## UV Mapping

### UV Best Practices
- Maximize UV space usage (minimize wasted area)
- Maintain consistent texel density
- Use seams at hidden edges (behind objects, under arms)
- Straighten UV islands for pixel-perfect textures
- Add 2-4px padding between islands
- Orient islands consistently

### Texel Density
```
Game resolution: e.g., 1024px/m
Character: 2048px texture, ~10m texel density
Prop: 512px texture, ~5m texel density
Environment: 4096px texture, variable density
```

## PBR Material Setup

### Principled BSDF Node
```
Base Color (Albedo) - Diffuse color map
Metallic - Metalness map (0=dialectic, 1=metal)
Roughness - Smoothness inverted (0=smooth, 1=rough)
Normal Map - Surface detail
Ambient Occlusion - Contact shadows
Displacement - Height map (optional)
```

### PBR Workflow
```python
# Material setup in Blender Python
import bpy

mat = bpy.data.materials.new(name="GameMaterial")
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links

# Clear default
for node in nodes:
    nodes.remove(node)

# Create nodes
output = nodes.new(type='ShaderNodeOutputMaterial')
principled = nodes.new(type='ShaderNodeBsdfPrincipled')
tex_coord = nodes.new(type='ShaderNodeTexCoord')
mapping = nodes.new(type='ShaderNodeMapping')
albedo = nodes.new(type='ShaderNodeTexImage')
normal = nodes.new(type='ShaderNodeTexImage')
normal_map = nodes.new(type='ShaderNodeNormalMap')

# Link nodes
links.new(principled.outputs[0], output.inputs[0])
links.new(albedo.outputs[0], principled.inputs[0])
links.new(normal.outputs[0], normal_map.inputs[1])
links.new(normal_map.outputs[0], principled.inputs[17])
```

## Rigging and Armatures

### Armature Structure
```
Armature
├── Root (bone) - controls entire character
├── Spine
│   ├── Chest
│   │   ├── Shoulder.L
│   │   │   └── UpperArm.L > Forearm.L > Hand.L
│   │   └── Shoulder.R
│   │       └── UpperArm.R > Forearm.R > Hand.R
│   ├── Hips
│   └── Head
│       └── Neck
└── Legs
    ├── Thigh.L > Shin.L > Foot.L > Toe.L
    └── Thigh.R > Shin.R > Foot.R > Toe.R
```

### Weight Painting
- Use Auto Weights as starting point
- Max 4 weights per vertex
- Smooth transitions at joints (elbows, knees)
- Clean weights: no stray vertices
- Use weight gradient for natural falloff

### Bone Constraints
- Inverse Kinematics (IK) for legs
- Copy Rotation for chain reactions
- Limit Rotation for joint restrictions
- Child Of for parent switching
- Stretch To for cables/tentacles

## Animation Baking

### Baking Process
1. Create animation in Blender (all keyframes)
2. Select armature
3. Pose > Animation > Bake Action
4. Settings:
   - Only Selected Bones: Yes
   - Visual Keying: Yes
   - Clear Constraints: Yes
   - Clear Parents: Yes
   - Bake Data: Pose
5. Rename baked action
6. Export with NLA Strip

### Animation Types for Games
```
idle - looping, relaxed stance
walk - looping, cycle gait
run - looping, faster cycle
jump - non-looping, start->apex->land
attack - non-looping, windup->strike->recovery
hit - non-looping, reactive stagger
death - non-looping, final pose
```

## Shape Keys

### Shape Key Workflow
1. Duplicate base mesh
2. Edit duplicate to target shape
3. Select original mesh
4. Add shape key (Basis)
5. Add shape key (Target)
6. Select target and vertex select
7. Use "Shape from Mix" for complex blends

### Common Shape Keys
```
- Expression: smile, frown, angry, surprised
- Phonemes: A, E, I, O, U, M, F, L, Rest
- Blink: left_eye_blink, right_eye_blink
- Morph targets: open_mouth, raised_brow
```

## GLTF/GLB Export for Godot

### Export Settings
```python
bpy.ops.export_scene.gltf(
    filepath="model.glb",
    export_format="GLB",  # GLB for single file, GLTF for separate
    export_texcoords=True,
    export_normals=True,
    export_materials=True,
    export_original_specular=False,
    export_apply=True,  # Apply modifiers
    export_animations=True,
    export_frame_range=True,
    export_skins=True,
    export_morph=True,  # Shape keys
    export_image_format="AUTO",  # PNG or JPEG
    export_current_frame=False,
)
```

### Godot Import Settings
```gdscript
# In Godot inspector after import:
# Mesh:
#   - Compress: Enabled (Draco)
#   - Generate LOD: Enabled (for large meshes)
# Material:
#   - Material Override: None or imported
# Animation:
#   - Import: Enabled
# Skin:
#   - Import: Enabled (for skinned meshes)
```

## FBX Export

### FBX Export Settings
```python
bpy.ops.export_scene.fbx(
    filepath="model.fbx",
    use_selection=True,
    object_types={'ARMATURE', 'MESH'},
    add_leaf_bones=False,
    bake_anim=True,
    bake_anim_use_all_bones=True,
    bake_anim_use_nla_strips=True,
    mesh_smooth_type='EDGE',
    path_mode='COPY',
    embed_textures=True,
)
```

### FBX to Godot Notes
- FBX may require manual material setup
- Bone orientation may differ from Blender
- Scale factor: 1.0 (Blender unit = Godot unit)
- Forward axis: -Z forward
- Up axis: Y up

## LOD Generation

### Blender Decimation
```python
import bpy

def generate_lod(obj, reduction_ratio, name_suffix):
    decimate = obj.modifiers.new(name="Decimate", type='DECIMATE')
    decimate.ratio = reduction_ratio
    # Apply modifier and rename
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=decimate.name)
    obj.name = obj.name + name_suffix

# LOD0: original (100%)
# LOD1: 50% tris
# LOD2: 25% tris
# LOD3: 10% tris
```

## Collision Mesh Creation

### Simplified Collision
```python
def create_collision_mesh(obj):
    # Duplicate and simplify
    collision = obj.copy()
    collision.data = obj.data.copy()
    # Remove subdivision
    # Apply decimate modifier
    decimate = collision.modifiers.new(name="Decimate", type='DECIMATE')
    decimate.ratio = 0.1
    bpy.context.collection.objects.link(collision)
    return collision
```

### Godot Collision Shapes
- Use primitive shapes when possible (box, sphere, capsule)
- Convex decomposition for complex objects
- Mesh convex for simple objects
- Add `_col` suffix to collision meshes for Godot recognition

## Texture Baking

### Common Bake Types
```python
# Normal Map
bpy.ops.object.bake(type='NORMAL')

# Ambient Occlusion
bpy.ops.object.bake(type='AO')

# Roughness
bpy.ops.object.bake(type='ROUGHNESS')

# Combined PBR
# Use multiple bake passes to different image textures
```

### Bake Settings
```
Samples: 128-256 (AO/Normal)
Extrusion: 0.1-0.5 (avoid edge artifacts)
Max Ray Distance: 1.0 (for AO)
Margin: 4px (padding between islands)
Selected to Active: Yes (high-poly to low-poly)
Use Cage: Optional (for complex shapes)
```

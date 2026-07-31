# Blender for Games - Examples

## Low-Poly Character Creation

```python
# Blender Python script to create a simple low-poly character
import bpy

def create_low_poly_character():
    # Clear scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    # Create body (torso)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1))
    body = bpy.context.active_object
    body.name = "Body"
    body.scale = (0.8, 0.5, 0.6)

    # Create head
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.4, location=(0, 0, 1.8))
    head = bpy.context.active_object
    head.name = "Head"

    # Create arms
    bpy.ops.mesh.primitive_cube_add(size=0.3, location=(1.0, 0, 1.2))
    arm_l = bpy.context.active_object
    arm_l.name = "Arm_L"
    arm_l.scale = (0.15, 0.15, 0.8)

    bpy.ops.mesh.primitive_cube_add(size=0.3, location=(-1.0, 0, 1.2))
    arm_r = bpy.context.active_object
    arm_r.name = "Arm_R"
    arm_r.scale = (0.15, 0.15, 0.8)

    # Create legs
    bpy.ops.mesh.primitive_cube_add(size=0.3, location=(0.3, 0, 0.3))
    leg_l = bpy.context.active_object
    leg_l.name = "Leg_L"
    leg_l.scale = (0.15, 0.15, 0.6)

    bpy.ops.mesh.primitive_cube_add(size=0.3, location=(-0.3, 0, 0.3))
    leg_r = bpy.context.active_object
    leg_r.name = "Leg_R"
    leg_r.scale = (0.15, 0.15, 0.6)

    # Join all parts
    bpy.ops.object.select_all(action='SELECT')
    bpy.context.view_layer.objects.active = body
    bpy.ops.object.join()

    # Add subdivision surface for smooth look
    bpy.ops.object.modifier_add(type='SUBSURF')
    bpy.context.object.modifiers["Subdivision"].levels = 2

    # Add armature
    bpy.ops.object.armature_add(location=(0, 0, 1))
    armature = bpy.context.active_object
    armature.name = "Armature"

    return armature

# Run
character = create_low_poly_character()
```

## UV Unwrapping Example

```python
# UV unwrapping script
import bpy

def uv_unwrap_object(obj):
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')

    # Select all faces
    bpy.ops.mesh.select_all(action='SELECT')

    # Mark seams (example: for a cube, mark edges around top/bottom)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_mode(type='EDGE')

    # Smart UV Project (easy method)
    bpy.ops.uv.smart_project(
        angle_limit=66,
        island_margin=0.02,
        area_weight=0.0
    )

    # Or use Lightmap Pack (for game assets)
    # bpy.ops.uv.lightmap_pack(
    #     PREF_CONTEXT='ALL_FACES',
    #     PREF_PACK_IN_ONE=True,
    #     PREF_NEW_UV_LAYER='UVMap_Game'
    # )

    bpy.ops.object.mode_set(mode='OBJECT')
    print("UV unwrapped: ", obj.name)

# Usage
for obj in bpy.context.selected_objects:
    if obj.type == 'MESH':
        uv_unwrap_object(obj)
```

## Animation Baking

```python
# Bake animation for game export
import bpy

def bake_animation(armature_obj, start_frame=1, end_frame=30):
    bpy.context.view_layer.objects.active = armature_obj
    bpy.ops.object.mode_set(mode='POSE')

    # Select all bones
    bpy.ops.pose.select_all(action='SELECT')

    # Bake action
    bpy.ops.nla.bake(
        frame_start=start_frame,
        frame_end=end_frame,
        only_selected=True,
        visual_keying=True,
        clear_constraints=True,
        clear_parents=True,
        use_current_action=True,
        bake_types={'POSE'}
    )

    bpy.ops.object.mode_set(mode='OBJECT')

    # Rename baked action
    if armature_obj.animation_data and armature_obj.animation_data.action:
        armature_obj.animation_data.action.name = "Baked_Walk"

# Usage
bake_animation(bpy.data.objects["Armature"], 1, 30)
```

## GLTF Export

```python
import bpy

def export_to_godot():
    # Settings for Godot
    export_path = "C:/MyGame/assets/models/character.glb"

    bpy.ops.export_scene.gltf(
        filepath=export_path,
        export_format='GLB',
        export_texcoords=True,
        export_normals=True,
        export_materials='EXPORT',
        export_original_specular=False,
        export_apply=True,
        export_animations=True,
        export_frame_range=True,
        export_skins=True,
        export_morph=True,
        export_current_frame=False,
        export_image_format='AUTO',
        export_texture_dir='',
        export_keep_originals=False
    )
    print("Exported to: ", export_path)

# Run
export_to_godot()
```

## Collision Mesh Generation

```python
import bpy

def create_collision_mesh(source_obj):
    """Create a simplified collision mesh for physics"""
    bpy.ops.object.select_all(action='DESELECT')

    # Duplicate source mesh
    bpy.context.view_layer.objects.active = source_obj
    bpy.ops.object.select_pattern(pattern=source_obj.name)
    bpy.ops.object.duplicate()

    collision = bpy.context.active_object
    collision.name = source_obj.name + "_col"

    # Add decimate modifier for simplification
    decimate = collision.modifiers.new(name="Decimate", type='DECIMATE')
    decimate.ratio = 0.1
    decimate.use_collapse_triangulate = True

    # Apply modifier
    bpy.ops.object.modifier_apply(modifier=decimate.name)

    # Make convex
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = collision
    bpy.ops.object.select_pattern(pattern=collision.name)

    bpy.ops.mesh.convex_hull()

    # Move to collision collection
    col_collection = bpy.data.collections.get("Collision")
    if not col_collection:
        col_collection = bpy.data.collections.new("Collision")
        bpy.context.scene.collection.children.link(col_collection)

    # Remove from current collections and add to collision
    for col in collision.users_collection:
        col.objects.unlink(collision)
    col_collection.objects.link(collision)

    return collision

# Usage
for obj in bpy.data.objects:
    if obj.type == 'MESH' and not obj.name.endswith('_col'):
        create_collision_mesh(obj)
```

## PBR Material Setup

```python
import bpy

def create_pbr_material(name="GameMaterial", textures={}):
    """Create a PBR material for Godot
    textures dict: {'albedo': path, 'metallic': path, 'roughness': path, 'normal': path, 'ao': path}
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear default nodes
    nodes.clear()

    # Create node tree
    output = nodes.new(type='ShaderNodeOutputMaterial')
    output.location = (400, 0)

    principled = nodes.new(type='ShaderNodeBsdfPrincipled')
    principled.location = (100, 0)

    tex_coord = nodes.new(type='ShaderNodeTexCoord')
    tex_coord.location = (-800, 0)

    mapping = nodes.new(type='ShaderNodeMapping')
    mapping.location = (-600, 0)

    # Link principled to output
    links.new(principled.outputs['BSDF'], output.inputs['Surface'])

    # Load textures and set up nodes
    if textures.get('albedo'):
        img = bpy.data.images.load(textures['albedo'])
        tex_node = nodes.new(type='ShaderNodeTexImage')
        tex_node.image = img
        tex_node.location = (-400, 200)
        links.new(tex_coord.outputs['UV'], mapping.inputs['Vector'])
        links.new(mapping.outputs['Vector'], tex_node.inputs['Vector'])
        links.new(tex_node.outputs['Color'], principled.inputs['Base Color'])

    if textures.get('normal'):
        img = bpy.data.images.load(textures['normal'])
        tex_node = nodes.new(type='ShaderNodeTexImage')
        tex_node.image = img
        tex_node.location = (-400, -50)
        normal_map = nodes.new(type='ShaderNodeNormalMap')
        normal_map.location = (-200, -50)
        links.new(tex_node.outputs['Color'], normal_map.inputs['Color'])
        links.new(normal_map.outputs['Normal'], principled.inputs['Normal'])

    if textures.get('metallic'):
        # Use image texture node for metallic
        pass

    return mat

# Usage
textures = {
    'albedo': 'C:/textures/character_albedo.png',
    'normal': 'C:/textures/character_normal.png',
}
mat = create_pbr_material("CharacterMat", textures)
```

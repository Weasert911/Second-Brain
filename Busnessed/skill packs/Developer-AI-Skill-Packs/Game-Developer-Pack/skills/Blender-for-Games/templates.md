# Blender for Games - Templates

## Low-Poly Model Template

```python
import bpy

def create_low_poly_template():
    """Creates a low-poly base mesh template"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    # Base cube with subdivision
    bpy.ops.mesh.primitive_cube_add(size=2.0, location=(0, 0, 0))
    obj = bpy.context.active_object
    obj.name = "BaseMesh"

    # Add subdivision surface
    bpy.ops.object.modifier_add(type='SUBSURF')
    obj.modifiers["Subdivision"].levels = 2

    # Add mirror modifier
    bpy.ops.object.modifier_add(type='MIRROR')
    obj.modifiers["Mirror"].use_axis[0] = True
    obj.modifiers["Mirror"].use_axis[1] = False
    obj.modifiers["Mirror"].use_axis[2] = False

    # Setup material slots
    mat = bpy.data.materials.new(name="GameMaterial")
    mat.use_nodes = True
    obj.data.materials.append(mat)

    # Setup collections
    if "Models" not in bpy.data.collections:
        col = bpy.data.collections.new("Models")
        bpy.context.scene.collection.children.link(col)
    else:
        col = bpy.data.collections["Models"]

    # Move to collection
    for c in obj.users_collection:
        c.objects.unlink(obj)
    col.objects.link(obj)

    # Set viewport settings
    for area in bpy.context.screen.areas:
        if area.type == 'VIEW_3D':
            area.spaces.active.overlay.show_wireframes = False
            area.spaces.active.shading.type = 'MATERIAL'

    return obj

create_low_poly_template()
```

## Rig Template

```python
import bpy

def create_basic_rig():
    """Creates a basic bipedal rig for game characters"""
    bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 1))
    armature = bpy.context.active_object
    armature.name = "Armature"
    bones = armature.data.edit_bones

    # Spine
    root = bones.new("Root")
    root.head = (0, 0, 0)
    root.tail = (0, 0, 0.5)

    spine = bones.new("Spine")
    spine.head = (0, 0, 0.5)
    spine.tail = (0, 0, 1.0)
    spine.parent = root

    chest = bones.new("Chest")
    chest.head = (0, 0, 1.0)
    chest.tail = (0, 0, 1.4)
    chest.parent = spine

    # Head
    neck = bones.new("Neck")
    neck.head = (0, 0, 1.4)
    neck.tail = (0, 0, 1.55)
    neck.parent = chest

    head = bones.new("Head")
    head.head = (0, 0, 1.55)
    head.tail = (0, 0, 1.8)
    head.parent = neck

    # Left arm
    shoulder_l = bones.new("Shoulder_L")
    shoulder_l.head = (0.5, 0, 1.35)
    shoulder_l.tail = (0.7, 0, 1.35)
    shoulder_l.parent = chest

    upper_arm_l = bones.new("UpperArm_L")
    upper_arm_l.head = (0.7, 0, 1.35)
    upper_arm_l.tail = (0.7, 0, 0.9)
    upper_arm_l.parent = shoulder_l

    forearm_l = bones.new("Forearm_L")
    forearm_l.head = (0.7, 0, 0.9)
    forearm_l.tail = (0.7, 0, 0.5)
    forearm_l.parent = upper_arm_l

    hand_l = bones.new("Hand_L")
    hand_l.head = (0.7, 0, 0.5)
    hand_l.tail = (0.7, 0, 0.35)
    hand_l.parent = forearm_l

    # Right arm (mirror)
    shoulder_r = bones.new("Shoulder_R")
    shoulder_r.head = (-0.5, 0, 1.35)
    shoulder_r.tail = (-0.7, 0, 1.35)
    shoulder_r.parent = chest

    upper_arm_r = bones.new("UpperArm_R")
    upper_arm_r.head = (-0.7, 0, 1.35)
    upper_arm_r.tail = (-0.7, 0, 0.9)
    upper_arm_r.parent = shoulder_r

    forearm_r = bones.new("Forearm_R")
    forearm_r.head = (-0.7, 0, 0.9)
    forearm_r.tail = (-0.7, 0, 0.5)
    forearm_r.parent = upper_arm_r

    hand_r = bones.new("Hand_R")
    hand_r.head = (-0.7, 0, 0.5)
    hand_r.tail = (-0.7, 0, 0.35)
    hand_r.parent = forearm_r

    # Left leg
    thigh_l = bones.new("Thigh_L")
    thigh_l.head = (0.3, 0, 0.5)
    thigh_l.tail = (0.3, 0, 0.0)
    thigh_l.parent = root

    shin_l = bones.new("Shin_L")
    shin_l.head = (0.3, 0, 0.0)
    shin_l.tail = (0.3, 0, -0.5)
    shin_l.parent = thigh_l

    foot_l = bones.new("Foot_L")
    foot_l.head = (0.3, 0, -0.5)
    foot_l.tail = (0.35, 0.15, -0.5)
    foot_l.parent = shin_l

    # Right leg (mirror)
    thigh_r = bones.new("Thigh_R")
    thigh_r.head = (-0.3, 0, 0.5)
    thigh_r.tail = (-0.3, 0, 0.0)
    thigh_r.parent = root

    shin_r = bones.new("Shin_R")
    shin_r.head = (-0.3, 0, 0.0)
    shin_r.tail = (-0.3, 0, -0.5)
    shin_r.parent = thigh_r

    foot_r = bones.new("Foot_R")
    foot_r.head = (-0.3, 0, -0.5)
    foot_r.tail = (-0.35, 0.15, -0.5)
    foot_r.parent = shin_r

    bpy.ops.object.mode_set(mode='OBJECT')
    return armature

create_basic_rig()
```

## GLTF Export Template

```python
import bpy
import os

def export_to_godot(output_dir, export_name):
    """Standardized export for Godot"""
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, export_name + ".glb")

    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        export_texcoords=True,
        export_normals=True,
        export_materials='EXPORT',
        export_apply=True,
        export_animations=True,
        export_skins=True,
        export_morph=True,
        export_image_format='AUTO',
        export_keep_originals=False
    )
    print(f"Exported to: {filepath}")

# Usage: export_to_godot("C:/Game/assets/models", "character")
```

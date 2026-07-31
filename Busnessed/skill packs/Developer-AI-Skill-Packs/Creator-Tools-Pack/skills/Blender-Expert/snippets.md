# Blender-Expert Snippets

## Snippet 1: Set Scene Units

**Description:** Configure scene to real-world metric scale.

```python
import bpy
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 0.01  # 1 unit = 1 cm
scene.unit_settings.length_unit = 'CENTIMETERS'
```

**When to use:** At project start to ensure physically accurate lighting and simulation.

---

## Snippet 2: Remove Unused Data Blocks

**Description:** Clean up orphaned data blocks before save.

```python
import bpy
for block in bpy.data.meshes:
    if block.users == 0:
        bpy.data.meshes.remove(block)
for block in bpy.data.materials:
    if block.users == 0:
        bpy.data.materials.remove(block)
for block in bpy.data.textures:
    if block.users == 0:
        bpy.data.textures.remove(block)
for block in bpy.data.images:
    if block.users == 0:
        bpy.data.images.remove(block)
```

**When to use:** Before final save to reduce file size and remove clutter.

---

## Snippet 3: Batch Export OBJ

**Description:** Export all selected objects as individual OBJ files.

```python
import bpy
import os

output_dir = "C:/exports/obj"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for obj in bpy.context.selected_objects:
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    filepath = os.path.join(output_dir, f"{obj.name}.obj")
    bpy.ops.wm.obj_export(filepath=filepath, export_selected_objects=True)
    obj.select_set(False)
```

**When to use:** When exporting each object individually for game engine import or portfolio presentation.

---

## Snippet 4: Apply All Modifiers

**Description:** Apply all modifiers on selected objects for export.

```python
import bpy

for obj in bpy.context.selected_objects:
    bpy.context.view_layer.objects.active = obj
    for modifier in obj.modifiers:
        try:
            bpy.ops.object.modifier_apply(modifier=modifier.name)
        except RuntimeError:
            print(f"Could not apply {modifier.name} on {obj.name}")
```

**When to use:** Before exporting for game engines that do not support Blender modifiers.

---

## Snippet 5: Create Simple Camera Rig

**Description:** Create a camera with empty target for orbit controls.

```python
import bpy
from mathutils import Vector

# Create camera
bpy.ops.object.camera_add(location=(5, -5, 3))
cam = bpy.context.active_object

# Create empty target
bpy.ops.object.empty_add(location=(0, 0, 0))
target = bpy.context.active_object
target.name = "CameraTarget"

# Add Track To constraint
constraint = cam.constraints.new(type='TRACK_TO')
constraint.target = target
constraint.track_axis = 'TRACK_NEGATIVE_Z'
constraint.up_axis = 'UP_Y'
```

**When to use:** When setting up orbitable camera rig for product visualization or turntable animation.

---

## Snippet 6: Geometry Nodes Grid Scatter

**Description:** Geometry nodes modifier to scatter objects on a grid pattern.

```python
import bpy

def add_grid_scatter(obj_name, instance_name, rows=10, cols=10, spacing=1.0):
    obj = bpy.data.objects.get(obj_name)
    if not obj:
        return
    
    # Add geometry nodes modifier
    mod = obj.modifiers.new(name="GridScatter", type='NODES')
    group = bpy.data.node_groups.new(name="GN_GridScatter", type='GeometryNodeTree')
    mod.node_group = group
    
    nodes = group.nodes
    links = group.links
    
    # Node setup
    input_node = nodes.new(type='NodeGroupInput')
    output_node = nodes.new(type='NodeGroupOutput')
    grid = nodes.new(type='GeometryNodeMeshGrid')
    transform = nodes.new(type='GeometryNodeTransform')
    instance = nodes.new(type='GeometryNodeInstanceOnPoints')
    col_info = nodes.new(type='GeometryNodeCollectionInfo')
    
    # Configure
    grid.inputs[1].default_value = rows
    grid.inputs[2].default_value = cols
    grid.inputs[3].default_value = spacing
    # Connect
    links.new(grid.outputs[0], transform.inputs[0])
    links.new(transform.outputs[0], instance.inputs[0])
    links.new(input_node.outputs[0], instance.inputs[2])
    links.new(col_info.outputs[0], instance.inputs[2])

add_grid_scatter("Plane", "Cube", 10, 10, 2.0)
```

**When to use:** For rapid prototyping of scatter patterns on large surfaces.

---

## Snippet 7: Set Render Border

**Description:** Set render border to specific region for test renders.

```python
import bpy
scene = bpy.context.scene
scene.render.use_border = True
scene.render.border_min_x = 0.25
scene.render.border_min_y = 0.25
scene.render.border_max_x = 0.75
scene.render.border_max_y = 0.75
```

**When to use:** For fast test renders on a specific region of the frame.

---

## Snippet 8: Batch Rename Objects

**Description:** Rename selected objects with prefix and numbered suffix.

```python
import bpy

prefix = "Prop_"
for i, obj in enumerate(bpy.context.selected_objects):
    obj.name = f"{prefix}{i+1:04d}"
```

**When to use:** Before export to standardize object names for pipeline compatibility.

---

## Snippet 9: Set EEVEE Shadow Settings

**Description:** Optimize EEVEE shadow quality for production.

```python
import bpy
scene = bpy.context.scene
eevee = scene.eevee
eevee.shadow_cube_size = '2048'
eevee.shadow_cascade_size = '2048'
eevee.use_shadow_high_bitdepth = True
eevee.use_soft_shadows = True
```

**When to use:** When using EEVEE for final render and need crisp shadows.

---

## Snippet 10: Create HDRI World Setup

**Description:** Assign HDRI image to world environment.

```python
import bpy

hdri_path = "C:/hdri/sunset.exr"
world = bpy.context.scene.world
world.use_nodes = True
nodes = world.node_tree.nodes
links = world.node_tree.links

# Clear existing
for node in nodes:
    nodes.remove(node)

# Create nodes
tex_coord = nodes.new(type='ShaderNodeTexCoord')
mapping = nodes.new(type='ShaderNodeMapping')
env_tex = nodes.new(type='ShaderNodeTexEnvironment')
bg = nodes.new(type='ShaderNodeBackground')
output = nodes.new(type='ShaderNodeOutputWorld')

# Load HDRI
env_tex.image = bpy.data.images.load(hdri_path)

# Connect
links.new(tex_coord.outputs['Generated'], mapping.inputs[0])
links.new(mapping.outputs[0], env_tex.inputs[0])
links.new(env_tex.outputs[0], bg.inputs['Color'])
links.new(bg.outputs[0], output.inputs['Surface'])
```

**When to use:** When setting up lighting for rendering with realistic environment reflections.

---

## Snippet 11: Set Keyframe on All Transforms

**Description:** Keyframe location, rotation, scale for selected objects.

```python
import bpy

frame = bpy.context.scene.frame_current
for obj in bpy.context.selected_objects:
    obj.keyframe_insert(data_path="location", frame=frame)
    obj.keyframe_insert(data_path="rotation_euler", frame=frame)
    obj.keyframe_insert(data_path="scale", frame=frame)
```

**When to use:** When creating animation keyframes for multiple objects at current frame.

---

## Snippet 12: Viewport Screenshot

**Description:** Capture viewport screenshot to file.

```python
import bpy

filepath = "C:/renders/viewport_screenshot.png"
bpy.ops.screen.screenshot(filepath=filepath, full=False)
```

**When to use:** For quick progress shots or reference capture without full render.

---

## Snippet 13: Toggle Wireframe View

**Description:** Switch viewport shading to wireframe for selected objects.

```python
import bpy

for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        for space in area.spaces:
            if space.type == 'VIEW_3D':
                space.shading.type = 'WIREFRAME'
```

**When to use:** When checking edge flow, topology, or modifier results.

---

## Snippet 14: Set Cycles Denoising

**Description:** Enable OptiX denoising for Cycles render.

```python
import bpy
scene = bpy.context.scene
cycles = scene.cycles
cycles.use_denoising = True
cycles.denoiser = 'OPTIX'
cycles.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
cycles.denoising_prefilter = 'ACCURATE'
```

**When to use:** When rendering final frames with Cycles to reduce noise while preserving detail.

---

## Snippet 15: Export as glTF with Draco

**Description:** Export selected object as glTF with Draco compression and embedded textures.

```python
import bpy

bpy.ops.export_scene.gltf(
    filepath="C:/exports/model.glb",
    export_format='GLB',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_texcoords=True,
    export_normals=True,
    export_materials=True,
    export_apply=True,
    export_animations=False
)
```

**When to use:** When exporting 3D models for web (three.js, Babylon.js) or AR/VR applications.

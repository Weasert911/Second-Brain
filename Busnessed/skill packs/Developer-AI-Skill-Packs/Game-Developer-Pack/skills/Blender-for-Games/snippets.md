# Blender for Games - Snippets

## Apply Transforms

```python
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
```

## Remove Doubles

```python
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=0.001)
bpy.ops.object.mode_set(mode='OBJECT')
```

## Triangulate Mesh

```python
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.quads_convert_to_tris()
bpy.ops.object.mode_set(mode='OBJECT')
```

## Check Triangle Count

```python
obj = bpy.context.active_object
mesh = obj.data
tri_count = len(mesh.polygons)
vert_count = len(mesh.vertices)
print(f"Tris: {tri_count}, Verts: {vert_count}")
```

## GLTF Quick Export

```python
bpy.ops.export_scene.gltf(
    filepath="model.glb",
    export_format='GLB',
    export_apply=True,
    export_animations=True
)
```

## Set Origin to Bottom

```python
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY')
min_z = min(v.co.z for v in obj.data.vertices)
obj.location.z -= min_z
```

## Add Material Slot

```python
mat = bpy.data.materials.new(name="GameMat")
obj.data.materials.append(mat)
```

## Create Empty

```python
bpy.ops.object.empty_add(type='PLAIN_AXES')
empty = bpy.context.active_object
empty.name = "Root"
```

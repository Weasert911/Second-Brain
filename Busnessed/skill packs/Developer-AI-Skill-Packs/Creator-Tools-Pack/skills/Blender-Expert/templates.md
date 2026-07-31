# Blender-Expert Templates

## Template 1: PBR Material Shader Node Setup

**Description:** A reusable Principled BSDF node group with PBR texture inputs.

```
Name: PBR Material - {{material_name}}

Node Setup:
[Image Texture: {{albedo_map}}] (Color Space: sRGB)
  → Principled BSDF Base Color
[Image Texture: {{roughness_map}}] (Color Space: Non-Color)
  → Principled BSDF Roughness
[Image Texture: {{metallic_map}}] (Color Space: Non-Color)
  → Principled BSDF Metallic
[Image Texture: {{normal_map}}] (Color Space: Non-Color)
  → Normal Map node → Principled BSDF Normal
[Image Texture: {{displacement_map}}] (Color Space: Non-Color)
  → Displacement node → Material Output Displacement

Settings:
- {{material_name}}: Name for the material
- Texture Resolution: {{resolution}}px
- UV Map: {{uv_map_name}}
```

**Usage Notes:** Ensure all PBR maps are exported from Substance Painter, Quixel, or similar tools. Normal maps must be in OpenGL format (green channel up).

---

## Template 2: Geometry Nodes Scatter Setup

**Description:** Geometry nodes setup to scatter instances across a surface.

```
Name: GN_Scatter_{{description}}

Node Tree:
1. Group Input (Geometry)
2. → Distribute Points on Faces
   - Density: {{density}}
   - Seed: {{random_seed}}
   - Scale: {{instance_scale}}
3. → Instance on Points
   - Instance: {{target_object}}
   - Scale Random: {{scale_min}} to {{scale_max}}
   - Rotation: {{rotation_euler}}
4. → Group Output (Geometry)

Settings:
- Density: {{density}} particles per m²
- Instance: {{target_object}} (must be collection or object)
- Seed: {{random_seed}} for reproducible scattering
```

**Usage Notes:** Realize Instances only if you need to apply further geometry operations. For large numbers, use Collection Info with separate children.

---

## Template 3: IK/FK Arm Rig

**Description:** Arm rig with IK/FK switching using custom properties.

```
Armature Setup:
1. Upper arm bone: {{upper_arm_name}}
2. Forearm bone: {{forearm_name}}
3. Hand bone: {{hand_name}}
4. IK target bone: {{ik_target_name}}
5. Pole target bone: {{pole_target_name}}

Constraints:
- {{forearm_name}}: IK Constraint
  - Target: {{ik_target_name}}
  - Chain Length: 2
  - Pole Target: {{pole_target_name}}

Custom Property on Upper Arm:
- Name: ik_fk_switch
- Default: 0.0 (FK), 1.0 (IK)
- Driver maps IK/FK influence to this value

Animation:
- FK: Rotate upper arm and forearm manually
- IK: Move ik_target to position hand
```

**Usage Notes:** Use drivers on constraint influence to blend between IK and FK. Create action poses in FK for extreme close-ups, use IK for foot/hand placement.

---

## Template 4: Render Settings Preset

**Description:** Standard render settings for EEVEE and Cycles.

```
Name: RenderPreset_{{preset_name}}

Engine: {{engine}}
Samples: {{samples}}
Denoising: {{denoiser}} (OptiX / OpenImageDenoise / None)
Resolution: {{width}} x {{height}} px
Frame Range: {{start_frame}} to {{end_frame}}

Cycles Specific:
- Max Bounces: {{max_bounces}}
- Light Paths: Diffuse {{diffuse_bounces}}, Glossy {{glossy_bounces}}
- Adaptive Sampling: {{adaptive_sampling}} (Yes/No)
- Tile Size: {{tile_size}}

EEVEE Specific:
- Shadow Cube Size: {{shadow_size}}
- Bloom: {{bloom}} (Yes/No)
- Ambient Occlusion: {{ao}} (Yes/No)
- Screen Space Reflections: {{ssr}} (Yes/No)

Output:
- File Format: {{file_format}}
- Color Depth: {{bit_depth}}
- Compression: {{compression_level}}
```

**Usage Notes:** For final renders use Cycles at 4096+ samples with OptiX denoising. For preview use EEVEE at 64 samples. Match resolution to delivery requirements.

---

## Template 5: Add-on Boilerplate

**Description:** Python add-on template with registration and panel.

```python
bl_info = {
    "name": "{{addon_name}}",
    "author": "{{author}}",
    "version": ({{version_major}}, {{version_minor}}, {{version_patch}}),
    "blender": ({{blender_min_major}}, {{blender_min_minor}}, 0),
    "location": "{{menu_location}}",
    "description": "{{description}}",
    "category": "{{category}}",
}

import bpy

class {{PanelClassName}}(bpy.types.Panel):
    bl_label = "{{panel_label}}"
    bl_idname = "{{panel_idname}}"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "{{tab_name}}"
    
    def draw(self, context):
        layout = self.layout
        layout.label(text="{{description}}")

def register():
    bpy.utils.register_class({{PanelClassName}})

def unregister():
    bpy.utils.unregister_class({{PanelClassName}})

if __name__ == "__main__":
    register()
```

**Usage Notes:** Replace all placeholders before first run. Register in Blender Preferences > Add-ons by browsing to the .py file. Use bl_idname with unique prefix to avoid conflicts.

---

## Template 6: Compositor Color Grade Setup

**Description:** Basic color grading node group for the compositor.

```
Name: Compositor_ColorGrade_{{look_name}}

Node Tree:
1. Render Layers (Image)
2. → Color Space (from Scene Linear to sRGB)
3. → Color Balance node (lift/gamma/gain)
   - Lift: {{lift_rgb}}
   - Gamma: {{gamma_rgb}}
   - Gain: {{gain_rgb}}
4. → Hue/Saturation node
   - Hue: {{hue_shift}}
   - Saturation: {{saturation}}
   - Value: {{value}}
5. → Glare node (Fog Glow type)
   - Threshold: {{glare_threshold}}
   - Mix: {{glare_mix}}
6. → Composite node (Output)

Settings:
- Lift: Shadows color tint
- Gamma: Midtones adjustment
- Gain: Highlights color tint
```

**Usage Notes:** Connect Viewer node before Composite for preview. Film-like look: reduce saturation slightly, warm up midtones, add subtle glow.

---

## Template 7: Animation Export Settings

**Description:** Export settings for animated FBX/GLB models.

```
Name: ExportAnim_{{character_name}}

Format: {{export_format}} (FBX / glTF / OBJ)
Path: {{export_path}}/{{character_name}}.{{extension}}

Settings:
- Selected Objects: {{selected_only}}
- Animation: {{include_animation}}
- Bake Animation: {{bake_anim}}
- NLA Strips: {{include_nla}}
- Keyframe Reduction: {{reduce_keyframes}} (threshold: 0.5)

FBX Specific:
- Apply Transform: {{apply_transform}}
- Path Mode: {{path_mode}} (Copy / Auto / Strip)
- Forward: -Z Forward
- Up: Y Up

glTF Specific:
- Image Format: {{image_format}} (PNG / JPEG / None)
- Compression: Draco: {{draco_compression}}
- Export Skin: {{export_skin}}
```

**Usage Notes:** For game engines, enable triangulation and disable NLA strips. For Unity, use FBX with -Z forward and Y up. For web, use glTF with Draco compression.

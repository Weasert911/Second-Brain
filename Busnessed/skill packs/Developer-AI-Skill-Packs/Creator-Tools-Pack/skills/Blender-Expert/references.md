# Blender-Expert References

## Official Documentation

- [Blender Manual](https://docs.blender.org/manual/en/latest/) — Complete reference for all Blender features and workflows
- [Blender Python API (bpy)](https://docs.blender.org/api/current/) — Full bpy module reference for scripting and add-on development
- [Blender Python API](https://docs.blender.org/api/current/info_quickstart.html) — Quickstart guide for bpy scripting
- [Blender Artists Community](https://blenderartists.org/) — Forum for troubleshooting and inspiration
- [Blender Studio](https://studio.blender.org/) — Open movie and asset production training materials
- [Blender Development Docs](https://wiki.blender.org/wiki/Main_Page) — For add-on and core development

## Glossary / Terminology

| Term | Definition |
|---|---|
| **Vertex** | A point in 3D space, the smallest unit of mesh geometry |
| **Edge** | A line connecting two vertices |
| **Face** | A polygon surface bounded by edges (tri, quad, or n-gon) |
| **UV Map** | 2D coordinate system mapping 3D surface to a texture image |
| **Texel Density** | Pixels per unit of 3D surface; consistency prevents resolution mismatch |
| **Retopology** | Rebuilding high-poly mesh as low-poly with clean edge flow |
| **PBR** | Physically Based Rendering using albedo, roughness, metallic, and normal maps |
| **HDRI** | High Dynamic Range Image used for environment lighting |
| **Armature** | Bone system used for deforming meshes in rigging |
| **IK / FK** | Inverse Kinematics and Forward Kinematics bone control methods |
| **NLA** | Non-Linear Animation editor for blending and layering actions |
| **Modifier Stack** | Ordered list of non-destructive operations applied to an object |
| **Shader Node** | Building block of material graphs in Blender node editor |
| **Denoising** | Post-process algorithm removing noise from path-traced renders |
| **Bake** | Pre-computing lighting or texture data into a texture map |

## Conventions / Naming Standards

- Objects: `OBJ_Type_Description` (e.g., `OBJ_Char_Protagonist`)
- Materials: `MAT_Type_Description` (e.g., `MAT_Metal_RustedSteel`)
- Textures: `TEX_Description_Type` (e.g., `TEX_Wall_Albedo`)
- Armatures: `ARM_Description` (e.g., `ARM_Humanoid`)
- Vertex Groups: `GRP_BodyPart` (e.g., `GRP_LeftArm`)
- Collections: `COL_Category` (e.g., `COL_Props`, `COL_Lights`)
- Node Groups: `NG_Description` (e.g., `NG_WoodTexture`)

## Architecture / Workflow Notes

Blender uses a graph-based architecture for materials, compositing, and geometry nodes. The modifier stack evaluates top-to-bottom. Shader nodes are evaluated from output node backward. Geometry nodes are evaluated per modifier in stack order. Understanding these evaluation orders is critical for troubleshooting.

**Render Pipeline:** Scene → Modifiers → Subdivision → Materials → Lighting → Camera → Render Engine → Compositor → Output

## Key Tools / Commands

- `Tab` — Toggle Edit Mode
- `G` — Grab/Move, `S` — Scale, `R` — Rotate
- `E` — Extrude, `I` — Inset, `K` — Knife Tool
- `Ctrl+R` — Loop Cut, `Ctrl+B` — Bevel
- `Shift+D` — Duplicate, `Alt+D` — Linked Duplicate
- `Alt+Z` — X-Ray / Transparency mode toggle
- `Ctrl+J` — Join objects
- `P` — Separate selection into new object
- `M` — Merge vertices
- `O` — Proportional Editing toggle
- `F3` — Search menu for any tool or operator
- `Ctrl+Space` — Maximize area

## Recommended Project Structure

```
project/
├── assets/
│   ├── models/
│   │   ├── hi-poly/
│   │   ├── low-poly/
│   │   └── references/
│   ├── textures/
│   │   ├── albedo/
│   │   ├── normal/
│   │   ├── roughness/
│   │   └── hdri/
│   ├── materials/
│   └── hdri/
├── renders/
│   ├── preview/
│   ├── final/
│   └── composited/
├── scripts/
│   ├── add-ons/
│   └── utilities/
├── exports/
│   ├── fbx/
│   ├── obj/
│   ├── glb/
│   └── abc/
└── project.blend
```

---
name: "Godot Shader Expert"
version: "1.0.0"
domain: "Game Development"
activation_description: "Godot shading language and visual shader expertise"
purpose: "Make AI proficient in Godot shading language, visual shaders, spatial/canvas item/particle shaders, and post-processing effects"
---

## Capabilities
- Write GLSL ES 3.0 shaders in Godot shading language
- Build visual shaders using the VisualShader editor
- Create spatial shaders for 3D materials and environments
- Design canvas item shaders for 2D sprites and UI effects
- Implement particle shaders for GPU particle systems
- Build post-processing effects using Viewport and BackBufferCopy
- Configure shader parameters and material variants
- Optimize shader performance for target hardware

## Limitations
- Does not cover GDScript programming (see GDScript Best Practices)
- Does not cover third-party shader tools (ShaderToy conversion)
- Does not cover Vulkan compute shaders in depth
- Does not cover Godot 3.x shader syntax

## Required Tools
- Godot 4.2+ with Vulkan or OpenGL 3.3
- RenderDoc for GPU debugging (optional)

## Execution Workflow
1. Determine shader type: spatial, canvas_item, or particles
2. Define shader parameters exposed to material inspector
3. Implement vertex shader for position/vertex manipulation
4. Implement fragment shader for color/pixel output
5. Add lighting handling for spatial shaders
6. Test with different material configurations
7. Profile and optimize GPU usage
8. Create material variants from shader parameters

## Shader Types
- spatial: 3D surface shaders (render_mode variants: blend, depth, cull, unshaded)
- canvas_item: 2D sprite/UI shaders (render_mode: blend, unshaded, sdf)
- particles: GPU particle shaders

## References
- See references.md for shader language syntax and built-in variables
- See examples.md for common visual effects implementations
- See templates.md for shader template files
- See checklists.md for shader optimization checklist
- See snippets.md for reusable shader code snippets

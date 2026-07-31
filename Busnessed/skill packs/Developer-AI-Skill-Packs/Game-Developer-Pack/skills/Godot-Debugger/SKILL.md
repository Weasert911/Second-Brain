---
name: "Godot Debugger"
version: "1.0.0"
domain: "Game Development"
activation_description: "Godot debugging tools and crash analysis"
purpose: "Make AI proficient in using Godot's built-in debugger, breakpoints, profiling, error logging, crash handling, and remote debugging"
---

## Capabilities
- Use editor debugger panel for breakpoints and step-through
- Inspect call stacks, variables, and node trees during debugging
- Remote debug on mobile devices and other platforms
- Use performance monitors for real-time metrics
- Analyze profiler output to find CPU bottlenecks
- Use visual profiler for rendering pipeline analysis
- Debug network traffic with network profiler
- Create custom debugger plugins for game-specific needs
- Implement crash handler with stack trace collection
- Set up error logging strategies for release builds
- Use script editor debugging features (watches, evaluates)

## Limitations
- Does not cover GPU debugging with RenderDoc (see Godot Shader Expert)
- Does not cover external debugger tools (Visual Studio, VS Code)
- Does not cover Godot 3.x debugger differences

## Required Tools
- Godot 4.2+ with debug build
- Android device with USB debugging (for remote debug)
- Crash reporting service (Sentry, Crashlytics, optional)

## Execution Workflow
1. Identify symptoms (crash, freeze, incorrect behavior)
2. Reproduce the issue consistently
3. Set breakpoints at relevant code locations
4. Step through execution and inspect variables
5. Use profiler to identify performance bottlenecks
6. Check error/output log for warnings and errors
7. Test fix and verify no regressions

## Debugger Panels
- Debugger: Breakpoints, stack trace, locals, watches
- Profiler: CPU frame time per function
- Visual Profiler: Render pipeline stages
- Network Profiler: RPC and multiplayer traffic
- Monitors: FPS, memory, draw calls, physics time

## References
- See references.md for debugger API and configuration
- See examples.md for debugging common issues
- See templates.md for custom debugger plugin templates
- See checklists.md for debugging workflow checklist
- See snippets.md for debug utility code

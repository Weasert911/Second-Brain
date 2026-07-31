# Godot Debugger - Checklists

## Debugging Setup Checklist

### Environment
- [ ] Godot debug build used for development
- [ ] Debugger panel visible (Debug > Debugger visible)
- [ ] Remote debugging configured for mobile testing
- [ ] Performance monitors enabled
- [ ] Profiler recording set up for target scenarios

### Breakpoints
- [ ] Breakpoints set at relevant code locations
- [ ] Conditional breakpoints used for specific cases
- [ ] Log points used for non-breaking logging
- [ ] Breakpoints temporary when testing one issue

### Profiler
- [ ] Profiler captures typical gameplay scenario
- [ ] Profiling session recorded for analysis
- [ ] Top functions identified for optimization
- [ ] Frame time budget verified against targets

### Error Handling
- [ ] Error logging configured for all scenes
- [ ] Crash handler writes report files
- [ ] Assertions used for invariant validation
- [ ] Debug prints removed or behind flags for release

### Network Debugging
- [ ] Network profiler monitoring RPC traffic
- [ ] Bandwidth and latency measured
- [ ] Packet loss simulated for testing
- [ ] Peer connections verified

## Common Issues Checklist
- [ ] Null reference: check is_instance_valid()
- [ ] Infinite loop: check loop conditions
- [ ] Signal not firing: check connections
- [ ] Memory leak: monitor memory over time
- [ ] Performance spike: profile the specific action
- [ ] Orphan nodes: check queue_free() calls
- [ ] Animation glitch: check blend times
- [ ] Physics jitter: check _physics_process vs _process

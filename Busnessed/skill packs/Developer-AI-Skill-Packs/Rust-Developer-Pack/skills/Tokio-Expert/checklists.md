# Checklists — Tokio-Expert

## Pre-Flight Checklist

- [ ] Tokio version selected (1.x latest stable)
- [ ] Runtime flavor chosen (multi_thread vs current_thread)
- [ ] Number of worker threads determined
- [ ] Channel types selected for each communication pattern
- [ ] Backpressure strategy defined
- [ ] Graceful shutdown plan documented
- [ ] Tracing/logging plan in place
- [ ] Cancellation token hierarchy designed

## Implementation Checklist

- [ ] Runtime created with appropriate configuration
- [ ] Tasks spawned with proper error handling (JoinHandle awaited or detached intentionally)
- [ ] All channels have appropriate capacity (bounded preferred)
- [ ] No std::sync::Mutex held across .await
- [ ] spawn_blocking used for CPU-heavy work
- [ ] Cancellation tokens propagated to all child tasks
- [ ] select! covers all expected async operations
- [ ] Timeout applied to network operations
- [ ] Async file I/O uses tokio::fs, not std::fs
- [ ] BufReader/BufWriter for efficient I/O
- [ ] Framing implements Encoder/Decoder from tokio-util
- [ ] Signal handling integrated (ctrl_c, SIGTERM)

## Testing Checklist

- [ ] Unit tests with tokio::test
- [ ] Integration tests run with single-threaded runtime for determinism
- [ ] Cancellation behavior tested (tasks actually stop)
- [ ] Timeout behavior tested
- [ ] Channel capacity limits tested (backpressure)
- [ ] Concurrent access tested with many tasks
- [ ] Graceful shutdown tested
- [ ] Error paths tested (connection drop, timeout, invalid data)

## Release Checklist

- [ ] Runtime parameters tuned for target deployment
- [ ] Logging level appropriate for production
- [ ] Tokio Console enabled only for debug builds
- [ ] Backpressure limits tuned
- [ ] Task spawn limits reviewed (prevent unbounded growth)
- [ ] Memory usage profiled
- [ ] max_connections / semaphore limits set
- [ ] Timeouts configured for all network operations
- [ ] Shutdown timeout configured (max wait time)
- [ ] Resource cleanup verified (files, sockets, channels)

## Maintenance Checklist

- [ ] Tokio version checked for updates
- [ ] Runtime metrics monitored (tasks spawned, queue depth)
- [ ] Channel capacity utilization reviewed
- [ ] Backpressure events tracked
- [ ] Task cancellation latencies reviewed
- [ ] Thread pool utilization monitored
- [ ] Tracing output reviewed for bottlenecks
- [ ] Dependency updates checked for tokio-util, tracing, etc.

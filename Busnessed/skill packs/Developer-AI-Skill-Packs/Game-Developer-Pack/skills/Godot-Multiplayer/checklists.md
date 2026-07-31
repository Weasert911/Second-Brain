# Godot Multiplayer - Checklists

## Networking Implementation Checklist

### Setup
- [ ] Transport selected (ENet/WebSocket/Steam)
- [ ] Port configured and forwarded
- [ ] Max players set
- [ ] Connection timeout configured
- [ ] Reconnection logic implemented

### Authority
- [ ] Server authoritative for critical game state
- [ ] Client-side prediction for responsiveness
- [ ] Server reconciliation for correction
- [ ] RPC authority flags correctly set
- [ ] No trust of client data

### RPC Configuration
- [ ] RPC mode correct per function (authority/any_peer)
- [ ] RPC transfer mode correct (reliable/unreliable)
- [ ] Channels configured for priority ordering
- [ ] `call_local` set when server needs local execution
- [ ] `call_remote` set when server needs network broadcast

### Scene Replication
- [ ] MultiplayerSpawner configured with spawn function
- [ ] MultiplayerSynchronizer set up for state sync
- [ ] Replicated properties identified
- [ ] Spawned nodes properly parented

### State Synchronization
- [ ] Full state sync on join
- [ ] Delta updates for ongoing changes
- [ ] Interpolation for smooth visual movement
- [ ] Extrapolation for lag compensation (if needed)

### Security
- [ ] Input validation on all RPC parameters
- [ ] Anti-cheat measures implemented
- [ ] Rate limiting on RPC calls
- [ ] Server validates all state changes
- [ ] No sensitive logic in client code

## Testing Checklist
- [ ] Test with 2+ players
- [ ] Test with simulated latency (100ms, 200ms)
- [ ] Test with packet loss (1%, 5%, 10%)
- [ ] Test disconnection/reconnection
- [ ] Test late joining (player joins mid-game)

## Performance Checklist
- [ ] Bandwidth usage profiled and optimized
- [ ] RPC frequency minimized
- [ ] Data compression for large payloads
- [ ] Interest management (only sync relevant entities)
- [ ] LOD for network updates (less frequent at distance)

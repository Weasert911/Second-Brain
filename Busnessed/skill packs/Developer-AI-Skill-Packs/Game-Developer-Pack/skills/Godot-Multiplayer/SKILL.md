---
name: "Godot Multiplayer"
version: "1.0.0"
domain: "Game Development"
activation_description: "Godot multiplayer networking and online systems"
purpose: "Make AI proficient in Godot's high-level multiplayer API, RPC configuration, scene replication, state synchronization, and server architecture"
---

## Capabilities
- Implement high-level multiplayer API (ENetMultiplayerPeer)
- Configure RPCs with proper authority, any_peer, call_remote modes
- Set up scene replication across network peers
- Implement state synchronization strategies (authoritative, interpolated)
- Build lag compensation and prediction systems
- Implement rollback netcode concepts
- Integrate matchmaking services
- Set up Steam multiplayer via Steamworks SDK
- Configure dedicated server builds
- Implement anti-cheat detection and validation

## Limitations
- Does not cover HTTP/WebSocket protocol implementation
- Does not cover database server architecture
- Does not cover store-specific multiplayer APIs (GameCenter, Xbox Live)
- Does not cover Godot 3.x multiplayer API

## Required Tools
- Godot 4.2+
- Steamworks SDK (for Steam features, optional)
- Dedicated server machine or cloud hosting
- Network testing tools (Wireshark, Clumsy)

## Execution Workflow
1. Determine network topology (peer-to-peer vs client-server)
2. Select transport (ENet, WebSocket, Steam)
3. Configure peer and connection limits
4. Implement authentication and lobby management
5. Set up scene tree replication and spawner
6. Define RPCs with correct authority configuration
7. Implement state synchronization (full state, delta, interpolated)
8. Add lag compensation and client prediction
9. Test with simulated latency and packet loss
10. Implement anti-cheat and validation

## RPC Modes
- @rpc("authority"): Only server can call
- @rpc("any_peer"): Any peer can call
- @rpc("call_local"): Execute locally as well as remotely
- @rpc("reliable"): Guaranteed delivery
- @rpc("unreliable"): No retransmission (for position updates)
- @rpc("unreliable_ordered"): Unreliable with ordering

## References
- See references.md for multiplayer API documentation
- See examples.md for multiplayer game implementations
- See templates.md for server and client templates
- See checklists.md for network testing checklist
- See snippets.md for common networking patterns

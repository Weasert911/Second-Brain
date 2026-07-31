# Game Design Document Writer - Examples

## GDD Title Page

```markdown
# [Game Title]

**Tagline:** A short, compelling phrase

**Version:** 1.0
**Date:** 2024-01-01
**Author:** Developer Name
**Status:** Draft / In Development / Final

**Platforms:** PC (Steam), Nintendo Switch, Xbox, PlayStation
**Engine:** Godot 4.2
**Genre:** Action Platformer / Rogue-lite
**Target Audience:** 18-35, fans of challenging platformers
**ESRB Rating:** E10+ (Fantasy Violence)

**Unique Selling Points:**
1. Procedurally generated dungeons with hand-crafted room templates
2. 200+ item combinations for unique builds each run
3. Adaptive difficulty that learns player skill level
4. Local co-op with seamless drop-in/drop-out

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2024-01-01 | Dev | Initial draft |
| 0.2 | 2024-02-01 | Dev | Added combat system, removed crafting |
| 1.0 | 2024-03-01 | Dev | Finalized for prototyping |

---

## Executive Summary

[Game Title] is a 2D action platformer with rogue-lite elements set in a sprawling underground dungeon. Players control a adventurer who must descend through procedurally generated levels, defeat monsters, collect loot, and upgrade their character. Each run is unique with different room layouts, enemy combinations, and item drops.

The core loop consists of: Explore dungeon rooms -> Defeat enemies -> Collect loot and XP -> Level up and choose upgrades -> Descend deeper -> Face boss -> Repeat with harder difficulty.

What sets [Game Title] apart is its adaptive difficulty system that adjusts enemy placement and loot quality based on player performance, ensuring a challenging but never frustrating experience for players of all skill levels.
```

## Core Gameplay Loop

```markdown
## Primary Gameplay Loop

```
                                            +------------------+
                                            |  Enter Dungeon   |
                                            +--------+---------+
                                                     |
                                                     v
                            +------------------+  +------------------+
                            |    Room Clear?   |  |  Explore Room    |
                            |  (Combat/Puzzle) |  +------------------+
                            +--------+---------+           |
                                     |                     v
                                     | Yes          +------------------+
                                     +------------->|  Encounter       |
                                     |              |  Enemies/Puzzle  |
                                     |              +--------+---------+
                                     |                       |
                                     v                       v
                            +------------------+  +------------------+
                            |  Collect Loot    |  |  Defeat/Solve    |
                            |  & XP            |  |  (or retreat)    |
                            +--------+---------+  +--------+---------+
                                     |                       |
                                     |                       v
                                     |              +------------------+
                                     |              |  All Rooms       |
                                     |              |  Cleared?        |
                                     |              +--------+---------+
                                     |                       |
                                     |              +--------v---------+
                                     |              |  Descend to      |
                                     |              |  Next Level      |
                                     |              +------------------+
                                     |
                                     v
                            +------------------+
                            |  Return to Hub   |
                            |  - Spend XP      |
                            |  - Buy items     |
                            |  - Upgrade gear  |
                            +------------------+
```

### Metagame Loop
- Complete runs to earn permanent currency
- Unlock new starting weapons and items
- Increase max health and abilities
- Unlock new character classes
- Reach leaderboard positions
- Earn achievements
```

## Combat System Design

```markdown
## Combat System

### Overview
Real-time 2D combat with directional attacks, dodging, and special abilities.

### Player Actions
| Action | Input | Description | Cooldown |
|--------|-------|-------------|----------|
| Light Attack | X / Left Click | Quick swing, low damage, 30 damage | 0.3s |
| Heavy Attack | Y / Right Click | Slow swing, high damage, 80 damage | 1.0s |
| Dodge | A / Space | Invincibility frames (0.2s), 3m distance | 0.8s |
| Block | B / Shift | Reduce damage by 50%, drains stamina | While held |
| Special | RB / Q | Weapon-specific ability | 5-30s |
| Interact | E / F | Pick up items, open doors | Instant |

### Damage Formula
```
damage = base_damage * strength_multiplier * crit_multiplier - enemy_defense * penetration_factor

crit_multiplier = 2.0 if random < crit_chance else 1.0
penetration_factor = 1.0 - clamp((enemy_armor - player_armor_pen) / 100, 0, 0.8)
```

### Enemy Types
| Name | HP | Damage | Speed | Behavior |
|------|----|--------|-------|----------|
| Slime | 30 | 5 | Slow | Charges in straight line |
| Skeleton | 50 | 10 | Medium | Patrols, attacks in range |
| Mage | 25 | 20 | Slow | Teleports, ranged attack |
| Knight | 100 | 15 | Slow | Blocks, combo attack |
| Boss: Slime King | 500 | 25 | Slow | Summons slimes, jump attack |

### Difficulty Scaling
- Each floor: enemies +10% HP, +5% damage, +2% speed
- Each run: floor count scales with player level
- Adaptive: if player dies 3 times on same floor, reduce difficulty
- If player clears floor without damage, increase next floor
```

## Economy Design

```markdown
## Economy System

### Currency Types
| Currency | Earned By | Spent On | Persistence |
|----------|-----------|----------|-------------|
| Gold | Enemies, chests, selling items | Consumables, weapons in-run | Run only |
| Gems | Bosses, achievements, daily | Permanent upgrades | Cross-run |
| XP | Enemies, exploration | Level-ups, skill points | Run only |
| Essence | Recycling items | Enchanting gear | Cross-run |

### Gold Economy (per run)
- Average gold per room: 25-50
- Rooms per floor: 5-8
- Floors per run: 3-5
- Average gold per run: 375-2000
- Prices: Potion (50g), Key (100g), Weapon (200-500g), Armor (300-600g)

### Gem Economy (permanent)
- Gems per boss kill: 10-25
- Gems per achievement: 50-500
- Gems from daily challenge: 10
- Upgrade costs: Health+ (50gems), Damage+ (75gems), Speed+ (60gems)
- Maximum upgrades: 10 per stat
- Total gems for max: ~5000

### Progression Curve
- Level 1-10: Quick levels (100-500 XP each)
- Level 11-20: Medium (600-2000 XP each)
- Level 21-30: Slow (2500-5000 XP each)
- Level 31-50: Very slow (5500-15000 XP each)
- Max level: 50
- XP formula: level^1.5 * 100
```

## Level Design Template

```markdown
## Level: Abyssal Depths - Floor 1

### Theme
Underground cave with glowing crystals, dark corners, and damp stone.

### Size
- Width: 100 tiles (3200px)
- Height: 80 tiles (2560px)
- Rooms: 7 (2 mandatory, 5 optional)

### Room Types
| Room | Size (tiles) | Enemies | Loot | Type |
|------|-------------|---------|------|------|
| Entrance | 10x8 | 2 slimes | None | Mandatory |
| Corridor A | 4x20 | 3 skeletons | 1 chest | Path |
| Treasure Room | 8x8 | 1 knight | 2 chests | Optional |
| Trap Hallway | 6x16 | 0 | Hidden gem | Optional |
| Boss Antechamber | 10x6 | 5 slimes | 1 potion | Mandatory |
| Boss Room | 16x12 | Slime King | Boss drop | Boss |
| Secret Room | 6x6 | 0 | Rare weapon | Hidden |

### Enemy Placements
- Room 1: 2 slimes at (5, 3) and (7, 5)
- Room 2: 1 skeleton at (2, 10), 1 at (2, 15), 1 at (3, 18)
- Room 4: Spikes at (1, 2), (1, 4), (1, 6)... alternating
- Room 6: Slime King at center (8, 6)

### Difficulty:
- Base: 3/10
- After checkpoint: +1 per completed floor
- Boss difficulty: 6/10 base
```

## Quest/Mission Design

```markdown
## Quest: The Lost Relic

### Type
Main Story Quest

### Prerequisites
- Complete tutorial
- Reach Floor 3 at least once

### Objectives
| # | Objective | Location | Details |
|---|-----------|----------|---------|
| 1 | Find the Old Map | Floor 1 hidden room | 50% spawn chance |
| 2 | Decipher the Runes | Floor 2 middle room | Requires map |
| 3 | Enter the Forbidden Vault | Floor 3, locked door | Requires key from mini-boss |
| 4 | Defeat the Vault Guardian | Vault boss room | Guardian has 800 HP |
| 5 | Return the Relic | Hub NPC | Receive reward |

### Rewards
- 5000 XP
- 100 Gems
- Unique weapon: "Relic Blade" (base damage 50, lifesteal 10%)
- New area unlocked: "Ancient Library"

### Failure States
- Player can leave dungeon mid-quest
- Progress saves per run
- Relic is lost if player dies in vault
```

# Game Design Document Writer - References

## GDD Structure Reference

### Complete GDD Outline
```
1. Title Page
   - Game title, logo, tagline
   - Version history
   - Team members and roles

2. Executive Summary (1 page)
   - Elevator pitch (2-3 sentences)
   - Genre, platform, target audience
   - Unique selling points (USPs)

3. Core Gameplay Loop
   - Primary loop diagram
   - Secondary/metagame loops
   - Player motivation cycle

4. Mechanics & Systems
   - Movement and controls
   - Combat system
   - Inventory and items
   - Progression mechanics
   - Crafting/economy (if applicable)
   - Minigames (if applicable)

5. Progression & Economy
   - Player leveling curve
   - Skill trees
   - Item tier/rarity system
   - Currency types and sinks
   - Reward schedules

6. Narrative & Characters
   - Story synopsis
   - Character profiles
   - Dialogue system
   - Branching narrative maps
   - Lore and worldbuilding

7. Level Design
   - Level structure and flow
   - Difficulty curve
   - Puzzle and encounter design
   - Visual landmarks

8. Art & Audio Direction
   - Art style reference
   - Color palette
   - Character design guidelines
   - Audio style and music direction
   - UI/UX style guide

9. Technical Design
   - Engine and tools
   - System requirements
   - Performance targets
   - Network architecture (if multiplayer)

10. Monetization (if applicable)
    - Business model (premium, F2P, hybrid)
    - IAP catalog
    - Advertising strategy
    - Consumer psychology

11. Accessibility
    - Colorblind modes
    - Control remapping
    - Subtitle options
    - Difficulty options
    - Menu navigation support

12. QA & Testing
    - Test plan
    - Bug tracking process
    - Beta testing strategy
    - Performance benchmarks

13. Post-Launch Plan
    - Content roadmap
    - Patch cycle
    - Community management
    - Live ops strategy
```

## Core Loop Documentation

### Loop Diagram Template
```
[Player Action] -> [System Response] -> [Feedback] -> [Motivation]
     |                    |                  |              |
     v                    v                  v              v
  Move/Jump           Physics check      Animation/    Continue
  Attack/Use          Damage calc        Sound/VFX     exploring
  Collect/Talk        Inventory add      UI update     Trying new
  Explore             Load new area      Visual change  strategy
```

### Primary Gameplay Loop Example (RPG)
```
1. Travel to dungeon area
2. Encounter enemies (random or scripted)
3. Engage in combat (turn-based or real-time)
4. Defeat enemies (or retreat)
5. Gain XP and loot
6. Return to town
7. Sell loot, buy equipment
8. Level up, assign skills
9. Accept new quest (loop back to 1)
```

### Engagement Loop
```
Reward (XP, loot) -> Satisfaction -> Dopamine -> Continue playing
  -> New challenge (harder enemies) -> Skill mastery -> Bigger reward
```

## Mechanic Design Templates

### Mechanic Specification Template
```
## Mechanic Name: [Name]
### Type: [Active/Passive/Reactive]
### Trigger: [How is it activated?]
### Effect:
   - [What does it do?]
   - [Duration/Cooldown]
   - [Numerical values]
### Constraints:
   - [Limitations]
   - [Resource costs]
### Feedback:
   - [Visual feedback]
   - [Audio feedback]
   - [Haptic feedback]
### Balancing:
   - [How this interacts with other mechanics]
   - [Counterplay options]
```

## Progression System Design

### Level Curve Formula
```gdscript
# Common XP formula: XP = baseXP * level^exponent
func xp_for_level(level: int) -> int:
    return int(100 * pow(level, 1.5))

# Level from XP
func level_from_xp(xp: int) -> int:
    return int(pow(xp / 100.0, 1.0 / 1.5))
```

### XP Curve Types
| Curve | Growth | Best For |
|-------|--------|----------|
| Linear | Constant per level | Simple games |
| Shallow | Slow then fast | RPGs, long progression |
| Steep | Fast then plateau | Quick progression |
| Exponential | Doubles each level | Mobile/F2P |
| Custom | Designer-defined | Any specific need |

## Economy Balancing

### Currency Types
| Type | Earned By | Spent On |
|------|-----------|----------|
| Soft currency | Gameplay (coins, gold) | Consumables, basic items |
| Hard currency | Purchase (gems, gold bars) | Premium items, boosts |
| Experience | Actions, quests | Levels, skill points |
| Crafting materials | Gathering, drops | Equipment crafting |
| Reputation | Faction quests | Special items, discounts |
| Energy | Time, consumables | Limited actions (F2P) |

### Economy Balancing Formula
```python
# Player earning rate
earnings_per_hour = (average_reward * attempts_per_hour) + daily_bonus

# Player spending rate
spending_per_hour = (desired_purchases / playtime_hours)

# Balance target: earnings > spending (for engagement)
# Sink target: spending > earnings at high levels (for monetization)
```

## Narrative Design

### Branching Narrative Map
```
[Scene 1: Introduction]
    |--- Choice A (Help NPC) ---> [Scene 2A]
    |                                   |--- Choice A1 -> [Scene 3A]
    |                                   |--- Choice A2 -> [Scene 3B]
    |--- Choice B (Ignore NPC) -> [Scene 2B]
                                        |--- Choice B1 -> [Scene 3C]
                                        |--- Choice B2 -> [Scene 3D]
    |--- Choice C (Neutral) -----> [Scene 2C]
                                        |--- (Linear) -> [Scene 3E]
```

### Character Profile Template
```
## Character: [Name]
### Role: [Protagonist/Antagonist/Support/NPC]
### Archetype: [Hero, Mentor, Trickster, etc.]
### Motivation:
   - [Primary goal]
   - [What they want vs what they need]
### Background:
   - [Backstory]
   - [Key events that shaped them]
### Personality:
   - [Traits]
   - [Flaws]
   - [Quirks]
### Arc:
   - [Beginning state]
   - [Midpoint change]
   - [End state]
### Voice:
   - [Speech patterns]
   - [Catchphrases]
   - [Emotional range]
```

## Level Design Documentation

### Level Flow Chart
```
[Start] -> [Tutorial Area] -> [First Encounter] -> [Puzzle Room]
   |                             |                     |
   v                             v                     v
[Shortcut] <- [Miniboss] <- [Challenge Room] <- [Treasure]
   |
   v
[Final Area] -> [Boss Room] -> [Exit/End]
```

### Level Spec Template
```
## Level: [Name]
### Theme: [Environment/Setting]
### Size: [Width x Height, playable area]
### Difficulty: [1-10, or Easy/Medium/Hard]
### Objectives:
   - Primary: [Main goal]
   - Secondary: [Optional objectives]
### Enemies:
   | Type | Count | Spawn Location |
   |------|-------|----------------|
   | Type1 | 5 | Area A |
   | Type2 | 3 | Area B |
### Collectibles:
   - [Item 1] at [Location]
   - [Item 2] at [Location]
### Key Moments:
   - [Event/encounter at specific location]
### Flow Description:
   [Paragraph describing player journey]
```

## Monetization Strategies

### F2P Monetization Models
| Model | Description | Examples |
|-------|-------------|----------|
| Battle Pass | Seasonal rewards, two tracks | Fortnite, Apex |
| Gacha | Random item pulls | Genshin Impact |
| Energy System | Limited actions per day | Candy Crush |
| Cosmetics | Visual items only | Fortnite, Valorant |
| Pay-to-Win | Power advantages | (Avoid) |
| Hybrid | Multiple models combined | Most modern F2P |

### Premium Game Pricing
```
$4.99 - Small indie/budget game
$9.99 - Standard indie game
$14.99 - Premium indie, short AA
$19.99 - Standard indie, longer experience
$29.99 - AA game
$39.99 - Lower-budget AAA
$49.99 - Last-gen standard
$59.99 - Current AAA standard
$69.99 - New AAA standard (2024+)
$79.99+ - Deluxe/DLC bundles
```

## Accessibility Requirements

### Accessibility Checklist
- Colorblind mode (deuteranopia, protanopia, tritanopia)
- Subtitle toggle (size, background, speaker labels)
- Control remapping (keyboard, controller, touch)
- Difficulty options (story, normal, hard)
- Auto-aim and aim assist
- Screen shake toggle
- Flashing light warnings (photosensitive epilepsy)
- Text size options
- High contrast mode
- Audio cues (for deaf/hard of hearing)
- Visual cues (for blind/low vision)
- One-handed control mode
- Button mashing alternative (hold instead of tap)
- Slow mode (game speed reduction)
- Skip puzzles option
- Auto-save frequency options

## QA & Testing Plan

### Test Plan Template
```
## Test Plan: [Feature/Area]
### Scope:
   - [What is being tested]
### Out of Scope:
   - [What is NOT being tested]
### Test Cases:
   | ID | Description | Steps | Expected Result | Status |
   |----|------------|-------|-----------------|--------|
   | TC-001 | [Name] | [Steps] | [Expected] | [Pass/Fail] |
### Test Environment:
   - [Platform, OS, hardware]
### Test Schedule:
   - [Milestone dates]
### Exit Criteria:
   - [All critical bugs fixed]
   - [All test cases passed]
   - [Performance targets met]
```

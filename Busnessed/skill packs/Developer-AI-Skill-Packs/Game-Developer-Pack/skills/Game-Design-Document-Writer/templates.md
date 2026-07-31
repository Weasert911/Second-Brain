# Game Design Document Writer - Templates

## GDD Section Template

```markdown
# [Section Title]

## Overview
[2-3 sentence overview of this section]

## Key Concepts
- [Concept 1]: [Brief description]
- [Concept 2]: [Brief description]
- [Concept 3]: [Brief description]

## Details

### [Subsection 1]
[Detailed explanation]

### [Subsystem A]
#### Inputs
- [What triggers this system]
#### Processing
- [What calculations/rules apply]
#### Outputs
- [What happens as a result]
#### Edge Cases
- [What happens in unusual scenarios]

## References
- [Link to related section or external resource]
```

## Core Loop Template

```markdown
## Core Gameplay Loop

### Primary Loop
```
[Action 1] -> [Action 2] -> [Action 3] -> [Action 4]
    ^                                              |
    +----------------------------------------------+
```

### Loop Breakdown
| Step | Action | Duration | Input | Feedback | Reward |
|------|--------|----------|-------|----------|--------|
| 1 | [Action] | [Time] | [Input] | [Visual/Audio] | [Reward] |

### Secondary Loop
```
[Metagame Action 1] -> [Metagame Action 2] -> [Metagame Action 3]
```

### Engagement Drivers
- [What keeps players coming back]
- [What creates excitement]
- [What provides satisfaction]
```

## Mechanic Design Template

```markdown
## Mechanic: [Name]

### Classification
- **Type:** [Primary/Secondary/Passive]
- **Category:** [Combat/Exploration/Social/Economy]
- **Unlock:** [When/how player unlocks this]

### Inputs
| Input | Action | Context |
|-------|--------|---------|
| [Key/Mouse] | [Action] | [When available] |

### Behavior
- [How the mechanic works step by step]

### Formulas
```
[Formula name] = [Formula expression]
[Variable definitions]
```

### Balance Parameters
| Parameter | Value | Reasoning |
|-----------|-------|-----------|
| [Param] | [Value] | [Why this value] |

### Feedback
- **Visual:** [What player sees]
- **Audio:** [What player hears]
- **Gameplay:** [What changes in game state]

### Failure States
- [What happens when player fails/uses incorrectly]
```

## Character Template

```markdown
## Character: [Name]

### Identity
- **Role:** [Protagonist/Antagonist/Support]
- **Archetype:** [Hero/Mentor/Trickster, etc.]
- **Age:** [Age]
- **Occupation:** [Job/Class]

### Appearance
- [Physical description]
- [Color scheme]
- [Distinctive features]

### Personality
- **Traits:** [Trait 1], [Trait 2], [Trait 3]
- **Strengths:** [Strength 1], [Strength 2]
- **Flaws:** [Flaw 1], [Flaw 2]
- **Motivation:** [What drives them]
- **Fear:** [What they fear most]

### Backstory
[2-3 paragraph backstory]

### Character Arc
| Act | State | Change |
|-----|-------|--------|
| Beginning | [Starting state] | - |
| Middle | [Midpoint state] | [What changes] |
| End | [Final state] | [Resolution] |

### Relationships
| Character | Relationship | Dynamic |
|-----------|-------------|---------|
| [Other] | [Friend/Rival/Family] | [How they interact] |

### Dialogue Style
- [Speech patterns, catchphrases, tone]
```

## Level Design Template

```markdown
## Level: [Name]

### Metadata
- **Theme:** [Environment]
- **Difficulty:** [1-10]
- **Duration:** [Expected completion time]
- **Unlock Condition:** [How to access]

### Layout Map
```
[ASCII art or description of level layout]
Legend:
P = Player start
E = Enemy spawn
C = Chest/Collectible
B = Boss
X = Exit
```

### Room List
| Room | Size | Enemies | Loot | Type | Description |
|------|------|---------|------|------|-------------|
| 1 | [WxH] | [Types] | [Items] | [Combat/Puzzle] | [Description] |

### Enemy Encounters
| Encounter | Enemies | Count | Position | Trigger | Difficulty |
|-----------|---------|-------|----------|---------|------------|
| 1 | [Type] | [N] | [Location] | [On enter] | [1-10] |

### Collectibles
| Item | Location | Visibility | Required? |
|------|----------|------------|-----------|
| [Name] | [Room/Position] | [Hidden/Visible] | [Yes/No] |

### Difficulty Curve
- [How difficulty changes through the level]
```

## Progression System Template

```markdown
## Progression System

### Experience Points
```
XP required for level N = BASE * N^EXPONENT
BASE = 100
EXPONENT = 1.5

Example levels:
1: 100 XP
2: 283 XP
3: 520 XP
5: 1118 XP
10: 3162 XP
```

### Level Rewards
| Level | Reward | Type |
|-------|--------|------|
| 1 | [Reward] | [Ability/Item/Stat] |

### Skill Tree
```
[Tier 1]   [Skill A]           [Skill B]
             |                     |
[Tier 2]   [Skill A1] [Skill A2] [Skill B1]
             |
[Tier 3]   [Skill A1a]
```
```

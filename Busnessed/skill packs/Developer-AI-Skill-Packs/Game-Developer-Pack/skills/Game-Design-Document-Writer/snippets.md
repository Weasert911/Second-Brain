# Game Design Document Writer - Snippets

## Core Loop Template

```markdown
[Action] -> [Feedback] -> [Reward] -> [Motivation] -> [Next Action]
```

## Mechanic Formula

```markdown
damage = base_damage * (1 + (level - 1) * 0.1) * crit_multiplier - defense
```

## XP Curve

```markdown
XP_required = BASE * level^EXPONENT
Level 1: 100 XP
Level 10: 3162 XP
Level 50: 35355 XP
```

## Character Profile

```markdown
- Name: [Name]
- Role: [Role]
- Traits: [Trait 1], [Trait 2]
- Motivation: [Goal]
- Arc: [Start -> Middle -> End]
```

## Level Flow

```markdown
Start -> [Room 1] -> [Room 2] -> [Boss] -> Exit
                    -> [Secret] ->
```

## Progression Table

```markdown
| Level | XP to Next | Reward |
|-------|------------|--------|
| 1     | 100        | Ability |
| 2     | 283        | Item    |
| 3     | 520        | Stat    |
```

## Economy Balance

```markdown
Earnings/hour: [Value]
Spending/hour: [Value]
Balance: [Positive/Negative]
```

## Quest Design

```markdown
Quest: [Name]
Type: [Main/Side]
Objectives: [Objective 1], [Objective 2]
Rewards: [XP], [Gold], [Item]
```

## Accessibility Options

```markdown
- Colorblind mode: [Yes/No]
- Subtitles: [Yes/No]
- Control remapping: [Yes/No]
- Difficulty options: [List]
```

## Post-Launch Roadmap

```markdown
Month 1: Bug fixes, balance patches
Month 2: New content update
Month 3: Feature update
Quarter 2: Major expansion
```

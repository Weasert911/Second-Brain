DIKKI DISASTER
Summer Vacation Packing Simulator

Elevator Pitch
Your family is going on summer vacation.

You have 30 seconds to pack the car trunk.

Choose the right items for the destination.

Choose poorly and the vacation becomes a legendary family disaster.


Scope
Target Development Time:
8–12 Hours

Engine:
Godot 4

Art Style:
Hand-drawn doodles

Animation:
Code Tweens only

Resolution:
1280x720

Target Playtime:
2–5 Minutes

Target Jam Goal:
Make players laugh.


Core Gameplay Loop
1. Destination Generation
A random vacation destination is selected.

Goa Beach
Needs:

Water Bottle
Sunscreen
Beach Towel
Bonus:

Drone

Hill Station
Needs:

Tent
Sleeping Bag
Flashlight
Bonus:

Books

Desert Safari
Needs:

Water Bottle
Sunscreen
Tent
Bonus:

Portable Stove

Family Picnic
Needs:

Chair
Cool Box
Water Bottle
Bonus:

Books

2. Packing Phase
Player sees:

Destination Card
Item Shelf
Car Trunk
Timer:
30 Seconds

Rule:
Pick exactly 5 items.

Each item clicked moves into trunk.

Click again removes it.


3. Trip Report
Score is calculated.

Player receives:

Star Rating
Vacation Grade
Funny Report Card

Screens
Scene 1
Main Menu

Contains:

Logo
Play Button
Quit Button
Background:

Doodle car bouncing slightly.


Scene 2
Packing Screen

Contains:

Top:

Destination Card
Left:

Item Shelf
Center:

Car Trunk
Top Right:

Timer
Bottom:

Selected Items Counter

Scene 3
Result Screen

Contains:

Star Rating
Vacation Grade
Funny Consequences
Play Again Button

Item List
Only 10 items.

No more.


Water Bottle
Space:
1

Category:
Essential

Description:
"Hydration is apparently important."


Sunscreen
Space:
1

Category:
Essential

Description:
"Prevents becoming a tomato."


Beach Towel
Space:
2

Category:
Comfort

Description:
"Dry yourself like a civilized human."


Tent
Space:
20

Category:
Essential

Description:
"Portable house."


Sleeping Bag
Space:
8

Category:
Comfort

Description:
"Stops nighttime suffering."


Flashlight
Space:
2

Category:
Essential

Description:
"Darkness DLC remover."


Portable Stove
Space:
12

Category:
Comfort

Description:
"Hot food generator."


Books
Space:
5

Category:
Fun

Description:
"Ancient entertainment technology."


Gaming Console
Space:
5

Category:
Fun

Description:
"Child mute button."


Drone
Space:
15

Category:
Fun

Description:
"Professional vacation exaggerator."


Art Asset List
Everything should be doodle-style.

Black outline.

White fill.

Colored accents.

No shading.

No lighting.

No animation frames.


UI Assets
Main Menu Logo

Play Button

Quit Button

Destination Card

Timer Frame

Result Card

Star Icon

Trunk Background

Notebook Paper Background


Item Icons
Water Bottle

Sunscreen

Beach Towel

Tent

Sleeping Bag

Flashlight

Portable Stove

Books

Gaming Console

Drone


Environment Cards
Goa Beach Card

Hill Station Card

Desert Safari Card

Family Picnic Card


Misc
Doodle Car

Happy Face

Neutral Face

Sad Face


Total Art Assets:

Approximately 25


Animation List
ALL animations are tween based.

No frame animation.

No AnimationPlayer required.


Main Menu Car
Loop:

Position Y

Move Up:
10px

Move Down:
10px

Duration:
1 second

Repeat forever


Play Button
Mouse Hover:

Scale:
1.0 → 1.1

Duration:
0.1 sec


Item Hover
Scale:
1.0 → 1.08

Duration:
0.1 sec


Item Selected
Tween:

Move from shelf to trunk.

Duration:
0.25 sec

Ease:
Out


Item Deselected
Tween:

Move back to shelf.

Duration:
0.25 sec


Timer Warning
When under 10 seconds:

Scale:

1.0 ↔ 1.2

Loop


Star Reveal
Result screen:

Reveal stars one by one.

Delay:
0.2 sec


Report Card
Slides from top.

Duration:
0.4 sec


Scoring System
Each destination has 3 required items.

Each required item:

+30

Missing required item:

-20

Bonus item:

+10

Maximum:
100

Minimum:
0

Clamp result.


Star Ratings
90+

⭐⭐⭐⭐⭐

"A Legendary Vacation"


70+

⭐⭐⭐⭐

"Pretty Great Trip"


50+

⭐⭐⭐

"Mostly Functional"


30+

⭐⭐

"Questionable Planning"


Below 30

⭐

"Family Group Chat Meltdown"


Funny Consequences
Missing Water
Everyone became raisins.


Missing Sunscreen
Entire family became tomatoes.


Missing Tent
You paid for nature and received suffering.


Missing Sleeping Bag
Nobody slept.
Everybody complained.


Missing Flashlight
Several mysterious noises were investigated poorly.


Missing Stove
Dinner consisted of sadness and chips.


Missing Entertainment
Children discovered boredom.
Nobody survived emotionally.


Brought Drone
You now have 500 photos of parking lots.


Perfect Score
The family is considering letting you plan vacations again.


Audio
Very Simple.

Only 5 Sounds.

Button Click

Item Select

Item Remove

Star Pop

Success Jingle


Project Structure
Scenes/

MainMenu.tscn

PackingScene.tscn

ResultScene.tscn


Scripts/

main_menu.gd

packing.gd

item.gd

destination.gd

scoring.gd

result.gd


Assets/

ui/

items/

cards/

audio/


Win Condition
Get 5 Stars.

Unlock:

"Vacation Master"


Loss Condition
Get 1 Star.

Show:

"Next year's vacation has been cancelled."


Why This Can Actually Be Finished
Only:

3 Scenes
10 Items
4 Destinations
25 Doodle Assets
Tween Animations Only
Simple Score Logic
A solo developer can realistically complete this in one day and still have time for polish.
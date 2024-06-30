# Snooker Game Project

This snooker game project employs object-oriented programming (OOP) to create a well-organized, modular codebase. OOP enables the encapsulation of various game elements like the table, balls, and cue stick into distinct classes, making the code more manageable and scalable. The game features three modes, dynamic interactions, and realistic animations, offering an engaging and authentic snooker experience.

## Game Modes

The game includes three modes:

1. **Standard Snooker**: This mode follows traditional snooker rules and setup, providing a familiar experience for players.
2. **Random All Balls**: In this mode, all balls are placed randomly on the table. The algorithm ensures no overlap between balls by generating positions within the table boundaries and checking distances between balls.
3. **Random Red Balls**: Similar to the second mode, but only the red balls are placed randomly. The colored balls remain in their standard positions.

The randomization algorithm used in these modes is designed to maintain a fair and playable setup by ensuring sufficient spacing between balls and preventing overlaps.

## Cue Ball Placement

The cue ball can only be placed inside the "D" zone, and this placement is done using the mouse. The choice of mouse control for this task over keyboard input is intentional. Using the mouse allows for precise placement within the "D" zone, mimicking the accuracy required in a real snooker game. This precision would be difficult to achieve with keyboard inputs.

## Cue Stick Control

The cue stick can be manipulated using both the mouse and keyboard:

- **Mouse Control**: The mouse adjusts the angle of the cue stick, providing an intuitive and direct way to aim.
- **Keyboard Control**: The left and right arrow keys offer fine-tuned adjustments to the angle, giving players precise control over their shots.

## Unique Cue Stick Animation

A standout feature of this game is the cue stick's animation, which simulates the action of hitting the ball. When the player releases the mouse button, the cue stick moves forward, hits the ball, and then retracts. This animation adds a layer of realism.

## Cue Stick Visibility

Another unique aspect is that the cue stick disappears while balls are in motion and only reappears when all balls have stopped moving. This design choice enhances gameplay by ensuring the player is not distracted by the cue stick during the dynamic phases of the game. It also adds to the realism, as in a real snooker game, the cue is not actively in the player's hand while balls are still in motion.

## Interaction Logging

The game logs interactions on the screen, providing feedback for each cue ball collision with other objects and indicating when a ball is pocketed. This real-time feedback helps players understand the results of their shots and adds a layer of interactivity and engagement.

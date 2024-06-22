# Two-Week Plan for Midterm Project

## Week 1

### Day 1-2: Project Setup and Initial Drawing

- **Task 1**: Set up the project environment.
  - Create a new repository.
  - Set up the project structure and install necessary libraries (p5.js, matter.js).
  - Initialize index.html and main.js files.
  - **PR Name**: `setup-project-environment`

- **Task 2**: Create the initial canvas.
  - Set up a basic canvas in main.js using p5.js.
  - Ensure the canvas size maintains the correct aspect ratio (e.g., 1200x600 pixels).
  - **PR Name**: `create-initial-canvas`

### Day 3-4: Draw Snooker Table

- **Task 3**: Define variables for the table, balls, and cue.
  - Create global variables for table dimensions, ball size, and pocket size.
  - Store ball objects in arrays.
  - **PR Name**: `define-variables`

- **Task 4**: Draw the snooker table.
  - Implement the drawing of the snooker table in the middle of the canvas with correct colors, pockets, and lines.
  - **PR Name**: `draw-snooker-table`

### Day 5-6: Ball Drawing in Starting Positions

- **Task 5**: Implement starting positions for balls.
  - Draw balls in their starting positions using keystroke "1".
  - Ensure the cue ball is excluded from the initial drawing.
  - **PR Name**: `draw-balls-starting-positions`

### Day 7: Implement Random Position Modes

- **Task 6**: Implement random positions for red balls.
  - Draw red balls in random positions using keystroke "2".
  - **PR Name**: `draw-random-red-positions`

- **Task 7**: Implement random positions for all balls.
  - Draw both red and colored balls in random positions using keystroke "3".
  - **PR Name**: `draw-random-all-positions`

## Week 2

### Day 1-2: Implement Physics Properties

- **Task 8**: Add physics properties for balls.
  - Implement restitution and friction for balls using matter.js.
  - **PR Name**: `add-physics-properties-balls`

- **Task 9**: Add physics properties for cushions.
  - Implement restitution for cushions using matter.js.
  - **PR Name**: `add-physics-properties-cushions`

### Day 3: Draw and Implement Cue

- **Task 10**: Draw the cue.
  - Implement drawing of the cue on the canvas.
  - **PR Name**: `draw-cue`

- **Task 11**: Add interaction for the cue.
  - Implement mouse and keyboard interaction to control the cue.
  - Ensure the cue ball can only be placed in the "D" zone.
  - **PR Name**: `add-cue-interaction`

### Day 4-5: Collision Detection and Ball Handling

- **Task 12**: Implement collision detection.
  - Add collision detection for cue ball with other balls and cushions.
  - **PR Name**: `implement-collision-detection`

- **Task 13**: Implement ball handling for pockets.
  - Remove red balls from the array when pocketed.
  - Re-spot colored balls when pocketed.
  - Return the cue ball to the "D" zone if pocketed.
  - **PR Name**: `implement-ball-handling`

### Day 6: Gaming Aspects

- **Task 14**: Implement additional gaming aspects.
  - Add error prompts when two consecutive colored balls are pocketed.
  - **PR Name**: `add-gaming-aspects`

### Day 7: Code Review and Commentary

- **Task 15**: Review and refine code.
  - Ensure code presentation: syntax, comments, consistent indentation, and removal of redundant code.
  - **PR Name**: `code-review`

- **Task 16**: Write commentary.
  - Explain design choices and any implemented extensions in a 500-word commentary.
  - **PR Name**: `write-commentary`

### Final Steps

- **Task 17**: Record video demo.
  - Create a video demonstrating all functionalities.
  - Include scenarios: ball starting positions, random positions, pocketed cue ball, pocketed colored balls, error prompts, and collision detection.
  - Ensure the console window is open during the demo.
  - **PR Name**: `prepare-video-demo`

### Good to have

- give balls border color

## Summary

- **Week 1**: Focus on setting up the environment, drawing the table, and initial ball positions.
- **Week 2**: Implement physics, interactions, collision detection, and finalize the project with a video demo and commentary.


            +-----------------------------------------+
            |             SnookerTable                |
            +-----------------------------------------+
            | - tableWidth: float                     |
            | - tableLength: float                    |
            | - ballDiameter: float                   |
            | - pocketDiameter: float                 |
            | - pocketRadius: float                   |
            +-----------------------------------------+
            | + drawTable(): void                     |
            | + drawEdges(): void                     |
            | + drawPockets(): void                   |
            | + drawBaulkLine(): void                 |
            | + drawDZone(): void                     |
            | + createBalls(): void                   |
            +-----------------------------------------+

                | uses
                v
            +-----------------------------------------+
            |                  Ball                   |
            +-----------------------------------------+
            | - x: float                              |
            | - y: float                              |
            | - diameter: float                       |
            | - body: Matter.Body                     |
            +-----------------------------------------+
            | + display(): void                       |
            | + applyFriction(): void                 |
            | + applyRestitution(): void              |
            +-----------------------------------------+

                | manages
                v
            +-----------------------------------------+
            |                  Cue                    |
            +-----------------------------------------+
            | - x: float                              |
            | - y: float                              |
            | - length: float                         |
            | - angle: float                          |
            | - speed: float                          |
            +-----------------------------------------+
            | + drawCue(): void                       |
            | + moveCue(): void                       |
            | + hitBall(): void                       |
            | + adjustSpeed(): void                   |
            +-----------------------------------------+

                | detects
                v
            +-----------------------------------------+
            |           CollisionManager              |
            +-----------------------------------------+
            | - collisionType: String                 |
            +-----------------------------------------+
            | + detectCollision(): void               |
            | + handleCollision(): void               |
            | + collisionCueRed(): void               |
            | + collisionCueColour(): void            |
            | + collisionCueCushion(): void           |
            +-----------------------------------------+

                | uses
                v
            +-----------------------------------------+
            |                  Game                   |
            +-----------------------------------------+
            | - balls: Ball[]                         |
            | - cue: Cue                              |
            | - table: SnookerTable                   |
            | - mode: int                             |
            | - engine: Matter.Engine                 |
            | - world: Matter.World                   |
            +-----------------------------------------+
            | + startGame(): void                     |
            | + handleKeystroke(mode: int): void      |
            | + update(): void                        |
            | + render(): void                        |
            | + initializeBalls(): void               |
            | + resetCueBall(): void                  |
            | + repositionColouredBall(): void        |
            | + showErrorPrompt(): void               |
            +-----------------------------------------+

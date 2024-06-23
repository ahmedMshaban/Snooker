class Game {
  constructor() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.engine.gravity.y = 0; // No gravity in the horizontal direction
    this.balls = [];
    this.cueStick = null; // Initialize cue stick
    this.table = new SnookerTable(this.world);
    this.mode = 0;
    this.cueBall = null; // Initialize cue ball
    this.cueBallPlaced = false; // Track cue ball placement
    this.error = {
      isError: false,
      message: "",
    };
  }

  startGame() {
    Runner.run(this.engine);
    this.table.setupTable();
    this.render();
  }

  handleKeystroke(mode) {
    // if game in progress, ignore keystrokes
    if (this.mode !== 0) return;

    this.mode = mode;
    this.initializeBalls();
  }

  handleMouse(mouseX, mouseY) {
    // ignore mouse clicks if the game is not in progress
    if (this.mode === 0) return;

    if (!game.cueBallPlaced) {
      if (this.table.isInsideDZone(mouseX, mouseY)) {
        // Place the cue ball in the 'D' zone
        game.createCueBall(mouseX, mouseY);
        this.cueBallPlaced = true;

        // Create the cue stick
        game.createCueStick(
          this.cueBall.body.position.x,
          this.cueBall.body.position.y,
          150
        );

        // Remove the error message
        this.error = {
          isError: false,
          message: "",
        };
      } else {
        this.error = {
          isError: true,
          message: "Cue ball must be placed in the 'D' zone",
        };
      }
    }
  }

  update() {
    Engine.update(this.engine);
    this.render();
  }

  render() {
    // Canvas background
    background(200);

    // Draw the table, balls, and cue
    this.table.drawTable();
    this.balls.forEach((ball) => ball.draw());

    if (this.cueBall) {
      this.cueBall.draw();
      this.cueStick.draw();
    }

    if (this.mode === 0) {
      this.showModePrompt();
    }

    if (this.mode !== 0 && !this.cueBallPlaced) {
      this.error = {
        isError: true,
        message: "Place the cue ball in the 'D' zone",
      };
    }

    if (this.error.isError) {
      this.showErrorPrompt(this.error.message);
    }
  }

  initializeBalls() {
    // Clear existing balls from the Matter.js world and array
    this.balls.forEach((ball) => this.removeFromWorld(ball.body));
    this.balls = [];

    // Create balls based on the mode
    if (this.mode === 1) {
      this.createStartingPositions();
    } else if (this.mode === 2) {
      this.createRandomRedPositions();
    } else if (this.mode === 3) {
      this.createRandomPositions();
    }
  }

  generateRandomPosition(ballDiameter, currentBalls) {
    let x, y, overlapping;
    do {
      overlapping = false;
      x = random(
        this.table.innerLeftX + ballDiameter,
        this.table.innerRightX - ballDiameter
      );
      y = random(
        this.table.innerTopY + ballDiameter,
        this.table.innerBottomY - ballDiameter
      );

      // Check for overlap with existing balls
      for (let ball of currentBalls) {
        const distance = dist(x, y, ball.body.position.x, ball.body.position.y);
        if (distance < ballDiameter * 1.1) {
          overlapping = true;
          break;
        }
      }
    } while (overlapping);

    return { x, y };
  }

  placeNonRedBalls() {
    const ballDiameter = this.table.ballDiameter;
    const baulkLineX = this.table.baulkLineX;
    const dRadius = this.table.dRadius;
    const dCenterY = this.table.dCenterY;

    this.balls.push(
      new Ball(
        baulkLineX,
        dCenterY + dRadius,
        ballDiameter,
        this.world,
        [255, 255, 0]
      )
    ); // Yellow ball
    this.balls.push(
      new Ball(
        baulkLineX,
        dCenterY - dRadius,
        ballDiameter,
        this.world,
        [0, 255, 0]
      )
    ); // Green ball
    this.balls.push(
      new Ball(baulkLineX, dCenterY, ballDiameter, this.world, [165, 42, 42])
    ); // Brown ball
    // Position of the remaining colored balls
    this.balls.push(new Ball(600, 300, ballDiameter, this.world, [0, 0, 255])); // Blue ball
    this.balls.push(
      new Ball(880, 300, ballDiameter, this.world, [255, 192, 203])
    ); // Pink ball
    this.balls.push(new Ball(1100, 300, ballDiameter, this.world, [0, 0, 0])); // Black ball
  }

  createStartingPositions() {
    this.placeNonRedBalls();

    // Red balls in triangular formation
    const ballDiameter = this.table.ballDiameter;
    const startX = 900; // Adjusted Starting X position for the triangle
    const startY = 300; // Y position for the tip of the triangle
    const spacing = ballDiameter * 1.1; // Slight spacing between balls

    let redCount = 0;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= row; col++) {
        const x = startX + row * spacing;
        const y = startY - (row / 2) * spacing + col * spacing;
        this.balls.push(new Ball(x, y, ballDiameter, this.world, [255, 0, 0])); // Red ball
        redCount++;
        if (redCount >= 15) break;
      }
      if (redCount >= 15) break;
    }
  }

  createRandomRedPositions() {
    this.placeNonRedBalls();

    // Generate random positions for 15 red balls
    const ballDiameter = this.table.ballDiameter;
    for (let i = 0; i < 15; i++) {
      const { x, y } = this.generateRandomPosition(ballDiameter, this.balls);
      this.balls.push(new Ball(x, y, ballDiameter, this.world, [255, 0, 0])); // Red ball
    }
  }

  createRandomPositions() {
    const ballDiameter = this.table.ballDiameter;

    // Generate random positions for all balls
    const colors = [
      [255, 255, 0], // Yellow ball
      [0, 255, 0], // Green ball
      [165, 42, 42], // Brown ball
      [0, 0, 255], // Blue ball
      [255, 192, 203], // Pink ball
      [0, 0, 0], // Black ball
    ];

    // Place non-red balls
    for (let color of colors) {
      const { x, y } = this.generateRandomPosition(ballDiameter, this.balls);
      this.balls.push(new Ball(x, y, ballDiameter, this.world, color));
    }

    // Place red balls
    for (let i = 0; i < 15; i++) {
      const { x, y } = this.generateRandomPosition(ballDiameter, this.balls);
      this.balls.push(new Ball(x, y, ballDiameter, this.world, [255, 0, 0])); // Red ball
    }
  }

  createCueBall(x, y) {
    const cueBall = new Ball(x, y, this.table.ballDiameter, this.world, [255]);
    this.balls.push(cueBall);
    this.cueBall = cueBall;
  }

  createCueStick() {
    const cueBallX = this.cueBall.body.position.x;
    const cueBallY = this.cueBall.body.position.y;
    const cueBallRadius = this.cueBall.diameter;
    const cueLength = 150;

    // Set initial position to the right of the cue ball
    const stickX = cueBallX - cueBallRadius - cueLength / 2;
    const stickY = cueBallY;

    this.cueStick = new CueStick(
      stickX,
      stickY,
      cueBallX,
      cueBallY,
      cueBallRadius,
      cueLength,
      this.world
    );

    // Set initial rotation angle to point towards the cue ball
    const angle = 0; // Initial angle pointing horizontally right
    this.cueStick.body.angle = angle;
    this.cueStick.angle = angle;
  }

  showErrorPrompt() {
    // Display an error message on the screen
    fill(255);
    textSize(20);
    text(this.error.message, width / 2 - 150, height / 2 - 200);
  }

  showModePrompt() {
    fill(255);
    textSize(20);
    text("Press 1 for standard mode", width / 2 - 150, height / 2 - 50);
    text("Press 2 for random reds position mode", width / 2 - 150, height / 2);
    text(
      "Press 3 for random all balls position mode",
      width / 2 - 150,
      height / 2 + 50
    );
  }

  ////////////////////////////////////////////////////////////
  //removes a body from the physics world
  removeFromWorld(body) {
    World.remove(this.engine.world, body);
  }
}

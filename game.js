class Game {
  constructor() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.engine.gravity.y = 0; // No gravity in the horizontal direction
    this.balls = [];
    this.cue = new Cue(200, 300, 150, this.world);
    this.table = new SnookerTable(this.world);
    this.mode = 0;

    this.initializeBalls();
  }

  startGame() {
    Runner.run(this.engine);
    this.table.setupTable();
    this.render();
  }

  handleKeystroke(mode) {
    this.mode = mode;
    this.initializeBalls();
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
    this.cue.drawCue();
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

  resetCueBall() {
    // Reset cue ball position, for example inside the "D" zone
    this.cue.setPosition(this.table.getDZonePosition());
  }

  showErrorPrompt(message) {
    // Display an error message on the screen
    fill(255, 0, 0);
    textSize(32);
    text(message, width / 2, height / 2);
  }

  ////////////////////////////////////////////////////////////
  //removes a body from the physics world
  removeFromWorld(body) {
    World.remove(this.engine.world, body);
  }
}

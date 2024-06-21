class Game {
  constructor() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.world.gravity.y = 0; // No gravity in the horizontal direction
    this.balls = [];
    // this.cue = new Cue();
    this.table = new SnookerTable(this.world);
    this.mode = 0;

    this.initializeBalls();
  }

  startGame() {
    Matter.Runner.run(this.engine);
    this.render();
  }

  handleKeystroke(mode) {
    this.mode = mode;
    this.initializeBalls();
  }

  update() {
    Matter.Engine.update(this.engine);
    this.render();
  }

  render() {
    // Canvas background
    background(200);

    // Draw the table, balls, and cue
    this.table.drawTable();
    this.balls.forEach((ball) => ball.display());
    // this.cue.drawCue();
  }

  initializeBalls() {
    // Clear existing balls from the Matter.js world and array
    this.balls.forEach((ball) => Matter.World.remove(this.world, ball.body));
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

  createStartingPositions() {
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

    // Red balls in triangular formation
    const startX = 900; // Adjusted Starting X position for the triangle
    const startY = 300; // Y position for the tip of the triangle
    const spacing = ballDiameter * 1.1; // Slight spacing between balls

    // Position of the remaining colored balls
    this.balls.push(new Ball(600, 300, ballDiameter, this.world, [0, 0, 255])); // Blue ball
    this.balls.push(
      new Ball(
        startX - spacing - 5,
        300,
        ballDiameter,
        this.world,
        [255, 192, 203]
      )
    ); // Pink ball
    this.balls.push(new Ball(1100, 300, ballDiameter, this.world, [0, 0, 0])); // Black ball

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
    for (let i = 0; i < 15; i++) {
      let x = random(100, width - 100);
      let y = random(100, height - 100);
      this.balls.push(new Ball(x, y, this.table.ballDiameter, this.world));
    }
  }

  createRandomPositions() {
    this.createRandomRedPositions();
    // Add colored balls at fixed positions
    this.balls.push(new Ball(200, 150, this.table.ballDiameter, this.world));
    this.balls.push(new Ball(250, 150, this.table.ballDiameter, this.world));
    // Add more colored balls as needed
  }

  resetCueBall() {
    // Reset cue ball position, for example inside the "D" zone
    // this.cue.setPosition(this.table.getDZonePosition());
  }

  repositionColouredBall(colouredBall) {
    // Reposition the colored ball to its designated spot
    colouredBall.setPosition(this.table.getColouredBallPosition(colouredBall));
  }

  showErrorPrompt(message) {
    // Display an error message on the screen
    fill(255, 0, 0);
    textSize(32);
    text(message, width / 2, height / 2);
  }
}

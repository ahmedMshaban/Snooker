let game;
const canvasWidth = 1200;
const canvasHeight = 600;

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  game = new Game();
  game.startGame();
}

function draw() {
  game.update();
}

class Game {
  constructor() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
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
    // Example positions, adjust as needed
    this.balls.push(new Ball(300, 200, this.table.ballDiameter, this.world));
    this.balls.push(new Ball(350, 200, this.table.ballDiameter, this.world));
    // Add more balls as needed
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

class Ball {
  constructor(x, y, diameter, world) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.body = Matter.Bodies.circle(x, y, diameter / 2);
    Matter.World.add(world, this.body);
  }

  display() {
    fill(255);
    ellipse(this.body.position.x, this.body.position.y, this.diameter);
  }

  setPosition(position) {
    Matter.Body.setPosition(this.body, position);
  }

  applyFriction() {
    // Apply friction using Matter.js properties
  }

  applyRestitution() {
    // Apply restitution using Matter.js properties
  }
}

function keyPressed() {
  if (key === "1") {
    game.handleKeystroke(1);
  } else if (key === "2") {
    game.handleKeystroke(2);
  } else if (key === "3") {
    game.handleKeystroke(3);
  }
}

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
    this.isCueBallJustPlaced = false; // Track if cue ball was just placed
    this.allBallsStopped = false; // Track if all balls have stopped
    this.error = {
      isError: false,
      message: "",
    };
    this.impactMessage = ""; // Track the impact message
    this.impactMessageTimeout = null; // Timeout for clearing the impact message
    this.recentPottedBalls = []; // Track recently potted balls
    this.pottedBallTimeout = 5000; // 5 seconds timeout to check for multiple potted balls

    Events.on(this.engine, "collisionStart", this.handleCollision.bind(this));
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
        this.isCueBallJustPlaced = true;

        // Create the cue stick
        this.cueStick = new CueStick(this.cueBall);

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

  handleMouseReleased() {
    if (this.cueStick && this.cueBallPlaced && this.allBallsStopped) {
      if (this.isCueBallJustPlaced) {
        // Reset the flag without hitting the ball
        this.isCueBallJustPlaced = false;
      } else {
        // Hit the cue ball
        this.cueBall.hit(this.cueStick.power, this.cueStick.angle);
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

    // Check if all balls are stopped
    this.allBallsStopped = this.balls.every((ball) => ball.isStopped());

    if (this.cueBall) {
      this.cueBall.draw();
      if (this.allBallsStopped) {
        this.cueStick.draw();
      }
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

    this.showImpactMessage();
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

    this.balls.push(
      new Ball(
        this.table.coloredBalls.yellow.x,
        this.table.coloredBalls.yellow.y,
        ballDiameter,
        this.world,
        [255, 255, 0],
        this.table.coloredBalls.yellow.color
      )
    ); // Yellow ball
    this.balls.push(
      new Ball(
        this.table.coloredBalls.green.x,
        this.table.coloredBalls.green.y,
        ballDiameter,
        this.world,
        [0, 255, 0],
        this.table.coloredBalls.green.color
      )
    ); // Green ball
    this.balls.push(
      new Ball(
        this.table.coloredBalls.brown.x,
        this.table.coloredBalls.brown.y,
        ballDiameter,
        this.world,
        [165, 42, 42],
        this.table.coloredBalls.brown.color
      )
    ); // Brown ball
    // Position of the remaining colored balls
    this.balls.push(
      new Ball(
        this.table.coloredBalls.blue.x,
        this.table.coloredBalls.blue.y,
        ballDiameter,
        this.world,
        [0, 0, 255],
        this.table.coloredBalls.blue.color
      )
    ); // Blue ball
    this.balls.push(
      new Ball(
        this.table.coloredBalls.pink.x,
        this.table.coloredBalls.pink.y,
        ballDiameter,
        this.world,
        [255, 192, 203],
        this.table.coloredBalls.pink.color
      )
    ); // Pink ball
    this.balls.push(
      new Ball(
        this.table.coloredBalls.black.x,
        this.table.coloredBalls.black.y,
        ballDiameter,
        this.world,
        [0, 0, 0],
        this.table.coloredBalls.black.color
      ) // Black ball
    );
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
        this.balls.push(
          new Ball(
            x,
            y,
            ballDiameter,
            this.world,
            [255, 0, 0],
            `redBall${redCount}`
          )
        ); // Red ball
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
      this.balls.push(
        new Ball(x, y, ballDiameter, this.world, [255, 0, 0], `redBall${i}`)
      ); // Red ball
    }
  }

  createRandomPositions() {
    const ballDiameter = this.table.ballDiameter;

    // Generate random positions for all balls
    const colors = [
      {
        yellow: [255, 255, 0],
      }, // Yellow ball
      {
        green: [0, 255, 0],
      }, // Green ball
      {
        brown: [165, 42, 42],
      }, // Brown ball
      {
        blue: [0, 0, 255],
      }, // Blue ball
      {
        pink: [255, 192, 203],
      }, // Pink ball
      {
        black: [0, 0, 0],
      }, // Black ball
    ];

    // Place non-red balls
    for (let color of colors) {
      const { x, y } = this.generateRandomPosition(ballDiameter, this.balls);
      this.balls.push(
        new Ball(
          x,
          y,
          ballDiameter,
          this.world,
          Object.values(color)[0],
          Object.keys(color)[0]
        )
      );
    }

    // Place red balls
    for (let i = 0; i < 15; i++) {
      const { x, y } = this.generateRandomPosition(ballDiameter, this.balls);
      this.balls.push(
        new Ball(x, y, ballDiameter, this.world, [255, 0, 0], `redBall${i}`)
      ); // Red ball
    }
  }

  createCueBall(x, y) {
    const cueBall = new Ball(
      x,
      y,
      this.table.ballDiameter,
      this.world,
      [255],
      "cueBall"
    );
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

  handleCollision(event) {
    const pairs = event.pairs;
    pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;

      // Check if a ball has collided with a pocket
      if (this.isBallInPocket(bodyA, bodyB)) {
        this.handleBallInPocket(bodyA, bodyB);
      } else if (this.isCueBallCollision(bodyA, bodyB)) {
        this.handleCueBallCollision(bodyA, bodyB);
      }
    });
  }

  isCueBallCollision(bodyA, bodyB) {
    return (
      (bodyA === this.cueBall.body && this.isNonCueBall(bodyB)) ||
      (bodyB === this.cueBall.body && this.isNonCueBall(bodyA))
    );
  }

  isNonCueBall(body) {
    return this.balls.some(
      (ball) => ball.body === body && ball !== this.cueBall
    );
  }

  handleCueBallCollision(bodyA, bodyB) {
    const otherBody = bodyA === this.cueBall.body ? bodyB : bodyA;
    const collidedBall = this.balls.find((ball) => ball.body === otherBody);

    if (collidedBall) {
      if (collidedBall.label === "cueBall") {
        this.promptImpact("cue-cue");
      } else if (collidedBall.label.startsWith("redBall")) {
        this.promptImpact("cue-red");
      } else {
        this.promptImpact(`cue-${collidedBall.label}`);
      }
    }
  }

  promptImpact(type) {
    this.impactMessage = `Impact detected: ${type}`;
    if (this.impactMessageTimeout) {
      clearTimeout(this.impactMessageTimeout);
    }
    this.impactMessageTimeout = setTimeout(() => {
      this.impactMessage = "";
    }, 4000); // Display for 4 seconds
  }

  showImpactMessage() {
    if (this.impactMessage) {
      fill(255);
      textSize(20);
      text(this.impactMessage, width / 2 - 150, height / 2 - 100);
    }
  }

  isBallInPocket(bodyA, bodyB) {
    return (
      (this.isPocket(bodyA) && this.isBall(bodyB)) ||
      (this.isPocket(bodyB) && this.isBall(bodyA))
    );
  }

  isPocket(body) {
    return this.table.pockets.includes(body);
  }

  isBall(body) {
    return this.balls.some((ball) => ball.body === body);
  }

  handleBallInPocket(bodyA, bodyB) {
    const ballBody = this.isBall(bodyA) ? bodyA : bodyB;

    // Find the ball object from the body
    const ball = this.balls.find((ball) => ball.body === ballBody);

    if (ball) {
      if (this.isColoredBall(ball)) {
        // Track potted colored balls
        this.trackPottedBall(ball);

        // Re-spot the colored ball
        this.reSpotColoredBall(ball);

        // Inform the user that the colored ball was pocketed
        this.promptImpact(`pocket-colored-${ball.label}`);
      } else if (ball.label === "cueBall") {
        this.removeFromWorld(ball.body);
        this.balls = this.balls.filter((b) => b !== ball);
        // Reset the cue ball
        this.cueBall = null;
        this.cueBallPlaced = false;
        this.isCueBallJustPlaced = false;

        // Inform the user that the cue ball was pocketed
        this.promptImpact("pocket-cue");
      } else {
        // Remove the ball from the world and the game
        this.removeFromWorld(ball.body);
        this.balls = this.balls.filter((b) => b !== ball);

        // Inform the user that a red ball was pocketed
        this.promptImpact("pocket-red");
      }
    }
  }

  trackPottedBall(ball) {
    this.recentPottedBalls.push(ball);

    if (this.recentPottedBalls.length > 1) {
      // Check if there are multiple colored balls potted within the timeout period
      const coloredBalls = this.recentPottedBalls.filter((b) =>
        this.isColoredBall(b)
      );
      if (coloredBalls.length > 1) {
        fill(255);
        textSize(20);
        text(
          "Multiple colored balls potted",
          width / 2 - 150,
          height / 2 - 200
        );
      }
    }

    // Remove the ball from the list after the timeout
    setTimeout(() => {
      this.recentPottedBalls = this.recentPottedBalls.filter((b) => b !== ball);
    }, this.pottedBallTimeout);
  }

  isColoredBall(ball) {
    return ["yellow", "green", "brown", "blue", "pink", "black"].includes(
      ball.label
    );
  }

  reSpotColoredBall(ball) {
    // Get the spot position for the colored ball
    const spot = this.table.coloredBalls[ball.label];
    // Set the ball's position to the spot position
    Body.setPosition(ball.body, spot);
    Body.setVelocity(ball.body, { x: 0, y: 0 });
  }

  ////////////////////////////////////////////////////////////
  //removes a body from the physics world
  removeFromWorld(body) {
    World.remove(this.engine.world, body);
  }
}

class CueStick {
  constructor(cueBall) {
    this.length = 150;
    this.cueBall = cueBall;
    this.angle = 0;
    this.power = 0;
    this.maxPower = 0.012; // Maximum power of the shot
    this.charging = false; // Flag to check if the power is being charged
    this.hitAnimation = false;
    this.animationProgress = 0;
    this.animationDuration = 10;
    this.hitBall = false; // Flag to determine when to hit the ball
  }

  draw() {
    const cueBallRadius = this.cueBall.diameter;
    const fixedDistance = cueBallRadius + this.length / 2;

    let stickX, stickY;
    if (this.hitAnimation) {
      const forwardDistance =
        (this.animationProgress / this.animationDuration) * 5; // Move forward 5 pixels
      stickX =
        this.cueBall.body.position.x -
        (fixedDistance - forwardDistance) * cos(this.angle);
      stickY =
        this.cueBall.body.position.y -
        (fixedDistance - forwardDistance) * sin(this.angle);
      this.animationProgress++;

      if (this.animationProgress >= this.animationDuration) {
        this.hitAnimation = false;
        this.animationProgress = 0;
        this.hitBall = true; // Set flag to hit the ball
      }
    } else {
      stickX = this.cueBall.body.position.x - fixedDistance * cos(this.angle);
      stickY = this.cueBall.body.position.y - fixedDistance * sin(this.angle);
    }

    push();
    translate(stickX, stickY);
    rotate(this.angle);

    // Draw the light brown shaft part
    stroke(210, 180, 140); // Light brown color for the shaft
    strokeWeight(8); // Slightly thinner than the handle
    line(0, 0, this.length / 2, 0);

    // Draw the white tip
    stroke(255); // White color for the tip
    strokeWeight(8); // Same width as the shaft
    line(this.length / 2 - 2, 0, this.length / 2, 0);

    // Draw the black handle part
    stroke(0); // Black color for the handle
    strokeWeight(10);
    line(-this.length / 2, 0, 0, 0);

    pop();
  }

  handleMouse(mouseX, mouseY) {
    const angle = atan2(
      mouseY - this.cueBall.body.position.y,
      mouseX - this.cueBall.body.position.x
    );

    this.angle = angle;
  }

  handleKeystroke(key) {
    const rotationStep = 0.05;

    if (key === "left") {
      // Rotate clockwise
      this.angle += rotationStep;
    } else if (key === "right") {
      // Rotate counterclockwise
      this.angle -= rotationStep;
    }
  }

  handleMousePressed() {
    this.charging = true;
    this.power = 0; // Reset power
  }

  handleMouseReleased() {
    if (this.charging) {
      this.charging = false;
      this.startHitAnimation();
    }
  }

  update() {
    if (this.charging) {
      this.power = min(this.power + 0.0005, this.maxPower); // Increase power while charging
    }

    if (this.hitBall) {
      this.hitBall = false; // Reset the flag
      this.cueBall.hit(this.power, this.angle);
    }
  }

  startHitAnimation() {
    this.hitAnimation = true;
    this.animationProgress = 0;
  }
}

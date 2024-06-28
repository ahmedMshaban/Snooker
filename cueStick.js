class CueStick {
  constructor(cueBall) {
    this.length = 150;
    this.cueBall = cueBall;
    this.angle = 0;
    this.power = 0.005;
  }

  draw() {
    const cueBallRadius = this.cueBall.diameter;
    const fixedDistance = cueBallRadius + this.length / 2;

    const stickX =
      this.cueBall.body.position.x - fixedDistance * cos(this.angle);
    const stickY =
      this.cueBall.body.position.y - fixedDistance * sin(this.angle);

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
    strokeWeight(10); // Adjust width as necessary
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

    // Update the angle of the cue stick body
    Body.setAngle(this.body, this.angle);

    const cueBallRadius = this.cueBall.diameter / 2;
    const fixedDistance = cueBallRadius + this.length / 2;

    const stickX =
      this.cueBall.body.position.x - fixedDistance * cos(this.angle);
    const stickY =
      this.cueBall.body.position.y - fixedDistance * sin(this.angle);

    Body.setPosition(this.body, { x: stickX, y: stickY });
    this.x = stickX; // Update this.x for p5.js rendering
    this.y = stickY; // Update this.y for p5.js rendering
  }
}

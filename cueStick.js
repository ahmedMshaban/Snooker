class CueStick {
  constructor(x, y, cueBallX, cueBallY, cueBallRadius, length, world) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.world = world;
    this.angle = 0;
    this.cueBallX = cueBallX;
    this.cueBallY = cueBallY;
    this.cueBallRadius = cueBallRadius;
    // Create a rectangular body for the cue stick
    this.body = Bodies.rectangle(x, y, length, 10, {
      isStatic: true,
      isSensor: true,
    });

    // Add the cue stick body to the Matter.js world
    World.add(this.world, this.body);
  }

  draw() {
    push();
    translate(this.x, this.y);
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

    this.drawBodyVertices();
  }

  drawBodyVertices() {
    const vertices = this.body.vertices;
    beginShape();
    for (let i = 0; i < vertices.length; i++) {
      vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
  }

  handleMouse(mouseX, mouseY) {
    const angle = atan2(mouseY - this.cueBallY, mouseX - this.cueBallX);

    // Update the angle of the cue stick
    Body.setAngle(game.cueStick.body, angle);

    const stickX =
      this.cueBallX - (this.cueBallRadius + this.length / 2) * cos(angle);
    const stickY =
      this.cueBallY - (this.cueBallRadius + this.length / 2) * sin(angle);

    Body.setPosition(game.cueStick.body, { x: stickX, y: stickY });

    // Update this.angle for p5.js rendering
    this.angle = angle;
    // Update the position of the cue stick in p5.js
    this.x = stickX;
    this.y = stickY;
  }

  handleKeystroke(key) {
    const rotationStep = 0.05;

    if (key === "left") {
      // Rotate clockwise
      game.cueStick.angle += rotationStep;
    } else if (key === "right") {
      // Rotate counterclockwise
      game.cueStick.angle -= rotationStep;
    }

    // Update the angle of the cue stick body
    Body.setAngle(game.cueStick.body, game.cueStick.angle);

    const stickX =
      this.cueBallX -
      (this.cueBallRadius + this.length / 2) * cos(game.cueStick.angle);
    const stickY =
      this.cueBallY -
      (this.cueBallRadius + this.length / 2) * sin(game.cueStick.angle);

    Body.setPosition(game.cueStick.body, { x: stickX, y: stickY });
    this.x = stickX; // Update this.x for p5.js rendering
    this.y = stickY; // Update this.y for p5.js rendering
  }
}

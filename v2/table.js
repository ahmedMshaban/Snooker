class Table {
  constructor(width, height, world) {
    this.world = world;
    this.width = width;
    this.height = height;
    // Set the wooden frame properties
    this.frameWidth = 25;
    this.cornerRadius = this.frameWidth;
    // Pocket
    this.ballDiameter = this.tableWidth / 60;
    this.pocketDiameter = tableWidth / 24;
    this.pocketRadius = this.pocketDiameter / 2;
    // Set the properties for the "D"
    this.dRadius = this.width / 10; // The diameter of the "D" semicircle
    this.dCenterX = this.width * 0.25; // The "D" center x-position
    this.dCenterY = this.height / 2; // The "D" center y-position

    // TOREMOVE
    this.walls = []; // Store wall bodies
  }

  draw() {
    this.drawEdges();
    this.drawPockets();
    this.drawD();
  }

  drawEdges() {
    // Draw the wooden frame with rounded corners
    noStroke();
    fill(99, 70, 53);
    rect(0, 0, this.width, this.height, this.cornerRadius);
    fill(58, 99, 61);
    rect(
      this.frameWidth,
      this.frameWidth,
      this.width - 2 * this.frameWidth,
      this.height - 2 * this.frameWidth
    ); // Inner rectangle for the green baize

    // Draw the walls for debugging
    // TOREMOVE
    // fill(0);
    // for (let wall of this.walls) {
    //   this.drawVertices(wall.vertices);
    // }
  }

  createWalls() {
    let wallThickness = 25;
    let wallColor = "#000";
    let options = {
      isStatic: true,
      restitution: 0.8,
      render: { visible: true, fillStyle: wallColor },
    }; // Make visible for debugging

    // Create walls with adjusted positions and sizes
    let topWall = Matter.Bodies.rectangle(
      this.width / 2,
      wallThickness / 2,
      this.width,
      wallThickness,
      options
    );
    let bottomWall = Matter.Bodies.rectangle(
      this.width / 2,
      this.height - wallThickness / 2,
      this.width,
      wallThickness,
      options
    );
    let leftWall = Matter.Bodies.rectangle(
      wallThickness / 2,
      this.height / 2,
      wallThickness,
      this.height,
      options
    );
    let rightWall = Matter.Bodies.rectangle(
      this.width - wallThickness / 2,
      this.height / 2,
      wallThickness,
      this.height,
      options
    );

    // Add walls to the world
    World.add(this.world, [topWall, bottomWall, leftWall, rightWall]);

    // TOREMOVE
    // this.walls = [topWall, bottomWall, leftWall, rightWall]; // Store walls for drawing
  }

  drawPockets() {
    let frameWidth = 20;

    fill(46, 38, 34);
    stroke(64, 50, 41);
    strokeWeight(1);

    // Adjust positions to be within the frame
    // Corner pockets
    ellipse(
      frameWidth + this.pocketRadius,
      frameWidth + this.pocketRadius,
      this.pocketDiameter,
      this.pocketDiameter
    ); // Top-left
    ellipse(
      this.width - frameWidth - this.pocketRadius,
      frameWidth + this.pocketRadius,
      this.pocketDiameter,
      this.pocketDiameter
    ); // Top-right
    ellipse(
      frameWidth + this.pocketRadius,
      tableHeight - frameWidth - this.pocketRadius,
      this.pocketDiameter,
      this.pocketDiameter
    ); // Bottom-left
    ellipse(
      this.width - frameWidth - this.pocketRadius,
      this.height - frameWidth - this.pocketRadius,
      this.pocketDiameter,
      this.pocketDiameter
    ); // Bottom-right

    // Side pockets need to be adjusted to be vertically centered within the playing area
    ellipse(
      this.width / 2,
      frameWidth + this.pocketRadius,
      this.pocketDiameter,
      this.pocketDiameter
    ); // Middle-top
    ellipse(
      this.width / 2,
      this.height - frameWidth - this.pocketRadius,
      this.pocketDiameter,
      this.pocketDiameter
    ); // Middle-bottom
  }

  drawD() {
    let frameWidth = 10;

    // Draw the baulk line
    strokeWeight(2);
    stroke(255);
    let startX = this.dCenterX;
    let endX = this.dCenterX;
    let startY = frameWidth + 20;
    let endY = tableHeight - frameWidth - 20;

    // Draw the modified line
    line(startX, startY, endX, endY);

    // Draw the "D" as an arc
    noFill(); // No fill for the "D"
    arc(
      this.dCenterX,
      this.dCenterY,
      this.dRadius * 2,
      this.dRadius * 2,
      HALF_PI,
      3 * HALF_PI
    );
  }

  // TOREMOVE
  //   drawVertices(vertices) {
  //     beginShape();
  //     for (var i = 0; i < vertices.length; i++) {
  //       vertex(vertices[i].x, vertices[i].y);
  //     }
  //     endShape(CLOSE);
  //   }
}

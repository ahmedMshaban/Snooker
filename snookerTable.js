class SnookerTable {
  constructor(world) {
    this.world = world;
    this.tableLength = canvasWidth - 100; // Table length
    this.tableWidth = this.tableLength / 2; // Table width should be half the table length

    this.ballDiameter = this.tableWidth / 36; // Ball diameter
    this.pockets = []; // Pockets array
    this.pocketDiameter = this.ballDiameter * 1.5; // 1.5 times ball diameter
    this.pocketRadius = this.pocketDiameter / 2;
    this.borderWidth = 20;
    this.cornerRadius = 20;
    this.trapezoidsWidth = 10;
    this.vertexOffset = 20;

    // Calculate positions
    this.innerLeftX = (canvasWidth - this.tableLength) / 2;
    this.innerRightX = this.innerLeftX + this.tableLength;
    this.innerTopY = (canvasHeight - this.tableWidth) / 2;
    this.innerBottomY = this.innerTopY + this.tableWidth;
    this.innerMiddleX = this.innerLeftX + this.tableLength / 2;

    // one-fifth of the width of the table from the left
    this.baulkLineX =
      (canvasWidth - this.tableLength) / 2 + this.tableLength / 5;
    // one-sixth of the width of the table, considering the trapezoidsWidth
    this.dRadius = (this.tableWidth - 2 * this.trapezoidsWidth) / 6;
    this.dCenterY = canvasHeight / 2;

    this.coloredBalls = {
      yellow: {
        x: this.baulkLineX,
        y: this.dCenterY + this.dRadius,
        color: "yellow",
      },
      green: {
        x: this.baulkLineX,
        y: this.dCenterY - this.dRadius,
        color: "green",
      },
      brown: { x: this.baulkLineX, y: this.dCenterY, color: "brown" },
      blue: {
        x: this.innerMiddleX,
        y: (this.innerTopY + this.innerBottomY) / 2,
        color: "blue",
      },
      pink: {
        x: this.innerMiddleX + this.tableLength / 6,
        y: (this.innerTopY + this.innerBottomY) / 2,
        color: "pink",
      },
      black: {
        x: this.innerRightX - this.tableLength / 12,
        y: (this.innerTopY + this.innerBottomY) / 2,
        color: "black",
      },
    };

    this.cushions = [];
  }

  drawTable() {
    // Draw table edges
    this.drawEdges();

    // Draw playing surface
    this.drawSurface();

    // Draw pockets
    this.drawPockets();

    // Draw trapezoids
    this.drawTrapezoids();

    // Draw lines
    this.drawBaulkLine();
    this.drawDZone();
  }

  drawEdges() {
    // Draw the outer brown border with rounded corners
    fill(64, 36, 12); // Dark brown color
    noStroke();
    rect(
      this.innerLeftX - this.borderWidth,
      this.innerTopY - this.borderWidth,
      this.tableLength + 2 * this.borderWidth,
      this.tableWidth + 2 * this.borderWidth,
      this.cornerRadius
    );
  }

  setupEdges() {
    // Create static bodies for the edges
    const leftEdge = Bodies.rectangle(
      this.innerLeftX - this.borderWidth / 2,
      (this.innerTopY + this.innerBottomY) / 2,
      this.borderWidth,
      this.tableWidth + 2 * this.borderWidth,
      { isStatic: true, restitution: 0.8 }
    );
    const rightEdge = Bodies.rectangle(
      this.innerRightX + this.borderWidth / 2,
      (this.innerTopY + this.innerBottomY) / 2,
      this.borderWidth,
      this.tableWidth + 2 * this.borderWidth,
      { isStatic: true, restitution: 0.8 }
    );
    const topEdge = Bodies.rectangle(
      (this.innerLeftX + this.innerRightX) / 2,
      this.innerTopY - this.borderWidth / 2,
      this.tableLength + 2 * this.borderWidth,
      this.borderWidth,
      { isStatic: true, restitution: 0.8 }
    );
    const bottomEdge = Bodies.rectangle(
      (this.innerLeftX + this.innerRightX) / 2,
      this.innerBottomY + this.borderWidth / 2,
      this.tableLength + 2 * this.borderWidth,
      this.borderWidth,
      { isStatic: true, restitution: 0.8 }
    );

    // Add edges to the world
    World.add(this.world, [leftEdge, rightEdge, topEdge, bottomEdge]);
  }

  drawSurface() {
    // Draw the inner green playing surface with rounded corners
    fill(78, 136, 52);
    noStroke();
    rect(
      this.innerLeftX,
      this.innerTopY,
      this.tableLength,
      this.tableWidth,
      this.cornerRadius
    );
  }

  drawPockets() {
    // Draw yellow backgrounds for the pockets
    fill(242, 212, 77); // Yellow color
    noStroke();

    // Top-left corner
    rect(
      this.innerLeftX - this.borderWidth,
      this.innerTopY - this.borderWidth,
      this.borderWidth,
      this.borderWidth,
      this.cornerRadius,
      0,
      0,
      0
    );

    // Top-right corner
    rect(
      this.innerRightX,
      this.innerTopY - this.borderWidth,
      this.borderWidth,
      this.borderWidth,
      0,
      this.cornerRadius,
      0,
      0
    );

    // Bottom-left corner
    rect(
      this.innerLeftX - this.borderWidth,
      this.innerBottomY,
      this.borderWidth,
      this.borderWidth,
      0,
      0,
      0,
      this.cornerRadius
    );

    // Bottom-right corner
    rect(
      this.innerRightX,
      this.innerBottomY,
      this.borderWidth,
      this.borderWidth,
      0,
      0,
      this.cornerRadius,
      0
    );

    // Top-middle
    rect(
      this.innerMiddleX - this.borderWidth / 2,
      this.innerTopY - this.borderWidth,
      this.borderWidth,
      this.borderWidth
    );

    // Bottom-middle
    rect(
      this.innerMiddleX - this.borderWidth / 2,
      this.innerBottomY,
      this.borderWidth,
      this.borderWidth
    );

    // Draw the pockets
    fill(0);
    ellipse(this.innerLeftX, this.innerTopY, this.pocketDiameter); // Top-left pocket
    ellipse(this.innerRightX, this.innerTopY, this.pocketDiameter); // Top-right pocket
    ellipse(this.innerLeftX, this.innerBottomY, this.pocketDiameter); // Bottom-left pocket
    ellipse(this.innerRightX, this.innerBottomY, this.pocketDiameter); // Bottom-right pocket
    ellipse(this.innerMiddleX, this.innerTopY, this.pocketDiameter); // Middle-top pocket
    ellipse(this.innerMiddleX, this.innerBottomY, this.pocketDiameter); // Middle-bottom pocket
  }

  setupPockets() {
    // Create Matter.js bodies for the pockets
    this.pockets = [
      Bodies.circle(this.innerLeftX, this.innerTopY, this.pocketRadius, {
        isStatic: true,
        isSensor: true,
      }), // Top-left pocket
      Bodies.circle(this.innerRightX, this.innerTopY, this.pocketRadius, {
        isStatic: true,
        isSensor: true,
      }), // Top-right pocket
      Bodies.circle(this.innerLeftX, this.innerBottomY, this.pocketRadius, {
        isStatic: true,
        isSensor: true,
      }), // Bottom-left pocket
      Bodies.circle(this.innerRightX, this.innerBottomY, this.pocketRadius, {
        isStatic: true,
        isSensor: true,
      }), // Bottom-right pocket
      Bodies.circle(this.innerMiddleX, this.innerTopY, this.pocketRadius, {
        isStatic: true,
        isSensor: true,
      }), // Middle-top pocket
      Bodies.circle(this.innerMiddleX, this.innerBottomY, this.pocketRadius, {
        isStatic: true,
        isSensor: true,
      }), // Middle-bottom pocket
    ];

    // Add pockets to the world
    World.add(this.world, this.pockets);
  }

  drawTrapezoids() {
    // Draw inner shapes (trapezoids)
    fill(49, 97, 23); // Dark green color
    noStroke();

    // Top-left to top-middle
    beginShape();
    vertex(this.innerLeftX + this.pocketDiameter / 2, this.innerTopY);
    vertex(this.innerMiddleX - this.pocketDiameter / 2, this.innerTopY);
    vertex(
      this.innerMiddleX - this.pocketDiameter / 2 - this.vertexOffset,
      this.innerTopY + this.trapezoidsWidth
    );
    vertex(
      this.innerLeftX + this.pocketDiameter / 2 + this.vertexOffset,
      this.innerTopY + this.trapezoidsWidth
    );
    endShape(CLOSE);

    // Top-middle to top-right
    beginShape();
    vertex(this.innerMiddleX + this.pocketDiameter / 2, this.innerTopY);
    vertex(this.innerRightX - this.pocketDiameter / 2, this.innerTopY);
    vertex(
      this.innerRightX - this.pocketDiameter / 2 - this.vertexOffset,
      this.innerTopY + this.trapezoidsWidth
    );
    vertex(
      this.innerMiddleX + this.pocketDiameter / 2 + this.vertexOffset,
      this.innerTopY + this.trapezoidsWidth
    );
    endShape(CLOSE);

    // Bottom-left to bottom-middle
    beginShape();
    vertex(this.innerLeftX + this.pocketDiameter / 2, this.innerBottomY);
    vertex(this.innerMiddleX - this.pocketDiameter / 2, this.innerBottomY);
    vertex(
      this.innerMiddleX - this.pocketDiameter / 2 - this.vertexOffset,
      this.innerBottomY - this.trapezoidsWidth
    );
    vertex(
      this.innerLeftX + this.pocketDiameter / 2 + this.vertexOffset,
      this.innerBottomY - this.trapezoidsWidth
    );
    endShape(CLOSE);

    // Bottom-middle to bottom-right
    beginShape();
    vertex(this.innerMiddleX + this.pocketDiameter / 2, this.innerBottomY);
    vertex(this.innerRightX - this.pocketDiameter / 2, this.innerBottomY);
    vertex(
      this.innerRightX - this.pocketDiameter / 2 - this.vertexOffset,
      this.innerBottomY - this.trapezoidsWidth
    );
    vertex(
      this.innerMiddleX + this.pocketDiameter / 2 + this.vertexOffset,
      this.innerBottomY - this.trapezoidsWidth
    );
    endShape(CLOSE);

    // Left vertical
    beginShape();
    vertex(this.innerLeftX, this.innerTopY + this.pocketDiameter / 2);
    vertex(this.innerLeftX, this.innerBottomY - this.pocketDiameter / 2);
    vertex(
      this.innerLeftX + this.trapezoidsWidth,
      this.innerBottomY - this.pocketDiameter / 2 - this.vertexOffset
    );
    vertex(
      this.innerLeftX + this.trapezoidsWidth,
      this.innerTopY + this.pocketDiameter / 2 + this.vertexOffset
    );
    endShape(CLOSE);

    // Right vertical
    beginShape();
    vertex(this.innerRightX, this.innerTopY + this.pocketDiameter / 2);
    vertex(this.innerRightX, this.innerBottomY - this.pocketDiameter / 2);
    vertex(
      this.innerRightX - this.trapezoidsWidth,
      this.innerBottomY - this.pocketDiameter / 2 - this.vertexOffset
    );
    vertex(
      this.innerRightX - this.trapezoidsWidth,
      this.innerTopY + this.pocketDiameter / 2 + this.vertexOffset
    );
    endShape(CLOSE);
  }

  setupTrapezoids() {
    const leftVerticalVertices = [
      { x: this.innerLeftX, y: this.innerTopY + this.pocketDiameter / 2 },
      { x: this.innerLeftX, y: this.innerBottomY - this.pocketDiameter / 2 },
      {
        x: this.innerLeftX + this.trapezoidsWidth,
        y: this.innerBottomY - this.pocketDiameter / 2 - this.vertexOffset,
      },
      {
        x: this.innerLeftX + this.trapezoidsWidth,
        y: this.innerTopY + this.pocketDiameter / 2 + this.vertexOffset,
      },
    ];

    const rightVerticalVertices = [
      { x: this.innerRightX, y: this.innerTopY + this.pocketDiameter / 2 },
      { x: this.innerRightX, y: this.innerBottomY - this.pocketDiameter / 2 },
      {
        x: this.innerRightX - this.trapezoidsWidth,
        y: this.innerBottomY - this.pocketDiameter / 2 - this.vertexOffset,
      },
      {
        x: this.innerRightX - this.trapezoidsWidth,
        y: this.innerTopY + this.pocketDiameter / 2 + this.vertexOffset,
      },
    ];

    const topLeftToMiddleVertices = [
      { x: this.innerLeftX + this.pocketDiameter / 2, y: this.innerTopY },
      { x: this.innerMiddleX - this.pocketDiameter / 2, y: this.innerTopY },
      {
        x: this.innerMiddleX - this.pocketDiameter / 2 - this.vertexOffset,
        y: this.innerTopY + this.trapezoidsWidth,
      },
      {
        x: this.innerLeftX + this.pocketDiameter / 2 + this.vertexOffset,
        y: this.innerTopY + this.trapezoidsWidth,
      },
    ];

    const topMiddleToRightVertices = [
      { x: this.innerMiddleX + this.pocketDiameter / 2, y: this.innerTopY },
      { x: this.innerRightX - this.pocketDiameter / 2, y: this.innerTopY },
      {
        x: this.innerRightX - this.pocketDiameter / 2 - this.vertexOffset,
        y: this.innerTopY + this.trapezoidsWidth,
      },
      {
        x: this.innerMiddleX + this.pocketDiameter / 2 + this.vertexOffset,
        y: this.innerTopY + this.trapezoidsWidth,
      },
    ];

    const bottomLeftToMiddleVertices = [
      { x: this.innerLeftX + this.pocketDiameter / 2, y: this.innerBottomY },
      { x: this.innerMiddleX - this.pocketDiameter / 2, y: this.innerBottomY },
      {
        x: this.innerMiddleX - this.pocketDiameter / 2 - this.vertexOffset,
        y: this.innerBottomY - this.trapezoidsWidth,
      },
      {
        x: this.innerLeftX + this.pocketDiameter / 2 + this.vertexOffset,
        y: this.innerBottomY - this.trapezoidsWidth,
      },
    ];

    const bottomMiddleToRightVertices = [
      { x: this.innerMiddleX + this.pocketDiameter / 2, y: this.innerBottomY },
      { x: this.innerRightX - this.pocketDiameter / 2, y: this.innerBottomY },
      {
        x: this.innerRightX - this.pocketDiameter / 2 - this.vertexOffset,
        y: this.innerBottomY - this.trapezoidsWidth,
      },
      {
        x: this.innerMiddleX + this.pocketDiameter / 2 + this.vertexOffset,
        y: this.innerBottomY - this.trapezoidsWidth,
      },
    ];

    // Create the Matter.js bodies from the vertices
    const leftVerticalBody = Bodies.fromVertices(
      this.innerLeftX + this.trapezoidsWidth / 2,
      (this.innerTopY + this.innerBottomY) / 2,
      leftVerticalVertices,
      { isStatic: true, restitution: 0.8 }
    );

    const rightVerticalBody = Bodies.fromVertices(
      this.innerRightX - this.trapezoidsWidth / 2,
      (this.innerTopY + this.innerBottomY) / 2,
      rightVerticalVertices,
      { isStatic: true, restitution: 0.8 }
    );

    const topLeftToMiddleBody = Bodies.fromVertices(
      (this.innerLeftX + this.innerMiddleX) / 2,
      this.innerTopY + this.trapezoidsWidth / 2,
      topLeftToMiddleVertices,
      { isStatic: true, restitution: 0.8 }
    );

    const topMiddleToRightBody = Bodies.fromVertices(
      (this.innerMiddleX + this.innerRightX) / 2,
      this.innerTopY + this.trapezoidsWidth / 2,
      topMiddleToRightVertices,
      { isStatic: true, restitution: 0.8 }
    );

    const bottomLeftToMiddleBody = Bodies.fromVertices(
      (this.innerLeftX + this.innerMiddleX) / 2,
      this.innerBottomY - this.trapezoidsWidth / 2,
      bottomLeftToMiddleVertices,
      { isStatic: true, restitution: 0.8 }
    );

    const bottomMiddleToRightBody = Bodies.fromVertices(
      (this.innerMiddleX + this.innerRightX) / 2,
      this.innerBottomY - this.trapezoidsWidth / 2,
      bottomMiddleToRightVertices,
      { isStatic: true, restitution: 0.8 }
    );

    this.cushions.push(
      leftVerticalBody,
      rightVerticalBody,
      topLeftToMiddleBody,
      topMiddleToRightBody,
      bottomLeftToMiddleBody,
      bottomMiddleToRightBody
    );

    // Add trapezoids to the world
    World.add(this.world, [
      leftVerticalBody,
      rightVerticalBody,
      topLeftToMiddleBody,
      topMiddleToRightBody,
      bottomLeftToMiddleBody,
      bottomMiddleToRightBody,
    ]);
  }

  setupTable() {
    this.setupEdges();
    this.setupPockets();
    this.setupTrapezoids();
  }

  drawBaulkLine() {
    // Draw the baulk line
    stroke(255);
    noFill();

    line(
      this.baulkLineX,
      this.innerTopY + this.trapezoidsWidth,
      this.baulkLineX,
      this.innerBottomY - this.trapezoidsWidth
    );
  }

  drawDZone() {
    // Draw the "D" area
    stroke(255);
    noFill();

    arc(
      this.baulkLineX,
      this.dCenterY,
      this.dRadius * 2,
      this.dRadius * 2,
      HALF_PI,
      PI + HALF_PI
    );

    textSize(16);
    fill(255);
    noStroke();
    text(
      'the "D" zone',
      this.baulkLineX - 30,
      this.dCenterY + this.dRadius + 20
    );
  }

  isInsideDZone(x, y) {
    const dRadius = this.dRadius;
    const baulkLineX = this.baulkLineX;
    const dCenterY = this.dCenterY;

    const distance = dist(x, y, baulkLineX, dCenterY);
    return distance <= dRadius && x <= baulkLineX;
  }

  isCushion(body) {
    console.log(body);
    return this.cushions.includes(body);
  }
}

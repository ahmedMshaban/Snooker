class Table {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    // Set the wooden frame properties
    this.frameWidth = 25;
    this.cornerRadius = this.frameWidth;
    // Set the properties for the "D"
    this.dRadius = this.width / 10; // The diameter of the "D" semicircle
    this.dCenterX = this.width * 0.25; // The "D" center x-position
    this.dCenterY = this.height / 2; // The "D" center y-position
  }

  draw() {
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
  }
}

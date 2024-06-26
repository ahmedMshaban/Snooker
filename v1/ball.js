class Ball {
  constructor(x, y, diameter, world, color) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.body = Bodies.circle(x, y, diameter / 2, {
      restitution: 0.9, // High restitution for bounciness
      friction: 0.005, // Low friction for smooth rolling
      frictionAir: 0.01, // Air friction to slow down the balls
    });
    this.color = color || 255;
    World.add(world, this.body);
  }

  draw() {
    fill(this.color);
    stroke(0);
    ellipse(this.body.position.x, this.body.position.y, this.diameter);
  }
}

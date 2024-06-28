class Ball {
  constructor(x, y, diameter, world, color, label) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.body = Bodies.circle(x, y, diameter / 2, {
      restitution: 0.9, // High restitution for bounciness
      friction: 0.005, // Low friction for smooth rolling
      frictionAir: 0.01, // Air friction to slow down the balls
    });
    this.color = color || 255;
    this.label = label;
    World.add(world, this.body);
  }

  draw() {
    fill(this.color);
    stroke(0);
    ellipse(this.body.position.x, this.body.position.y, this.diameter);
  }

  hit(force, angle) {
    const forceVector = {
      x: force * Math.cos(angle),
      y: force * Math.sin(angle),
    };
    Body.applyForce(this.body, this.body.position, forceVector);

    // update the p5.js position
    this.x = this.body.position.x;
    this.y = this.body.position.y;
  }

  isStopped(threshold = 0.01) {
    const velocity = this.body.velocity;
    return Math.abs(velocity.x) < threshold && Math.abs(velocity.y) < threshold;
  }
}

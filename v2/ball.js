class Ball {
  constructor(x, y, diameter, color, value, world) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.color = color || 255;
    this.value = value;
    this.body = Bodies.circle(x, y, radius, {
      restitution: 0.9, // Bounciness
      friction: 0.05,
      render: {
        fillStyle: this.color,
      },
      label: "snookerBall",
      ballValue: this.value, // Store the point value of the ball
    });
    World.add(world, this.body);
  }
}

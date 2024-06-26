class Game {
  constructor() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    // Disable gravity for top-down view
    this.engine.world.gravity.y = 0;
    this.engine.world.gravity.x = 0;
    this.table = new Table(800, 400, this.world);
  }

  startGame() {
    let runner = Runner.create();
    Runner.run(runner, this.engine);

    Events.on(game.engine, "collisionStart", handleCollision);

    // Create the table walls
    this.table.createWalls();

    this.render();
  }

  update() {
    Engine.update(this.engine);
    this.render();
  }

  render() {
    background(255);

    // Draw the table, balls, and cue
    this.table.draw();
  }
}

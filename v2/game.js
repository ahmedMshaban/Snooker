class Game {
  constructor() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.table = new Table(800, 400);
  }

  startGame() {
    let runner = Runner.create();
    Runner.run(runner, this.engine);
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

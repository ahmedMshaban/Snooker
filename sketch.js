let game;
const canvasWidth = 1200;
const canvasHeight = 600;

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  game = new Game();
  game.startGame();
}

function draw() {
  game.update();
}

function keyPressed() {
  if (key === "1") {
    game.handleKeystroke(1);
  } else if (key === "2") {
    game.handleKeystroke(2);
  } else if (key === "3") {
    game.handleKeystroke(3);
  }
}

////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
  World.remove(engine.world, body);
}

let Engine = Matter.Engine;
let Render = Matter.Render;
let Runner = Matter.Runner;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Constraint = Matter.Constraint;
let Mouse = Matter.Mouse;
let MouseConstraint = Matter.MouseConstraint;
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
  } else if (game.cueStick && key === "ArrowRight") {
    game.cueStick.handleKeystroke("right");
  } else if (game.cueStick && key === "ArrowLeft") {
    game.cueStick.handleKeystroke("left");
  }
}

function mousePressed() {
  game.handleMouse(mouseX, mouseY);
}

function mouseMoved() {
  // Handle mouse interaction for the cue stick
  if (game && game.cueBallPlaced && game.cueStick) {
    game.cueStick.handleMouse(mouseX, mouseY);
  }
}

////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
  push();
  var offsetA = constraint.pointA;
  var posA = { x: 0, y: 0 };
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  var offsetB = constraint.pointB;
  var posB = { x: 0, y: 0 };
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}
////////////////////////////////////////////////////////////

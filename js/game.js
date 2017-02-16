var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth * 0.9;
ctx.canvas.height = window.innerHeight * 0.8;

BASE_HEIGHT = canvas.height - 200;
GRAVITY = 30;
INITIAL_VELOCITY = 350;

CAR_X = 200;
CAR_Y = BASE_HEIGHT;


GAME_SPEED = 2;
MAP_UPDATE_INTERVAL = 10;


MAP = new Array(ctx.canvas.width);
OBSTACLE_X = canvas.width;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function contextColor(color, lineWidth) {
  if (color == undefined) {
    color = 'black';
  }
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  if (lineWidth == undefined) {
    lineWidth = 1;
  }
  ctx.lineWidth = lineWidth;
}

function drawLine(start, stop) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(stop.x, stop.y);
  ctx.closePath();
  ctx.stroke();
}

function drawCircle(pos, radius) {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

var start = new Point(0, BASE_HEIGHT);
var stop = new Point(canvas.width, BASE_HEIGHT);
drawLine(start, stop, 'black');

function drawDino(pos) {
  // Left leg
  contextColor("black", 5);
  drawLine(pos, new Point(pos.x + 5, pos.y - 20));
  // Right leg
  drawLine(new Point(pos.x + 30, pos.y), new Point(pos.x + 15, pos.y - 30));
  contextColor();
  ctx.beginPath();
  ctx.arc(pos.x + 10, pos.y - 40, 20, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function drawCar(pos) {
  contextColor("black");
  drawCircle(new Point(pos.x, pos.y - 10), 10);
  drawCircle(new Point(pos.x + 100, pos.y - 10), 10);

  // Draw hood
  contextColor("#550");
  ctx.beginPath();
  ctx.moveTo(pos.x + 130, pos.y - 17);
  ctx.lineTo(pos.x + 130, pos.y - 35);
  ctx.lineTo(pos.x + 90, pos.y - 35);
  ctx.lineTo(pos.x + 70, pos.y - 60);
  ctx.lineTo(pos.x + 5, pos.y - 60);
  ctx.lineTo(pos.x + 5, pos.y - 35);
  ctx.lineTo(pos.x - 30, pos.y - 35);
  ctx.lineTo(pos.x - 30, pos.y - 17);
  ctx.closePath();
  ctx.fill();
}

function drawObstacle(pos) {
  contextColor("#e94200");
  ctx.beginPath();
  ctx.moveTo(pos.x - 20, pos.y);
  ctx.lineTo(pos.x - 5, pos.y - 50);
  ctx.lineTo(pos.x + 5, pos.y - 50);
  ctx.lineTo(pos.x + 20, pos.y);
  ctx.closePath();
  ctx.fill();
}

function drawBaseLine() {
  contextColor("black", 3);
  drawLine(new Point(0, BASE_HEIGHT), new Point(canvas.width, BASE_HEIGHT));
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBaseLine();

  x_var = Math.random();
  y_var = Math.random();

  drawCar(new Point(CAR_X - x_var, CAR_Y - y_var));

  for (i=0; i<MAP.length; i++) {
    if (MAP[i] == 2) {
      drawObstacle(new Point(i, BASE_HEIGHT));
    }
  }
}

function addObstacle() {
  objects = [0, 2];
  var rand = objects[Math.floor(Math.random() * objects.length)];
  MAP.push(rand);
  MAP.splice(0, 1);
}

var jumpper = null;

function jump() {
  if (jumpper) {
    clearInterval(jumpper);
  }

  var j = 1;
  jumpper = setInterval(function () {
    t = (j * 16) / 1000;
    e = (INITIAL_VELOCITY * t) - (12 * GRAVITY * Math.pow(t, 2));
    if (e < 0) {
      CAR_Y = BASE_HEIGHT;
      clearInterval(jumpper);
      j = 1;
    } else {
      CAR_Y = BASE_HEIGHT - e;
      j++;
    }
  }, 16);
}

function keyDown(e) {
  var keyCode = e.keyCode;
  if(keyCode == 0 || keyCode == 32) {
    jump();
  }
}

function update () {
  window.requestAnimationFrame(update, canvas);
  render();
}

function startGame() {
  for (i=0; i<MAP.length; i++) {
    MAP[i] = 0;
  }

  document.addEventListener("keydown", keyDown, false);

  setInterval(function () {
    MAP.splice(0, 2 * GAME_SPEED);
    for (i=0; i<2 * GAME_SPEED; i++) {
      MAP.push(0);
    }
  }, MAP_UPDATE_INTERVAL);

  setInterval(function () {
    addObstacle();
  }, 1000);

  update();
}

startGame();
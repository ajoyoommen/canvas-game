var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth * 0.9;
ctx.canvas.height = window.innerHeight * 0.8;

var BASE_HEIGHT = canvas.height - 200;
var CAR_X = 200;
var CAR_Y = BASE_HEIGHT;


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

function update () {
  window.requestAnimationFrame(update, canvas);
  render();
}

function startGame() {
  for (i=0; i<MAP.length; i++) {
    MAP[i] = 0;
  }

  setInterval(function () {
    MAP.splice(0, 2);
    for (i=0; i<2; i++) {
      MAP.push(0);
    }
  }, 10);

  setInterval(function () {
    MAP.push(2);
  }, 1500);


  update();
}

// Start updating the canvas
update();
startGame();
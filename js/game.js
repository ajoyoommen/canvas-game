var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth * 0.9;
ctx.canvas.height = window.innerHeight * 0.8;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

var game = {
  BASE_HEIGHT: canvas.height - 200,
  GRAVITY: 30,
  INITIAL_VELOCITY: 350,
  JUMPING: false,
  CAR_X: 200,
  CAR_Y: this.BASE_HEIGHT,
  GAME_SPEED: 2,
  MAP_UPDATE_INTERVAL: 10,
  MAP: new Array(ctx.canvas.width),
  OBSTACLE_X: canvas.width,

  addObstacle: function () {
    objects = [0, 2];
    rand = objects[Math.floor(Math.random() * objects.length)];
    this.MAP.push(rand);
    this.MAP.splice(0, 1);
  }
};


var gameCanvas = {
  ctx: ctx,

  contextColor: function (color, lineWidth) {
    if (color == undefined) {
      color = 'black';
    }
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;

    if (lineWidth == undefined) {
      lineWidth = 1;
    }
    this.ctx.lineWidth = lineWidth;
  },

  drawLine: function (start, stop) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(stop.x, stop.y);
    this.ctx.closePath();
    this.ctx.stroke();
  },

  drawCircle: function (pos, radius) {
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
  },

  drawDino: function (pos) {
    // Left leg
    this.contextColor("black", 5);
    this.drawLine(pos, new Point(pos.x + 5, pos.y - 20));
    // Right leg
    this.thisdrawLine(new Point(pos.x + 30, pos.y), new Point(pos.x + 15, pos.y - 30));
    this.contextColor();
    this.ctx.beginPath();
    this.ctx.arc(pos.x + 10, pos.y - 40, 20, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
  },

  drawCar: function (pos) {
    this.contextColor("black");
    this.drawCircle(new Point(pos.x, pos.y - 10), 10);
    this.drawCircle(new Point(pos.x + 100, pos.y - 10), 10);

    // Draw hood
    this.contextColor("#550");
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x + 130, pos.y - 17);
    this.ctx.lineTo(pos.x + 130, pos.y - 35);
    this.ctx.lineTo(pos.x + 90, pos.y - 35);
    this.ctx.lineTo(pos.x + 70, pos.y - 60);
    this.ctx.lineTo(pos.x + 5, pos.y - 60);
    this.ctx.lineTo(pos.x + 5, pos.y - 35);
    this.ctx.lineTo(pos.x - 30, pos.y - 35);
    this.ctx.lineTo(pos.x - 30, pos.y - 17);
    this.ctx.closePath();
    this.ctx.fill();
  },

  drawObstacle: function (pos) {
    this.contextColor("#e94200");
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x - 20, pos.y);
    this.ctx.lineTo(pos.x - 5, pos.y - 50);
    this.ctx.lineTo(pos.x + 5, pos.y - 50);
    this.ctx.lineTo(pos.x + 20, pos.y);
    this.ctx.closePath();
    this.ctx.fill();
  },

  drawBaseLine: function () {
    this.contextColor("black", 3);
    this.drawLine(new Point(0, game.BASE_HEIGHT), new Point(canvas.width, game.BASE_HEIGHT));
  },

  render: function () {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBaseLine();

    x_var = Math.random();
    y_var = Math.random();

    this.drawCar(new Point(CAR_X - x_var, CAR_Y - y_var));

    for (i=0; i<MAP.length; i++) {
      if (MAP[i] == 2) {
        this.drawObstacle(new Point(i, game.BASE_HEIGHT));
      }
    }
  }
};

var start = new Point(0, game.BASE_HEIGHT);
var stop = new Point(canvas.width, game.BASE_HEIGHT);
canvas.drawLine(start, stop, 'black');

var jumpper = null;

function jump() {
  if (JUMPING) {
    return -1;
  } else {
    JUMPING = true;
  }

  if (jumpper) {
    clearInterval(jumpper);
  }

  var j = 1;
  jumpper = setInterval(function () {
    t = (j * 16) / 1000;
    e = (INITIAL_VELOCITY * t) - (12 * GRAVITY * Math.pow(t, 2));
    if (e < 0) {
      CAR_Y = game.BASE_HEIGHT;
      clearInterval(jumpper);
      j = 1;
      JUMPING = false;
    } else {
      CAR_Y = game.BASE_HEIGHT - e;
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
  canvas.render();
}

function startGame() {
  for (i=0; i<game.MAP.length; i++) {
    game.MAP[i] = 0;
  }

  document.addEventListener("keydown", keyDown, false);

  setInterval(function () {
    game.MAP.splice(0, 2 * GAME_SPEED);
    for (i=0; i<2 * GAME_SPEED; i++) {
      game.MAP.push(0);
    }
  }, game.MAP_UPDATE_INTERVAL);

  setInterval(function () {
    addObstacle();
  }, 1000);

  update();
}

startGame();
const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

class Ball {
  constructor(x, y, size, speed, dx, dy) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.dx = dx;
    this.dy = dy;
  }

  drawBall() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
  }

  moveBall() {
    this.x += this.dx;
    this.y += this.dy;

    // Wall collision (right/left)
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.dx *= -1; // ball.dx = ball.dx * -1
    }

    // Wall collision (top/bottom)
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.dy *= -1;
    }

    // Paddle collision
    if (
      this.x - this.size > paddle.x &&
      this.x + this.size < paddle.x + paddle.w &&
      this.y + this.size > paddle.y
    ) {
      this.dy = -this.speed;
    }

    // Brick collision
    bricks.forEach((column) => {
      column.forEach((brick) => {
        if (brick.visible) {
          if (
            this.x - this.size > brick.x && // left brick side check
            this.x + this.size < brick.x + brick.w && // right brick side check
            this.y + this.size > brick.y && // top brick side check
            this.y - this.size < brick.y + brick.h // bottom brick side check
          ) {
            this.dy *= -1;
            brick.visible = false;

            increaseScore();
          }
        }
      });
    });

    // Hit bottom wall - Lose
    if (this.y + this.size > canvas.height) {
      showAllBricks();
      score = 0;
    }
  }
}

const ball1 = new Ball(canvas.width / 2, canvas.height / 2, 10, 4, 4, -4);

const ball2 = new Ball(canvas.width / 2, canvas.height - 50, 10, 4, 4, -3);

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score:${score}`, canvas.width - 100, 30);
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Increase score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
  }
}

// Make all bricks appear
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

// Draw everything
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ball2.drawBall();
  ball1.drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation
function update() {
  movePaddle();
  ball1.moveBall();
  ball2.moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

// Keydown event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

//Keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Rules and close event handlers
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));

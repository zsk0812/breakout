const canvas = document.getElementById('breakoutCanvas');
const ctx = canvas.getContext('2d');

// 定义球的属性
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;
let isGameRunning = false; // 游戏是否正在运行

// 定义球拍属性
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// 定义键盘按键状态
let rightPressed = false;
let leftPressed = false;

// 定义分数和生命
let score = 0;
let lives = 3; // 将生命值改为可变变量

// 定义砖块的行数和列数
const brickRowCount = 5;
const brickColCount = 5;

// 定义砖块的宽度和高度
const brickWidth = 75;
const brickHeight = 20;

// 定义连续碰撞的次数
let consecutiveHits = 0;

// 定义砖块之间的间距和上边距
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// 定义砖块的颜色和分数
const brickColors = ['red', 'green', 'purple'];
const brickScores = { red: 10, green: 20, purple: 30 };

// 创建砖块数组
const bricks = [];
for (let c = 0; c < brickColCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    // 随机分配颜色
    const colorIndex = Math.floor(Math.random() * brickColors.length);
    const color = brickColors[colorIndex];
    const score = brickScores[color];
    bricks[c][r] = { x: 0, y: 0, status: 1, color: color, score: score };
  }
}

// 绘制球
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// 绘制球拍
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// 绘制砖块
function drawBricks() {
  for (let c = 0; c < brickColCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// 绘制分数
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score: ' + score, 8, 20);
}

// 绘制生命值
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

// 碰撞检测
function collisionDetection() {
    for (let c = 0; c < brickColCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;
            score += b.score; // 根据砖块颜色增加分数
            consecutiveHits++; // 增加连续碰撞次数
            if (consecutiveHits >= 2) {
              score += 10; // 连续碰撞两次及以上时额外加10分
            }
            if (score >= 450) { // 修改这里
              alert('CONGRATULATIONS, YOU WIN!');
              document.location.reload();
            }
          } else {
            consecutiveHits = 0; // 如果没有碰撞，则重置连续碰撞次数
          }
        }
      }
    }
  }
  
// 键盘事件处理
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// 鼠标移动事件处理
canvas.addEventListener('mousemove', mouseMoveHandler, false);

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// 重置游戏状态
function resetGame() {
    lives = 3;
    score = 0;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 4; // 设置小球的初始速度
    dy = -4; // 设置小球的初始速度
    paddleX = (canvas.width - paddleWidth) / 2;
  
    // 重新生成砖块
    for (let c = 0; c < brickColCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const colorIndex = Math.floor(Math.random() * brickColors.length);
        const color = brickColors[colorIndex];
        const score = brickScores[color];
        bricks[c][r] = { x: 0, y: 0, status: 1, color: color, score: score };
      }
    }
  }
  

// 动画循环
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
  
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        if (!lives) {
          alert('GAME OVER');
          resetGame();
          draw();
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 0; // 停止小球运动
          dy = 0; // 停止小球运动
          paddleX = (canvas.width - paddleWidth) / 2;
          isGameRunning = false; // 停止游戏
          ctx.font = '24px Arial';
          ctx.fillStyle = '#0095DD';
          ctx.fillText('Click to continue', canvas.width / 2 - 100, canvas.height / 2);
        }
      }
    }
  
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }
  
    x += dx;
    y += dy;
  
    if (isGameRunning) {
      requestAnimationFrame(draw);
    }
  }

// 启动游戏
document.getElementById('startButton').addEventListener('click', function() {
  if (!isGameRunning) {
    isGameRunning = true;
    resetGame(); // 重置游戏状态
    draw(); // 开始绘制
  }
});

// 点击小球重新开始运动
canvas.addEventListener('click', function() {
  if (!isGameRunning && lives > 0) {
    dx = 4; // 开始小球运动
    dy = -4; // 开始小球运动
    isGameRunning = true;
    draw();
  }
});

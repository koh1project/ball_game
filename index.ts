let ballX = 75;
let ballY = 75;
let ballSpeedX = 5;
let ballSpeedY = 7;

const BRICK_W = 100;
const BRICK_H = 50;
const BRICK_GAP = 2;
const BRICK_COLS = 8;
const BRICK_ROWS = 4;

let brickGrid = new Array(BRICK_COLS * BRICK_ROWS);

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;

let paddleX = 400;

let canvas, canvasContext;

let mouseX = 0;
let mouseY = 0;

const updateMousePos = (evt: MouseEvent) => {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - PADDLE_WIDTH / 2;
};

const brickReset = () => {
  for (let i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
    brickGrid[i] = true;
  } // end of for each brick

  //@ TODO: To remove
  brickGrid[5] = false;
}; // end of brick Reset func

window.onload = () => {
  canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  canvasContext = canvas.getContext('2d');

  let framesPerSecond = 30;
  setInterval(updateAll, 1000 / framesPerSecond);

  canvas.addEventListener('mousemove', updateMousePos);

  brickReset();
};

const updateAll = () => {
  moveAll();
  drawAll();
};

const ballReset = () => {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
};

const moveAll = () => {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 0) {
    // Left
    ballSpeedX *= -1;
  }
  if (ballX > canvas.width) {
    // Right
    ballSpeedX *= -1;
  }

  if (ballY < 0) {
    // Top
    ballSpeedY *= -1;
  }
  if (ballY > canvas.height) {
    // Bottom
    ballReset();
  }

  let paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
  let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
  let paddleLeftEdgeX = paddleX;
  let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
  if (
    ballY > paddleTopEdgeY && // below the top of paddle
    ballY < paddleBottomEdgeY && // above bottom of paddle
    ballX > paddleLeftEdgeX && // right of the left side of paddle
    ballX < paddleRightEdgeX
  ) {
    // left of the left side of paddle

    ballSpeedY *= -1;
    let centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
    let ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
    ballSpeedX = ballDistFromPaddleCenterX * 0.35;
  }
};

const drawBricks = () => {
  for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < BRICK_COLS; eachCol++) {

      let arrayIndex = BRICK_COLS * eachRow + eachCol;

      if (brickGrid[arrayIndex]) {
        colorRect(BRICK_W * eachCol, BRICK_H * eachRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'blue');
      } // end of if this brick here
    } // end of for each brick
  }
}; // end of drawBricks func

const drawAll = () => {
  colorRect(0, 0, canvas.width, canvas.height, 'black'); // clear screen
  colorCircle(ballX, ballY, 10, 'white'); // draw ball
  colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');

  drawBricks();
  const mouseBrickCol = mouseX / BRICK_W;
  const mouseBrickRow = mouseY / BRICK_H;
  colorText(mouseBrickCol + ',' + mouseBrickRow, mouseX, mouseY, 'yellow');
};

const colorText = (showWords: string, textX: number, textY: number, fillColor: string) => {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
};

const colorRect = (topLeftX: number, topLeftY: number, boxWidth: number, boxHeight: number, fillColor: string) => {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
};

const colorCircle = (centerX: number, centerY: number, radius: number, fillColor: string): void => {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
};

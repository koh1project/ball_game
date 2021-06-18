let ballX = 75;
let ballY = 75;
let ballSpeedX = 5;
let ballSpeedY = 7;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
let brickGrid = new Array(BRICK_COLS * BRICK_ROWS) as [boolean];
let bricksLeft = 0;

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

  // cheat / hack to test ball in any position
  // ballX = mouseX;
  // ballY = mouseY;
  // ballSpeedX = 4;
  // ballSpeedY = -4;
};

const brickReset = () => {
  bricksLeft = 0;
  let i;
  for (i = 0; i < 3 * BRICK_COLS; i++) {
    brickGrid[i] = false;
  }

  for (; i < BRICK_COLS * BRICK_ROWS; i++) {
    brickGrid[i] = true;
    bricksLeft++;
  } // end of for each brick
}; // end of brick Reset func

window.onload = () => {
  canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  canvasContext = canvas.getContext('2d');

  let framesPerSecond = 30;
  setInterval(updateAll, 1000 / framesPerSecond);

  canvas.addEventListener('mousemove', updateMousePos);

  brickReset();
  ballReset();
};

const updateAll = () => {
  moveAll();
  drawAll();
};

const ballReset = () => {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
};

const ballMove = () => {
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
    brickReset();
  }
};

const isBrickAtColRow = (col: number, row: number) => {
  if (col >= 0 && col < BRICK_COLS && row >= 0 && row < BRICK_ROWS) {
    let brickIndexUnderCoord = rowColToArrayIndex(col, row);
    return brickGrid[brickIndexUnderCoord];
  } else {
    return false;
  }
};

const ballBrickHandling = () => {
  let ballBrickCol = Math.floor(ballX / BRICK_W);
  let ballBrickRow = Math.floor(ballY / BRICK_H);
  let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

  if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
    if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
      brickGrid[brickIndexUnderBall] = false;
      bricksLeft--;
      console.log('bricksLeft: ', bricksLeft);

      let prevBallX = ballX - ballSpeedX;
      let prevBallY = ballY - ballSpeedY;
      let prevBrickCol = Math.floor(prevBallX / BRICK_W);
      let prevBrickRow = Math.floor(prevBallY / BRICK_H);

      let bothTestsFailed = true;

      if (prevBrickCol != ballBrickCol) {
        if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
          ballSpeedX *= -1;
          bothTestsFailed = false;
        }
      }
      if (prevBrickRow != ballBrickRow) {
        if (isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
          ballSpeedY *= -1;
          bothTestsFailed = false;
        }
      }

      if (bothTestsFailed) {
        // armpit case, prevents ball from going through
        ballSpeedX *= -1;
        ballSpeedY *= -1;
      }
    } // end of brick found
  } // end of valid col and row
}; // end of ballBrickHandling function

const ballPaddleHandling = () => {
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

    if (bricksLeft === 0) {
      brickReset();
    } // out of bricks
  } // ball center inside paddle
}; // end of ball PaddleHandling

const moveAll = () => {
  ballMove();

  ballBrickHandling();

  ballPaddleHandling();
};

const rowColToArrayIndex = (col: number, row: number) => {
  return col + BRICK_COLS * row;
};

const drawBricks = () => {
  for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow);

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

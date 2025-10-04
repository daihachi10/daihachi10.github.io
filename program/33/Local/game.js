let is2Players = false;

let keys = {};

let grid = 15;
let gridSize = 512 / grid;

let onePlayerDirection = 0;
let onePlayerSpeed = 4; //4
let onePlayerX = 512 / 2 - 17 - gridSize * 3; // width / 2 - 間隔 / 2
let onePlayerY = 512 / 2 - 17;
let onePlayerColor = "#4674e1";

let onePlayerOldPlayerX = [onePlayerX];
let onePlayerOldPlayerY = [onePlayerY];

let onePlayerScore = 0; //0

let twoPlayerDirection = 0;
let twoPlayerSpeed = 4; //4
let twoPlayerX = 512 / 2 - 17 + gridSize * 3; // width / 2 - 間隔 / 2
let twoPlayerY = 512 / 2 - 17;
let twoPlayerColor = "#fec701";

let twoPlayerOldPlayerX = [twoPlayerX];
let twoPlayerOldPlayerY = [twoPlayerY];

let twoPlayerScore = 0;

let appleX = 0;
let appleY = 0;

let appleImage;
let appleSounds;

let onePlayerGameOver = false;
let twoPlayerGameOver = false;

let oneRespanTime = 300;
let twoRespanTime = 300;

let showOneRespanTime = 300;
let showTwoRespanTime = 300;

let countdown = 60; // カウントダウン秒数
let startTime;
let displayTime;

function preload() {
  appleImage = loadImage("image/apple.png");
  // appleSounds = loadSound("./sounds/apple.mp3");
}

function setup() {
  appleImage.resize(0, 25);
  let canvasContainer = document.getElementById("p5-canvas-container");
  let canvas = createCanvas(512, 512);
  canvas.parent(canvasContainer); // コンテナにキャンバスを配置
  frameRate(60);
  noStroke();
  appleX = 240;
  appleY = random(512);

  noLoop(); // ゲームが始まるまで停止
}

function draw() {
  background("#abd55b");
  drawLine();
  appleSpan(appleX, appleY);

  onePleyerJudgment();
  if (is2Players) twoPleyerJudgment();

  onePlayerClone();
  if (is2Players) twoPleyerClone();

  onePlayerSpan(onePlayerX, onePlayerY);
  if (is2Players) twoPlayerSpan(twoPlayerX, twoPlayerY);

  onePleyerMove(onePlayerDirection);
  if (is2Players) twoPleyerMove(twoPlayerDirection);

  onePleyerGame();
  if (is2Players) twoPleyerGame();

  drawScore();
  timer();

  if (is2Players) {
    onePlayerRespan();
    twoPlayerRespan();
  }
}

function keyPressed() {
  keys[key] = true;
}

function keyReleased() {
  keys[key] = false;
}

function drawLine() {
  stroke("#708A41");
  for (let x = 0; x <= width; x += width / grid) {
    line(x, 0, x, height);
  }
  for (let y = 0; y <= height; y += width / grid) {
    line(0, y, width, y);
  }
  noStroke();
}

function onePleyerJudgment() {
  let miss = 7;
  let revision = 1;
  let standardRevision = 0.5;

  if (keys["a"] || keys["ArrowLeft"] || controlLeft) {
    if (onePlayerY % gridSize <= miss) {
      onePlayerDirection = "left";
      if (onePlayerY % gridSize > standardRevision) onePlayerY -= revision;
      else if (onePlayerY % gridSize < standardRevision) onePlayerY += revision;
    }
  }
  if (keys["w"] || keys["ArrowUp"] || controlTop) {
    if (onePlayerX % gridSize <= miss) {
      onePlayerDirection = "top";
      if (onePlayerX % gridSize > standardRevision) onePlayerX -= revision;
      else if (onePlayerY % gridSize < standardRevision) onePlayerX += revision;
    }
  }
  if (keys["d"] || keys["ArrowRight"] || controlRight) {
    if (onePlayerY % gridSize <= miss) {
      onePlayerDirection = "right";
      if (onePlayerY % gridSize > standardRevision) onePlayerY -= revision;
      else if (onePlayerY % gridSize < standardRevision) onePlayerY += revision;
    }
  }
  if (keys["s"] || keys["ArrowDown"] || controlBottom) {
    if (onePlayerX % gridSize <= miss) {
      onePlayerDirection = "bottom";
      if (onePlayerX % gridSize > standardRevision) onePlayerX -= revision;
      else if (onePlayerY % gridSize < standardRevision) onePlayerX += revision;
    }
  }
}

function twoPleyerJudgment() {
  let miss = 7;
  let revision = 1;
  let standardRevision = 0.5;

  if (!twoPlayerGameOver) {
    if (keys["j"]) {
      if (twoPlayerY % gridSize <= miss) {
        twoPlayerDirection = "left";
        if (twoPlayerY % gridSize > standardRevision) twoPlayerY -= revision;
        else if (twoPlayerY % gridSize < standardRevision)
          twoPlayerY += revision;
      }
    }
    if (keys["i"]) {
      if (twoPlayerX % gridSize <= miss) {
        twoPlayerDirection = "top";
        if (twoPlayerX % gridSize > standardRevision) twoPlayerX -= revision;
        else if (twoPlayerY % gridSize < standardRevision)
          twoPlayerX += revision;
      }
    }
    if (keys["l"]) {
      if (twoPlayerY % gridSize <= miss) {
        twoPlayerDirection = "right";
        if (twoPlayerY % gridSize > standardRevision) twoPlayerY -= revision;
        else if (twoPlayerY % gridSize < standardRevision)
          twoPlayerY += revision;
      }
    }
    if (keys["k"]) {
      if (twoPlayerX % gridSize <= miss) {
        twoPlayerDirection = "bottom";
        if (twoPlayerX % gridSize > standardRevision) twoPlayerX -= revision;
        else if (twoPlayerY % gridSize < standardRevision)
          twoPlayerX += revision;
      }
    }
  }
}

function onePlayerSpan(x, y) {
  let size = 7;
  fill(onePlayerColor);
  rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);
}

function twoPlayerSpan(x, y) {
  let size = 7;
  fill(twoPlayerColor);
  rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);
}

function onePlayerClone() {
  for (let i = 0; i < onePlayerScore + 20; i++) {
    let size = 7;
    let x = onePlayerOldPlayerX[onePlayerOldPlayerX.length - i];
    let y = onePlayerOldPlayerY[onePlayerOldPlayerY.length - i];
    fill(onePlayerColor);
    rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);
  }
}

function twoPleyerClone() {
  for (let i = 0; i < twoPlayerScore + 20; i++) {
    let size = 7;
    let x = twoPlayerOldPlayerX[twoPlayerOldPlayerX.length - i];
    let y = twoPlayerOldPlayerY[twoPlayerOldPlayerY.length - i];
    fill(twoPlayerColor);
    rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);
  }
}

function onePleyerMove(i) {
  if (!onePlayerGameOver) {
    switch (i) {
      case "left":
        onePlayerX -= onePlayerSpeed;
        break;
      case "right":
        onePlayerX += onePlayerSpeed;
        break;
      case "top":
        onePlayerY -= onePlayerSpeed;
        break;
      case "bottom":
        onePlayerY += onePlayerSpeed;
        break;
    }
    onePlayerOldPlayerX.push(onePlayerX);
    onePlayerOldPlayerY.push(onePlayerY);
  }
}

function twoPleyerMove(i) {
  if (!twoPlayerGameOver) {
    switch (i) {
      case "left":
        twoPlayerX -= twoPlayerSpeed;
        break;
      case "right":
        twoPlayerX += twoPlayerSpeed;
        break;
      case "top":
        twoPlayerY -= twoPlayerSpeed;
        break;
      case "bottom":
        twoPlayerY += twoPlayerSpeed;
        break;
    }
    twoPlayerOldPlayerX.push(twoPlayerX);
    twoPlayerOldPlayerY.push(twoPlayerY);
  }
}

function onePleyerGame() {
  if (
    onePlayerX >= 512 ||
    onePlayerX <= 0 - 10 ||
    onePlayerY >= 512 ||
    onePlayerY <= 0 - gridSize
  ) {
    onePlayerGameOver = true;
    showGameOverScreen();
  }
}

function twoPleyerGame() {
  if (
    twoPlayerX >= 512 ||
    twoPlayerX <= 0 - 10 ||
    twoPlayerY >= 512 ||
    twoPlayerY <= 0 - gridSize
  ) {
    twoPlayerGameOver = true;
    showGameOverScreen();
  }
}

function appleSpan(x, y) {
  image(appleImage, x + 5, y + 5);

  let detection = 15;
  if (dist(onePlayerX, onePlayerY, x, y) < detection) {
    onePlayerScore++;
    // appleSounds.play();
    if (onePlayerScore % 2 === 0) onePlayerSpeed += 0.25;
    resetApple();
  }

  if (is2Players && dist(twoPlayerX, twoPlayerY, x, y) < detection) {
    twoPlayerScore++;
    // appleSounds.play();
    if (twoPlayerScore % 2 === 0) twoPlayerSpeed += 0.25;
    resetApple();
  }
}

function resetApple() {
  appleX = random(30, 480);
  appleY = random(30, 480);
}

function showGameOverScreen() {
  $("#game-over-screen").show();
  noLoop();
}

function drawScore() {
  if (is2Players) {
    showOneRespanTime = oneRespanTime / 60;
    showTwoRespanTime = twoRespanTime / 60;
    if (!onePlayerGameOver) {
      $("#1Pscore").text("1P: " + onePlayerScore);
    } else {
      $("#1Pscore").text("1P: " + showOneRespanTime.toFixed(2));
    }
    if (!twoPlayerGameOver) {
      $("#2Pscore").text("2P: " + twoPlayerScore);
    } else {
      $("#2Pscore").text("2P: " + showTwoRespanTime.toFixed(2));
    }
  } else {
    $("#1Pscore").text("SCORE: " + onePlayerScore);
    $("#2Pscore").text(""); // 2Pスコアを隠す
  }
}

// ゲーム開始処理
function commonStart() {
  loop();
  startTime = millis();
  $("#start-menu").hide();
  $("#game-over-screen").hide();
  $("#controls").show();

  if (is2Players) {
    onePlayerX = 512 / 2 - 17 - gridSize * 3;
    twoPlayerX = 512 / 2 - 17 + gridSize * 3;
  }
}

function start1P() {
  is2Players = false;
  commonStart();
}

function start2P() {
  is2Players = true;
  commonStart();
}

// 操作ボタン用の変数
let controlLeft = false,
  controlTop = false,
  controlRight = false,
  controlBottom = false;

function topButton() {
  controlTop = true;
  setTimeout(() => (controlTop = false), 100);
}
function bottomButton() {
  controlBottom = true;
  setTimeout(() => (controlBottom = false), 100);
}
function leftButton() {
  controlLeft = true;
  setTimeout(() => (controlLeft = false), 100);
}
function rightButton() {
  controlRight = true;
  setTimeout(() => (controlRight = false), 100);
}

function onePlayerRespan() {
  if (onePlayerGameOver) {
    oneRespanTime--;
    if (oneRespanTime <= 0) {
      onePlayerGameOver = false;
      onePlayerDirection = 0;
      onePlayerX = 512 / 2 - 17 - gridSize * 3;
      onePlayerY = 512 / 2 - 17;
      oneRespanTime = 300;
    }
  }
}

function twoPlayerRespan() {
  if (twoPlayerGameOver) {
    twoRespanTime--;
    if (twoRespanTime <= 0) {
      twoPlayerGameOver = false;
      twoPlayerDirection = 0;
      twoPlayerX = 512 / 2 - 17 + gridSize * 3;
      twoPlayerY = 512 / 2 - 17;
      twoRespanTime = 300;
    }
  }
}

function timer() {
  let elapsed = (millis() - startTime) / 1000;
  let remaining = max(0, countdown - elapsed);
  displayTime = remaining.toFixed(1);
  $("#time").text("TIME: " + displayTime);

  if (remaining <= 0) {
    textAlign(CENTER, CENTER);
    fill(200, 0, 0, 200);
    rect(0, 0, width, height);
    fill(255);
    textSize(48);
    text("タイムアップ！", width / 2, height / 2 - 20);

    textSize(24);
    if (is2Players) {
      fill(onePlayerColor);
      text("1P SCORE: " + onePlayerScore, width / 2, height / 2 + 40);
      fill(twoPlayerColor);
      text("2P SCORE: " + twoPlayerScore, width / 2, height / 2 + 70);
    }
    showGameOverScreen();
  }
}

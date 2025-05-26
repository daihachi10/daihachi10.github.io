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

let minFps = 512;
let maxFps = -512;

let fps = 0;

let appleImage;

let controlLeft = false;
let controlTop = false;
let controlRight = false;
let controlBottom = false;

let onePlayerGameOver = false;
let twoPlayerGameOver = false;

let oneRespanTime = 300;
let twoRespanTime = 300;

let showOneRespanTime = 300;
let showTwoRespanTime = 300;

let countdown = 60; // カウントダウン秒数
let startTime;
let displayTime;

let isSurinuke = false;

let appleSounds;

let timeLimit = true;

function preload() {
  appleImage = loadImage("image/apple.png");

  appleSounds = loadSound("./sounds/apple.mp3");
}

function setup() {
  appleImage.resize(0, 25);
  // createCanvas(512, 512);
  let canvasContainer = document.getElementById("p5-canvas-container");
  let canvas = createCanvas(512, 512);
  canvas.parent(canvasContainer); // コンテナにキャンバスを配置
  frameRate(60);
  noStroke();
  appleX = 240;
  appleY = random(512);

  noLoop();
}

function draw() {
  background("#abd55b");
  drawLine();
  appleSpan(appleX, appleY);

  onePleyerJudgment();

  twoPleyerJudgment();

  onePlayerClone();

  twoPleyerClone();

  onePlayerSpan(onePlayerX, onePlayerY);

  twoPlayerSpan(twoPlayerX, twoPlayerY);

  onePleyerMove(onePlayerDirection);

  twoPleyerMove(twoPlayerDirection);

  onePleyerGame();

  twoPleyerGame();

  drawScore();
  fpsCount();

  onePlayerRespan();
  twoPlayerRespan();

  timer();

  gameSystem();
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

      if (onePlayerY % gridSize > standardRevision) {
        onePlayerY -= revision;
      } else if (onePlayerY % gridSize < standardRevision) {
        onePlayerY += revision;
      }
    }
  }

  if (keys["w"] || keys["ArrowUp"] || controlTop) {
    if (onePlayerX % gridSize <= miss) {
      onePlayerDirection = "top";

      if (onePlayerX % gridSize > standardRevision) {
        onePlayerX -= revision;
      } else if (onePlayerY % gridSize < standardRevision) {
        onePlayerX += revision;
      }
    }
  }

  if (keys["d"] || keys["ArrowRight"] || controlRight) {
    if (onePlayerY % gridSize <= miss) {
      onePlayerDirection = "right";

      if (onePlayerY % gridSize > standardRevision) {
        onePlayerY -= revision;
      } else if (onePlayerY % gridSize < standardRevision) {
        onePlayerY += revision;
      }
    }
  }

  if (keys["s"] || keys["ArrowDown"] || controlBottom) {
    if (onePlayerX % gridSize <= miss) {
      onePlayerDirection = "bottom";

      if (onePlayerX % gridSize > standardRevision) {
        onePlayerX -= revision;
      } else if (onePlayerY % gridSize < standardRevision) {
        onePlayerX += revision;
      }
    }
  }

  //自分の体
  // onePlayerX =
  // onePlayerOldPlayerX[onePlayerOldPlayerX.length - i];
  // onePlayerOldPlayerY[onePlayerOldPlayerY.length - i];

  // for (let i = 0; i < onePlayerScore + 20; i++) {
  //   let size = 7;
  //   let x = onePlayerOldPlayerX[onePlayerOldPlayerX.length - i];
  //   let y = onePlayerOldPlayerY[onePlayerOldPlayerY.length - i];
  //   let judX;
  //   let judY;
  //   let jud = 10;

  //   // fill("#ff0000");
  //   // rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);
  //   fill("#00ffff");

  //   switch (onePlayerDirection) {
  //     case "top":
  //       judX = 0;
  //       judY = jud;
  //       break;
  //     case "bottom":
  //       judX = 0;
  //       judY = jud * 2;
  //       break;
  //     case "left":
  //       judX = -jud * 2;
  //       judY = 0;
  //       break;
  //     case "right":
  //       judX = jud;
  //       judY = 0;
  //       break;
  //   }

  //   rect(
  //     onePlayerX + gridSize - size + judX,
  //     onePlayerY + gridSize - size + judY,
  //     size,
  //     size
  //   );
  //   fill("#ff0000");
  //   rect(onePlayerX + size, onePlayerY + size, size, size);
  //   // rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);

  //   console.log(onePlayerDirection);

  //   if (x + size == onePlayerX && y + size == onePlayerY) {
  //     console.log("AAAAAAAAAA");
  //   }
  // }
}

function twoPleyerJudgment() {
  if (is2Players) {
    let miss = 7;
    let revision = 1;
    let standardRevision = 0.5;

    if (!twoPlayerGameOver) {
      if (keys["j"]) {
        if (twoPlayerY % gridSize <= miss) {
          twoPlayerDirection = "left";

          if (twoPlayerY % gridSize > standardRevision) {
            twoPlayerY -= revision;
          } else if (twoPlayerY % gridSize < standardRevision) {
            twoPlayerY += revision;
          }
        }
      }

      if (keys["i"]) {
        if (twoPlayerX % gridSize <= miss) {
          twoPlayerDirection = "top";

          if (twoPlayerX % gridSize > standardRevision) {
            twoPlayerX -= revision;
          } else if (twoPlayerY % gridSize < standardRevision) {
            twoPlayerX += revision;
          }
        }
      }

      if (keys["l"]) {
        if (twoPlayerY % gridSize <= miss) {
          twoPlayerDirection = "right";

          if (twoPlayerY % gridSize > standardRevision) {
            twoPlayerY -= revision;
          } else if (twoPlayerY % gridSize < standardRevision) {
            twoPlayerY += revision;
          }
        }
      }

      if (keys["k"]) {
        if (twoPlayerX % gridSize <= miss) {
          twoPlayerDirection = "bottom";

          if (twoPlayerX % gridSize > standardRevision) {
            twoPlayerX -= revision;
          } else if (twoPlayerY % gridSize < standardRevision) {
            twoPlayerX += revision;
          }
        }
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
  if (is2Players) {
    let size = 7;
    fill(twoPlayerColor);
    rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);
  }
}

function onePlayerClone() {
  for (let i = 0; i < onePlayerScore + 20; i++) {
    let size = 7;
    let x = onePlayerOldPlayerX[onePlayerOldPlayerX.length - i];
    let y = onePlayerOldPlayerY[onePlayerOldPlayerY.length - i];
    fill(onePlayerColor);

    rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);
    fill("#fff");
  }
}

function twoPleyerClone() {
  if (is2Players) {
    for (let i = 0; i < twoPlayerScore + 20; i++) {
      let size = 7;
      let x = twoPlayerOldPlayerX[twoPlayerOldPlayerX.length - i];
      let y = twoPlayerOldPlayerY[twoPlayerOldPlayerX.length - i];
      fill(twoPlayerColor);

      rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);
      fill("#fff");
    }
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
  if (is2Players) {
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
}

function onePleyerGame() {
  // console.log(onePlayerY)
  if (
    onePlayerX >= 512 ||
    onePlayerX <= 0 - 10 ||
    onePlayerY >= 512 ||
    onePlayerY <= 0 - gridSize
  ) {
    if (!isSurinuke) {
      onePlayerGameOver = true;
      $("#GameOver").addClass("gameover");
      // gameOver()
    } else {
      if (onePlayerX >= 512) {
        onePlayerX = 0;
      }
      if (onePlayerX <= 0 - 10) {
        onePlayerX = 511;
      }
      if (onePlayerY >= 512) {
        onePlayerY = 1 - gridSize;
      }
      if (onePlayerY <= 0 - gridSize) {
        onePlayerY = 511;
      }
    }
  }
}

function twoPleyerGame() {
  if (is2Players) {
    // console.log(twoPlayerY)
    if (
      twoPlayerX >= 512 ||
      twoPlayerX <= 0 - 10 ||
      twoPlayerY >= 512 ||
      twoPlayerY <= 0 - gridSize
    ) {
      twoPlayerGameOver = true;
      $("#GameOver").addClass("gameover");
    }
  }
}

function appleSpan(x, y) {
  let revision = 1;
  let standardRevision = 1;
  image(appleImage, appleX + 5, appleY + 5);

  let detection = 15;
  if (
    onePlayerX - appleX < detection &&
    onePlayerX - appleX > -detection &&
    onePlayerY - appleY < detection &&
    onePlayerY - appleY > -detection
  ) {
    onePlayerScore++;
    appleSounds.play();
    if (onePlayerScore % 2 === 0) {
      onePlayerSpeed += 0.25;
    }
    appleX = random(512);
    appleY = random(512);
  }

  if (
    twoPlayerX - appleX < detection &&
    twoPlayerX - appleX > -detection &&
    twoPlayerY - appleY < detection &&
    twoPlayerY - appleY > -detection
  ) {
    twoPlayerScore++;
    if (twoPlayerScore % 2 === 0) {
      twoPlayerSpeed += 0.25;
    }
    appleX = random(512);
    appleY = random(512);
  }

  if (appleY % gridSize > standardRevision) {
    appleY -= revision;
  } else if (onePlayerY % gridSize < standardRevision) {
    appleY += revision;
  }
  if (appleX % gridSize > standardRevision) {
    appleX -= revision;
  } else if (onePlayerX % gridSize < standardRevision) {
    appleX += revision;
  }
}

function gameOver() {
  fill("#ff0000");
  textSize(50);
  textAlign(CENTER);
  text("GameOver", width / 2, height / 2);
  noLoop();
}

function drawScore() {
  $(document).ready(function () {
    if (is2Players) {
      showOneRespanTime = oneRespanTime / 60;
      showTwoRespanTime = twoRespanTime / 60;

      if (!onePlayerGameOver) {
        $("#1Pscore").text("1PScore:" + onePlayerScore);
      } else {
        $("#1Pscore").text("1P:" + showOneRespanTime.toFixed(2));
      }
      if (!twoPlayerGameOver) {
        $("#2Pscore").text("2PScore:" + twoPlayerScore);
      } else {
        $("#2Pscore").text("2P:" + showTwoRespanTime.toFixed(2));
      }
    } else {
      $("#1Pscore").text("Score:" + onePlayerScore);
    }
  });
}

function fpsCount() {
  fps = frameRate();
  if (frameCount > 10) {
    if (fps < minFps) {
      minFps = fps;
    }

    if (fps > maxFps) {
      maxFps = fps;
    }
  }

  // fill(0);
  // textSize(16);
  // textAlign(RIGHT,TOP)
  // text(fps.toFixed(2), 512, 0);
  $(document).ready(function () {
    $("#fps").text(
      "fps:" +
        fps.toFixed(0) +
        " " +
        minFps.toFixed(1) +
        "/" +
        maxFps.toFixed(1)
    );

    if (fps < 45) {
      $("#fps").addClass("red");
    } else {
      $("#fps").removeClass("red");
    }
  });

  // if (frameCount % 5 == 0) {
  // }
}

function start() {
  loop();
  startTime = millis(); // 開始時刻を記録
  $(document).ready(function () {
    $("#startbutton").addClass("started");
    $("#2pstartbutton").addClass("started");
    $("#item-text").addClass("hidden");
    $("#GameOver").addClass("gameover");
    if (!is2Players) {
      $("#control").removeClass("hidden");
    }
  });

  if (is2Players) {
    onePlayerX = -gridSize;
    twoPlayerX = +gridSize;
  }
}

function topButton() {
  controlTop = true;
  setTimeout(function () {
    controlTop = false;
  }, 150);
}

function bottomButton() {
  controlBottom = true;
  setTimeout(function () {
    controlBottom = false;
  }, 150);
}

function leftButton() {
  controlLeft = true;
  setTimeout(function () {
    controlLeft = false;
  }, 150);
}

function rightButton() {
  controlRight = true;
  setTimeout(function () {
    controlRight = false;
  }, 150);
}

function onePlayerRespan() {
  if (onePlayerGameOver) {
    if (is2Players) {
      oneRespanTime--;

      if (oneRespanTime <= 0) {
        onePlayerGameOver = false;

        onePlayerDirection = 0;
        onePlayerX = 512 / 2 - 17 - gridSize * 3; // width / 2 - 間隔 / 2
        onePlayerY = 512 / 2 - 17;
        // onePlayerOldPlayerX = [onePlayerX];
        // onePlayerOldPlayerY = [onePlayerY];

        oneRespanTime = 300;
        // }
      }
    }
  }
}

function twoPlayerRespan() {
  if (twoPlayerGameOver) {
    if (is2Players) {
      twoRespanTime--;

      if (twoRespanTime <= 0) {
        twoPlayerX = 256;
        twoPlayerY = 256;

        twoPlayerGameOver = false;

        twoPlayerDirection = 0;
        twoPlayerX = 512 / 2 - 17 + gridSize * 3; // width / 2 - 間隔 / 2
        twoPlayerY = 512 / 2 - 17;
        // twoPlayerOldPlayerX = [twoPlayerX];
        // twoPlayerOldPlayerY = [twoPlayerY];

        twoRespanTime = 300;
        // }
      }
    }
  }
}

function random(min, max) {
  Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

function gameSystem() {
  // let min = 0;
  // let max = 9;
  // let randomNumber = random(min, max);
  // if (displayTime == 50) {
  //   isSurinuke = true;
  // }
  // if (isSurinuke) {
  // }
}

function timer() {
  // 経過時間（秒）を小数で計算
  let elapsed = (millis() - startTime) / 1000;
  let remaining = max(0, countdown - elapsed);

  // 小数第1位まで表示
  displayTime = remaining.toFixed(2);

  $("#time").text("残り時間:" + displayTime + "秒");

  textAlign(CENTER, CENTER);
  textSize(48);
  if (remaining <= 0 && timeLimit) {
    fill(200, 0, 0);

    text("タイムアップ！", width / 2, height / 2);

    fill("#fff");
    rect(width / 2 - 80, height / 2 + 50, 160, 80);

    textSize(24);
    if (is2Players) {
      fill(onePlayerColor);
      text("1PScore:" + onePlayerScore, width / 2, height / 2 + 75);
      fill(twoPlayerColor);
      text("2PScore:" + twoPlayerScore, width / 2, height / 2 + 105);
    }

    noLoop(); // 終了後は停止
  }
}

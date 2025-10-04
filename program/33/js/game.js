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

// ランダムワープ関連の変数
let randomSurinukeActive = false;
let surinukeStartTime = 0;
let surinukeDuration = 20;
let nextSurinukeTime = 0;
let showSurinukeNotification = false;
let notificationMessage = "";
let notificationAlpha = 0;
let notificationFadeIn = true;
let showWarning = false;

const surinukeButton = document.getElementById("surinukebutton");
const timeButton = document.getElementById("timebutton");

surinukeButton.addEventListener("click", function () {
  isSurinuke = true;
});

timeButton.addEventListener("click", function () {
  countdown = prompt("時間を入力してください", countdown);
});

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

  // 次のワープタイミングを設定（10〜40秒後）
  nextSurinukeTime = millis() + random(10000, 40000);

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

  // ランダムワープシステム
  handleRandomSurinuke();

  // ワープ通知の表示
  drawSurinukeNotification();
}

function handleRandomSurinuke() {
  // ゲームが開始されていて、手動ワープが有効でない場合のみ動作
  if (startTime && !isSurinuke) {
    let currentTime = millis();

    // ランダムワープを開始
    if (!randomSurinukeActive && currentTime >= nextSurinukeTime) {
      randomSurinukeActive = true;
      surinukeStartTime = currentTime;

      // 通知を表示
      showSurinukeNotification = true;
      notificationMessage = "ワープモード開始！";
      notificationAlpha = 0;
      notificationFadeIn = true;
      showWarning = false;

      // 次のワープタイミングを設定（終了後20〜50秒後）
      nextSurinukeTime =
        currentTime + surinukeDuration * 1000 + random(20000, 50000);
    }

    // ワープ中の処理
    if (randomSurinukeActive) {
      let elapsed = (currentTime - surinukeStartTime) / 1000;
      let remaining = surinukeDuration - elapsed;

      // 終了5秒前に警告を表示
      if (remaining <= 5 && remaining > 0 && !showWarning) {
        showWarning = true;
        showSurinukeNotification = true;
        notificationMessage = "ワープモード終了まで5秒！";
        notificationAlpha = 0;
        notificationFadeIn = true;
      }

      // ワープ終了
      if (remaining <= 0) {
        randomSurinukeActive = false;
        showWarning = false;
      }
    }
  }
}

function drawSurinukeNotification() {
  if (showSurinukeNotification) {
    push();

    // フェードイン/フェードアウト効果
    if (notificationFadeIn) {
      notificationAlpha += 5;
      if (notificationAlpha >= 200) {
        notificationAlpha = 200;
        notificationFadeIn = false;
        // 2秒後にフェードアウト開始
        setTimeout(() => {
          showSurinukeNotification = false;
        }, 2000);
      }
    }

    // 背景の半透明ボックス
    fill(0, 0, 0, notificationAlpha * 0.7);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 100, 300, 60, 10);

    // テキスト
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(255, 255, 255, notificationAlpha);
    text(notificationMessage, width / 2, height / 2 - 100);

    pop();
  }

  // ワープ中の常時表示インジケーター
  if (randomSurinukeActive) {
    push();
    let elapsed = (millis() - surinukeStartTime) / 1000;
    let remaining = max(0, surinukeDuration - elapsed);

    // 画面上部にインジケーター表示
    fill(0, 0, 0, 150);
    rect(10, 10, 150, 30, 5);

    textAlign(LEFT, CENTER);
    textSize(14);

    // 残り時間によって色を変える
    if (remaining <= 5) {
      fill(255, 100, 100);
    } else {
      fill(100, 255, 100);
    }

    text("ワープ: " + remaining.toFixed(1) + "秒", 20, 25);
    pop();
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
    // 手動ワープまたはランダムワープが有効な場合
    if (!isSurinuke && !randomSurinukeActive) {
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
      // 手動ワープまたはランダムワープが有効な場合
      if (!isSurinuke && !randomSurinukeActive) {
        twoPlayerGameOver = true;
        $("#GameOver").addClass("gameover");
        // gameOver()
      } else {
        if (twoPlayerX >= 512) {
          twoPlayerX = 0;
        }
        if (twoPlayerX <= 0 - 10) {
          twoPlayerX = 511;
        }
        if (twoPlayerY >= 512) {
          twoPlayerY = 1 - gridSize;
        }
        if (twoPlayerY <= 0 - gridSize) {
          twoPlayerY = 511;
        }
      }
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
    appleSounds.play();
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

        oneRespanTime = 300;
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

        twoRespanTime = 300;
      }
    }
  }
}

function random(min, max) {
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

function gameSystem() {
  // 既存のgameSystem関数の内容
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

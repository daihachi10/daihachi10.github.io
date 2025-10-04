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
let surinukeDuration = 15; // 10秒間
let nextSurinukeTime = 0;
let showSurinukeNotification = false;
let notificationMessage = "";
let notificationAlpha = 0;
let notificationFadeIn = true;
let showWarning = false;

// ポップアップアニメーション用
let popupScale = 0;
let popupRotation = 0;

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
  // nextSurinukeTime = millis() + random(10000, 20000);
  nextSurinukeTime = millis();

  noLoop();
}

function draw() {
  background("#abd55b");
  drawLine();
  appleSpan(appleX, appleY);

  onePleyerJudgment();

  twoPleyerJudgment();

  // ゲームパッドの入力を処理
  handleGamepads();

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

function handleGamepads() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  const deadzone = 0.5;

  // helper: 十字キー判定（buttonsがある場合）と軸でのフォールバックを統一して返す
  function readDirectionFromPad(gp) {
    if (!gp) return null;

    // ボタンによるD-Pad（標準的）
    const btnUp = gp.buttons[12] && gp.buttons[12].pressed;
    const btnDown = gp.buttons[13] && gp.buttons[13].pressed;
    const btnLeft = gp.buttons[14] && gp.buttons[14].pressed;
    const btnRight = gp.buttons[15] && gp.buttons[15].pressed;

    // アナログスティック（左スティック優先、なければ右スティック）
    const axes = gp.axes || [];
    const lStickX = axes.length > 0 ? axes[0] : 0;
    const lStickY = axes.length > 1 ? axes[1] : 0;
    const rStickX = axes.length > 2 ? axes[2] : 0;
    const rStickY = axes.length > 3 ? axes[3] : 0;

    // 一部コントローラー（特にPCドライバなしの時）ではD-Padが軸にマップされることがある。
    // その場合は軸の値から判定する（左右/上下それぞれ）。
    // まずボタン判定があればそれを優先。
    if (btnLeft || btnRight || btnUp || btnDown) {
      return {
        left: !!btnLeft,
        right: !!btnRight,
        up: !!btnUp,
        down: !!btnDown,
      };
    }

    // 軸判定：左スティックが有効ならそれを使う。なければ右スティック。
    const useX = Math.abs(lStickX) > Math.abs(rStickX) ? lStickX : rStickX;
    const useY = Math.abs(lStickY) > Math.abs(rStickY) ? lStickY : rStickY;

    return {
      left: useX < -deadzone,
      right: useX > deadzone,
      up: useY < -deadzone,
      down: useY > deadzone,
    };
  }

  // --- プレイヤー1（従来の処理） ---
  const gp1 = gamepads[0];
  if (gp1) {
    const dpad = readDirectionFromPad(gp1);
    const stickX = (gp1.axes && gp1.axes[0]) || 0;
    const stickY = (gp1.axes && gp1.axes[1]) || 0;

    const dpadLeft = dpad && dpad.left;
    const dpadRight = dpad && dpad.right;
    const dpadUp = dpad && dpad.up;
    const dpadDown = dpad && dpad.down;

    if (dpadLeft || stickX < -deadzone) {
      if (onePlayerY % gridSize <= 7) onePlayerDirection = "left";
    } else if (dpadRight || stickX > deadzone) {
      if (onePlayerY % gridSize <= 7) onePlayerDirection = "right";
    } else if (dpadUp || stickY < -deadzone) {
      if (onePlayerX % gridSize <= 7) onePlayerDirection = "top";
    } else if (dpadDown || stickY > deadzone) {
      if (onePlayerX % gridSize <= 7) onePlayerDirection = "bottom";
    }
  }

  // --- プレイヤー2: is2Players が true のとき、接続されている gamepad の中から 2P 用を自動で探す ---
  if (is2Players) {
    // 優先ルール：
    // 1) index 1 の gamepad が存在すればまずそれを 2P に使う
    // 2) もし index 1 が無ければ、id に "Pro" か "Pro Controller" を含むものを探す
    // 3) それも無ければ、index 0 以外の最初の接続済み gamepad を使う
    let gp2 = null;
    if (gamepads[1]) gp2 = gamepads[1];
    if (!gp2) {
      // id に "Pro" を含むものを探す（Nintendo Pro Controller 対策）
      for (let i = 0; i < gamepads.length; i++) {
        const g = gamepads[i];
        if (g && g.connected && g.id && /pro/i.test(g.id)) {
          // 既に gp1 を使っている場合は別のものを選ぶ
          if (!gp1 || g.index !== gp1.index) {
            gp2 = g;
            break;
          }
        }
      }
    }
    if (!gp2) {
      // 上の条件で見つからなければ index 0 以外の最初の接続済み gamepad を選ぶ
      for (let i = 0; i < gamepads.length; i++) {
        const g = gamepads[i];
        if (g && g.connected && (!gp1 || g.index !== gp1.index)) {
          gp2 = g;
          break;
        }
      }
    }

    // gp2 が見つかったら入力を読み取る
    if (gp2) {
      const dpad = readDirectionFromPad(gp2);

      // ABXY は環境によってボタン番号が異なることがあるが、標準配置をまず試す
      const btnA = gp2.buttons[0] && gp2.buttons[0].pressed;
      const btnB = gp2.buttons[1] && gp2.buttons[1].pressed;
      const btnX = gp2.buttons[2] && gp2.buttons[2].pressed;
      const btnY = gp2.buttons[3] && gp2.buttons[3].pressed;

      const dpadLeft = dpad && dpad.left;
      const dpadRight = dpad && dpad.right;
      const dpadUp = dpad && dpad.up;
      const dpadDown = dpad && dpad.down;

      // スティックのフォールバック
      const lStickX = (gp2.axes && gp2.axes[0]) || 0;
      const lStickY = (gp2.axes && gp2.axes[1]) || 0;
      const rStickX = (gp2.axes && gp2.axes[2]) || 0;
      const rStickY = (gp2.axes && gp2.axes[3]) || 0;

      // 決定ロジック（複数ソースを OR で扱う）
      if (dpadLeft || btnX || lStickX < -deadzone || rStickX < -deadzone) {
        if (twoPlayerY % gridSize <= 7) twoPlayerDirection = "left";
      } else if (
        dpadRight ||
        btnB ||
        lStickX > deadzone ||
        rStickX > deadzone
      ) {
        if (twoPlayerY % gridSize <= 7) twoPlayerDirection = "right";
      } else if (dpadUp || btnY || lStickY < -deadzone || rStickY < -deadzone) {
        if (twoPlayerX % gridSize <= 7) twoPlayerDirection = "top";
      } else if (dpadDown || btnA || lStickY > deadzone || rStickY > deadzone) {
        if (twoPlayerX % gridSize <= 7) twoPlayerDirection = "bottom";
      }
    } // end if (gp2)
  } // end if is2Players
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
      notificationAlpha = 5;
      notificationFadeIn = true;
      showWarning = false;
      popupScale = 0;

      // 次のワープタイミングを設定（終了後20〜50秒後）
      nextSurinukeTime =
        currentTime + surinukeDuration * 1000 + random(20000, 30000);
    }

    // ワープ中の処理
    if (randomSurinukeActive) {
      let elapsed = (currentTime - surinukeStartTime) / 1000;
      let remaining = surinukeDuration - elapsed;

      // 終了5秒前に警告を表示
      if (remaining <= 3 && remaining > 0 && !showWarning) {
        showWarning = true;
        showSurinukeNotification = true;
        notificationMessage = "ワープモード終了まで3秒！";
        notificationAlpha = 5;
        notificationFadeIn = true;
        popupScale = 0;
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

    // フェードイン/フェードアウト効果とスケールアニメーション
    if (notificationFadeIn) {
      notificationAlpha += 8;
      popupScale = min(popupScale + 0.08, 1.2);

      if (notificationAlpha >= 255) {
        notificationAlpha = 255;
        notificationFadeIn = false;
        // 2秒後にフェードアウト開始
        setTimeout(() => {
          showSurinukeNotification = false;
        }, 2000);
      }
    }

    // バウンス効果
    if (popupScale > 1) {
      popupScale = max(1, popupScale - 0.02);
    }

    // モダンなポップアップデザイン
    push();
    translate(width / 2, height / 2 - 100);
    scale(popupScale);

    // グラデーション効果のための複数レイヤー
    // 外側のグロー効果
    for (let i = 3; i > 0; i--) {
      if (showWarning) {
        fill(255, 50, 50, notificationAlpha * 0.1 * i);
      } else {
        fill(100, 255, 200, notificationAlpha * 0.1 * i);
      }
      rectMode(CENTER);
      rect(0, 0, 320 + i * 20, 80 + i * 10, 20);
    }

    // メインボックス（グラデーション背景）
    if (showWarning) {
      // 警告時：赤系グラデーション
      fill(220, 30, 50, 100);
    } else {
      // 通常時：青緑系グラデーション
      fill(30, 150, 200, 100);
    }
    rect(0, 0, 320, 80, 15);

    // 内側のハイライト
    fill(255, 255, 255, 70);
    rect(0, -25, 300, 30, 10);

    // テキストエフェクト
    textAlign(CENTER, CENTER);

    // テキストの影
    fill(0, 0, 0, notificationAlpha * 0.5);
    textSize(26);
    text(notificationMessage, 2, 2);

    // メインテキスト
    fill(255, 255, 255, notificationAlpha);
    textSize(26);
    textStyle(BOLD);
    text(notificationMessage, 0, 0);
    textStyle(NORMAL);

    // アイコン的な装飾

    pop();
    pop();
  }
  // randomSurinukeActive = true;
  // ワープ中の常時表示インジケーター（改善版）
  if (randomSurinukeActive) {
    push();
    let elapsed = (millis() - surinukeStartTime) / 1000;
    let remaining = max(0, surinukeDuration - elapsed);
    let progress = elapsed / surinukeDuration;

    // ゲージの背景
    fill(0, 0, 0, 50);
    rect(10, 10, 200, 40, 10);

    // プログレスバー
    if (remaining <= 5) {
      // 警告色のグラデーション
      fill(255, 50 + sin(frameCount * 0.2) * 50, 50, 150);
    } else {
      // 通常色のグラデーション
      fill(50, 200 + sin(frameCount * 0.1) * 55, 150, 150);
    }
    rect(15, 15, 190 * (1 - progress), 30, 8);

    // 光の効果
    fill(255, 255, 255, 100);
    rect(15, 15, 190 * (1 - progress), 10, 5);

    // テキスト
    textAlign(LEFT, CENTER);
    textSize(16);
    textStyle(BOLD);

    // メインテキスト
    fill(255, 255, 255, 200);
    text("ワープ: " + remaining.toFixed(2) + "秒", 70, 30);
    textStyle(NORMAL);

    // アイコンアニメーション
    push();
    translate(35, 30);
    rotate(frameCount * 0.1);
    stroke(255, 255, 255);
    strokeWeight(2);
    noFill();
    for (let i = 0; i < 4; i++) {
      arc(0, 0, 15, 15, i * HALF_PI, i * HALF_PI + QUARTER_PI);
    }
    pop();

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
      let y = twoPlayerOldPlayerY[twoPlayerOldPlayerY.length - i];
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
        $("#1Pscore").text("BlueScore:" + onePlayerScore);
      } else {
        $("#1Pscore").text("Blue:" + showOneRespanTime.toFixed(2));
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

  // タイムアップ時のモダンなポップアップ表示
  if (remaining <= 0 && timeLimit) {
    // 背景の暗転効果
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    push();
    translate(width / 2, height / 2);

    // アニメーション用の値
    let pulse = sin(frameCount * 0.05) * 5;

    // 外側のグロー効果
    for (let i = 5; i > 0; i--) {
      fill(255, 100, 100, 20 * i);
      rectMode(CENTER);
      rect(0, 0, 320 + i * 15 + pulse, 200 + i * 10 + pulse, 25);
    }

    // メインポップアップボックス
    // グラデーション背景（暗い赤から明るい赤へ）
    fill(180, 20, 40);
    rect(0, 0, 320, 200, 20);

    // 内側のハイライト効果
    fill(255, 255, 255, 20);
    rect(0, -70, 280, 50, 15);

    // タイトル部分の装飾ライン
    stroke(255, 100, 100);
    strokeWeight(2);
    line(-100, -40, -20, -40);
    line(20, -40, 100, -40);
    noStroke();

    // "タイムアップ！"テキスト
    textAlign(CENTER, CENTER);

    // テキストの影
    fill(0, 0, 0, 100);
    textSize(42);
    textStyle(BOLD);
    text("TIME UP!", 3, -53);

    // メインタイトル
    fill(255, 255, 255);
    textSize(42);
    text("TIME UP!", 0, -55);

    // 装飾的な時計アイコン
    push();
    translate(-130, -55);
    stroke(255, 200, 100);
    strokeWeight(3);
    noFill();
    circle(0, 0, 30);
    line(0, 0, 0, -10);
    line(0, 0, 7, 5);
    pop();

    // スコア表示部分
    // スコアボックスの背景
    fill(0, 0, 0, 50);
    rect(0, 35, 260, 100, 15);

    textSize(24);
    textStyle(NORMAL);

    if (is2Players) {
      // 2プレイヤーモードのスコア表示
      // Player 1
      push();
      translate(-65, 10);

      // プレイヤー1のカラーボックス
      fill(onePlayerColor);
      rect(0, 0, 100, 35, 10);
      fill(255, 255, 255, 30);
      rect(0, -10, 90, 15, 5);

      fill(255);
      textSize(20);
      text("1P", 0, 0);
      pop();

      // Player 1 スコア
      fill(255, 255, 255);
      textSize(28);
      textStyle(BOLD);
      text(onePlayerScore, -65, 45);

      // Player 2
      push();
      translate(65, 10);

      // プレイヤー2のカラーボックス
      fill(twoPlayerColor);
      rect(0, 0, 100, 35, 10);
      fill(255, 255, 255, 30);
      rect(0, -10, 90, 15, 5);

      fill(255);
      textSize(20);
      text("2P", 0, 0);
      pop();

      // Player 2 スコア
      fill(255, 255, 255);
      textSize(28);
      textStyle(BOLD);
      text(twoPlayerScore, 65, 45);

      // VS表示
      textSize(16);
      textStyle(NORMAL);
      fill(255, 200, 100);
      text("VS", 0, 45);

      // 勝者の表示
      textSize(18);
      fill(255, 255, 100);
      if (onePlayerScore > twoPlayerScore) {
        text("🏆 Player 1 Win! 🏆", 0, 75);
      } else if (twoPlayerScore > onePlayerScore) {
        text("🏆 Player 2 Win! 🏆", 0, 75);
      } else {
        text("⭐ Draw! ⭐", 0, 75);
      }
    } else {
      // 1プレイヤーモードのスコア表示
      fill(255, 255, 100);
      textSize(22);
      text("FINAL SCORE", 0, 15);

      // スコアの数値
      fill(255, 255, 255);
      textSize(48);
      textStyle(BOLD);
      text(onePlayerScore, 0, 55);

      // 星の評価
      textSize(24);
      let stars = "";
      if (onePlayerScore >= 50) stars = "⭐⭐⭐";
      else if (onePlayerScore >= 30) stars = "⭐⭐";
      else if (onePlayerScore >= 10) stars = "⭐";
      text(stars, 0, 85);
    }

    textStyle(NORMAL);
    pop();

    noLoop(); // 終了後は停止
  }
}

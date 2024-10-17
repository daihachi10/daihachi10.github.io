//hp
let hp = 1;
let hpuse = false;

//btn
let btn;
var currentColor = 1;
let btnX = 0;
let btnY = 60;
let btnDisplay = 300;

//プレイ方法変更
let play = 1;

// 下のバーのX座標
let barX = 0;

// 下のバーのY座標
const barY = 365;

// ボールの落下速度
let fallingSpeed = 2;

// 通常のボールの初期X座標
let fallingBallX = 200;

// 通常のボールの初期Y座標
let fallingBallY = 0;

// レアなボールの出現確率 ("B"は通常のボール)
let rareProbability = "B";

// レアなボールの落下速度
let goldfallingSpeed = 2;

// レアなボールの初期X座標
let goldfallingBallX = 200;

// レアなボールの初期Y座標
let goldfallingBallY = 0;

// 下向きの速度（ボールの速度を加速させる）
let downSpeed = 1;

// スコアの初期値またはゲームスタート時の表示テキスト
let score = "Start";

// ゲーム説明の表示テキスト
let setumei = "上キーを押すとスキップできます。";

// ボールの直径
let ballSize = 20;

// 下のバーの幅
let barWidth = 90;

// 下のバーの高さ
let barHeight = 10;

// 下のバーの移動速度
let barSpeed = 10;

// レベルアップの効果音の定義
let levelUpSound;

// ピコンの効果音
let pikonSound;

// ゲームオーバーの効果音
let gameOverSound;

// ゲームオーバーの状態を管理するフラグ
let gameOverTrue = false;

// デバッグ情報を表示するかどうかのフラグ
let varDisplay = false;

// ゲームの背景色
let backGround = "#ffffff";

// ゲームオーバー時の背景色
const gameOverGround = "#ffffff";

// 下のバーの色
let rectCollar = "#4a4a4a";

// 通常のボールの色
const ellipseCollar = "#242424";

// レアなボールの色
const rareEllipseCollar = "yellow";

// ペナルティボールの色
const badEllipseCollar = "#d34fff";

//hpUpボールの色
const hpEllipseCollar = "red";

function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 400);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置

    noCursor();
    // 生成した座標
    fallingBallX = random(50, 350); // fallingBallXの初期位置を修正
    //   createCanvas(400, 400);
    // createCanvas(600, 400);
    noStroke(); // 円に枠線を描かない
    barX = fallingBallX - 50;

    noLoop();
}

function programStart() {
    loop()
}

function draw() {
    console.log(hp);
    if (mouseY <= 100) {
        cursor();
    } else {
        noCursor();
    }
    // buttonDisplay();
    if (keyCode === ESCAPE) {
        noLoop(); // ゲームを終了する
    }

    background(backGround); // 背景を設定
    if (hp == 2) {
        fill("red");
    } else {
        fill(rectCollar); // 長方形の色
    }
    rect(barX, barY, barWidth, barHeight); // 長方形（バー
    fill("#FF0000"); // 赤色
    rect(0, 390, 400, 400); // 赤いバー

    // 生成した座標に円を描画
    fill(ellipseCollar);
    ellipse(fallingBallX, fallingBallY, ballSize, ballSize);

    if (rareProbability == "A") {
        fill(rareEllipseCollar);
        ellipse(fallingBallX, fallingBallY, ballSize, ballSize);
    }

    if (rareProbability == "M") {
        fill(badEllipseCollar);
        ellipse(fallingBallX, fallingBallY, ballSize, ballSize);
    }

    if (rareProbability == "K") {
        fill(hpEllipseCollar);
        ellipse(fallingBallX, fallingBallY, ballSize, ballSize);
    }
    // 座標を表示するテキスト
    textDisplay();
    textSize(20);
    text("Score: ", 0, 110);
    textSize(40);
    if (score == "Start") {
        fill("red");
    } else {
        fill("black");
    }
    textStyle(BOLD);
    text(score, 0, 150);
    textStyle(NORMAL);
    if (score !== "Start") {
        setumei = " ";
    }
    fill("black");
    textSize(16);
    text(setumei, 0, 170);

    if (play == 1) {
        // キーが押されている場合の処理
        if (keyIsPressed) {
            if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
                barX += barSpeed; // 右に移動
            } else if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
                barX -= barSpeed; // 左に移動
            }

            if (keyIsDown(RIGHT_ARROW) && keyIsDown(87)) {
                barSpeed = 10;
                barX += barSpeed; // 右に移動
            } else if (keyIsDown(LEFT_ARROW) && keyIsDown(87)) {
                barSpeed = 10;
                barX -= barSpeed; // 左に移動
            }

            if (keyIsDown(40)) {
                fallingBallY += downSpeed;
                downSpeed += 0.3;
            } else {
                downSpeed = 1;
            }
        }
    } else {
        barX = mouseX + barHeight - barWidth / 2;
        if (mouseIsPressed) {
            fallingBallY += downSpeed;
            downSpeed += 0.3;
        } else {
            downSpeed = 1;
        }
    }
    // 当たり判定
    if (
        fallingBallY + ballSize / 2 >= barY &&
        fallingBallY - ballSize / 2 <= barY + barHeight &&
        fallingBallX + ballSize / 2 >= barX &&
        fallingBallX - ballSize / 2 <= barX + barWidth
    ) {
        if (score == "Start") {
            score = 0;
            hyouji();
            getSpeed();
        } else {
            console.log(hp);
            if (rareProbability == "A") {
                score += 5;
                getSpeed();
                hyouji();
            } else {
                if (rareProbability == "M") {
                    score -= 5;
                    getSpeed();
                    hyouji();
                }

                if (rareProbability == "K") {
                    // hp
                    hp = 2;
                    getSpeed();
                    hyouji();
                }
                score += 1;
                getSpeed();
                hyouji();
            }
        }
    }

    if (
        fallingBallY + ballSize / 2 >= 400 &&
        fallingBallY - ballSize / 2 <= 400 + 0 &&
        fallingBallX + ballSize / 2 >= 0 &&
        fallingBallX - ballSize / 2 <= 400 + 0
    ) {
        if (rareProbability !== "A") {
            if (rareProbability !== "M" && rareProbability !== "L") {
                hp--;
                if (hp == 0) {
                    gameOver();
                }
            } else {
                if (rareProbability == "M") {
                    score += 1;
                    hyouji();
                }
            }
        } else {
            if (rareProbability == "M") {
                score += 1;
            }
        }
        if (rareProbability == "M") {
            score += 1;
            pikonplay();
        }
        hyouji();
    }

    // ボールが画面外に出たら再生成
    if (fallingBallY > height + ballSize / 2) {
        if (rareProbability == "M") {
            score += 1;
            pikonplay();
        }
        hyouji();
    }
    // ボールの移動
    if (rareProbability == "A") {
        fallingBallY += fallingSpeed + 5;
    } else {
        fallingBallY += fallingSpeed;
    }
}

function preload() {
    // levelUpSound = loadSound("audio.mp3");
    // pikonSound = loadSound("pikonn.mp3");
    // gameOverSound = loadSound("gameoversound.mp3");
}

function hyouji() {
    rareProbability = random([
        "A", //＋５するやつ
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "M", //ー５するやつ
        "M", //ー５するやつ
    ]);
    console.log(rareProbability);

    fallingBallY = 0;
    fallingBallX = random(50, 350);
    console.log("ボールのX座標=" + fallingBallX.toFixed(0));
    console.log("score=" + score);
}

function gameOver() {
    if (
        rareProbability !== "K" ||
        rareProbability !== "M"
    ) {
        cursor();
        console.log("gameover");
        background(gameOverGround);
        fill("black");
        textSize(20);
        text("score: ", 90, 170);
        textSize(40);
        textStyle(BOLD);
        text(score, 90, 210);
        textSize(60);
        fill("red");
        text("GameOver", width / 2 - 3 * 60, 100);
        textStyle(NORMAL);
        fill("black");
        textSize(20);
        text("START/RESETボタンで", width / 2 - 6.25 * 20, 130);
        text("リスタート", width / 2 - 2.5 * 20, 150);
        print(width);
        gameOverPlay();
        reset();
        barX = fallingBallX - 50;
        textDisplay();
        noLoop();
        setumei = "上キーを押すとスキップできます。";
    }
    hp = 1;
}

function reset() {
    // 変数の初期化
    barX = 0;
    fallingSpeed = 2;
    fallingBallX = 200;
    fallingBallY = 0;
    score = "Start";
    ballSize = 20;
    barWidth = 90;
    barHeight = 10;
    barSpeed = 10;
}

function getSpeed() {
    downSpeed = 1;
    pikonplay();
    if (score == 0) {
        fallingSpeed = 4; //speed関係
        up();
    } else if (score == 5) {
        fallingSpeed = 5;
        up();
    } else if (score == 10) {
        fallingSpeed += 0.5;
        up();
    } else if (score == 15) {
        fallingSpeed += 0.4;
        up();
    } else if (score == 20) {
        fallingSpeed += 0.3;
        up();
    } else if (score == 25) {
        fallingSpeed += 0.2;
        up();
    } else if (score == 30) {
        fallingSpeed += 0.1;
        up();
    } else if (score == 35) {
        fallingSpeed += 0.05;
        up();
    } else if (score == 40) {
        fallingSpeed += 0.04;
        up();
    } else if (score > 19 && fallingSpeed <= 10) {
        fallingSpeed += 0.01;
        barSpeed = 13.5;
    }
}

function up() {
    // levelUpSound.play();
}

function pikonplay() {
    // pikonSound.play();
}

function gameOverPlay() {
    // gameOverSound.play();
}

function keyPressed() {
    if (keyCode === ENTER) {
        console.log("reset");
        loop();
    }

    if (keyIsDown(73)) {
        if (backGround == "#ffffff") {
            backGround = "#fff1";
        } else {
            backGround = "#ffffff";
        }
    }

    if (keyIsDown(38)) {
        fallingBallY = 360;
    }

    if (keyIsDown(83)) {
        //debug
        if (varDisplay == true) {
            varDisplay = false;
        } else {
            if (varDisplay == false) {
                varDisplay = true;
            }
        }
    }
}

function mouseClicked() {
    console.log("reset");
    // loop();
}

function textDisplay() {
    //画面に変数を出す
    fill(0);
    textSize(20);
    text("Speed: " + fallingSpeed.toFixed(1), 0, 20);
    if (varDisplay == true) {
        textSize(10);
        text("barX:" + barX.toFixed(0), 0, 30);
        text("downSpeed:" + downSpeed.toFixed(0), 0, 40);
        text("fallingBallX:" + fallingBallX.toFixed(0), 0, 50);
        text("fallingBallY:" + fallingBallY.toFixed(0), 0, 60);
        if (keyIsDown(87)) {
            text("W key is pressed:True", 0, 70);
        } else {
            text("W key is pressed:False", 0, 70);
        }
        text("Ball type:", 0, 80);
        textSize(25);
        if (rareProbability == "A") {
            fill(rareEllipseCollar);
        } else {
            if (rareProbability == "M") {
                fill(badEllipseCollar);
            } else {
                fill(ellipseCollar);
            }
        }
        text(rareProbability, 45, 90);
        fill("black");
    }
}

function btnClicked() {
    if (play == 1) {
        play = 2;
    } else {
        play = 1;
    }
}

function buttonDisplay() {
    if (btnDisplay >= 0) {
        btnDisplay -= 1;
    } else {
        btn.position(-60, -50);
    }
}
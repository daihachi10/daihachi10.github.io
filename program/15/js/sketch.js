let imanoyatu = 0;
let keys;
let i = 0;

//images
let sushiImage;
let sushi_karaImage;
let barrage_arrowImage;

//timers
let countUpTimer = 0;
let countDownTimer;
let time = 90;

//流れる寿司
let sushiX = -103;
let sushiSpeed = 1;
let sushiKasokudo = 0.03;

//score
let score = 0;

//皿の数
let sara = 0;
let juunokuraiSara = 0;

//次のに行ったら遅延
let tien = 0;

//連打メーター
let barrrage = 0
let barrrageSpeed = 1.35
let barrrageX = 0


//追加カウント
let isAdd1Sec1 = false
let isAdd1Sec2 = false
let isAdd2Sec = false
let isAdd3Sec = false

//連打メーター表示されたかどうか
let isShowAdd1Sec1 = false
let isShowAdd1Sec2 = false
let isShowAdd2Sec = false
let isShowAdd3Sec = false

//連打メーター表示されたかどうかの時間
let defaultShowBarrageTime = 50
let showBarrageTime = defaultShowBarrageTime


function preload() {
    sushiImage = loadImage('image/sushi.webp');
    sushi_karaImage = loadImage('image/sushi_kara.webp');
    barrage_arrowImage = loadImage('image/barrage_arrow.webp')
}

function setup() {
    // frameRate(180)
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    next();
    noStroke();
    angleMode(DEGREES);//半円作るのに使う
    frameRate(60);
    textFont("Noto Sans JP");
}

function draw() {
    background(255);
    timers();
    backgrounds();
    sushi();
    barrage_Meter();
    gui();
    odaihyouji();
    for (let n = 0; n < i; n += 1) {
        oldHyouji(n);
    }
    keyboard()
    sushiSet();

}

function next() {
    imanoyatu = Math.floor(random(0, odai.length));
    i = 0;
}

function odaihyouji() {
    fill("#fff");
    text(odai[imanoyatu], 200, 135);
    textSize(13);
    for (let n = 0; n < romaji[imanoyatu].length; n += 1) {
        text(romaji[imanoyatu][n], 10 + n * 9 + (10 * romaji[imanoyatu].length / 2), 160);
    }
}

function oldHyouji(n) {
    fill("#828282");
    text(romaji[imanoyatu][n], 10 + n * 9 + (10 * romaji[imanoyatu].length / 2), 160);
}

function gui() {
    stroke("#fff");
    strokeWeight(3);

    //中央の文字の下の黒い四角
    textAlign(CENTER, CENTER);
    fill(0, 0, 0, 200);
    rect(50, 110, 300, 70, 7);
    noStroke();

    //残り時間
    fill("#000");
    textSize(20);
    text("残り" + countDownTimer + "秒", 60, 20);

    //連打メーター
    textSize(11)
    text("連打メーター", 180, 10)
    fill("#4c4034")
    rect(160, 17, 217, 3)

    //連打メーター棒
    fill("#fff489");
    rect(160, 17, barrrage_X, 3);

    //連打メーター矢印    
    // sushiImage.resize(0, 50);
    // image(barrage_arrowImage, 20, 70);

    //秒数追加
    //2024-11-02ここ！！！
    fill("#f54545");
    textSize(20);
    console.log(showBarrageTime)
    if (isAdd1Sec1 == true && isShowAdd1Sec1 == false) {
        if (showBarrageTime > 0) {
            text("+1秒", 90, 50);
            showBarrageTime--;
        } else {
            isShowAdd1Sec1 = true;
            showBarrageTime = defaultShowBarrageTime
        }

    }

    // 左右の線
    fill("#f79a4f");
    rect(0, 40, 5, 230);
    rect(400, 40, -5, 230);

    // スコア
    fill("#f29e4f");
    rect(0, 270, 400, 50, 0, 0, 5, 5);
    fill("#000");
    textSize(15);
    text("スコア", 30, 285);

    //-------スコアのお皿-------
    fill("#fff");
    ellipse(70, 286, 28, 28);
    stroke(72, 54, 9, 100);
    strokeWeight(2.6);
    ellipse(70, 286, 20, 20);

    //-------スコアの数字-------
    noStroke();
    fill("#000");
    textSize(13);
    text("¥240", 70, 285)
    if (score < 10) {
        text("×" + "0" + score, 100, 285);
    } else {
        text("×" + score, 100, 285);
    }

    //10づつのお皿の数のもの
    if (score >= 11) {

        //-------形-------
        fill("#fff");
        rect(8, 185, 46, 25, 5);
        fill("#cbcccb");
        arc(30, 214, 20, 20, 180, 360);
        stroke("#cbcccb");
        strokeWeight(2);
        line(30, 214, 30, 235);
        noStroke();
        ellipse(30, 235, 30, 5);
        //----------------

        //お皿の数
        fill("#000");
        textSize(15);

        // text(Math.round(score / 10) * 10 + "皿", 30, 197);
        if (score <= 20) {
            text("10" + "皿", 30, 197);
        } else if (score <= 30) {
            text("20" + "皿", 30, 197);
        } else if (score <= 40) {
            text("30" + "皿", 30, 197);
        } else if (score <= 50) {
            text("40" + "皿", 30, 197);
        } else if (score <= 60) {
            text("50" + "皿", 30, 197);
        } else if (score <= 70) {
            text("60" + "皿", 30, 197);
        } else {
            text("測定不可", 30, 197);
        }
    }
}

function sushi() {
    if (sushiX < 400) {
        sushiImage.resize(0, 50);
        image(sushiImage, sushiX, 70);
    } else {
        sushiX = -103;
        next();
    }
    sushiX += sushiSpeed;
}
function timers() {
    countUpTimer += 1 / 60;
    countDownTimer = time - countUpTimer.toFixed(0);
}



function backgrounds() {
    //残り時間の下のやつ
    fill("#ffa65a");
    rect(0, 0, 400, 40, 5, 5, 0);
    //背景の緑色のやつ
    fill("#b5bf65");
    rect(0, 40, 400, 45);
    //寿司のレーン
    fill("#efbf6b");
    rect(0, 85, 400, 45);
    //寿司のレーンの影
    fill("#e49f36");
    rect(0, 130, 400, 14);
    //寿司のレーンの下
    fill("#d69e4f");
    rect(0, 144, 400, 70);
    // 机
    fill("#eab768");
    rect(0, 214, 400, 370);

}

function sushiSet() {
    if (sara >= 11) {
        sara = 1
    }
    // sara++;

    for (n = 0; n < sara; n += 1) {
        sushi_karaImage.resize(0, 50);
        image(sushi_karaImage, 200 - 50.5, 210 - n * 4.6);
    }
}

function barrage_Meter() {
    barrrage_X = barrrage * barrrageSpeed;
    // if (barrrage == 249) {

    // }

    if (barrrage_X > 45 && isAdd1Sec1 == false) {
        console.log("1秒追加")
        countUpTimer -= 1;
        isAdd1Sec1 = true
    } else if (barrrage_X > 90 && isAdd1Sec2 == false) {
        console.log("1秒追加")
        countUpTimer -= 1;
        isAdd1Sec2 = true
    } else if (barrrage_X > 135 && isAdd2Sec == false) {
        console.log("2秒追加")
        countUpTimer -= 2;
        isAdd2Sec = true
    } else if (barrrage_X > 207 && isAdd3Sec == false) {
        console.log("3秒追加")
        countUpTimer -= 3;
        isAdd1Sec1 = false;
        isAdd1Sec2 = false;
        isAdd2Sec = false;
        isAdd3Sec = false;
        barrrage = 0;
    }

}



function keyboard() {

    keys = romaji[imanoyatu][i];

    //長押しでも反応してしまう
    tien--;
    if (key === keys && tien <= 0) {
        console.log("nyuryoku:" + key);
        i += 1;
        keys = romaji[imanoyatu][i];
        iscorrect = true;
        barrrage++;
    } else {
        iscorrect = false;
    }
    if (keyIsPressed && !key === keys) {
        barrrage = 0
    }
    //長押しでも反応しないけど早く入力すると反応しない
    // if (keyIsPressed && !isKeyPushed && key === keys) {
    //     console.log("nyuryoku:" + key);
    //     i += 1;
    //     keys = romaji[imanoyatu][i];
    //     iscorrect = true;
    //     isKeyPushed = true;  // キーが押されたときにフラグをリセット
    // } else if (!keyIsPressed) {
    //     isKeyPushed = false;  // キーが離されたらフラグを元に戻す
    // }
    // console.log(keyIsPressed);
    if (i == romaji[imanoyatu].length) {
        // すべて打ったあとの処理
        sushiX = -103;
        sushiSpeed += sushiKasokudo;
        next();
        score++;
        sara++;
        tien = 20;
    }
}
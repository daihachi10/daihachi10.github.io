let odai = [
    "グアムとサイパンは近い",
    // "卓球で脱臼",
    // "有給休暇を使う",
    // "シェフの気まぐれサラダ",
    // "キャラメルポップコーン",
    // "ウサギをモフモフする",
    // "普段着はパジャマです",
    // "開いた口が塞がらない",
    // "窓の外は冷たい雨",
    // "アメリカンショートヘアー",
    // "ここで会ったが百年目",
];

let romaji = [
    ["g", "u", "a", "m", "u", "t", "o", "s", "a", "i", "p", "a", "n", "h", "a", "t", "i", "k", "a", "i",],
    ["t", "a", "k", "k", "u", "u", "d", "e", "d", "a", "k", "k", "y", "u", "u",]
]
let isKeyPushed = false;
// let keyIsReleased = true;  // フラグを追加
let imanoyatu = 0;
let keys;
let i = 0
let moji = 0
let sushiImage;
let sushi_karaImage;
let countUpTimer = 0;
let countDownTimer;
let time = 60
let sushiX = -103
let sushiSpeed = 1;
let score = 0;
let sara = 0;
let juunokuraiSara = 0;
function preload() {
    sushiImage = loadImage('image/sushi.webp');
    sushi_karaImage = loadImage('image/sushi_kara.webp');
}

function setup() {
    // frameRate(180)
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    typing();
    noStroke();
    angleMode(DEGREES);//半円作るのに使う
    frameRate(60)
}

function draw() {
    background(255);

    timers();
    backgrounds();
    sushi();
    gui();
    odaihyouji();
    for (let n = 0; n < i; n += 1) {
        oldHyouji(n);
    }
    keys = romaji[moji][i]

    //長押しでも反応してしまう
    if (key === keys) {
        console.log("nyuryoku:" + key)
        i += 1;
        keys = romaji[moji][i]
        iscorrect = true
    } else {
        iscorrect = false
    }
    //長押しでも反応しないけど早く入力すると反応しない
    // if (keyIsPressed && !isKeyPushed && key === keys) {
    //     console.log("nyuryoku:" + key);
    //     i += 1;
    //     keys = romaji[moji][i];
    //     iscorrect = true;
    //     isKeyPushed = true;  // キーが押されたときにフラグをリセット
    // } else if (!keyIsPressed) {
    //     isKeyPushed = false;  // キーが離されたらフラグを元に戻す
    // }
    // console.log(keyIsPressed);



    if (i == romaji[moji].length) {
        // すべて打ったあとの処理
        sushiX = -103
        sushiSpeed += 0.07
        next();
        score++;
        sara++;
    }
    sushiSet()

}

function typing() {
    imanoyatu = Math.floor(random(0, odai.length - 1));

}

function odaihyouji() {
    fill("#fff");
    text(odai[imanoyatu], 200, 135);
    textSize(13);
    for (let n = 0; n < romaji[moji].length; n += 1) {
        text(romaji[moji][n], 10 + n * 9 + (10 * romaji[moji].length / 2), 160);
    }
}

function oldHyouji(n) {
    fill("#828282");
    text(romaji[moji][n], 10 + n * 9 + (10 * romaji[moji].length / 2), 160);
}

function gui() {
    stroke("#fff")
    strokeWeight(3)
    //中央の文字の下の黒い四角
    textAlign(CENTER, CENTER);
    fill(0, 0, 0, 200);
    rect(50, 110, 300, 70, 7);
    noStroke();
    //残り時間
    fill("#000");
    textSize(20);
    text("残り" + countDownTimer + "秒", 60, 20);
    // 左右の線
    fill("#f79a4f");
    rect(0, 40, 5, 230);
    rect(400, 40, -5, 230);
    // スコア
    fill("#f29e4f")
    rect(0, 270, 400, 50, 0, 0, 5, 5)

    if (score >= 10) {
        //お皿の数のもの
        fill("#fff");
        rect(8, 185, 46, 25, 5);
        fill("#cbcccb");
        arc(30, 214, 20, 20, 180, 360);
        stroke("#cbcccb");
        strokeWeight(2);
        line(30, 214, 30, 235);
        noStroke();
        ellipse(30, 235, 30, 5);
        //お皿の数
        fill("#000")
        textSize(15);
        text(Math.round(score / 10) * 10 + "皿", 30, 197)
    }
    textSize(18)
}

function sushi() {
    if (sushiX < 400) {
        sushiImage.resize(0, 50)
        image(sushiImage, sushiX, 70)
    } else {
        sushiX = -103
        next();
    }
    sushiX += sushiSpeed;
}
function timers() {
    countUpTimer += 1 / 60;
    countDownTimer = time - countUpTimer.toFixed(0);
}

function next() {
    i = 0;
}

function backgrounds() {
    //残り時間の下のやつ
    fill("#ffa65a");
    rect(0, 0, 400, 40, 5, 5, 0);
    //背景の緑色のやつ
    fill("#b5bf65")
    rect(0, 40, 400, 45);
    //寿司のレーン
    fill("#efbf6b");
    rect(0, 85, 400, 45)
    //寿司のレーンの影
    fill("#e49f36");
    rect(0, 130, 400, 14)
    //寿司のレーンの下
    fill("#d69e4f");
    rect(0, 144, 400, 70);
    // 机
    fill("#eab768");
    rect(0, 214, 400, 370);

}

function sushiSet() {
    if (sara >= 10) {
        sara = 0
    }
    // sara++;

    for (n = 0; n < sara; n += 1) {
        sushi_karaImage.resize(0, 50)
        image(sushi_karaImage, 200 - 50.5, 210 - n * 5)
    }
}
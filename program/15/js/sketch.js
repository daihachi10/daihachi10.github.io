let odai = [
    "グアムとサイパンは近い",
    "卓球で脱臼",
    "ホームページ作りました",
    "ハードディスク",
    "タイムマシーン",
    "卒業式",
    "メールアドレス",
    "ハンドルネーム",
    "職員室",
    "起承転結",
    "兄弟げんか",
    "百万ボルト",
    "天国と地獄",
    "運も実力の内",
    "運命なんて信じない",
    "代表取締役",
    "ガーデニングが趣味です",
    "障害物競走",
];

let romaji = [
    ["g", "u", "a", "m", "u", "t", "o", "s", "a", "i", "p", "a", "n", "h", "a", "t", "i", "k", "a", "i",],
    ["t", "a", "k", "k", "u", "u", "d", "e", "d", "a", "k", "k", "y", "u", "u",],
    ["h", "o", "-", "m", "u", "p", "e", "-", "j", "i", "t", "u", "k", "u", "r", "i", "m", "a", "s", "i", "t", "a",],
    ["h", "a", "-", "d", "o", "d", "h", "i", "s", "u", "k", "u"],
    ["t", "a", "i", "m", "u", "m", "a", "s", "i", "-", "n"],
    ["s", "o", "t", "u", "g", "y", "o", "u", "s", "i", "k", "i"],
    ["m", "e", "-", "r", "u", "a", "d", "o", "r", "e", "s", "u"],
    ["h", "a", "n", "d", "o", "r", "u", "n", "e", "-", "m", "u"],
    ["s", "h", "o", "k", "u", "i", "n", "s", "i", "t", "u"],
    ["k", "i", "s", "h", "o", "u", "t", "e", "n", "k", "e", "t", "u"],
    ["k", "y", "o", "u", "d", "a", "i", "g", "e", "n", "k", "a"],
    ["h", "y", "a", "k", "u", "m", "a", "n", "b", "o", "r", "u", "t", "o"],
    ["t", "e", "n", "g", "o", "k", "u", "t", "o", "j", "i", "g", "o", "k", "u"],
    ["u", "n", "m", "o", "j", "i", "t", "u", "r", "y", "o", "k", "u", "n", "o", "u", "t", "i"],
    ["u", "n", "m", "e", "i", "n", "a", "n", "t", "e", "s", "i", "n", "j", "i", "n", "a", "i"],
    ["d", "a", "i", "h", "y", "o", "u", "t", "o", "r", "i", "s", "i", "m", "a", "r", "i", "y", "a", "k", "u"],
    ["g", "a", "-", "d", "e", "n", "i", "n", "g", "u", "g", "a", "s", "h", "u", "m", "i", "d", "e", "s", "u"],
    ["s", "h", "o", "u", "g", "a", "i", "b", "u", "t", "u", "k", "y", "o", "u", "s", "o", "u"],
]
let isKeyPushed = false;
// let keyIsReleased = true;  // フラグを追加
let imanoyatu = 0;
let keys;
let i = 0
let moji = 0    //◯こめ
let sushiImage;
let sushi_karaImage;
let countUpTimer = 0;
let countDownTimer;
let time = 90
let sushiX = -103
let sushiSpeed = 1;
let sushiKasokudo = 0.03;
let score = 0;
let sara = 0;
let juunokuraiSara = 0;
let tien = 0; //次のに行ったら遅延
function preload() {
    sushiImage = loadImage('image/sushi.webp');
    sushi_karaImage = loadImage('image/sushi_kara.webp');
}

function setup() {
    // frameRate(180)
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    next();
    noStroke();
    angleMode(DEGREES);//半円作るのに使う
    frameRate(60)
    textFont("Noto Sans JP")
}

function draw() {
    moji = imanoyatu//仮
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
    tien--;
    if (key === keys && tien <= 0) {
        console.log("nyuryoku:" + key)
        i += 1;
        keys = romaji[moji][i]
        iscorrect = true
        tien = 20;
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
        sushiSpeed += sushiKasokudo
        next();
        score++;
        sara++;
    }
    sushiSet()

}

function next() {
    imanoyatu = Math.floor(random(0, odai.length));
    i = 0;
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

    if (score >= 11) {
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
    if (sara >= 11) {
        sara = 1
    }
    // sara++;

    for (n = 0; n < sara; n += 1) {
        sushi_karaImage.resize(0, 50)
        image(sushi_karaImage, 200 - 50.5, 210 - n * 4.6)
    }
}
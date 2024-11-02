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

let guamu = [
    "g", "u", "a", "m", "u", "t", "o", "s", "a", "i", "p", "a", "n", "h", "a", "t", "i", "k", "a", "i",
]

let imanoyatu = 0;
let keys;
let i = 0
let sushiImage;
let countUpTimer = 0;
let countDownTimer;
let time = 60
let sushiX = -103
let sushiSpeed = 1;

function preload() {
    sushiImage = loadImage('image/sushi.webp');
    // sushiImage = resize(10,10)

}

function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    typing();
    noStroke();
}

function draw() {
    background(105);
    timers();
    backgrounds();
    sushi();
    gui();
    odaihyouji();
    for (let n = 0; n < i; n += 1) {
        oldHyouji(n);
    }
    keys = guamu[i]
    if (key === keys) {
        console.log("nyuryoku:" + key)
        i += 1;
        keys = guamu[i]
        iscorrect = true
    } else {
        iscorrect = false
    }
    if (keyIsPressed === true) {
    }
    if (i == guamu.length) {
        // すべて打ったあとの処理
        sushiX = -103
        sushiSpeed += 0.07
        next();
    }
}

function typing() {
    imanoyatu = Math.floor(random(0, odai.length - 1));

}

function odaihyouji() {
    fill("#fff");
    text(odai[imanoyatu], 200, 135);
    textSize(13);
    for (let n = 0; n < guamu.length; n += 1) {
        text(guamu[n], 10 + n * 9 + (10 * guamu.length / 2), 160);
    }
}

function oldHyouji(n) {
    fill("#828282");
    text(guamu[n], 10 + n * 9 + (10 * guamu.length / 2), 160);
}

function gui() {

    //中央の文字の下の黒い四角
    textAlign(CENTER, CENTER);
    fill(0, 0, 0, 200);
    rect(50, 110, 300, 70, 7);

    //残り時間
    fill("#000");
    textSize(20);
    text("残り" + countDownTimer + "秒", 60, 20);

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
    //寿司のレーン
    fill("#efbf6b");
    rect(0, 60, 400, 70)
    //背景の緑色のやつ
    fill("#b5bf65")
    rect(0, 40, 400, 45);
}
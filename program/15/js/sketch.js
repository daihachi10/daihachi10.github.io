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

let nihongo = [
    "guamutosaipanhatikai",
    // "takkyuudedakkyuu",
    // "yuukyuukyuukawotukau",
    // "shehunokimaguresarada",
    // "kyaramerupoppuko-n",
    // "usagiwomohumohusuru",
    // "hudangihapajamadesu",
    // "aitakutigahusagaranai",
    // "madonosotohatumetaiame",
    // "amerikansho-tohea-",
    // "kokodeattagahyakunenme",
];

let guamu = [
    "g", "u", "a", "m", "u", "t", "o", "s", "a", "i", "p", "a", "n", "h", "a", "t", "i", "k", "a", "i",
]

let imanoyatu = 0;
let keys;
let i = 0
function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    typing();
    textAlign(CENTER, CENTER);
    noStroke();
}

function draw() {
    background(255);
    gui();
    odaihyouji();
    for (let n = 0; n < i; n += 1) {
        oldHyouji(n);
    }
    keys = guamu[i]
    if (keyIsPressed === true) {
        if (key === keys) {
            console.log("nyuryoku:" + key)
            i += 1;
            keys = guamu[i]
            iscorrect = true
        } else {
            iscorrect = false
        }
    }
    if (i == guamu.length) {
        // すべて打ったあとの処理
    }
}

function typing() {
    imanoyatu = Math.floor(random(0, odai.length - 1));

}

function odaihyouji() {
    text(odai[imanoyatu], 200, 180);
    // text(nihongo[imanoyatu], 10, 20);
    fill("#828282");
    for (let n = 0; n < guamu.length; n += 1) {
        text(guamu[n], 10 + n * 9 + (10 * guamu.length / 2), 200);
    }
    fill("#000000");
}

function oldHyouji(n) {
    text(guamu[n], 10 + n * 9 + (10 * guamu.length / 2), 200);
    // if (iscorrect === true) {
    // }
}

function gui() {
    fill("#f5f5f5");
    rect(50, 150, 300, 100);
    fill("#000");
}
const keys = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const keycode = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
const hyouka = ["D", "C", "B", "A", "S"]
let randoms = Math.floor(Math.random() * 26);
let ok = 0;
let ng = 0;
let x = 0;
let speed = 0.25;
let kankaku = 0;
// let keySound1;
let game = true;
let hyoukakekka;
let hyoukaSpeed = 23

function preload() {
    // keySound1 = loadSound('https://daihachi10.github.io/typing/assets/sound_assets/typing_sound.mp3');
}

function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    x = width / 2 - 150;
    noLoop();
}
function start() {
    varReset();
    loop();
}
function draw() {
    textFont('Verdana');
    background("#fafafa");
    texts();
    if (keyIsPressed === true) {
        runs();
    }
    character();
    speedBar();
    speedBarText();
}

function runs() {
    if (keyIsDown(keycode[randoms])) {
        // keySound1.play();
        ok++;
        x = width / 2 - 150;
        speed = speed + 0.25;
        randoms = Math.floor(Math.random() * 26);
    } else {
        ng++;
    }
}

function texts() {
    fill("white");
    rect(width / 2 - 150, height / 2 - 30, 300, 50);
    fill("black");
    textSize(15);
    if (width >= 406) {
        text(("タイプ数(ミスなし):" + ok + "回"), 0, 15);
    } else if (width >= 338) {
        text(("タイプ数:" + ok + "回"), 0, 15);
    } else if (width >= 274) {
        text((ok + "回"), 0, 15);
    } else {
        text((ok), 0, 15);
    }
    textSize(20);
    text(keys[randoms] + " key press!", width / 2 - 50, height / 2);
}

function character() {
    stroke("red");
    strokeWeight(5);
    line(width / 2 - 150, height / 2 + 20, x + 1, height / 2 + 20);
    stroke("black");
    strokeWeight(1);
    x = x + speed;
    if (x >= width / 2 + 150) {
        gameOver();
    }
}

function speedBar() {
    fill("white")
    rect(width - 250, 10, 230, 2);
    ellipse(width - 255 + speed * hyoukaSpeed, 11, 10, 10);
}

function speedBarText() {
    fill("black");
    textSize(15)
    kankaku = 0;
    for (let i = 0; i < 5; i += 1) {
        line(width - 235 + kankaku, 5, width - 235 + kankaku, 20);
        text(hyouka[i], width - 240 + kankaku, 35);
        kankaku += 45
    }
}



function gameOver() {
    game = false
    fill("white");
    rect(width / 2 - 150, height / 2 - 30, 300, 50);
    fill("black");
    textSize(20);
    hyoukakeisan()
    if (hyoukakekka == "") {
        text("スコア:" + ok, width / 2 - 40, height / 2);
    } else {
        text("スコア:" + ok + "  " + hyoukakekka, width / 2 - 80, height / 2);
    }
    text("Enterキーでリスタート", width / 2 - 110, height / 2 + 40);
    noLoop();
}

function keyPressed() {
    if (keyIsDown(27)) {
        noLoop();
    } else if (keyIsDown(13) && game == true) {
        loop();
    }

    if (game == false && keyIsDown(13)) {
        varReset();
        loop();
    }
}

function hyoukakeisan() {
    const hyoukakijun = [225, 180, 135, 90, 45, 0];
    const hyoukamei = ["評価:SS", "評価:S", "評価:A", "評価:B", "評価:C", "評価:D", ""];

    for (let i = 0; i < hyoukakijun.length; i++) {
        if (width - 255 + speed * hyoukaSpeed > width - 235 + hyoukakijun[i]) {
            console.log(ok + "回 " + hyoukamei[i]);
            hyoukakekka = hyoukamei[i];
            break; // マッチしたらループを終了
        } else {
            hyoukakekka = ""
            console.log(ok + "回");
        }
    }
}


function varReset() {
    ok = 0;
    ng = 0;
    x = width / 2 - 150;
    speed = 0.25;
    kankaku = 0;
    // keySound1;
    game = true;
    hyoukakekka;
}
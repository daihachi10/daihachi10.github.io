let keys = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
let keycode = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
let hyouka = ["D", "C", "B", "A", "S"]
let randoms = Math.floor(Math.random() * 26);
let ok = 0;
let ng = 0;
let x = 0;
let speed = 0.5;
let kankaku = 0;
function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);
    texts();
    if (keyIsPressed === true) {
        runs();
    }
    character();
    speedBar();
    speedBarText();
    gameOverLine();
}
function runs() {
    if (keyIsDown(keycode[randoms])) {
        ok++;
        x = 0;
        speed = speed + 0.25;
        console.log("\"" + keys[randoms] + "\" key pressed");
        randoms = Math.floor(Math.random() * 26);
    } else {
        ng++;
    }
    console.log("タイプ数(ミスなし):" + ok + "回");
}
function texts() {
    fill("black");
    textSize(15);
    text(("タイプ数(ミスなし):" + ok + "回"), 0, 15);
    textSize(20);
    text(keys[randoms] + " key press!", 150, 200);
}
function character() {
    fill("whilte");
    rect(x + 1, 369, 30, 30);
    x = x + speed;
    if (x >= 365) {
        noLoop();
    }
}
function speedBar() {
    fill("white")
    rect(165, 10, 230, 2);
    ellipse(165 + speed * 18, 11, 10, 10);
}
function speedBarText() {
    fill("black");
    textSize(15)
    kankaku = 0;
    for (let i = 0; i < 5; i += 1) {
        line(185 + kankaku, 5, 185 + kankaku, 20);
        text(hyouka[i], 180 + kankaku, 35);
        kankaku += 45
    }
}
function gameOverLine() {
    fill("black");
    line(395, 360, 395, 390);
    textSize(15);
    fill("red");
    text("GameOverLine", 290, 355);
    fill("defolt");
}
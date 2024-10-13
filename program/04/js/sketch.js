let x = 10;
let y = 60;
let i = 0;
let kaisu = 11;
let time = 0;
let start = false;

let items = [
    "😁",
    "😂",
    "😊",
    "🤣",
    "😍",
    "😒",
    "😘",
    "😎",
    "😉",
    "😢",
    "😜",
    "🥰",
    "🙂",
    "😚",
    "🫡",
    "🤨",
    "😐",
    "😑",
    "😶",
    "😥",
    "😣",
    "😏",
    "🙄",
    "😯",
    "😪",
    "😫",
    "🥱",
    "🫠",
    "😤",
    "🤑",
    "😨",
    "😭",
    "😰",
    "🤬",
];


function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    // createCanvas(400, 16383);
    console.log(items);
    console.log("文字の数=" + items.length);
    background("white");
    title();
}

function draw() {
    if (start == true) {
        pass();
        omokusuru(false, 100);
        bar();
    }
}

function mouseClicked() {
    if (
        width / 2 - 150 <= mouseX &&
        mouseX <= 300 &&
        60 <= mouseY &&
        mouseY <= 160 &&
        start == false
    ) {
        background("white");
        start = true;
        title();
    }
}

function programStart() {
    background("white");
    start = true;
    title();
    if (start == true) {
        x = 10;
        y = 60;
        i = 0;
        time = 0
        pass();
        omokusuru(false, 100);
        bar();
    }
}



function title() {
    fill("black");
    textSize(23);
    text("絵文字生成機", 20, 31);
    textSize(20);
}

function pass() {
    fill("black");
    if (i < kaisu) {
        text(
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)] +
            items[Math.floor(Math.random() * items.length)],
            x,
            y
        );
    }
}

function omokusuru(torF, b) {
    if (torF == true) {
        if (i < kaisu) {
            for (let a = 0; a < b; a++) {
                time++;
                console.log(time);
            }
            time = 0;
        }
    }
}

function bar() {
    if (i < kaisu) {
        fill("#FF0000"); // 赤色
        i++;
        y += 23;
    } else {
        fill("white");
    }
    noStroke();
    rect(0, 0, (i * width) / kaisu, 2);
}

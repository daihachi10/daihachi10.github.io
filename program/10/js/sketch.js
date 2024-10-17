let x = 0;
let y = 0;
function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    noStroke();
    noLoop();
}

function draw() {
    fill("#16E950")
    background("#fff");
    x = sin(frameCount / 50) * 500 + 10;
    for (let i = 0; i < 50; i += 1) {
        summon(i);
    }
}

function programStart() {
    loop();
}

function summon(i) {
    rect(x + i * 10, y + i * 10, 10);
}

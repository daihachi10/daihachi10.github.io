let timer = 0;
let x;
let y;
let ellipseSize;
let fps = 10; //defo10
let speed = 0.001; //　デフォルトは0.001 ここいじる
let size = 180; //　円の半径デフォルトは200
function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 400);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    background("#fff");
    // slider = createSlider(1, 255, fps, 5);
    // slider.position(10, 10);
    // slider.size(200);
    noLoop();
}

function programStart() {
    loop();
    reset();
}

function draw() {
    // lines("#000");
    // let fps = slider.value();
    frameRate(fps);
    timer += speed;
    x = cos(timer * 200) * size + 200;
    y = sin(timer * 200) * size + 200;
    ellipseSize = 20;
    fill("white");
    stroke("black");
    // textSize(20);
    // text("fps:" + fps, 10, 50);
    // strokeWeight(1);
    noStroke();
    fill("#e0e0e0");
    ellipse(200, 200, 20);
    ellipse(x, y, ellipseSize);
    // line(200, 200, 200, y);
    // line(200, 200, x, 200);
    // line(200, y, x, y);
    // line(x, 200, x, y);
    colorMode(HSB);
    stroke((2 * frameCount) % 360, 40, 100);
    colorMode(RGB);
    strokeWeight(5);
    fill("red");
    line(200, y, x, 200);
    fill("black");
    // noLoop();
}

function reset() {
    background("#fff");
    // lines("white");
}

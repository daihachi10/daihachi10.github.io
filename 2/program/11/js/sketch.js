let timer = 0;
let x;
let y;
let ellipseSize;
let fps = 10;
let speed = 0.001; //　デフォルトは0.001
let size = 200; //　円の半径デフォルトは130
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

function lines(col) {
    stroke(col);
    strokeWeight(3);
    line(100, 0, 100, 400);
    line(200, 0, 200, 400);
    line(300, 0, 300, 400);
    line(0, 100, 400, 100);
    line(0, 200, 400, 200); //juujinosen
    line(0, 300, 400, 300);
    textSize(10);
    text("(0,0)", 0, 10);
    text("(100,0)", 100, 10);
    text("(200,0)", 200, 10);
    text("(300,0)", 300, 10);
    text("(0,100)", 0, 110);
    text("(100,100)", 100, 110);
    text("(200,100)", 200, 110);
    text("(300,100)", 300, 110);
    text("(0,200)", 0, 210);
    text("(100,200)", 100, 210);
    text("(200,200)", 200, 210);
    text("(300,200)", 300, 210);
    text("(0,300)", 0, 310);
    text("(100,300)", 100, 310);
    text("(200,300)", 200, 310);
    text("(300,300)", 300, 310);
}

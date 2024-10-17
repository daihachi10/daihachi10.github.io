let color_ = "white";
let kakuritu = "1, 2, 3";
let random_ = 1;
let ookisa = 10;
let x = null
let y = null
let kazu = 5;
function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 400);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    background("white");
    noStroke();

    noLoop();
}

function programStart() {
    loop();
}

function draw() {
    aa();
    kazu = random(1, 5);
    random_ = random([
        "1",  // red
        "2",  // green
        "3",  // bule
        "4",  // white
        "5",  // white
        "6",  // white
        "7",  // white
    ]);
    print(random_)
    if (random_ == 1) {
        color_ = "red";
    }
    if (random_ == 2) {
        color_ = "green";
    }
    if (random_ == 3) {
        color_ = "blue";
    }
    if (random_ == 4 ||
        random_ == 5 ||
        random_ == 6 ||
        random_ == 7) {
        color_ = "white";
    }

    if (mouseIsPressed) {
        fill("black");
    } else
        fill(color_);
}

/*if (kazu = 5){
fill("white");
}
*/
function aa() {
    ookisa = random(10, 50);
    x = random(0, 400);
    y = random(0, 400);
    circle(x, y, ookisa);
}
let x = 10;
let y = 10;
let size = 10;
let angle = 0;
let type;
let backgroundColor = "rgb(255,255,255)";
let input_ = "111111121212121112111111131222221222121112221222221312111212212212221212111213121112121221122112121112131211121211122212121211121312222212121112221212222213111111121212121212111111132222222212112121122222222312221211122111221111112213222112221111111212211121232112121211211221121221122311211122111222122112121131212121222212111211221111311222121122212221222122123222122112121111122211113221222222111212112111211311221212221211221111111322222222121221111222131111111211122222121213122222122222212112221111131211121211112112111111121312111212222212211111221113121112122111111221122121312222212221121212221111131111111211221122221222111";
let qrColor = "rgb(14,14,14)";
let lineNumber = 0;
function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    noStroke();
    background(backgroundColor);
    noLoop();
}

function programStart() {
    loop();
}

function draw() {
    if (input_[lineNumber] == 1) {
        type = "black";
        drawing();
    } else if (input_[lineNumber] == 2) {
        type = "white";
        drawing();
    } else if (input_[lineNumber] == 3) {
        x = 10
        y += 10
    }
    lineNumber += 1
}


function keyReleased() {
    if (keyCode == 65) {
        type = "black";
        drawing();
    } else {
        if (keyCode == 68) {
            type = backgroundColor;
            drawing();
        } else {
            if (keyCode == 83) {
                x = 10
                y += 10
            }
        }
    }
}

function drawing() {
    if (type == "black") {
        fill(qrColor);
        square(x, y, size, angle);
        x += 10;
        print(x);
    } else if (type == "white") {
        fill(backgroundColor);
        square(x, y, size, angle);
        x += 10;
        print(x);
    }
}

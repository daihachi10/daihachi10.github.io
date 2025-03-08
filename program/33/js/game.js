let grid = 15;
let gridSize = 512 / grid;

let orientation = 0;
let speed = 4; //34.1
let playerX = 512 / 2 - 17; // width / 2 - 間隔 / 2
let playerY = 512 / 2 - 17;
let playerColor = "#4674e1"

let oldPlayerX = [playerX];
let oldPlayerY = [playerY];

let appleX = 0;
let appleY = 0;

let score = 0;

function setup() {
    // createCanvas(512, 512);
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(512, 512);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    frameRate(60);
    noStroke();
    appleX = random(512);
    appleY = random(512);
}

function draw() {
    // console.log("x:" + playerX + "y:" + playerY);
    background("#abd55b");
    drawLine();
    judgment();
    crone(score);
    playerSpan(playerX, playerY);
    appleSpan(appleX, appleY);
    move(orientation);
    game();
    drawScore();
}

function judgment() {
    let miss = 7;
    let revision = 1;
    let standardRevision = 0.5;

    // console.log(playerY % gridSize);
    if (key === "ArrowLeft") {
        //left
        if (playerY % gridSize <= miss) {
            orientation = "left";

            if (playerY % gridSize > standardRevision) {
                playerY -= revision;
            } else if (playerY % gridSize < standardRevision) {
                playerY += revision;
            }
        }
    }

    if (key === "ArrowUp") {
        //top
        if (playerX % gridSize <= miss) {
            orientation = "top";

            if (playerX % gridSize > standardRevision) {
                playerX -= revision;
            } else if (playerY % gridSize < standardRevision) {
                playerX += revision;
            }
        }
    }

    if (key === "ArrowRight") {
        //right
        if (playerY % gridSize <= miss) {
            orientation = "right";

            if (playerY % gridSize > standardRevision) {
                playerY -= revision;
            } else if (playerY % gridSize < standardRevision) {
                playerY += revision;
            }
        }
    }

    if (key === "ArrowDown") {
        //bottom
        if (playerX % gridSize <= miss) {
            orientation = "bottom";

            if (playerX % gridSize > standardRevision) {
                playerX -= revision;
            } else if (playerY % gridSize < standardRevision) {
                playerX += revision;
            }
        }
    }
}

function drawLine() {
    stroke("#708A41");
    for (let x = 0; x <= width; x += width / grid) {
        line(x, 0, x, height);
    }

    for (let y = 0; y <= height; y += width / grid) {
        line(0, y, width, y);
    }
    noStroke();
}

function playerSpan(x, y) {
    let size = 7;
    fill(playerColor);
    rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);
}

function crone() {

    for (let i = 0; i < score + 20; i++) {
        let size = 7;
        let x = oldPlayerX[oldPlayerX.length - i];
        let y = oldPlayerY[oldPlayerX.length - i];
        fill(playerColor);

        rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);
        fill("#fff")
    }
}

function appleSpan(x, y) {
    let size = 4;

    let revision = 1;
    let standardRevision = 1;
    fill("#f00")
    rect(x + size, y + size, gridSize - size * 2, gridSize - size * 2);
    fill("#fff")
    let detection = 15
    if (
        playerX - appleX < detection &&
        playerX - appleX > -detection &&
        playerY - appleY < detection &&
        playerY - appleY > -detection
    ) {
        score++
        if (score % 2 === 0) {
            speed += 0.5;
        }
        appleX = random(512);
        appleY = random(512);
    }

    if (appleY % gridSize > standardRevision) {
        appleY -= revision;
    } else if (playerY % gridSize < standardRevision) {
        appleY += revision;
    }
    if (appleX % gridSize > standardRevision) {
        appleX -= revision;
    } else if (playerX % gridSize < standardRevision) {
        appleX += revision;
    }
}

function move(i) {
    switch (i) {
        case "left":
            playerX -= speed;
            break;

        case "right":
            playerX += speed;
            break;

        case "top":
            playerY -= speed;
            break;

        case "bottom":
            playerY += speed;
            break;
    }

    oldPlayerX.push(playerX);
    oldPlayerY.push(playerY);
}

function game() {
    // console.log(playerY)
    if (playerX >= 512 || playerX <= 0 - gridSize || playerY >= 512 || playerY <= 0 - gridSize) {
        fill("#ff0000");
        textSize(50);
        textAlign(CENTER);
        text("GameOver", width / 2, height / 2);
        noLoop();
    }
}

function drawScore() {
    fill("#420e0e");
    textSize(20);
    textAlign(LEFT, TOP);
    text("score: " + score, 10, 10);
    fill("#fff");
}
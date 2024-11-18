//Little disclaimer: I DO NOT OWN THE RIGHTS OF PAC-MAN. ALL THE RIGHTS RESERVED TO NAMCO.

let pacman;
let grid = [];
let rows, cols;
const w = 20; //cell length (standard w = 10)
let speedX = 0;
let speedY = 0;
let totalScore = 0;
let p;
let ghosts = [];
let ghostNum = 4;
let r;
let thetaoff = 0;
let dir; //equals 0 if up arrow is pressed, 1 if right arrow is pressed, 2 if down arrow is pressed, 3 if left arrow is pressed
let neighbors = [];


function setup() {
    createCanvas(26 * w, 20 * w);
    rectMode(CENTER);
    noStroke();
    textSize(w * 5);
    rows = height / w + 1;
    cols = width / w + 1;
    translate(w / 2, w / 2);
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Cell(w * (j + 0), w * (i + 0));
        }
    }
    for (let i = 0; i < ghostNum; i++) {
        let rx = round(random(11, 15));
        let ry = round(random(9, 11));
        ghosts[i] = new Ghost(w * rx, w * ry, w);
    }
    pacman = new Pacman(13 * w, 15 * w, w);
    p = createP('Score: ' + totalScore);
    level1();
}

function draw() {
    background(0);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].show();
            grid[i][j].total();
        }
    }
    pacman.show();
    pacman.move();
    ghosts[0].show(0, 255, 0);
    ghosts[1].show(255, 25, 140);
    ghosts[2].show(255, 15, 0);
    ghosts[3].show(50, 155, 255);
    for (let i = 0; i < ghostNum; i++) {
        ghosts[i].move();
        ghosts[i].kill();
    }

    p.html('Score: ' + totalScore);
    if (win()) {
        push();
        fill(205, 205, 40);
        stroke(5);
        text('YOU WON!', 0, height / 2);
        setTimeout(noLoop, 100);
        pop();
    }
}




class Pacman {
    constructor(x, y, diameter) {
        this.x = x;
        this.y = y;
        this.d = diameter;
    }

    show() {
        fill(220, 220, 50);
        let theta = PI / 3 * sq(sin(thetaoff))
        if (speedY < 0) {
            arc(this.x, this.y, this.d, this.d, -theta - PI / 6, theta + 7 * PI / 6);
        } else if (speedY > 0) {
            arc(this.x, this.y, this.d, this.d, -7 * PI / 6 - theta, theta + PI / 6);
        } else if (speedX < 0) {
            arc(this.x, this.y, this.d, this.d, theta + PI, -theta + PI);
        } else if (speedX > 0) {
            arc(this.x, this.y, this.d, this.d, theta, -theta);
        } else {
            if (dir == 0) {
                arc(this.x, this.y, this.d, this.d, -theta - PI / 6, theta + 7 * PI / 6);
            } else if (dir == 1) {
                arc(this.x, this.y, this.d, this.d, -7 * PI / 6 - theta, theta + PI / 6);
            } else if (dir == 2) {
                arc(this.x, this.y, this.d, this.d, theta + PI, -theta + PI);
            } else if (dir == 3) {
                arc(this.x, this.y, this.d, this.d, theta, -theta);
            } else {
                arc(this.x, this.y, this.d, this.d, theta, -theta);
            }
        }
        thetaoff += 0.1;
    }

    move() {
        checkNeighbors(this.x, this.y, neighbors);
        if (this.y % w == 0 && this.x % w == 0) {
            if (neighbors[3] || neighbors[1]) {
                speedX = 0;
            }
            if (neighbors[0] || neighbors[2]) {
                speedY = 0;
            }
            if (dir == 2 && neighbors[3] == false) {
                speedX = -w / 10;
                speedY = 0;
            }
            if (dir == 3 && neighbors[1] == false) {
                speedX = w / 10;
                speedY = 0;
            }
            if (dir == 0 && neighbors[0] == false) {
                speedY = -w / 10;
                speedX = 0;
            }
            if (dir == 1 && neighbors[2] == false) {
                speedY = w / 10;
                speedX = 0;
            }
        }
        this.x += speedX;
        this.y += speedY;
        //looping the pacman through the canvas
        if (this.x < - w / 2) {
            this.x = width + w / 2;
        }
        if (this.x > width + w / 2) {
            this.x = -w / 2;
        }
        if (this.y < - w / 2) {
            this.y = height + w / 2;
        }
        if (this.y > height + w / 2) {
            this.y = -w / 2;
        }
    }
}







class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.wall = false; //is this cell a wall?
        this.score = false; //this cell increases the total score?
        this.power = false; // is this cell a power token?
        this.time = 0;
    }

    show() {
        if (this.wall == true) {
            fill(150, 100);
            rect(this.x, this.y, w, w);
            this.score = false;
        } else if (this.score) {
            fill(225, 120, 0);
            ellipse(this.x, this.y, w / 5);
        }
        if (this.power) {
            fill(225, 120, 0);
            if (this.time % 45 < 15) {
                fill(0);
            }
            ellipse(this.x, this.y, w / 2);
            this.time++;
            if (this.time == 4500) {
                this.time = 0;
            }
        }
    }

    total() {
        if (this.score) {
            let d = dist(pacman.x, pacman.y, this.x, this.y);
            if (d < w / 2) {
                totalScore++;
                this.score = false;
            }
        }
        if (this.power) {
            let d = dist(pacman.x, pacman.y, this.x, this.y);
            if (d < w / 2) {
                totalScore++;
                let time = 6000;
                this.power = false;
                for (let i = 0; i < ghostNum; i++) {
                    ghosts[i].killable = true;
                    setTimeout(ghostInv, time);
                }
            }
        }
    }
}





class Ghost {
    constructor(x, y, diameter) {
        this.i = 0
        this.x = x;
        this.y = y;
        this.d = diameter;
        this.r1 = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.killable = false;
        this.alive = true;
        this.neighbors = [];
        this.i++;
    }

    show(r, g, b) {
        if (this.alive == false) {
        } else if (this.killable) {
            fill(0, 0, 255);
            rect(this.x, this.y, this.d, this.d, 5);
        } else {
            fill(r, g, b);
            rect(this.x, this.y, this.d, this.d, 5);
        }
    }

    kill() {
        let d = dist(pacman.x, pacman.y, this.x, this.y);
        if (d < w / 2) {
            if (this.alive) {
                if (this.killable) {
                    this.alive = false;
                    totalScore += 50;
                    setTimeout(() => {
                        this.x = floor(random(11, 15)) * w;
                        this.y = floor(random(9, 11)) * w;
                        this.alive = true;
                    }, 7000); //calling anonimous function by the old syntax ~function() {}~ doesn't work
                } else {
                    deathPac();
                }
            }
        }
    }

    move() {
        if (this.x % w == 0 && this.y % w == 0) {
            checkNeighbors(this.x, this.y, this.neighbors);
            //it's probably a dumb way of making the ghosts move, but I divided the move function into all the possible neighbors cells of the ghost
            //if all neighbors are walls (technically this is not needed)
            if (this.neighbors[0] && this.neighbors[1] && this.neighbors[2] && this.neighbors[3]) {
                this.speedX = 0;
                this.speedY = 0;
                //if 3 neighbors are walls (technically this is not needed)
            } else if (this.neighbors[0] && this.neighbors[1] && this.neighbors[2]) {
                this.speedX = -w / 10;
                this.speedY = 0;
            } else if (this.neighbors[0] && this.neighbors[1] && this.neighbors[3]) {
                this.speedX = 0;
                this.speedY = w / 10;
            } else if (this.neighbors[0] && this.neighbors[2] && this.neighbors[3]) {
                this.speedX = w / 10;
                this.speedY = 0;
            } else if (this.neighbors[3] && this.neighbors[1] && this.neighbors[2]) {
                this.speedX = 0;
                this.speedY = -w / 10;
                //if 2 neighbors are walls
            } else if (this.neighbors[0] && this.neighbors[1]) {
                this.r = random(1);
                if (this.r < 0.5) {
                    this.speedX = -w / 10;
                    this.speedY = 0;
                } else {
                    this.speedX = 0;
                    this.speedY = w / 10;
                }
            } else if (this.neighbors[0] && this.neighbors[2]) {
                this.r = random(1);
                //if the ghost is between 2 parallel walls, theres a little chance of 5% that it will change its direction
                if (this.r < 0.05) {
                    this.speedX = w / 10;
                    this.speedY = 0;
                } else if (this.r < 0.1) {
                    this.speedX = -w / 10;
                    this.speedY = 0;
                }
            } else if (this.neighbors[0] && this.neighbors[3]) {
                this.r = random(1);
                if (this.r < 0.5) {
                    this.speedX = w / 10;
                    this.speedY = 0;
                } else {
                    this.speedX = 0;
                    this.speedY = w / 10;
                }
            } else if (this.neighbors[1] && this.neighbors[2]) {
                this.r = random(1);
                if (this.r < 0.5) {
                    this.speedX = 0;
                    this.speedY = -w / 10;
                } else {
                    this.speedX = -w / 10;
                    this.speedY = 0;
                }
            } else if (this.neighbors[1] && this.neighbors[3]) {
                this.r = random(1);
                //if the ghost is between 2 parallel walls, theres a little chance of 5% that it will change its direction
                if (this.r < 0.05) {
                    this.speedX = 0;
                    this.speedY = w / 10;
                } else if (this.r < 0.1) {
                    this.speedX = 0;
                    this.speedY = -w / 10;
                }
            } else if (this.neighbors[2] && this.neighbors[3]) {
                this.r = random(1);
                if (this.r < 0.5) {
                    this.speedX = w / 10;
                    this.speedY = 0;
                } else {
                    this.speedX = 0;
                    this.speedY = -w / 10;
                }
                //if 1 neighbor is a wall
            } else if (this.neighbors[0]) {
                this.r = random(1);
                if (this.r < 0.333) {
                    this.speedX = w / 10;
                    this.speedY = 0;
                } else if (this.r < 0.667) {
                    this.speedX = -w / 10;
                    this.speedY = 0;
                } else {
                    this.speedX = 0;
                    this.speedY = w / 10;
                }
            } else if (this.neighbors[1]) {
                this.r = random(1);
                if (this.r < 0.333) {
                    this.speedX = 0;
                    this.speedY = w / 10;
                } else if (this.r < 0.667) {
                    this.speedX = 0;
                    this.speedY = -w / 10;
                } else {
                    this.speedX = -w / 10;
                    this.speedY = 0;
                }
            } else if (this.neighbors[2]) {
                this.r = random(1);
                if (this.r < 0.333) {
                    this.speedX = w / 10;
                    this.speedY = 0;
                } else if (this.r < 0.667) {
                    this.speedX = -w / 10;
                    this.speedY = 0;
                } else {
                    this.speedX = 0;
                    this.speedY = -w / 10;
                }
            } else if (this.neighbors[3]) {
                this.r = random(1);
                if (this.r < 0.333) {
                    this.speedX = 0;
                    this.speedY = w / 10;
                } else if (this.r < 0.667) {
                    this.speedX = 0;
                    this.speedY = -w / 10;
                } else {
                    this.speedX = w / 10;
                    this.speedY = 0;
                }
                //if there are no neighbor walls
            } else {
                this.r = random(1);
                if (this.r < 0.25) {
                    this.speedX = w / 10;
                    this.speedY = 0;
                } else if (this.r < 0.5) {
                    this.speedX = -w / 10;
                    this.speedY = 0;
                } else if (this.r < 0.75) {
                    this.speedX = 0;
                    this.speedY = w / 10;
                } else {
                    this.speedX = 0;
                    this.speedY = -w / 10;
                }
            }

        }
        if (this.x < -w / 2) {
            this.x = width + w / 2;
        }
        if (this.x > width + w / 2) {
            this.x = -w / 2;
        }
        if (this.y < -w / 2) {
            this.y = height + w / 2;
        }
        if (this.y > height + w / 2) {
            this.y = -w / 2;
        }
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        dir = 0;
    }
    if (keyCode === DOWN_ARROW) {
        dir = 1;
    }
    if (keyCode === LEFT_ARROW) {
        dir = 2;
    }
    if (keyCode === RIGHT_ARROW) {
        dir = 3;
    }
}

//what happens when a ghost touches pacman
function deathPac() {
    noLoop();
}

//let ghosts be invulnerable again
function ghostInv() {
    for (let i = 0; i < ghostNum; i++) {
        ghosts[i].killable = false;
    }
}

function checkNeighbors(x, y, array) {
    if (array instanceof Array) {
        let i = floor(y / w);
        let j = floor(x / w);
        let top = grid[i - 1][j];
        let right = grid[i][j + 1];
        let bottom = grid[i + 1][j];
        let left = grid[i][j - 1];
        if (!top) {
            top = false;
        }
        if (!right) {
            right = false;
        }
        if (!bottom) {
            bottom = false;
        }
        if (!left) {
            left = false;
        }
        array[0] = top.wall;
        array[1] = right.wall;
        array[2] = bottom.wall;
        array[3] = left.wall;
    }
}

function win() {
    let count = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j].score || grid[i][j].token) {
                count++;
            }
        }
    }
    if (count == 0) {
        return true
    } else {
        return false;
    }
}

function level1() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].score = true;
        }
    }
    for (let i = 0; i < cols; i++) {
        grid[0][i].wall = true;
        grid[rows - 1][i].wall = true;
    }
    for (let i = 0; i < rows; i++) {
        grid[i][0].wall = true;
        grid[i][cols - 1].wall = true;
    }
    grid[10][0].wall = false;
    grid[10][0].score = false;
    grid[1][13].wall = true;
    grid[2][13].wall = true;
    grid[4][13].wall = true;
    grid[5][13].wall = true;
    grid[6][13].wall = true;
    grid[4][12].wall = true;
    grid[4][11].wall = true;
    grid[4][10].wall = true;
    grid[12][13].wall = true;
    grid[13][13].wall = true;
    grid[14][13].wall = true;
    grid[16][13].wall = true;
    grid[17][13].wall = true;
    grid[18][13].wall = true;
    grid[2][2].wall = true;
    grid[2][3].wall = true;
    grid[2][4].wall = true;
    grid[3][2].wall = true;
    grid[3][3].wall = true;
    grid[3][4].wall = true;
    grid[4][2].wall = true;
    grid[4][3].wall = true;
    grid[4][4].wall = true;
    grid[6][2].wall = true;
    grid[6][3].wall = true;
    grid[6][4].wall = true;
    grid[2][6].wall = true;
    grid[2][7].wall = true;
    grid[2][8].wall = true;
    grid[3][6].wall = true;
    grid[3][7].wall = true;
    grid[3][8].wall = true;
    grid[4][6].wall = true;
    grid[4][7].wall = true;
    grid[4][8].wall = true;
    grid[2][9].wall = true;
    grid[2][10].wall = true;
    grid[2][11].wall = true;
    grid[8][1].wall = true;
    grid[8][2].wall = true;
    grid[8][3].wall = true;
    grid[8][4].wall = true;
    grid[8][5].wall = true;
    grid[8][6].wall = true;
    grid[9][1].wall = true;
    grid[9][2].wall = true;
    grid[9][3].wall = true;
    grid[9][4].wall = true;
    grid[9][5].wall = true;
    grid[9][6].wall = true;
    grid[11][1].wall = true;
    grid[11][2].wall = true;
    grid[11][3].wall = true;
    grid[11][4].wall = true;
    grid[11][5].wall = true;
    grid[11][6].wall = true;
    grid[12][1].wall = true;
    grid[12][2].wall = true;
    grid[12][3].wall = true;
    grid[12][4].wall = true;
    grid[12][5].wall = true;
    grid[12][6].wall = true;
    grid[6][6].wall = true;
    grid[6][7].wall = true;
    grid[6][8].wall = true;
    grid[6][9].wall = true;
    grid[6][10].wall = true;
    grid[6][11].wall = true;
    grid[7][8].wall = true;
    grid[8][8].wall = true;
    grid[9][8].wall = true;
    grid[11][8].wall = true;
    grid[12][8].wall = true;
    grid[8][10].wall = true;
    grid[8][11].wall = true;
    grid[8][12].wall = true;
    grid[9][10].wall = true;
    grid[10][10].wall = true;
    grid[11][10].wall = true;
    grid[12][10].wall = true;
    grid[12][11].wall = true;
    grid[12][12].wall = true;
    grid[14][2].wall = true;
    grid[14][3].wall = true;
    grid[14][4].wall = true;
    grid[15][4].wall = true;
    grid[16][4].wall = true;
    grid[16][5].wall = true;
    grid[16][6].wall = true;
    grid[14][6].wall = true;
    grid[14][7].wall = true;
    grid[14][8].wall = true;
    grid[14][9].wall = true;
    grid[14][10].wall = true;
    grid[14][11].wall = true;
    grid[16][12].wall = true;
    grid[16][11].wall = true;
    grid[16][10].wall = true;
    grid[16][1].wall = true;
    grid[16][2].wall = true;
    grid[18][2].wall = true;
    grid[18][3].wall = true;
    grid[18][4].wall = true;
    grid[18][5].wall = true;
    grid[18][6].wall = true;
    grid[18][7].wall = true;
    grid[18][8].wall = true;
    grid[18][9].wall = true;
    grid[18][10].wall = true;
    grid[18][11].wall = true;
    grid[17][8].wall = true;
    grid[16][8].wall = true;
    for (let i = 0; i < cols / 2 + 1; i++) {
        for (let j = 0; j < rows; j++) {
            let temp = grid[j][i].wall;
            grid[j][26 - i].wall = temp;
        }
    }
    for (let i = 0; i < rows; i++) {
        grid[i][cols - 1].wall = true;
    }
    grid[10][26].wall = false;
    grid[10][26].score = false;
    for (let i = 9; i < 18; i++) {
        for (let j = 6; j < 13; j++) {
            grid[j][i].score = false;
        }
    }
    grid[3][1].power = true;
    grid[3][25].power = true;
    grid[15][1].power = true;
    grid[15][25].power = true;
    grid[15][13].score = false;
}
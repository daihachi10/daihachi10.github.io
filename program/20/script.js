document.addEventListener("dblclick", (e) => e.preventDefault(), {
  passive: false,
});

const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const holdCanvas = document.createElement("canvas"); // ホールド用キャンバス
const holdContext = holdCanvas.getContext("2d");
holdCanvas.width = 100;
holdCanvas.height = 100;
holdCanvas.style.position = "absolute";
holdCanvas.style.left = "10px";
holdCanvas.style.top = "30px";
holdCanvas.style.border = "1px solid #aaa";
document.body.appendChild(holdCanvas);

const gameConfig = {
  blockSize: 20,
  speed: 1000,
  backgroundColor: "#f8f8f8",
  gridColor: "#787878",
  lineWidth: 0.005,
  colors: [
    null,
    "#dc2171",
    "#ff708f",
    "#ffb5cf",
    "#a6c7ff",
    "#7397e6",
    "#3e69b3",
    "#003f83",
  ],
  dropInterval: 1000,
  restartButtonText: "Restart",
  gameOverText: "Game Over! Score: ",
};

context.scale(gameConfig.blockSize, gameConfig.blockSize);

const arena = createMatrix(12, 20);

const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0,
};

const restartButton = document.createElement("button");
restartButton.innerText = gameConfig.restartButtonText;
restartButton.style.display = "none";
restartButton.onclick = restartGame;
document.body.appendChild(restartButton);

function createMatrix(width, height) {
  const matrix = [];
  while (height--) {
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
}

function createPiece(type) {
  if (type === "T") {
    return [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
  } else if (type === "O") {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === "L") {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === "J") {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === "I") {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === "S") {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === "Z") {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}

function drawMatrix(matrix, offset, ctx = context, blockSize = 1) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = gameConfig.colors[value];
        ctx.fillRect(
          (x + offset.x) * blockSize,
          (y + offset.y) * blockSize,
          blockSize,
          blockSize
        );
      }
    });
  });
}

function drawGrid() {
  context.strokeStyle = gameConfig.gridColor;
  context.lineWidth = gameConfig.lineWidth;
  for (let x = 0; x < canvas.width / gameConfig.blockSize; x++) {
    for (let y = 0; y < canvas.height / gameConfig.blockSize; y++) {
      context.strokeRect(x, y, 1, 1);
    }
  }
}

let start = false;

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    // window.location.reload();
    // noLoop();
    start = false
  }
  if (event.key === "Enter") {
    gameStart();
    loop();

    start = true
  }
  if (event.key === "c" || event.key === "C") {
    holdCurrentPiece();
  }
});

function gameStart() {
  start = true;
  const elements = document.querySelectorAll(".startbutton");
  elements.forEach((element) => element.classList.add("started"));
}

// ====== ホールド機能 ======
let holdPiece = null;
let holdUsed = false;

function holdCurrentPiece() {
  if (holdUsed) return; // 1ターン1回しかホールドできない
  if (!holdPiece) {
    holdPiece = player.matrix;
    playerReset();
  } else {
    const temp = player.matrix;
    player.matrix = holdPiece;
    holdPiece = temp;
    player.pos.y = 0;
    player.pos.x =
      ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
    if (collide(arena, player)) {
      arena.forEach((row) => row.fill(0));
      player.score = 0;
    }
  }
  holdUsed = true;
  drawHold();
}

function drawHold() {
  holdContext.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
  if (holdPiece) {
    holdContext.scale(holdCanvas.width / 4, holdCanvas.height / 4);
    drawMatrix(holdPiece, { x: 0, y: 0 }, holdContext, 1);
    holdContext.setTransform(1, 0, 0, 1, 0, 0);
  }
}

// ====== ゲームループ関係 ======
function draw() {
  if (start) {
    context.fillStyle = gameConfig.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
    drawProjection();
    if (player.pos.y === 0 && collide(arena, player)) {
      context.fillStyle = "white";
      context.font = "1.5em Arial";
      context.fillText(`${gameConfig.gameOverText} ${player.score}`, 2, 10);
      restartButton.style.display = "block";
    }
  }
}



// document
//   .getElementById("holdButton")
//   .addEventListener("touchstart", holdCurrentPiece);

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
  }
  dropCounter = 0;
}

function playerDropInstant() {
  while (!collide(arena, player)) {
    player.pos.y++;
  }
  player.pos.y--;
  merge(arena, player);
  playerReset();
  arenaSweep();
  dropCounter = 0;
}

const piecesBag = [];
function fillPiecesBag() {
  const pieces = "ILJOTSZ".split("");
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  piecesBag.push(...pieces);
}

function playerReset() {
  if (piecesBag.length === 0) {
    fillPiecesBag();
  }
  player.matrix = createPiece(piecesBag.shift());
  player.pos.y = 0;
  player.pos.x =
    ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
  holdUsed = false;
  if (collide(arena, player)) {
    arena.forEach((row) => row.fill(0));
    player.score = 0;
  }
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) matrix.forEach((row) => row.reverse());
  else matrix.reverse();
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
  }
}

function drawProjection() {
  const projectionPos = { ...player.pos };
  while (!collide(arena, { ...player, pos: projectionPos })) {
    projectionPos.y++;
  }
  projectionPos.y--;
  context.fillStyle = "rgba(0, 0, 0, 0.3)";
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillRect(x + projectionPos.x, y + projectionPos.y, 1, 1);
      }
    });
  });
}

let dropCounter = 0;
let dropInterval = gameConfig.dropInterval;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  if (start) {
    dropCounter += deltaTime;
  }
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "a") {
    playerMove(-1);
  } else if (event.key === "ArrowRight" || event.key === "d") {
    playerMove(1);
  } else if (event.key === "ArrowDown" || event.key === "s") {
    playerDrop();
  } else if (event.key === " " || event.key === "　") {
    playerDropInstant();
  } else if (event.key === "ArrowUp" || event.key === "w") {
    playerRotate(1);
  }
});

function restartGame() {
  player.score = 0;
  restartButton.style.display = "none";
  arena.forEach((row) => row.fill(0));
  playerReset();
  update();
}

playerReset();
update();

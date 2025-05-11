let downKey = "ArrowDown";
let leftKey = "ArrowLeft";
let rightKey = "ArrowRight";
let upKey = "ArrowUp";
let holdKey = "c";
let hardDropKey = " ";
let gyakukaiten = "z";

let inDownKey = "ArrowDown";
let inLeftKey = "ArrowLeft";
let inRightKey = "ArrowRight";
let inUpKey = "ArrowUp";
let inHoldKey = "C";
let inHardDropKey = " ";
let inGyakukaiten = "z";
let isSaving = false;

document.addEventListener("dblclick", (e) => e.preventDefault(), {
  passive: false,
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (e.repeat) {
      window.location.reload();
    }
  }
});

if (localStorage.getItem("isSaving")) {
  const keySettings = JSON.parse(localStorage.getItem("keySettings"));
  downKey = keySettings[0];
  leftKey = keySettings[1];
  rightKey = keySettings[2];
  upKey = keySettings[3];
  holdKey = keySettings[4];
  hardDropKey = keySettings[5];
  gyakukaiten = keySettings[6];
}

function keyChange() {
  inUpKey = prompt(
    '"回転"に割り当てるキーを設定してください 1/6: \n キー:a-z,　矢印キー:例ArrowRight,　デフォルト空欄のまま'
  );
  inGyakukaiten = prompt(
    '"逆回転"に割り当てるキーを設定してください 1/6: \n キー:a-z,　矢印キー:例ArrowRight,　デフォルト空欄のまま'
  );
  inDownKey = prompt(
    '"↓"に割り当てるキーを設定してください 2/6: \n キー:a-z,　矢印キー:例ArrowRight,　デフォルト空欄のまま,'
  );
  inLeftKey = prompt(
    '"←"に割り当てるキーを設定してください 3/6: \n キー:a-z,　矢印キー:例ArrowRight,　デフォルト空欄のまま,'
  );
  inRightKey = prompt(
    '"→"に割り当てるキーを設定してください 4/6: \n キー:a-z,　矢印キー:例ArrowRight,　デフォルト空欄のまま,'
  );
  inHoldKey = prompt(
    '"ホールド"に割り当てるキーを設定してください 5/6: \n キー:a-z,　矢印キー:例ArrowRight,　デフォルト空欄のまま,'
  );
  inHardDropKey = prompt(
    '"ハードドロップ"に割り当てるキーを設定してください 6/6: \n キー:a-z,　矢印キー:例ArrowRight,　デフォルト空欄のまま,'
  );

  if (inUpKey !== "" || inUpKey !== null) {
    upKey = inUpKey;
  } else {
    upKey = "ArrowUp";
  }

  if (inGyakukaiten !== "" || inGyakukaiten !== null) {
    gyakukaiten = inGyakukaiten;
  } else {
    gyakukaiten = "z";
  }

  if (inDownKey !== "" || inDownKey !== null) {
    downKey = inDownKey;
  } else {
    downKey = "ArrowDown";
  }

  if (inLeftKey !== "" || inLeftKey !== null) {
    leftKey = inLeftKey;
  } else {
    leftKey = "ArrowLeft";
  }

  if (inRightKey !== "" || inRightKey !== null) {
    rightKey = inRightKey;
  } else {
    rightKey = "ArrowRight";
  }

  if (inHoldKey !== "" || inHoldKey !== null) {
    holdKey = inHoldKey;
  } else {
    holdKey = "c";
  }

  if (inHardDropKey !== "" || inHardDropKey !== null) {
    hardDropKey = inHardDropKey;
  } else {
    hardDropKey = " ";
  }

  isSaving = prompt("キー配置を保存しますか？y / n");
  if (isSaving == "y") {
    const keySettings = [
      downKey,
      leftKey,
      rightKey,
      upKey,
      holdKey,
      hardDropKey,
      gyakukaiten,
    ];
    localStorage.setItem("keySettings", JSON.stringify(keySettings));
    localStorage.setItem("isSaving", "true");
    alert("保存しました");
  } else {
    alert("保存されませんでした");
    localStorage.setItem("isSaving", "false");
  }

  alert(
    '"回転"に割り当てるキー: ' +
      upKey +
      "\n" +
      '"逆回転"に割り当てるキー: ' +
      gyakukaiten +
      "\n" +
      '"↓"に割り当てるキー: ' +
      downKey +
      "\n" +
      '"←"に割り当てるキー: ' +
      leftKey +
      "\n" +
      '"→"に割り当てるキー: ' +
      rightKey +
      "\n" +
      '"ホールド"に割り当てるキー: ' +
      holdKey +
      "\n" +
      '"ハードドロップ"に割り当てるキー: ' +
      hardDropKey +
      "　　空欄:スペースキー"
  );
}

function keyChangeReset() {
  downKey = "ArrowDown";
  leftKey = "ArrowLeft";
  rightKey = "ArrowRight";
  upKey = "ArrowUp";
  holdKey = "C";
  hardDropKey = " ";
  gyakukaiten = "z";
  localStorage.setItem("isSaving", "false");
  localStorage.removeItem("keySettings");

  alert("キー設定を初期化しました");
  alert(
    '"回転"に割り当てるキー: ' +
      upKey +
      "\n" +
      '"逆回転"に割り当てるキー: ' +
      gyakukaiten +
      "\n" +
      '"↓"に割り当てるキー: ' +
      downKey +
      "\n" +
      '"←"に割り当てるキー: ' +
      leftKey +
      "\n" +
      '"→"に割り当てるキー: ' +
      rightKey +
      "\n" +
      '"ホールド"に割り当てるキー: ' +
      holdKey +
      "\n" +
      '"ハードドロップ"に割り当てるキー: ' +
      hardDropKey +
      "　　空欄:スペースキー"
  );
}

const canvas = document.getElementById("TETR");
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
let reset = 0;
let key;

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    start = !start;
  }
  if (event.key === "Enter") {
    gameStart();
    loop();

    start = true;
  }
  if (event.key === holdKey) {
    holdCurrentPiece();
  }

  console.log(reset);

  if (event.key === "Escape" && reset == 10) {
    // window.location.reload();
  } else {
    key = event.key;
    reset = 0;
  }
});

function gameStart() {
  start = true;
  const elements = document.querySelectorAll(".startbutton");
  elements.forEach((element) => element.classList.add("started"));

  const elements2 = document.querySelectorAll(".keychangebutton");
  elements2.forEach((element) => element.classList.add("started"));

  const elements3 = document.querySelectorAll(".keychangeresetbutton");
  elements3.forEach((element) => element.classList.add("started"));
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
  if (start) {
    if (event.key === leftKey) {
      playerMove(-1);
    } else if (event.key === rightKey) {
      playerMove(1);
    } else if (event.key === downKey) {
      playerDrop();
    } else if (event.key === hardDropKey) {
      playerDropInstant();
    } else if (event.key === upKey) {
      playerRotate(1);
    } else if (event.key === gyakukaiten) {
      playerRotate(-1);
    }
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

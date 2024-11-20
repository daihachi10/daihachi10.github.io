// ダブルクリックを無効化する（モバイル操作時の誤作動防止）
document.addEventListener("dblclick", function (e) {
    e.preventDefault();
}, {
    passive: false
});

// キャンバスの設定とゲームの初期設定
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const gameConfig = {
    blockSize: 20, // 1ブロックのサイズ（ピクセル）
    speed: 1000, // ブロックの落下速度（ミリ秒）
    backgroundColor: 'rgb(40, 40, 40)', // 背景色
    gridColor: '#d6d6d6', // グリッドの線の色
    lineWidth: 0.1, // グリッドの線の太さ
    colors: [null, '#dc2171', '#ff708f', '#ffb5cf', '#a6c7ff', '#7397e6', '#3e69b3', '#003f83'], // ブロックの色
    dropInterval: 1000, // 自動落下の間隔
    restartButtonText: 'Restart', // リスタートボタンのテキスト
    gameOverText: 'Game Over! Score: ', // ゲームオーバー時のメッセージ
};

// キャンバスのスケールを設定
context.scale(gameConfig.blockSize, gameConfig.blockSize);

// ゲーム用の配列（アリーナ）を生成
const arena = createMatrix(12, 20);

// プレイヤーの初期データ
const player = {
    pos: { x: 0, y: 0 }, // プレイヤーの位置
    matrix: null, // 現在操作中のブロック
    score: 0, // スコア
};

// リスタートボタンの作成
const restartButton = document.createElement('button');
restartButton.innerText = gameConfig.restartButtonText;
restartButton.style.display = 'none'; // 初期状態では非表示
restartButton.onclick = restartGame; // ボタンがクリックされたときにゲームをリセット
document.body.appendChild(restartButton);

// 指定したサイズの2次元配列を作成
function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0)); // 初期値はすべて0
    }
    return matrix;
}

// 指定された形状のテトリスのブロックを生成
function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    } else if (type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

// 指定されたマトリックス（ブロック）を描画
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) { // 値が0でない部分だけ描画
                context.fillStyle = gameConfig.colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// グリッド（背景のマス目）を描画
function drawGrid() {
    context.strokeStyle = gameConfig.gridColor;
    context.lineWidth = gameConfig.lineWidth;
    for (let x = 0; x < canvas.width / gameConfig.blockSize; x++) {
        for (let y = 0; y < canvas.height / gameConfig.blockSize; y++) {
            context.strokeRect(x, y, 1, 1);
        }
    }
}

// ゲーム画面全体を描画
function draw() {
    context.fillStyle = gameConfig.backgroundColor; // 背景色を設定
    context.fillRect(0, 0, canvas.width, canvas.height); // 全体を塗りつぶす
    drawProjection();
    drawGrid(); // グリッドを描画
    drawMatrix(arena, { x: 0, y: 0 }); // アリーナを描画
    drawMatrix(player.matrix, player.pos); // プレイヤーのブロックを描画
    if (player.pos.y === 0 && collide(arena, player)) { // ゲームオーバー判定
        context.fillStyle = 'white';
        context.font = '1.5em Arial';
        context.fillText(`${gameConfig.gameOverText} ${player.score}`, 2, 10);
        restartButton.style.display = 'block'; // リスタートボタンを表示
    }
}

function drawProjection() {
    const projectionPos = { ...player.pos }; // プレイヤー位置をコピー
    while (!collide(arena, { ...player, pos: projectionPos })) {
        projectionPos.y++; // 衝突するまで落下位置を計算
    }
    projectionPos.y--; // 衝突位置の1つ上に調整

    // 半透明の白で補助線を描画
    context.fillStyle = 'rgba(255, 255, 255, 0.3)'; // 半透明の白
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillRect(
                    x + projectionPos.x,
                    y + projectionPos.y,
                    1,
                    1
                );
            }
        });
    });
}

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

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 |
        0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
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
            [matrix[x][y], matrix[y][x],] = [matrix[y][x], matrix[x][y],];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
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
let dropCounter = 0;
let dropInterval = gameConfig.dropInterval;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        playerMove(-1);
    } else if (event.key === 'ArrowRight') {
        playerMove(1);
    } else if (event.key === 'ArrowDown') {
        playerDrop();
    } else if (event.key === ' ') {
        playerDropInstant();
    } else if (event.key === 'ArrowUp') {
        playerRotate(1);
    }
});

function restartGame() {
    player.score = 0;
    restartButton.style.display = 'none';
    arena.forEach(row => row.fill(0));
    playerReset();
    update();
}
playerReset();
update();


document.getElementById('leftButton').addEventListener('touchstart', () => {
    playerMove(-1);
});

document.getElementById('rightButton').addEventListener('touchstart', () => {
    playerMove(1);
});

document.getElementById('rotateButton').addEventListener('touchstart', () => {
    playerRotate(1);
});

document.getElementById('dropButton').addEventListener('touchstart', () => {
    playerDrop();
});

document.getElementById('instantDropButton').addEventListener('touchstart', () => {
    playerDropInstant();
});

let timer = 0;
let x;
let y;
let ellipseSize;
let fps = 10; // デフォルト10
let speed = 0.001; // デフォルトは0.001
let size = 180; // 円の半径デフォルトは200
let backgroundResetCount = false; // デフォルトはfalse
let autoStart = false

let lastFps = fps;
let lastSpeed = speed;
let lastBackgroundResetCount = backgroundResetCount; // 前回の背景リセット状態を保持

function setup() {
  // URLのパラメーターを取得して初期値に適用
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  fps = parseInt(urlParams.get('fps')) || fps;
  speed = parseFloat(urlParams.get('katati')) || speed;

  // backgroundResetCountをtrue/falseで取得
  backgroundResetCount = urlParams.get('background') === 'true' ? true : false;
  autoStart = urlParams.get('autostart') === 'true' ? true : false;

  let canvasContainer = document.getElementById("p5-canvas-container");
  let canvas = createCanvas(400, 400);
  canvas.parent(canvasContainer); // コンテナにキャンバスを配置
  background("#fff"); // 固定の背景色
  if (autoStart == false) {
    noLoop();
  }
}

function programStart() {
  loop();
  reset();
}

function draw() {
  frameRate(fps);

  if (backgroundResetCount == true) {
    background("#fff"); // 固定の背景色
  }

  timer += speed;
  x = cos(timer * 200) * size + 200;
  y = sin(timer * 200) * size + 200;
  ellipseSize = 20;
  fill("white");
  stroke("black");
  noStroke();
  fill("#e0e0e0");
  ellipse(200, 200, 20);
  ellipse(x, y, ellipseSize);
  colorMode(HSB);
  stroke((2 * frameCount) % 360, 40, 100);
  colorMode(RGB);
  strokeWeight(5);
  fill("red");
  line(200, y, x, 200);
  fill("black");

  // fps, speed, backgroundResetCountが変更されたときにURLを更新
  if (fps !== lastFps || speed !== lastSpeed || backgroundResetCount !== lastBackgroundResetCount) {
    updateURLParams();
    lastFps = fps;
    lastSpeed = speed;
    lastBackgroundResetCount = backgroundResetCount; // 更新後のリセット状態を保持
  }
}

function updateURLParams() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // fps, speed, backgroundResetCountのパラメーターを更新
  urlParams.set('fps', fps);
  urlParams.set('katati', speed);
  urlParams.set('reset', backgroundResetCount); // リセット状態をtrue/falseで追加

  // URLを更新（履歴は変更しない）
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  history.replaceState(null, '', newUrl);
}

function reset() {
  background("#fff");
}

function speedUp() {
  if (fps == 60) {
    fps = 10;
  } else {
    fps += 5;
  }
}

function katatiUp() {
  speed += 0.001;
}

function katatiDown() {
  speed -= 0.001;
}

function backgroundReset() {
  backgroundResetCount = !backgroundResetCount; // リセット状態をトグル
}

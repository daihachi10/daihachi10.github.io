let timer = 0;
let x;
let y;
let ellipseSize;
let fps = 10; // デフォルト10
let speed = 0.001; // デフォルトは0.001
let size = 180; // 円の半径デフォルトは200
let backgroundResetCount = false; // デフォルトはfalse
let autoStart = false;
let fillColor = NaN;

let lastFps = fps;
let lastSpeed = speed;
let lastBackgroundResetCount = backgroundResetCount; // 前回の背景リセット状態を保持

function setup() {
  // URLのパラメーターを取得して初期値に適用
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  fps = parseInt(urlParams.get('f')) || getSavedValue('fps', fps);
  speed = parseFloat(urlParams.get('k')) || getSavedValue('speed', speed);
  // fillColor = urlParams.get('color') || fillColor;

  // backgroundResetCountをtrue/falseで取得
  backgroundResetCount = urlParams.get('b') === 'true' ? true : getSavedValue('backgroundResetCount', backgroundResetCount);
  autoStart = urlParams.get('a') === 'true' ? true : getSavedValue('autoStart', autoStart);

  let canvasContainer = document.getElementById("p5-canvas-container");
  let canvas = createCanvas(400, 400);
  canvas.parent(canvasContainer); // コンテナにキャンバスを配置
  background("#fff");

  if (!autoStart) {
    noLoop();
  }
  updateURLParams();
}

function programStart() {
  loop();
  reset();
}

function draw() {
  frameRate(fps);

  if (backgroundResetCount) {
    background("#fff");
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

  // fps, speed, backgroundResetCountが変更されたときにURLとlocalStorageを更新
  if (fps !== lastFps || speed !== lastSpeed || backgroundResetCount !== lastBackgroundResetCount) {
    updateURLParams();
    saveValue('fps', fps);
    saveValue('speed', speed);
    saveValue('backgroundResetCount', backgroundResetCount);
    lastFps = fps;
    lastSpeed = speed;
    lastBackgroundResetCount = backgroundResetCount; // 更新後のリセット状態を保持
  }
}

function updateURLParams() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // fps, speed, backgroundResetCountのパラメーターを更新
  urlParams.set('f', fps);
  urlParams.set('k', speed);
  urlParams.set('b', backgroundResetCount);
  urlParams.set('a', autoStart);

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
  background("#fff");
}

function katatiDown() {
  speed -= 0.001;
  background("#fff");
}

function backgroundReset() {
  backgroundResetCount = !backgroundResetCount; // リセット状態をトグル
}

// localStorageに値を保存する関数
function saveValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// localStorageから値を取得する関数
function getSavedValue(key, defaultValue) {
  const savedValue = localStorage.getItem(key);
  return savedValue ? JSON.parse(savedValue) : defaultValue;
}

function varReset() {
  background("#fff");
  backgroundResetCount = false; // デフォルトはfalse
  fps = 10; // デフォルト10
  speed = 0.001; // デフォルトは0.001
  autoStart = false;
}
let AA = 0;
let aa = 0;
let Aa = 0;
let result = null;

let maru = 0;
let shiwa = 0;

let hitotume = null;
let hutatume = null;
let random1 = [0, 0];
let kaisu = 0;

let isRun = true;

let outputResult = maru / shiwa;
let outputHeikin = outputResult.toFixed(2);

let textPos = [300, 150];

function setup() {
  let canvasContainer = document.getElementById("p5-canvas-container");
  let canvas = createCanvas(600, 300);
  canvas.parent(canvasContainer); // コンテナにキャンバスを配置
  frameRate(20000);
}

function draw() {
  background(255);

  if (isRun) {
    nakami();
  }

  textAlign(CENTER, CENTER);
  textSize(30);
  text(
    "回数:" +
      kaisu +
      "  丸:" +
      maru +
      "  しわ:" +
      shiwa +
      "\n" +
      "割合:" +
      outputHeikin +
      ":1",
    textPos[0],
    textPos[1]
  );

  text("AA:" + AA + "  Aa:" + Aa + "  aa:" + aa, textPos[0], textPos[1] + 50);
}

function output() {
  console.log(outputHeikin + ":" + 1);
}

function run(runKaisu) {
  AA = 0;
  aa = 0;
  Aa = 0;
  result = null;
  maru = 0;
  shiwa = 0;
  hitotume = null;
  hutatume = null;
  random1 = [0, 0];
  kaisu = 0;
  outputResult = maru / shiwa;
  outputHeikin = outputResult.toFixed(2);

  for (let i = 0; i < runKaisu; i++) {
    nakami();
  }
  console.log(
    "回数:" +
      kaisu +
      "  丸:" +
      maru +
      "  しわ:" +
      shiwa +
      "\n" +
      "割合:" +
      outputHeikin +
      ":1" +
      "\n" +
      "AA:" +
      AA +
      "  Aa:" +
      Aa +
      "  aa:" +
      aa
  );
}

function nakami() {
  random1 = [Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)];
  for (let i = 0; i < 2; i++) {
    if (random1[i] == 0) {
      random1[i] = "A";
    } else {
      random1[i] = "a";
    }
  }

  if (random1[0] == "A" && random1[1] == "A") {
    result = "AA";
    AA++;
    maru++;
  } else if (random1[0] == "A" && random1[1] == "a") {
    result = "Aa";
    Aa++;
    maru++;
  } else if (random1[0] == "a" && random1[1] == "A") {
    result = "Aa";
    Aa++;
    maru++;
  } else if (random1[0] == "a" && random1[1] == "a") {
    result = "aa";
    aa++;
    shiwa++;
  }
  kaisu++;

  outputResult = maru / shiwa;
  outputHeikin = outputResult.toFixed(2);
}

function stop() {
  isRun = false;
}

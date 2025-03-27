let x = 0; //左側の文字
let y = 0; //右側の文字
let answer = []; //ユーザーが入力した文字
let conversion = ""; //ユーザーが入力した文字を文字列に変換したもの
let correct = 0; //正解数
let time = 60; //制限時間
let mode = "+"; //計算のモード
let isModeRandom = true; //モードをランダムにするかどうか
let max = 20; //ランダムな数字の最大値
let ansewrHint = ""; //答え
let isStartClicked = false;

function setup() {
  noLoop();

  createCanvas(400, 200);
  textAlign(CENTER, CENTER);
  textFont("line");
  next();
}

function draw() {
  background(220);
  game();
  drawText();
}

function next() {
  //
  ansewrHint = "";
  x = Math.round(random(1, max));
  y = Math.round(random(1, max));

  if (isModeRandom) {
    mode = Math.round(random(0, 2));
    switch (mode) {
      case 0:
        mode = "+";
        break;
      case 1:
        mode = "-";
        break;
      case 2:
        mode = "*";
        break;
    }
  }
}

function drawText() {
  textAlign(CENTER, CENTER);
  textSize(50);
  switch (mode) {
    case "+":
      text(x + " + " + y, width / 2, 100);
      break;
    case "-":
      text(x + " - " + y, width / 2, 100);
      break;
    case "*":
      text(x + " × " + y, width / 2, 100);
      break;
  }
  textSize(28);
  text(conversion, width / 2, 100 + 50);
  textSize(20);
  text(ansewrHint, width / 2, 100 - 30);
  textSize(15);
  textAlign(LEFT, TOP);
  text("TIME: " + time.toFixed(3), 10, 10);
  text("正解数: " + correct, 10, 30);

  time -= 1 / 60;
}

function game() {
  conversion = "";
  for (let i = 0; i < answer.length; i++) {
    conversion += answer[i];
  }

  if (
    (conversion == x - y && mode == "-") ||
    (conversion == x + y && mode == "+") ||
    (conversion == x * y && mode == "*")
  ) {
    correct++;
    next();
    answer = [];
  }

  if (time <= 0) {
    noLoop();
    time = 0;
  }
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    answer.splice(0);
  } else {
    answer.push(key);
  }

  if (keyCode === ENTER) {
    answer.pop();

    switch (mode) {
      case "+":
        ansewrHint = x + y;
        break;
      case "-":
        ansewrHint = x - y;
        break;
      case "*":
        ansewrHint = x * y;
        break;
    }

    time -= 5;

    // answer = [];
    // next();
  }
}

function answerAdd(i) {
  console.log(i);
  if (i === "BACKSPACE") {
    answer.splice(0);
  } else {
    answer.push(i);
  }

  if (i === "ENTER") {
    answer.pop();

    switch (mode) {
      case "+":
        ansewrHint = x + y;
        break;
      case "-":
        ansewrHint = x - y;
        break;
      case "*":
        ansewrHint = x * y;
        break;
    }

    time -= 5;
  }

  i = "";
}

function changeMode(i) {
  mode = i;
  alert("モードを" + i + "に変更しました。");
}

function changeMax() {
  max = prompt("最大値を入力してください");
  alert("最大値を" + max + "に変更しました。");
}

function changeModeRandom() {
  switch (isModeRandom) {
    case true:
      isModeRandom = false;
      alert("モードを固定に変更しました。");
      break;

    case false:
      isModeRandom = true;
      alert("モードをランダムに変更しました。");
      break;
  }
}

function gameStart() {
  if (!isStartClicked) {
    textSize(30);
    textAlign(CENTER, CENTER);
    fill("#425bff");
    stroke("#fff");
    strokeWeight(20);
    text("ここを\nクリック\nしてください", 100, 100);
    noStroke();
    fill("#000");
  }
  setTimeout(function () {
    isStartClicked = true;
  }, 10);
}

function mouseClicked() {
  if (isStartClicked && 0 < mouseX < 200 && 0 < mouseY < 200) {
    loop();
    console.log(mouseX + "," + mouseY);
  }
}

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
function setup() {
  createCanvas(200, 200);
  next();
  textAlign(CENTER, CENTER);
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
    answer.pop();
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
    answer.pop();
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

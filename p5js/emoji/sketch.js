let x = 0;
let y = 60;
let i = 0;
let kaisu = 450;
let time = 0;
let start = false;

let items = [
  "😁",
  "😂",
  "😊",
  "🤣",
  "😍",
  "😒",
  "😘",
  "😎",
  "😉",
  "😢",
  "😜",
  "🥰",
  "🙂",
  "😚",
  "🫡",
  "🤨",
  "😐",
  "😑",
  "😶",
  "😥",
  "😣",
  "😏",
  "🙄",
  "😯",
  "😪",
  "😫",
  "🥱",
  "🫠",
  "😤",
  "🤑",
  "😨",
  "😭",
  "😰",
  "🤬",
];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight + 6900);
  console.log(items);
  console.log("文字の数=" + items.length);
  background("white");
  startBtn();
  title();
  console.log("ここには何も打たないでください。")
}

function draw() {
  if (start == true) {
    pass();
    omokusuru(true);
    bar();
  }
}

function mouseClicked() {
  if (
    start == false
  ) {
    background("white");
    start = true;
    title();
  }
}

function startBtn() {
  fill("#ADADAD");
  rect(width / 2 - 150, 60, 300, 100);
  fill("black");
  textSize(30);
  text("生成開始", width / 2 - 60, 120);
}

function title() {
  fill("black");
  textSize(23);
  text("絵文字生成機", window.innerWidth / 2 - 150, 31);
  textSize(20);
}

function pass() {
  fill("black");
  if (i < kaisu) {
    text(
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)] +
      items[Math.floor(Math.random() * items.length)],
      x,
      y
    );
  }
}

function omokusuru(torF) {
  if (torF == true) {
    if (i < kaisu) {
      for (let a = 0; a < 500; a++) {
        time++;
        console.log(time);
      }
      time = 0;
    }
  }
}

function bar() {
  if (i < kaisu) {
    fill("#FF0000"); // 赤色
    i++;
    y += 23;
  } else {
    fill("white");
  }
  noStroke();
  rect(0, 0, (i * width) / kaisu, 2);
}

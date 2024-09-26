/* var w = window.innerWidth;
var h = window.innerHeight;
var d = 60;
var n = 60;
var points = new Array(n);
function setup() {
  createCanvas(w, h);
  console.log("画面の横幅: " + windowWidth + "px");
  console.log("画面の縦幅: " + windowHeight + "px");
  background(0);//white
  stroke(30, 30, 50);
  for(i =0; i < n;i++){
    points[i] = [random(w), random(h), 1, random(-1, 1), random(-1, 1)];
  }
}

function draw(){
  background(0);
  for(i =0; i < n;i++){
    var x = points[i][0];
    var y = points[i][1];
    for(j=0;j < n;j++){
      if(i !== j){
        var distans = sqrt((x - points[j][0]) * (x - points[j][0]) + (y - points[j][1]) * (y - points[j][1]));
        if(distans < d){
          stroke(50);
          strokeWeight(0.2);
          line(x, y, points[j][0], points[j][1]);
          points[i][2]++;
        }
      }
    }
  }
  noStroke();
  fill(100);
  for(i =0; i < n;i++){
    ellipse(points[i][0], points[i][1], points[i][2] * 1.5);
    points[i][0] = (points[i][0] + points[i][3]) % w;
    points[i][1] = (points[i][1] + points[i][4]) % h; 
    points[i][2] = 1;
  }
}

*/

// exhibition settings
let drawDensity = 1;
let drawBowlLoopCount = 1;

// style parameters
let noiseScaleX = 0.1;
let noiseScaleY = 0.1;

let lineDensity = 1.0;
let dotDensity = 1.0;
let baseLineThickness = 1;
let baseLineLength = 6;


let mainHue = 0;

let curveTypes = []

// leaf settings
let leafCurveValue = 3;
let leafNoiseScale = 0.01;

// color settings
let nowHue = 0;
let nowSat = 0;
let nowBri = 0;
let nowAlpha = 0;

let bowls = [];

async function setup() {
  let paddingRatio = 0.1;
  createCanvas(windowWidth, windowHeight);
	describe("This artwork draws inspiration from potted succulent plants found on the streets. It integrates recursive algorithms to make the layout and uses easing functions to create the leaf shapes.");

  colorMode(HSB);
  pixelDensity(drawDensity);
  background(20);

  dotDensity = random(0.05, 0.3);
  lineDensity = random(0.4, 0.8);

  noiseScaleX = random(0.0001, 0.01);
  noiseScaleY = random(0.0001, 0.01);

  baseLineThickness = random(1, 6);
  baseLineLength = random(6, 12);

  mainHue = random(0, 360);

  curveTypes.push(easeOutSine);
  curveTypes.push(easeOutCubic);
  curveTypes.push(easeOutQuart);
  curveTypes.push(easeOutQuint);
  curveTypes.push(easeOutExpo);
  curveTypes.push(easeInOutSine);
  curveTypes.push(easeInOutBounce);
  curveTypes.push(easeOutBounce);
  curveTypes.push(easeOutElastic);
  curveTypes.push(easeInSine);
  curveTypes.push(easeOutBack);
	
  // draw bg with code
  let bgHueA = processHue(mainHue + random(-10, 10));
  let bgHueB = processHue(mainHue + random(-10, 10));
  let bgSatA = random(0, 20);
  let bgSatB = random(0, 20);
  let bgBriA = random(5, 25);
  let bgBriB = random(5, 25);

  if (random() < 0.5) {
    bgBriA = random(20, 40);
    bgBriB = random(20, 40);
  }
  let bgLineCount = height * lineDensity;

  // let bgDensity = 0.06;
  let lastDotDensity = dotDensity;
  // dotDensity = bgDensity;
  for (let y = 0; y < bgLineCount; y++) {
    let t = y / (bgLineCount - 1);
    let nowY = height * t;

    NYSetColorLerp(bgHueA, bgSatA, bgBriA, bgHueB, bgSatB, bgBriB, t);
    NYDotLine(0, nowY, width, nowY);

    if(y % 10 == 0)
    await sleep(1);
  }
  dotDensity = lastDotDensity;

  let xCount = floor(random(1, 3));
  let yCount = floor(random(1, 3));

  let padding = min(width, height) * paddingRatio;

  let rectWidth = (width - 2 * padding) / xCount;
  let rectHeight = (height - 2 * padding) / yCount;

  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {

      let startX = rectWidth * x + padding;
      let startY = rectHeight * y + padding;

      let plantX = startX + random(rectWidth * 0.2, rectWidth * 0.8);
      let plantY = startY + random(rectHeight * 0.2, rectHeight * 0.8);

      let plantSize = min(rectWidth, rectHeight) * random(0.3, 0.6);
      let leafWidth = plantSize * random(0.2, 0.8);

      let layers = floor(random(3, 12));
      let countPerLayer = floor(random(3, 24));

      let rects = SubdivideRect(startX, startY, rectWidth, rectHeight, 0);

      for (let r = 0; r < rects.length; r++) {
        let rectObj = rects[r];

        let bowlX = rectObj.x;
        let bowlY = rectObj.y;
        let bowlWidth = rectObj.w;
        let bowlHeight = rectObj.h;

        let newBowl = new PlantBowl(bowlX, bowlY, bowlWidth, bowlHeight);
        bowls.push(newBowl);
      }
    }
  }

  for (let i = 0; i < bowls.length; i++) {

    if (bowls[i].bowlType == 3) // empty bowl
      continue;

    if (bowls[i].bowlType <= 1) // rect
    {
      await bowls[i].drawBowlRect();
    }
    else if (bowls[i].bowlType == 2) // circle
    {
      await bowls[i].drawBowlRound();
    }

    await sleep(1);
  }

  // sort: small bowl draw first
  bowls.sort(function (a, b) {
    if (a.plantSize < b.plantSize)
      return -1;
    else if (a.plantSize > b.plantSize)
      return 1;
    else
      return 0;
  });

  for (let i = 0; i < bowls.length; i++) {
    if (bowls[i].bowlType == 3) // empty bowl
      continue;

    bowls[i].drawPlant();
    await sleep(1);
  }
}


function SubdivideRect(_x, _y, _width, _height, _depth) {

  let doSplit = random(0, 1) < 0.9;

  if (_depth == 0)
    doSplit = true;

  if (min(_width, _height) < 120) {
    doSplit = false;
  }

  if (doSplit) {
    let splitRatio = random(0.4, 0.6);

    // split X
    if (random() < 0.5) {
      let rectA_x = _x;
      let rectA_y = _y;
      let rectA_width = _width * splitRatio;
      let rectA_height = _height;

      let rectB_x = _x + _width * splitRatio;
      let rectB_y = _y;
      let rectB_width = _width * (1 - splitRatio);
      let rectB_height = _height;

      let rectA = SubdivideRect(rectA_x, rectA_y, rectA_width, rectA_height, _depth + 1);
      let rectB = SubdivideRect(rectB_x, rectB_y, rectB_width, rectB_height, _depth + 1);

      return rectA.concat(rectB);
    }
    // split Y
    else {
      let rectA_x = _x;
      let rectA_y = _y;
      let rectA_width = _width;
      let rectA_height = _height * splitRatio;

      let rectB_x = _x;
      let rectB_y = _y + _height * splitRatio;
      let rectB_width = _width;
      let rectB_height = _height * (1 - splitRatio);

      let rectA = SubdivideRect(rectA_x, rectA_y, rectA_width, rectA_height, _depth + 1);
      let rectB = SubdivideRect(rectB_x, rectB_y, rectB_width, rectB_height, _depth + 1);

      return rectA.concat(rectB);
    }
  }
  else {
    return [{ x: _x, y: _y, w: _width, h: _height, depth: _depth }];
  }
}

function draw() {

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function keyPressed(e) {
  if (e.key == 's') {
    saveCanvas(`succulent-${width}-${height}-${fxhash}.png`);
  }
}

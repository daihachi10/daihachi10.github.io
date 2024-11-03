function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    next();
    noStroke();
    angleMode(DEGREES);//半円作るのに使う
    frameRate(60);
    textFont("Noto Sans JP");
}

function preload() {
    sushiImage = loadImage('image/sushi.webp');
    sushi_karaImage = loadImage('image/sushi_kara.webp');
    barrage_arrowImage = loadImage('image/barrage_arrow.webp')
}

function draw() {
    background(255);

}

function start() {
    timers();           //残り◯秒
    backgrounds();      //背景
    sushi();            //寿司
    barrage_Meter();    //連打メーター
    gui();              //GUI
    odaihyouji();       //日本語・ローマ字表示
    oldHyouji();        //ローマ字打った履歴表示
    keyboard();         //入力判定
    sushiSet();         //真ん中の寿司
}
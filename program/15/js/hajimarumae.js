let tSushiX = 400;
let isStarted = false;
let tobiraX
function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    next();
    noStroke();
    angleMode(DEGREES);//半円作るのに使う
    frameRate(60);
    textFont("Noto Sans JP");
    textAlign(CENTER, CENTER);
}

function preload() {
    sushiImage = loadImage('image/sushi.webp');
    sushi_karaImage = loadImage('image/sushi_kara.webp');
    barrage_arrowImage = loadImage('image/barrage_arrow.webp');
}

function draw() {
    if (!isStarted) {
        title();
        varReset();//変数全てリセット

    } else {
        difficultySelect()

        // start();
    }

}

function title() {
    tobiraX1 = 0
    tobiraX2 = 400
    //背景の緑色のやつ
    fill("#b5bf65");
    rect(0, 20, 400);

    //寿司打のタイトルの文字
    textSize(70);
    fill("#000")
    text("寿司打", 200, 100);
    sushiImage.resize(0, 50);
    sushi_karaImage.resize(0, 50);

    //寿司のレーン
    fill("#efbf6b");
    rect(0, 158, 400, 45);

    //寿司のレーンの影
    fill("#e49f36");
    rect(0, 203, 400, 14);

    //寿司のレーンの下
    fill("#d69e4f");
    rect(0, 217, 400, 70);

    //バージョン
    fill("#000");
    textSize(13);
    text("P5JS版", 350, 260);
    textSize(8);
    text("2.5", 380, 262)


    //後ろで流れてる寿司
    for (let n = 0; n < 100; n++) {
        image(sushiImage, tSushiX + n * -130, 150);
    }
    tSushiX++;

    //周りの枠
    gridLine();
    //スタートボタン
    button();


}



function button() {
    //スタート形
    fill(255, 255, 255, 200);
    stroke("#93660a");
    strokeWeight(5);
    rect(150 - 15, 160, 130, 30, 5);
    noStroke();
    //スタート文字
    fill("#b34749");
    textSize(20);
    text("スタート", 200, 175);

}
//ESCキーでタイトルに戻る
function keyPressed() {
    if (keyCode === 27) {
        isStarted = false;

    }
}

//スタート当たり判定
function mouseClicked() {
    if (mouseX > 135 && mouseX < 130 + 135 && mouseY > 160 && mouseY < 190) {
        isStarted = true;
    }
}

function difficultySelect() {
    gridLine();

    //閉まるアニメーション
    if (tobiraX < 200) { tobiraX += 15; };
    fill("#f7a152");
    rect(5, 40, tobiraX, 270); //tobiraX
    rect(400, 40, -tobiraX, 270);
    if (tobiraX > 200) {

        //説明テキスト
        fill("#000");
        textSize(15);
        text("難易度を決めた後、コースを選んでください。", 200, 20);

        //難易度
        fill(255, 255, 255, 200);
        rect(30, 60, 330, 25, 5);

        fill(0, 0, 0, 50);
        text("練習", 60, 72,);

        //選択
        stroke("#ce0000");
        strokeWeight(3);
        fill("#fff");
        rect(80, 60, 50, 25, 5);
        noStroke();

        //これだけ黒
        fill(0, 0, 0);
        text("普通", 105, 72);

        fill(0, 0, 0, 50);
        text("正確重視", 169, 72);
        text("速度必須", 245, 72);
        text("一発勝負", 320, 72);


        //コース選択
        stroke("#9c7348");
        strokeWeight(4);

        for (let n = 0; n < 3; n++) {
            if (n == 1) { stroke(156, 115, 72); } else { stroke(156, 115, 72, 200) }
            if (n == 1) { fill(254, 226, 204) } else { fill(254, 226, 204, 120) }
            rect(50, 100 + n * 55, 300, 45, 5);
        }
        noStroke();
        textAlign(LEFT, CENTER);


        textSize(14);
        fill(255, 162, 22, 120);
        text("お手軽", 80, 114);

        fill(0, 0, 0, 120);
        text("3,000円コース", 80, 130);

        fill(65, 60, 62, 120);
        textSize(12);
        text("文字数　　：2~7文字", 190, 114);
        text("制限時間　：60秒", 190, 130);


        textSize(14);
        fill("#4f92b1")
        text("お勧め", 80, 114 + 55);

        fill("#000")
        text("5,000円コース", 80, 130 + 55);

        fill("#413c3e");
        textSize(12);
        text("文字数　　：5~10文字", 190, 114 + 55);
        text("制限時間　：90秒", 190, 130 + 55);


        textSize(14);
        fill(168, 37, 32, 120)
        text("高級", 80, 114 + 110);

        fill(0, 0, 0, 120)
        text("10,000円コース", 80, 130 + 110);

        fill(65, 60, 62, 120);
        textSize(12);
        text("文字数　　：9~14文字以上", 190, 114 + 110);
        text("制限時間　：120秒", 190, 130 + 110);

        textAlign(CENTER, CENTER);
    }
}



function start() {
    timers();           //残り◯秒
    backgrounds();      //背景
    sushi();            //寿司
    gridLine()          //枠線
    barrage_Meter();    //連打メーター
    gui();              //GUI
    odaihyouji();       //日本語・ローマ字表示
    oldHyouji();        //ローマ字打った履歴表示
    keyboard();         //入力判定
    sushiSet();         //真ん中の寿司
}





function varReset() {
    tobiraX = 0//閉まるアニメーション
    imanoyatu = 0;
    i = 0;
    romajiIndex = 0;

    //timers
    countUpTimer = 0;
    countDownTimer;
    time = 90;

    //流れる寿司
    sushiX = -103;
    sushiY = 0;
    sushiSpeed = 1;
    sushiKasokudo = 0.03;

    //score
    score = 0;

    //皿の数
    sara = 0;
    juunokuraiSara = 0;

    //次のに行ったら遅延
    tien = 0;

    //連打メーター
    barrrage = 0;
    barrrageSpeed = 1.35;
    barrrageX = 0;


    //追加カウント
    isAdd1Sec1 = false;
    isAdd1Sec2 = false;
    isAdd2Sec = false;
    isAdd3Sec = false;

    //連打メーター表示されたかどうか
    isShowAdd1Sec1 = false;
    isShowAdd1Sec2 = false;
    isShowAdd2Sec = false;
    isShowAdd3Sec = false;

    //連打メーター表示されたかどうかの時間
    defaultShowBarrageTime = 50;
    showBarrageTime = defaultShowBarrageTime;
}
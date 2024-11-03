function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置
    next();
    noStroke();
    angleMode(DEGREES);//半円作るのに使う
    frameRate(60);
    textFont("Yuji Mai");
    // textFont("Noto Sans JP");
    textAlign(CENTER, CENTER);
    varReset();
}

function preload() {
    sushiImage = loadImage('image/sushi.webp');
    sushi_karaImage = loadImage('image/sushi_kara.webp');
    barrage_arrowImage = loadImage('image/barrage_arrow.webp');
    attentionImage = loadImage('image/attention.webp');
    sushiImageSmall = loadImage('image/sushi_small.webp');
    sushi_karaImageSmall = loadImage('image/sushi_kara_small.webp');

}

function draw() {
    if (now == "title") { title(); }
    else if (now == "difficultyselect") { difficultySelect(); }
    else if (now == "standby") { standby(); }
    else if (now == "start") { start(); }
    console.log(now);
}

//ESCキー、ENTERキーが押されたとき
function keyPressed() {
    if (now == "start" && keyCode === 27) { now = "standby"; varReset(); }//プレイ中にESCキーでスタンバイに戻る
    if (keyCode === 32 || keyCode === 13 && now == "standby") { start(); now = "start" }
}

//ボタン当たり判定
function mouseClicked() {
    if (now == "title" && mouseX > 135 && mouseX < 130 + 135 && mouseY > 160 && mouseY < 190) { now = "difficultyselect"; }                   //タイトル画面でスタートが押されたら難易度選択画面に行く

    else if (now == "difficultyselect") {                                                                                                     //難易度を選択画面で
        if (mouseX > 260 && mouseX < 350 && mouseY > 270 && mouseY < 290) { now = "title" };                                                  //タイトルに戻るが押されたらタイトルに戻る
        if (mouseX > 50 && mouseX < 350 && mouseY > 155 && mouseY < 200) { now = "standby"; difficulty = "お勧め" }                           //お勧めが押されたらスタンバイ画面に行く

    } else if (now == "standby" && mouseX > 260 && mouseX < 350 && mouseY > 270 && mouseY < 290) { now = "title" };                           //スタンバイ画面でタイトルに戻るが押されたらタイトルに戻る
}

//タイトル画面
function title() {
    now = "title";
    tobiraX = 0

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
    for (let n = 0; n < 100; n++) { image(sushiImage, tSushiX + n * -130, 150); }
    tSushiX++;

    //周りの枠
    gridLine();

    //スタートボタン
    //形
    fill(255, 255, 255, 200);
    stroke("#93660a");
    strokeWeight(5);
    rect(150 - 15, 160, 130, 30, 5);
    noStroke();
    //文字
    fill("#b34749");
    textSize(20);
    text("スタート", 200, 175);


}

//難易度選択画面
function difficultySelect() {
    now = "difficultyselect";
    gridLine();
    //閉まるアニメーション
    // tobiraX = 400
    if (tobiraX < 200) { tobiraX += 20; };
    fill("#f7a152");
    rect(5, 40, tobiraX, 270); //tobiraX
    rect(400, 40, -tobiraX, 270);
    if (tobiraX > 180) {
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

        //タイトルに戻るボタン
        fill("#fff");
        stroke("#9a6400");
        rect(260, 270, 90, 20, 5);
        noStroke();
        fill("#000");
        textSize(11);
        text("タイトルに戻る", 266, 280);
        textAlign(CENTER, CENTER);

        //寿司
        sushiImageSmall.resize(0, 25);
        sushi_karaImageSmall.resize(0, 20);
        for (let n = 0; n < 3; n++) {
            if (n == 1) { image(sushiImageSmall, 17, 110 + 55 * n); } else { image(sushi_karaImageSmall, 20, 110 + 55 * n); }
        }
    }
}

//スタンバイ画面
function standby() {
    now = "standby";
    gridLine();
    fill("#f7a152");
    rect(5, 40, tobiraX, 270); //tobiraX
    rect(400, 40, -tobiraX, 270);
    fill("#343434");
    rect(30, 50, 330, 30, 9);

    //上の黒いの
    textAlign(LEFT, TOP);
    textSize(18);
    fill("#4f92b1");
    text(difficulty, 50, 55);
    fill("#fff");
    if (difficulty == "お勧め") { text("5,000円コース", 120, 55); };
    if (course == "普通") { fill("#ffcf00"); text("【普通】", 260, 55); };
    textAlign(CENTER, CENTER);

    //注意書き
    fill("#fff");
    ellipse(30 + 12.5, 107 + 12.5, 20, 20)
    attentionImage.resize(0, 25);
    image(attentionImage, 30, 107);

    fill("#000");
    textSize(17);
    text("タイピング中はキーボードを使います", 200, 120);

    fill("#a40402");
    text("【スペースかEnterキーを押すとスタートします】", 200, 160);

    fill("#000");
    textSize(10);
    text("※ゲーム中や結果画面では、「ESCキー」を押すと\nすぐにタイピングをやり直す事ができます。", 200, 220);

    //タイトルに戻るボタン
    textAlign(LEFT, CENTER);
    fill("#fff");
    stroke("#9a6400");
    rect(260, 270, 90, 20, 5);
    noStroke();
    fill("#000");
    textSize(11);
    text("タイトルに戻る", 266, 280);
    textAlign(CENTER, CENTER);
}

//ゲーム処理
function start() {
    now = "start";
    // isStarted = true;
    timers();                   //残り◯秒
    backgrounds();              //背景
    sushi();                    //寿司
    gridLine()                  //枠線
    barrage_Meter();            //連打メーター
    gui();                      //GUI
    textFont("Noto Sans JP");   //フォントを読みやすいのに変更
    odaihyouji();               //日本語・ローマ字表示
    oldHyouji();                //ローマ字打った履歴表示
    textFont("Yuji Mai");       //フォントを寿司打っぽく変更
    keyboard();                 //入力判定
    sushiSet();                 //真ん中の寿司
}

//変数リセット
function varReset() {
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
    // sushiSpeed = 1;
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
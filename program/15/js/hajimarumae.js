function setup() {
    let canvasContainer = document.getElementById("p5-canvas-container");
    let canvas = createCanvas(400, 300);
    canvas.parent(canvasContainer); // コンテナにキャンバスを配置

    // createCanvas(400, 300);
    next();
    noStroke();
    angleMode(DEGREES);//半円作るのに使う

    textAlign(CENTER, CENTER);
    varReset();

    sushiImage.resize(0, 50);
    sushi_karaImage.resize(0, 50);
    sushiImageSmall.resize(0, 25);
    sushi_karaImageSmall.resize(0, 20);
    attentionImage.resize(0, 25);
    settingsImage.resize(0, 20);
    settingsImageSmall.resize(0, 13);
    checkImage.resize(0, 20);
    check_boxImage.resize(0, 20);

    //fps測定
    lastTime = millis();  // プログラム開始時の時間を保存
}

function preload() {
    sushiImage = loadImage('image/sushi.webp');
    sushi_karaImage = loadImage('image/sushi_kara.webp');
    barrage_arrowImage = loadImage('image/barrage_arrow.webp');
    attentionImage = loadImage('image/attention.webp');
    sushiImageSmall = loadImage('image/sushi_small.webp');
    sushi_karaImageSmall = loadImage('image/sushi_kara_small.webp');
    settingsImage = loadImage('image/settings.webp');
    settingsImageSmall = loadImage('image/settings_small.webp');
    check_boxImage = loadImage('image/check_box.webp')
    checkImage = loadImage('image/check_box_checked.webp');


    keySounds1 = loadSound('sounds/key1.mp3');
    keySounds2 = loadSound('sounds/key2.mp3');
    keySounds3 = loadSound('sounds/key3.mp3');

    startSounds = loadSound('sounds/start.wav');
    stopSounds = loadSound('sounds/stop.wav');

    result1Sounds = loadSound('sounds/result1.wav');
    result2Sounds = loadSound('sounds/result2.wav');
}

function draw() {

    if (now == "title" || isShowSetting) { title(); }
    else if (now == "difficultyselect" || isShowSetting) { difficultySelect(); }
    else if (now == "standby" || isShowSetting) { standby(); }
    else if (now == "start" || isShowSetting) { start(); }
    if (isShowSetting) { settings(); }

    if (isChangeFont) { textFont("Noto Sans JP"); } else { textFont("Zen Old Mincho"); }
    fpsCount();
}

//ESCキー、ENTERキーが押されたとき
function keyPressed() {
    if (now == "start" && keyCode === 27) { now = "standby"; varReset(); }//プレイ中にESCキーでスタンバイに戻る
    if (keyCode === 32 && now == "standby" || keyCode === 13 && now == "standby") { varReset(); start(); now = "start"; if (isSoundEffect) { startSounds.play(); } }
}

//ボタン当たり判定
function mouseClicked() {
    console.log("mouseClicked X: " + mouseX + "Y: " + mouseY);
    if (now == "title" && mouseX > 135 && mouseX < 130 + 135 && mouseY > 160 && mouseY < 190) { now = "difficultyselect"; }                   //タイトル画面でスタートが押されたら難易度選択画面に行く

    else if (now == "difficultyselect") {                                                                                                     //難易度を選択画面で
        if (mouseX > 260 && mouseX < 350 && mouseY > 270 && mouseY < 290) { now = "title" };                                                  //タイトルに戻るが押されたらタイトルに戻る
        if (mouseX > 50 && mouseX < 350 && mouseY > 155 && mouseY < 200) { now = "standby"; difficulty = "お勧め" }                           //お勧めが押されたらスタンバイ画面に行く

    } else if (now == "standby" && mouseX > 260 && mouseX < 350 && mouseY > 270 && mouseY < 290) { now = "title" };                           //スタンバイ画面でタイトルに戻るが押されたらタイトルに戻る

    //設定
    if (!isShowSetting && now == "title" && mouseX > 150 && mouseX < 250 && mouseY > 220 && mouseY < 245) { isShowSetting = true }            //タイトル画面で設定を表示ボタンを押した
    if (isShowSetting && mouseX > 120 && mouseX < 260 && mouseY > 240 && mouseY < 270) { isShowSetting = false }                               //設定画面で閉じるボタンが押された
    if (!isShowSetting && now == "standby" && mouseX > 27 && mouseY > 268 && mouseX < 120 && mouseY < 290) { isShowSetting = true }
    //27,268 120,290
    //設定項目
    if (isShowSetting && mouseX > 120 && mouseY > 68 - 10 && mouseX < 270 + 30 && mouseY < 85 - 10) { if (isChangeFont) { isChangeFont = false; } else { isChangeFont = true; } }          //フォントを変更する
    if (isShowSetting && mouseX > 120 && mouseY > 103 - 10 && mouseX < 230 + 30 && mouseY < 103 + 17 - 10) { if (isRomajiShow) { isRomajiShow = false; } else { isRomajiShow = true; } }   //ローマ字表示を切り替える
    if (isShowSetting && mouseX > 120 && mouseY > 128 && mouseX < 230 + 30 && mouseY < 138) { if (isType) { isType = false; } else { isType = true; } }                                    //タイプ音
    if (isShowSetting && mouseX > 120 && mouseY > 163 && mouseX < 200 + 30 && mouseY < 163 + 17) { if (isBgm) { isBgm = false; } else { isBgm = true; } }                        //BGM
    if (isShowSetting && mouseX > 120 && mouseY > 196 && mouseX < 200 + 30 && mouseY < 196 + 17) { if (isSoundEffect) { isSoundEffect = false; } else { isSoundEffect = true; } }//効果音
}

//タイトル画面
function title() {
    now = "title";
    tobiraX = 0

    //背景の緑色のやつ
    fill("#b5bf65");
    rect(0, 20, 400);

    //寿司打のタイトルの文字
    textSize(100);
    fill("#000")
    textFont("Yuji Mai");
    text("寿司打", 200, 100);
    if (isChangeFont) { textFont("Noto Sans JP"); } else { textFont("Zen Old Mincho"); }

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

    //設定ボタン
    fill(255, 255, 255, 200);
    stroke("#93660a");
    strokeWeight(4);
    rect(150, 220, 100, 25, 5);
    noStroke();
    fill("#667938");
    textSize(15);
    image(settingsImage, 160, 222);
    text("設定", 200, 232);
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
    rect(5, 40, 400, 270);
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
    fill(255, 255, 255, 200);

    stroke("#9a6400");
    rect(260, 270, 90, 20, 5);
    noStroke();
    fill("#000");
    textSize(11);
    text("タイトルに戻る", 266, 280);
    textAlign(CENTER, CENTER);
    tobiraX = 0

    //設定ボタン
    fill(255, 255, 255, 200);
    stroke("#93660a");
    strokeWeight(4);
    rect(30, 270, 90, 20, 5);
    noStroke();
    fill("#667938");
    image(settingsImageSmall, 40, 274);
    text("設定", 80, 280);
}

//設定画面
function settings() {
    //背景
    fill("#000");
    rect(20, 10, 360, 280, 3);

    //タイピングの設定文字
    fill("#607531");
    textAlign(CENTER, CENTER);


    image(settingsImage, 105, 21);
    text("タイピングの設定", 210, 30);

    //詳細設定
    fill("#fff");
    textSize(13);
    textFont("Noto Sans JP");
    textAlign(LEFT, TOP);

    //チェックボックス

    if (isChangeFont) { image(checkImage, 120, 67 - 10); } else { image(check_boxImage, 120, 67 - 10); };
    if (isRomajiShow) { image(checkImage, 120, 67 + 35 - 10); } else { image(check_boxImage, 120, 67 + 35 - 10); }
    if (isType) { image(checkImage, 120, 160 - 35); } else { image(check_boxImage, 120, 160 - 35); };
    if (isBgm) { image(checkImage, 120, 160); } else { image(check_boxImage, 120, 160); };
    if (isSoundEffect) { image(checkImage, 120, 160 + 35); } else { image(check_boxImage, 120, 160 + 35); };

    //詳細設定文字
    text("フォントを変更する", 150, 70 - 10);
    text("ローマ字表示", 150, 104 - 10);
    text("♪タイプ音", 150, 163 - 35);
    text("♪BGM", 150, 163);
    text("♪効果音", 150, 199);

    //閉じるボタン
    fill("#7a7a7a");
    rect(120, 240, 140, 30, 4);
    fill("000");
    text("✕ 閉じる", 163, 248);
    textAlign(CENTER, CENTER);
    if (isChangeFont) { textFont("Noto Sans JP"); } else { textFont("Zen Old Mincho"); }
}

//ゲーム処理
function start() {
    now = "start";
    timers();                   //残り◯秒
    backgrounds();              //背景
    sushi();                    //寿司
    gridLine()                  //枠線
    barrage_Meter();            //連打メーター
    gui();                      //GUI
    textFont("Noto Sans JP");   //フォントを読みやすいのに変更
    // textFont("Montserrat");
    odaihyouji();               //日本語・ローマ字表示
    oldHyouji();                //ローマ字打った履歴表示
    if (isChangeFont) { textFont("Noto Sans JP"); } else { textFont("Zen Old Mincho"); }
    keyboard();                 //入力判定
    sushiSet();                 //真ん中の寿司
    gameOverProcessing();       //ゲームオーバー処理
}

//変数リセット
function varReset() {
    tSushiX = 400;                              //タイトル画面の寿司
    tobiraX = 0                                 //画面が変わるときの扉
    // now = "title"                               //今なんの画面か

    course = "普通"                             //難易度
    difficulty = "お勧め"                       //コース

    imanoyatu = 0;                              //今ローマ字どれくらい打ったか
    keys;                                       //次に打たないといけないキー
    i = 0;                                      //打った数
    romajiIndex = 0;                            //ローマ字の中央寄せするときに使う

    //ゲームオーバー
    isOdaiShow = true;                          //ゲームオーバーの終了の文字を表示するときにfalseになる
    gameOverTien = 30;                          //終了の文字がでてから扉が閉じるまでの遅延
    gameOverResultTien = 0;                     //白い背景がでてから結果が出るまでの遅延
    isTimeShow = true;                          //ゲームオーバーの扉が閉まるとfalseになる
    isStopSounds = false
    isResult1Sounds = false
    isResult2Sounds = false
    isResult3Sounds = false

    //images
    sushiImage;                                 //寿司の画像
    sushi_karaImage;                            //寿司の空の画像
    sushiImageSmall;                            //寿司の難易度選択で使う画像
    sushi_karaImageSmall;                       //寿司の空の難易度選択で使う画像
    barrage_arrowImage;                         //連打バーの矢印の画像
    settingsImage;                              //設定の画像
    check_boxImage;                             //チェックボックスだけの画像
    checkImage;                                 //チェックの画像

    //timers
    countUpTimer = 0;                           //カウントアップタイマー
    countDownTimer;                             //カウントダウンタイマー
    time = 90;                                  //残りの時間設定

    //流れる寿司
    sushiX = -103;                              //X
    sushiY = 0;                                 //Y
    sushiSpeed = 1;                             //基本のスピード
    sushiKasokudo = 0.03;                       //1つ終わる事にどれくらい加速するか

    score = 0;                                  //score
    nedan = 0;                                  //nedan
    //皿
    kekka = 0;                                  //払った値段を引いた値段
    sara = 0;                                   //皿の数
    juunokuraiSara = 0;                         //十の位の皿の数

    tien = 0;                                   //次のに行ったら遅延

    //連打メーター
    barrrage = 0;                               //連打の数
    barrrageSpeed = 1.35;                       //連打する事の数
    barrrageX = 0;                              //連打のバーの数

    //追加カウント
    isAdd1Sec1 = false;                         //1秒1回目
    isAdd1Sec2 = false;                         //1秒2回目
    isAdd2Sec = false;                          //2秒
    isAdd3Sec = false;                          //3秒

    //連打メーター表示されたかどうか
    isShowAdd1Sec1 = false;                     //1秒1回目
    isShowAdd1Sec2 = false;                     //1秒2回目
    isShowAdd2Sec = false;                      //2秒
    isShowAdd3Sec = false;                      //3秒

    //連打メーター表示されたかどうかの時間
    defaultShowBarrageTime = 80;                //基準
    showBarrageTime = defaultShowBarrageTime;   //最初にリセット

}

//FPS測定
function fpsCount() {
    // 時間差を計算
    let currentTime = millis();
    let deltaTime = currentTime - lastTime;

    // FPSを計算（1000ミリ秒 / 経過したミリ秒）
    fps = 1000 / deltaTime;

    // FPSの合計とフレーム数を更新
    fpsTotal += fps;
    frameCount++;

    // 平均FPSを計算
    averageFps = fpsTotal / frameCount;

    // 次のフレームに備えて時間を更新
    lastTime = currentTime;


    // if (fps > 55) {
    // fill("#000");
        
    // } else (fps > 52) {
    // fill("#ffd000");
        
    // } else {
    // fill("#ff0000");
        
    // } 
    fill("#000")
    
    textSize(12)
    text("FPS:" + fps.toFixed(1), 372, 7);
    fill("#000")
}


//次のものをランダムで決める
function next() {
    imanoyatu = Math.floor(random(0, odai.length));
    i = 0;
}

//お題を表示する
function odaihyouji() {
    if (isOdaiShow) {
        fill("#fff");
        text(odai[imanoyatu], 200, 135);
        textSize(13);
        if (romaji[imanoyatu].length > 20) {
            romajiIndex = 4.34;
        } else if (romaji[imanoyatu].length > 15) {
            romajiIndex = 7;
        } else if (romaji[imanoyatu].length > 13) {
            romajiIndex = 8
        } else if (romaji[imanoyatu].length > 10) {
            romajiIndex = 12;
        } else if (romaji[imanoyatu].length > 8) {
            romajiIndex = 15;
        } else if (romaji[imanoyatu].length > 7) {
            romajiIndex = 20;
        } else if (romaji[imanoyatu].length > 5) {
            romajiIndex = 25;
        } else if (romaji[imanoyatu].length == 4) {
            romajiIndex = 46;
        } else if (romaji[imanoyatu].length == 3) {
            romajiIndex = 63;
        } else if (romaji[imanoyatu].length == 2) {
            romajiIndex = 98;
        }
        if (isRomajiShow) {             //設定でローマ字を非表示にできるように
            for (let n = 0; n < romaji[imanoyatu].length; n += 1) {
                text(romaji[imanoyatu][n], romaji[imanoyatu].length * romajiIndex + 10 * n, 160);
            }
        }

    }
}

//入力した文字を灰色にする処理
function oldHyouji() {
    if (isOdaiShow) {
        fill("#828282");
        for (let n = 0; n < i; n += 1) {
            text(romaji[imanoyatu][n], romaji[imanoyatu].length * romajiIndex + 10 * n, 160);
        }
    }
}

//GUI
function gui() {


    //残り時間
    fill("#000");
    textSize(20);
    if (isTimeShow) { if (countUpTimer < time) { text("残り" + countDownTimer + "秒", 60, 20); } else { text("残り0秒", 60, 20); } } //終了したらマイナスではなく0と表示
    if (isOdaiShow) {
        stroke("#fff");
        strokeWeight(3);

        //中央の文字の下の黒い四角
        fill(0, 0, 0, 200);
        rect(50, 110, 300, 70, 7);
        noStroke();
    }

    if (isTimeShow) {
        //連打メーター
        textSize(11);
        text("連打メーター", 180, 10);
        fill("#4c4034");
        rect(160, 17, 217, 3);

        //連打メーター棒
        fill("#fff489");
        rect(160, 17, barrrage_X, 3);

        //連打メーター矢印    
        barrage_arrowImage.resize(0, 10);
        for (let n = 0; n < 3; n++) {
            image(barrage_arrowImage, 202 + n * 50, 20);
        }

        //連打メーター秒数
        image(barrage_arrowImage, 202 + 166, 20);
        for (let n = 0; n < 2; n++) {
            fill("#d73019");
            textSize(8.5);
            text("1秒追加", 185 + n * 50, 29);
        }
        text("2秒追加", 284, 29);
        text("3秒追加", 350, 29);
    }

    //連打メーターの秒数追加
    barrageMeterTimeShows();


    //スコア
    fill("#000");
    textSize(15);
    text("スコア", 30, 285);

    //-------スコアのお皿-------
    fill("#fff");
    ellipse(70, 286, 28, 28);
    stroke(72, 54, 9, 100);
    strokeWeight(2.6);
    ellipse(70, 286, 20, 20);

    //-------スコアの数字-------
    noStroke();
    fill("#000");
    textSize(13);
    text("¥240", 70, 285);
    if (score < 10) {
        text("×" + "0" + score, 100, 285);
    } else {
        text("×" + score, 100, 285);
    }

    //10づつのお皿の数のもの
    if (score >= 11) {

        //-------形-------
        fill("#fff");
        rect(8, 185, 46, 25, 5);
        fill("#cbcccb");
        arc(30, 214, 20, 20, 180, 360);
        stroke("#cbcccb");
        strokeWeight(2);
        line(30, 214, 30, 235);
        noStroke();
        ellipse(30, 235, 30, 5);
        //----------------

        //お皿の数
        fill("#000");
        textSize(15);

        // text(Math.round(score / 10) * 10 + "皿", 30, 197);
        if (score <= 20) {
            text("10" + "皿", 30, 197);
        } else if (score <= 30) {
            text("20" + "皿", 30, 197);
        } else if (score <= 40) {
            text("30" + "皿", 30, 197);
        } else if (score <= 50) {
            text("40" + "皿", 30, 197);
        } else if (score <= 60) {
            text("50" + "皿", 30, 197);
        } else if (score <= 70) {
            text("60" + "皿", 30, 197);
        } else {
            text("70以上", 30, 197);
        }
    }
}

//流れる寿司
function sushi() {
    if (sushiX < 400) {
        sushiImage.resize(0, 50);
        image(sushiImage, sushiX, 70 + sushiY);
    } else {
        sushiX = -103;
        barrrage = 0
        next();
    }
    sushiX += sushiSpeed;
}

//残りの時間
function timers() {
    countUpTimer += deltaTime / 1000
    countDownTimer = time - countUpTimer.toFixed(0);
}

//背景
function backgrounds() {
    //背景の緑色のやつ
    fill("#b5bf65");
    rect(0, 40, 400, 45);

    //寿司のレーン
    fill("#efbf6b");
    rect(0, 85, 400, 45);

    //寿司のレーンの影
    fill("#e49f36");
    rect(0, 130, 400, 14);

    //寿司のレーンの下
    fill("#d69e4f");
    rect(0, 144, 400, 70);

    // 机
    fill("#eab768");
    rect(0, 214, 400, 370, 0, 0, 5, 5);



}

//周りの枠
function gridLine() {
    //残り時間の下のやつ
    fill("#ffa65a");
    rect(0, 0, 400, 40, 5, 5, 0);

    // 左右の線
    fill("#f79a4f");
    rect(0, 40, 5, 230);
    rect(400, 40, -5, 230);

    // スコア下
    fill("#f29e4f");
    rect(0, 270, 400, 50, 0, 0, 5, 5);
}

//入力した後の寿司を表示
function sushiSet() {
    if (sara >= 11) {
        sara = 1;
    }
    // sara++;

    for (n = 0; n < sara; n += 1) {
        sushi_karaImage.resize(0, 50);
        image(sushi_karaImage, 200 - 50.5, 210 - n * 4.6);
    }
}

//連打メーター
function barrage_Meter() {
    barrrage_X = barrrage * barrrageSpeed;

    if (barrrage_X > 50 && isAdd1Sec1 == false) {
        isAdd3Sec = false;
        isShowAdd3Sec = false;

        console.log("1秒追加")
        countUpTimer -= 1;
        isAdd1Sec1 = true;
    } else if (barrrage_X > 100 && isAdd1Sec2 == false) {
        console.log("1秒追加")
        countUpTimer -= 1;
        isAdd1Sec2 = true;
    } else if (barrrage_X > 150 && isAdd2Sec == false) {
        console.log("2秒追加")
        countUpTimer -= 2;
        isAdd2Sec = true;
    } else if (barrrage_X > 217 && isAdd3Sec == false) {
        console.log("3秒追加")
        countUpTimer -= 3;
        isAdd3Sec = true;

        //もう一度表示できるようにする
        isAdd1Sec1 = false;
        isShowAdd1Sec1 = false;
        isAdd1Sec2 = false;
        isShowAdd1Sec2 = false;
        isAdd2Sec = false;
        isShowAdd2Sec = false

        barrrage = 0;
    }
}

//+◯秒の表示
function barrageMeterTimeShows() {

    fill("#f54545");
    textSize(20);
    // console.log(showBarrageTime)
    if (isAdd1Sec1 == true && isShowAdd1Sec1 == false) {
        if (showBarrageTime > 0) {
            text("+1秒", 90, 50);
            showBarrageTime--;
        } else {
            isShowAdd1Sec1 = true;
            showBarrageTime = defaultShowBarrageTime
        }
    }
    if (isAdd1Sec2 == true && isShowAdd1Sec2 == false) {
        if (showBarrageTime > 0) {
            text("+1秒", 90, 50);
            showBarrageTime--;
        } else {
            isShowAdd1Sec2 = true;
            showBarrageTime = defaultShowBarrageTime;
        }
    }
    if (isAdd2Sec == true && isShowAdd2Sec == false) {
        if (showBarrageTime > 0) {
            text("+2秒", 90, 50);
            showBarrageTime--;
        } else {
            isShowAdd2Sec = true;
            showBarrageTime = defaultShowBarrageTime;
        }
    }
    if (isAdd3Sec == true && isShowAdd3Sec == false) {
        if (showBarrageTime > 0) {
            text("+3秒", 90, 50);
            showBarrageTime--;
        } else {
            isShowAdd3Sec = true;
            showBarrageTime = defaultShowBarrageTime;
        }
    }
}

//入力の処理
function keyboard() {

    keys = romaji[imanoyatu][i];


    //長押しでも反応してしまう
    tien--;
    if (key === keys && tien <= 0) {
        if (isType) { keysound = Math.floor(random(0, 3)); if (keysound == 0) { keySounds1.play(); } else if (keysound == 1) { keySounds2.play(); } else if (keysound == 2) { keySounds3.play(); } }
        i += 1;
        keys = romaji[imanoyatu][i];
        barrrage++;
    }

    if (i == romaji[imanoyatu].length) {
        // すべて打ったあとの処理
        sushiX = -103;
        sushiSpeed += sushiKasokudo;
        next();
        score++;
        sara++;
        tien = 20;
    }
}

//ゲームオーバーの処理
function gameOverProcessing() {
    if (countDownTimer <= 0) {
        if (!isStopSounds) { isStopSounds = true; stopSounds.play(); }
        isOdaiShow = false
        nedan = score * 240
        //終了文字
        textSize(45);
        color("#000");
        text("終了", 200, 150);

        //閉まるアニメーション
        gameOverTien -= 0.6;//0.6
        if (gameOverTien < 0) {
            if (tobiraX < 200) { };
            tobiraX += 20;
            // console.log(tobiraX);
            fill("#f7a152");
            rect(5, 40, tobiraX, 230); //tobiraX
            rect(400, 40, -tobiraX, 230);
            if (tobiraX >= 1000) {
                isTimeShow = false

                //背景
                fill("#fff");
                rect(30, 20, 345, 230);
                //コース名
                fill("#333333")
                rect(30, 35, 345, 30)
                textAlign(LEFT, TOP);
                textSize(18);
                fill("#4f92b1");
                text(difficulty, 50, 55 - 14);
                fill("#fff");
                if (difficulty == "お勧め") { text("5,000円コース", 120, 55 - 14); };
                if (course == "普通") { fill("#ffcf00"); text("【普通】", 260, 55 - 14); };
                textAlign(CENTER, CENTER);


                //成績

                //ゲット数・成績画像
                gameOverResultTien++;
                if (gameOverResultTien > 30) {
                    if (!isResult1Sounds) { result1Sounds.play(); isResult1Sounds = true; }
                    fill("#000");
                    textAlign(LEFT, CENTER);
                    textSize(16);
                    text(nedan, 130, 90);
                    text("             円分のお寿司をゲット！", 130, 90);
                }
                if (gameOverResultTien > 60) {
                    if (!isResult2Sounds) { result1Sounds.play(); isResult2Sounds = true; }
                    fill("#969696");
                    textSize(16)
                    text("5,000円　払って・・・", 130, 115);
                }
                if (gameOverResultTien > 100) {
                    if (!isResult3Sounds) { result2Sounds.play(); isResult3Sounds = true; }
                    if (nedan - 5000 > 0) {
                        kekka = nedan - 5000;
                        stroke("#6f9825");
                        fill("#6f9825");
                        strokeWeight(4);
                        fill("#fff")
                        rect(50, 140, 305, 30, 5);
                        noStroke();
                        fill("#6f9825");
                        text("円分 お得でした！", 185, 155);
                    } else {
                        stroke("#656065");
                        kekka = 5000 - nedan;
                        strokeWeight(4);
                        fill("#fff");
                        rect(50, 140, 305, 30, 5);
                        noStroke();
                        fill("#656065");
                        text("円分 損でした・・・", 185, 155);
                    }
                    fill("#000");
                    textSize(18);
                    textAlign(LEFT, CENTER);
                    text(kekka, 110, 155);
                    textAlign(CENTER, CENTER);
                }
            }
        }
    }
}
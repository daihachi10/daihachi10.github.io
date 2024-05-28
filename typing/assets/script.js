    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    let currentIndex;
    let currentChar;
    let nextChar;
    let score = 0;
    let startTime;
    let endTime;
    let gameFinished = false;

    const typeSounds = [
        document.getElementById("typeSound1"),
        document.getElementById("typeSound2"),
        document.getElementById("typeSound3")
    ];

    function startGame() {
        currentIndex = 0;
        score = 0;
        startTime = performance.now();
        gameFinished = false;

        // 文字列をランダムに並び替え
        alphabet = shuffleString(alphabet);

        currentChar = alphabet[currentIndex];
        nextChar = alphabet[currentIndex + 1]; // 次の文字

        updateDisplay();

        document.getElementById("startButton").style.display = "none"; // ゲーム開始時にボタンを非表示
        document.getElementById("result").textContent = "";
        document.getElementById("timer").textContent = ""; // タイマー表示をリセット

        // キーボードイベントの監視を開始
        document.addEventListener("keydown", handleKeyDown);

        // 開始時にタイマーを開始
        updateTimer();
        setInterval(updateTimer, 10); // 10ミリ秒ごとに更新
    }

    function handleKeyDown(event) {
        if (!gameFinished) {
            const inputChar = event.key.toLowerCase();

            if (inputChar === currentChar) {
                playRandomTypeSound(); // タイピング音を再生
                score++;
                currentIndex++;

                if (currentIndex < alphabet.length) {
                    currentChar = alphabet[currentIndex];
                    nextChar = alphabet[currentIndex + 1]; // 次の文字
                    updateDisplay();
                } else {
                    endGame();
                }
            }
        }
    }

    function endGame() {
        gameFinished = true;
        endTime = performance.now();
        document.removeEventListener("keydown", handleKeyDown);
        const elapsedTime = (endTime - startTime) / 1000; // 秒単位に変換
        const resultText = score > 0 ? "時間: " + elapsedTime.toFixed(3) + "秒";
        document.getElementById("result").textContent = resultText;

        // ゲーム終了時に共有ボタンを表示
        document.getElementById("shareButton").style.display = "block";
    }

    function updateTimer() {
        if (!gameFinished) {
            const currentTime = performance.now();
            const elapsedTime = (currentTime - startTime) / 1000; // 秒単位に変換
            document.getElementById("timer").textContent = "時間: " + elapsedTime.toFixed(3) + "秒";
        }
    }

    // ゲームをリセットする関数
    function resetGame() {
        document.getElementById("startButton").style.display = "block"; // ボタンを表示
        document.getElementById("result").textContent = "ゲームをリセットしました。Enterキーまたは「スタート」ボタンをクリックしてゲームを開始してください。";
        document.getElementById("shareButton").style.display = "none"; // リセット時に共有ボタンを非表示にする
    }

    // Enterキーが押されたときにゲームを開始
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            startGame();
        }
    });

    // 文字列をランダムに並び替える関数
    function shuffleString(str) {
        let array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    // 表示を更新する関数
    function updateDisplay() {
        document.getElementById("word").textContent = currentChar;
        document.getElementById("next").textContent = "次: " + (nextChar ? nextChar : "なし");
    }

    // ランダムなタイピング音を再生する関数
    function playRandomTypeSound() {
        const randomIndex = Math.floor(Math.random() * typeSounds.length);
        typeSounds[randomIndex].currentTime = 0;
        typeSounds[randomIndex].play();
    }

    // Twitterで共有する関数
    function shareOnTwitter() {
        const elapsedTime = (endTime - startTime) / 1000;
        const scoreText = score > 0 ? ` スコア: ${score}点` : "";
        const text = `タイピングゲームで${elapsedTime.toFixed(3)}秒かかりました！#タイピングゲーム #daihachi`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, '_blank');
    }

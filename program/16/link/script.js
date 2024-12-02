// URLパラメーターを取得する関数
function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// ローカルストレージリセット処理
if (getUrlParameter("reset") === "true") {
    localStorage.removeItem("skipConfirmation");
    alert("ローカルストレージをリセットしました。");
}

// "url"パラメーターを取得
const targetUrl = getUrlParameter("url");

// 要素を取得
const messageElement = document.getElementById("message");
const goButton = document.getElementById("go-button");
const backButton = document.getElementById("back-button");
const dontShowAgainCheckbox = document.getElementById("dont-show-again");

// ローカルストレージを確認
if (localStorage.getItem("skipConfirmation") === "true" && targetUrl) {
    window.location.href = targetUrl; // URLに直接リダイレクト
} else {
    // パラメーターがない場合の処理
    if (!targetUrl) {
        messageElement.textContent = "エラー: URLパラメーターが見つかりません。";
        goButton.style.display = "none";
    } else {
        // メッセージの設定
        messageElement.textContent = `URL "${targetUrl}" に移動しますが、よろしいですか？`;

        // "行く"ボタンのイベント設定
        goButton.addEventListener("click", () => {
            if (dontShowAgainCheckbox.checked) {
                localStorage.setItem("skipConfirmation", "true");
            }
            window.location.href = targetUrl; // URLに直接リダイレクト

        });
    }
}

// "戻る"ボタンのイベント設定
backButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});

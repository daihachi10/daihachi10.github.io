// URLパラメーターを取得する関数
function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// "url"パラメーターを取得
const targetUrl = getUrlParameter("url");

// 要素を取得
const messageElement = document.getElementById("message");
const goButton = document.getElementById("go-button");
const backButton = document.getElementById("back-button");

// パラメーターがない場合の処理
if (!targetUrl) {
    messageElement.textContent = "エラー: URLパラメーターが見つかりません。";
    goButton.style.display = "none";
} else {
    // メッセージの設定
    messageElement.textContent = `URL "${targetUrl}" に移動しますが、よろしいですか？`;

    // "行く"ボタンのイベント設定
    goButton.addEventListener("click", () => {
        window.open(targetUrl, "_blank"); // 新しいタブで開く
        window.location.href = "https://daihachi10.github.io/program/16/index.html";

    });
}

// "戻る"ボタンのイベント設定
backButton.addEventListener("click", () => {
    window.location.href = "https://daihachi10.github.io/program/16/index.html";
});

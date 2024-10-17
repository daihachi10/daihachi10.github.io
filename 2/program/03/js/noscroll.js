window.onload = () => init();

function init() {
    const body = document.body;

    // body へのキー入力を止める。
    // 矢印キーの操作で body がスクロールしないようにする。
    // 必要なのは keydown イベントだけです。
    // event.stopPropagation() で止める方法もあります。
    body.addEventListener("keydown", event => event.preventDefault());

    /* keyup, keypress は不要です。
        body.addEventListener("keyup", event => event.preventDefault() );
        body.addEventListener("keypress", event => event.preventDefault() );
     */
};

document.addEventListener('keydown', function (event) {
    // スペースキーが押された場合
    if (event.code === 'Space') {
        // デフォルトのスクロール動作を無効化
        event.preventDefault();
    }
});

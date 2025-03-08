$(function () {
    $(".footer").load("https://daihachi10.github.io/common/footer.html");
    $("#loading").load("https://daihachi10.github.io/common/loading.html");
    $(".header").load("https://daihachi10.github.io/common/header.html");
});

document.addEventListener("click", function (event) {
    // クリックされたときの処理
    console.log("クリックされました！", event.clientX, event.clientY);
    AOS.init();

});

for (let i = 0; i < 500; i++) {
    setTimeout(function () {
        AOS.init();
    }, 500);
}

window.onload = function () {
    window.addEventListener('keydown', keydownfunc, true);
}

var keydownfunc = function (event) {
    var code = event.keyCode;
    switch (code) {
        case 32:
        case 37: // ←
        case 38: // ↑
        case 39: // →
        case 40: // ↓
            event.preventDefault();
            // console.log(code);
    }
}

document.addEventListener('keydown', function(event) {
    // 上矢印キー（38）または下矢印キー（40）が押された場合
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
    }
});
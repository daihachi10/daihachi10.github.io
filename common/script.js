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
        console.log(i)
    }, 200);
}

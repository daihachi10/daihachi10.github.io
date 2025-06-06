$(function () {
  $(".footer").load("https://daihachi10.github.io/common/footer.html");
  // $("#loading").load("https://daihachi10.github.io/common/loading.html");
  $(".header").load("https://daihachi10.github.io/common/programheader.html");
  //   $(".header").load("../../common/programheader.html");

  $("#login").load("https://daihachi10.github.io/account/iframe.html");

  $.get("https://daihachi10.github.io/common/color.html", function (data) {
    $("body").prepend(data); // 先頭に追加する場合
    // $("body").append(data); // 末尾に追加する場合は、こちらを使用
  });
});

document.addEventListener("click", function (event) {
  // クリックされたときの処理
  console.log("クリックされました！", event.clientX, event.clientY);
});

for (let i = 0; i < 500; i++) {
  setTimeout(function () {}, 500);
}

window.onload = function () {
  window.addEventListener("keydown", keydownfunc, true);
};

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
};

document.addEventListener("keydown", function (event) {
  // 上矢印キー（38）または下矢印キー（40）が押された場合
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
  }
});

$(function () {
  $(".shop-menu").load("../common/sidebar.html");
  $(".item-list").load("../common/recommended/index.html");
});

function hidden() {
  $("#sidebar").addClass("hidden");
}
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sidebar");

  for (let i = 0; i < 28; i++) {
    const div = document.createElement("div");
    div.className = "skeleton"; // クラス名を指定
    container.appendChild(div);
  }

  window.addEventListener("load", () => {
    console.log("window.load event fired"); // イベント発火確認

    const element = document.querySelector(".item-list");
    const images = document.querySelectorAll(".imagehidden"); // 変数名を複数形に (NodeListなので)

    console.log("Found .item-list:", element);
    console.log("Found .imagehidden elements:", images); // NodeList自体をログに出力
    console.log("Number of .imagehidden elements:", images.length); // 要素の数を出力

    if (element) {
      element.classList.add("loaded");
      console.log(".item-listにloadedクラスを追加しました");
    } else {
      console.log(".item-listが見つかりませんでした");
    }

    if (images.length > 0) {
      images.forEach((el) => {
        console.log("Processing element:", el); // 対象要素をログに出力
        el.classList.remove("imagehidden");
        console.log("Removed .imagehidden. Current classes:", el.className); // 削除後のクラス名を確認
      });
    } else {
      console.log(".imagehiddenクラスを持つ要素が見つかりませんでした at window.load");
    }
  });

  // DOMContentLoadedの直後にも確認（比較のため）
  console.log("DOMContentLoaded - Number of .imagehidden elements:", document.querySelectorAll(".imagehidden").length);
});
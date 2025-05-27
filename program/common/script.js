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
    const element = document.querySelector(".item-list");
    const image = document.querySelectorAll(".imagehidden");

    if (element) {
      element.classList.add("loaded");
    }
    image.forEach((el) => {
      el.classList.remove("imagehidden");
    });
  });
});

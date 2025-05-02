const popup = document.getElementById("popup");
const openBtn = document.getElementById("open-btn");
const closeBtn = document.getElementById("close-btn");
let popupClosed = localStorage.getItem("popupClosed2");
setTimeout(function () {
    popup.classList.remove("hidden");
}, 500);

openBtn.addEventListener("click", () => {
  popup.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
});

function closePopup() {
  popup.classList.add("hidden");
  localStorage.setItem("popupClosed2", "true");
}

let docTitle = document.title;
window.addEventListener("blur", () => {
document.title = "戻ってきて！";
})
window.addEventListener("focus", () => {
document.title = daihachi web;
})

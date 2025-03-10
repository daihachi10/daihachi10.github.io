$(function () {
    $(".shop-menu").load("../common/sidebar.html");
    $(".item-list").load("../common/recommended/index.html");
});

function hidden() {
    $("#sidebar").addClass("hidden");
}
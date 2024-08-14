function searchGoogle() {
    var query = document.getElementById("search-box").value;
    var url = "https://www.google.com/search?q=" + encodeURIComponent(query);
    window.location.href = url;
}

// エンターキーで検索を実行する
document.getElementById("search-box").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchGoogle();
    }
});

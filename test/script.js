// scripts.js
function loadContent(event, url) {
    event.preventDefault();
    startLoadingBar();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var content = document.getElementById('content');
            content.innerHTML = xhr.responseText;
            // 追加のスタイル適用
            content.style.margin = '0';
            content.style.padding = '20px';
            content.style.boxSizing = 'border-box';
        }
        finishLoadingBar();
    };
    xhr.send();
}

function startLoadingBar() {
    var loadingBar = document.getElementById('loading-bar');
    loadingBar.style.width = '0';
    setTimeout(function() {
        loadingBar.style.width = '50%';
    }, 10);
}

function finishLoadingBar() {
    var loadingBar = document.getElementById('loading-bar');
    loadingBar.style.width = '100%';
    setTimeout(function() {
        loadingBar.style.width = '0';
    }, 400);
}

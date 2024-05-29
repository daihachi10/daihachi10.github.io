// scripts.js
function loadContent(event, url) {
    event.preventDefault();
    startLoadingBar();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            document.getElementById('content').innerHTML = xhr.responseText;
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

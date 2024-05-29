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
                    content.style.margin = '0 auto';
                    content.style.padding = '20px';
                    content.style.boxSizing = 'border-box';
                    content.style.maxWidth = '1000px'; // 必要に応じて調整
                }
                finishLoadingBar();
            };
            xhr.send();
        }

        function startLoadingBar() {
            var loadingBar = document.getElementById('loading-bar');
            loadingBar.style.width = '0';
            loadingBar.classList.remove('hidden');
            setTimeout(function() {
                loadingBar.style.width = '50%';
            }, 10);
        }

        function finishLoadingBar() {
            var loadingBar = document.getElementById('loading-bar');
            loadingBar.style.width = '100%';
            setTimeout(function() {
                loadingBar.classList.add('hidden');
                setTimeout(function() {
                    loadingBar.style.width = '0';
                }, 500); // フェードアウト完了後に幅をリセット
            }, 400);
        }

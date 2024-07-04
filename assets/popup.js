        // 1秒後に通知を表示
        setTimeout(function() {
            var notification = document.getElementById('notification');
            notification.style.display = 'block';
            setTimeout(function() {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 10); // トランジションを有効にするための短い遅延
        }, 1000);

        // 通知を閉じる関数
        function closeNotification() {
            var notification = document.getElementById('notification');
            notification.style.opacity = '0'; /* フェードアウト開始 */
            notification.style.transform = 'translateX(100px)'; /* スライドアウト開始 */
            setTimeout(function() {
                notification.style.display = 'none';
            }, 500); /* フェードアウトの時間と一致させる */
        }

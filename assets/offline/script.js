    function test() {
              if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log("pwa");
            if (!navigator.onLine) {
                console.log("オフライン")
                showNewNotification();
            } else {
              console.log("オンライン")
            }
    } else {
      console.log("not pwa");
      }
    }

        if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log("pwa");
            if (!navigator.onLine) {
                showNewNotification();
            }
    } else {
      console.log("not pwa");
      }

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('https://daihachi10.github.io/beta/offline/service-worker.js')
    .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}

        // Check if the browser is online or offline
        function checkOnlineStatus() {
            if (!navigator.onLine) {
                window.location = 'https://daihachi10.github.io/beta/offline/offline.html';
            }
        }

        // Register the service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch(error => {
                console.log('Service Worker registration failed:', error);
            });
        }

        // Check online status on page load
        window.addEventListener('load', checkOnlineStatus);
        // Listen for changes in network status
        window.addEventListener('online', () => window.location.reload());
        window.addEventListener('offline', () => window.location = 'https://daihachi10.github.io/beta/offline/offline.html');

}

    if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log("pwa");      
} else {
      console.log("not pwa");
      
                // 1秒後に通知を表示
        setTimeout(function() {
            var notification = document.getElementById('notification');
            notification.style.display = 'block';
            setTimeout(function() {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 10); // トランジションを有効にするための短い遅延
        }, 1000);

}


        // 新しい通知を表示する関数
        function showNewNotification() {
            var newNotification = document.getElementById('new-notification');
            newNotification.style.display = 'block';
            setTimeout(function() {
                newNotification.style.opacity = '1';
                newNotification.style.transform = 'translateX(0)';
            }, 10); // トランジションを有効にするための短い遅延
        }

        // 新しい通知を閉じる関数
        function closeNewNotification() {
            var newNotification = document.getElementById('new-notification');
            newNotification.style.opacity = '0'; /* フェードアウト開始 */
            newNotification.style.transform = 'translateX(100px)'; /* スライドアウト開始 */
            setTimeout(function() {
                newNotification.style.display = 'none';
            }, 500); /* フェードアウトの時間と一致させる */
        }

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

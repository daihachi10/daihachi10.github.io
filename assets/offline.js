        if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('https://daihachi10.github.io/beta/offline/service-worker.js')
    .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}

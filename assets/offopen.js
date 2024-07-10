        if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log("pwa");
            if (!navigator.onLine) {
                showNewNotification();
            }
    } else {
      console.log("not pwa");
      }

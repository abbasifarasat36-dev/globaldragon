// sw.js

// Service Worker Lifecycle
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

// --- Push Event Handler (for real push notifications) ---
// This is where real push notifications from a server would be handled.
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push Received.');
    const data = event.data.json();
    const title = data.title;
    const options = {
        body: data.options.body,
        icon: '/favicon.svg', // A default icon
        badge: '/favicon.svg', // An icon for the notification bar on Android
        tag: data.options.tag, // An ID to prevent duplicate notifications
        ...data.options,
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// --- Message Event Handler (for simulating push from client) ---
// This is a workaround for the demo environment to trigger notifications without a push server.
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'show-notification') {
        const { title, options } = event.data.payload;
        self.registration.showNotification(title, {
             icon: '/favicon.svg',
             badge: '/favicon.svg',
             ...options
        });
    }
});


// --- Notification Click Handler ---
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Close the notification

    // This looks for an open window/tab for this app and focuses it.
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            // If no window is open, it opens a new one.
            return clients.openWindow('/');
        })
    );
});

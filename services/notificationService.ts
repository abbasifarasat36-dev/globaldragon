// services/notificationService.ts

const isSupported = (): boolean => {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

const registerServiceWorker = (): void => {
    if (!isSupported()) {
        console.warn('Push notifications are not supported in this browser.');
        return;
    }

    // Wait for the page to be fully loaded before trying to register the service worker.
    window.addEventListener('load', async () => {
        try {
            const swUrl = `${window.location.origin}/sw.js`;
            const registration = await navigator.serviceWorker.register(swUrl);
            console.log('Service Worker registered with scope:', registration.scope);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    });
};

// FIX: Completed the function to handle notification permission requests and return a value.
const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported()) {
        console.warn('Push notifications are not supported in this browser.');
        return 'default';
    }
    try {
        const permission = await window.Notification.requestPermission();
        return permission;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return 'default';
    }
};
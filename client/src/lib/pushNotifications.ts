export async function subscribeToPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.error('Push notifications are not supported');
        return false;
    }

    const API_URL = import.meta.env.VITE_API_URL || '';

    try {
        const registration = await navigator.serviceWorker.ready;

        // Get the VAPID public key from the server
        const response = await fetch(`${API_URL}/api/notifications/vapid-public-key`);
        const { publicKey } = await response.json();

        const convertedVapidKey = urlBase64ToUint8Array(publicKey);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        });

        // Send the subscription to the server
        await fetch(`${API_URL}/api/notifications/subscribe`, {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Subscribed to push notifications!');
        return true;
    } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
        return false;
    }
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

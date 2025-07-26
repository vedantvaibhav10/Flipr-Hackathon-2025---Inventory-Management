import { db } from '../db';
import apiClient from '../api';

// Adds a failed request to the outbox table in IndexedDB
export const addToOutbox = async (payload) => {
    const { url, method, data, headers } = payload;
    try {
        await db.outbox.add({
            url,
            method,
            data,
            headers,
            timestamp: new Date().getTime(),
        });
        console.log(`Request for ${method.toUpperCase()} ${url} added to outbox.`);
    } catch (error) {
        console.error("Failed to add to outbox:", error);
    }
};

// Processes all pending requests in the outbox
export const processOutbox = async () => {
    const pendingRequests = await db.outbox.orderBy('timestamp').toArray();
    if (pendingRequests.length === 0) {
        console.log("Outbox is empty. Nothing to sync.");
        return;
    }

    console.log(`Processing ${pendingRequests.length} items from the outbox...`);

    for (const request of pendingRequests) {
        try {
            // Re-try the API call with the stored data
            await apiClient.request({
                method: request.method,
                url: request.url,
                data: request.data,
                headers: request.headers,
            });

            // If successful, remove it from the outbox
            await db.outbox.delete(request.id);
            console.log(`Successfully synced request ID: ${request.id}`);

        } catch (error) {
            console.error(`Failed to sync request ID: ${request.id}. It will be retried later.`, error);
            // If it fails again, it stays in the queue for the next sync attempt.
            // A more advanced implementation could add retry counters or error logging.
        }
    }
};

// This function sets up listeners for online/offline events
export const initializeSync = () => {
    // When the app comes back online, process the outbox
    window.addEventListener('online', processOutbox);

    // Initial check in case the app loads while online
    if (navigator.onLine) {
        processOutbox();
    }

    // Cleanup function to remove the listener
    return () => {
        window.removeEventListener('online', processOutbox);
    };
};

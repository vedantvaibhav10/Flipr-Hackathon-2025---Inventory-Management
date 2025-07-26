import { db } from '../db';
import apiClient from '../api';

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

export const processOutbox = async () => {
    const pendingRequests = await db.outbox.orderBy('timestamp').toArray();
    if (pendingRequests.length === 0) {
        console.log("Outbox is empty. Nothing to sync.");
        return;
    }

    console.log(`Processing ${pendingRequests.length} items from the outbox...`);

    for (const request of pendingRequests) {
        try {
            await apiClient.request({
                method: request.method,
                url: request.url,
                data: request.data,
                headers: request.headers,
            });

            await db.outbox.delete(request.id);
            console.log(`Successfully synced request ID: ${request.id}`);

        } catch (error) {
            console.error(`Failed to sync request ID: ${request.id}. It will be retried later.`, error);
        }
    }
};

export const initializeSync = () => {
    window.addEventListener('online', processOutbox);

    if (navigator.onLine) {
        processOutbox();
    }

    return () => {
        window.removeEventListener('online', processOutbox);
    };
};

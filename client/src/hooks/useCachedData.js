import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db'; // Your Dexie instance
import apiClient from '../api';

export const useCachedData = (tableName, apiEndpoint) => {
    // 1. Get a live view of the local data from IndexedDB
    const localData = useLiveQuery(() => db[tableName].toArray(), []);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 2. Function to fetch from network and update the cache
    const syncData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get(apiEndpoint);
            const serverData = response.data.data;

            // 3. Clear the old local data and bulk-add the fresh data
            await db.transaction('rw', db[tableName], async () => {
                await db[tableName].clear();
                await db[tableName].bulkPut(serverData);
            });

        } catch (err) {
            // If the API fails (e.g., offline), we'll rely on the cached data.
            // The error is useful for showing an "offline" message.
            setError('Could not connect to the server. Displaying offline data.');
            console.error(`Failed to sync ${tableName}:`, err);
        } finally {
            setLoading(false);
        }
    }, [tableName, apiEndpoint]);

    // 4. Trigger the sync when the component mounts
    useEffect(() => {
        syncData();
    }, [syncData]);

    return {
        data: localData || [], // Return localData, fallback to empty array
        loading,
        error,
        forceSync: syncData // Expose a function to manually trigger a refresh
    };
};

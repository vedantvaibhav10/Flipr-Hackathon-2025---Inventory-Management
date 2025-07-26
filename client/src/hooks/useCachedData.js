import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import apiClient from '../api';

export const useCachedData = (tableName, apiEndpoint) => {
    const localData = useLiveQuery(() => db[tableName].toArray(), []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const syncData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get(apiEndpoint);
            const serverData = response.data.data;
            await db.transaction('rw', db[tableName], async () => {
                await db[tableName].clear();
                await db[tableName].bulkPut(serverData);
            });
        } catch (err) {
            setError('Could not connect to the server. Displaying offline data.');
        } finally {
            setLoading(false);
        }
    }, [tableName, apiEndpoint]);

    useEffect(() => {
        syncData();

        const handleSyncComplete = () => {
            console.log(`'datasync-complete' event heard by ${tableName}. Refetching data.`);
            syncData();
        };

        window.addEventListener('datasync-complete', handleSyncComplete);

        return () => {
            window.removeEventListener('datasync-complete', handleSyncComplete);
        };

    }, [syncData]);

    return {
        data: localData || [],
        loading,
        error,
        forceSync: syncData
    };
};

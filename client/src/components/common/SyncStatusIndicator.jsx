import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

const SyncStatusIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const pendingSyncs = useLiveQuery(() => db.outbox.count(), []);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const getStatus = () => {
        if (!isOnline) {
            return { text: 'Offline', icon: WifiOff, color: 'bg-secondary text-text-secondary' };
        }
        if (pendingSyncs > 0) {
            return { text: `Syncing ${pendingSyncs} items...`, icon: Loader2, color: 'bg-warning/20 text-warning animate-pulse' };
        }
        return { text: 'Online & Synced', icon: Wifi, color: 'bg-success/20 text-success' };
    };

    const { text, icon: Icon, color } = getStatus();

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg border border-border shadow-lg ${color}`}
        >
            <Icon size={16} className={pendingSyncs > 0 && isOnline ? 'animate-spin' : ''} />
            <span className="text-xs font-semibold">{text}</span>
        </motion.div>
    );
};

export default SyncStatusIndicator;

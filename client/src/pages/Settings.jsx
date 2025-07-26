import { motion } from 'framer-motion';
import { db } from '../db';
import { toast } from 'react-hot-toast';
import { Download, HardDrive } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
    const [lastBackup, setLastBackup] = useState(localStorage.getItem('lastBackupTimestamp'));

    const handleManualBackup = async () => {
        toast.loading('Generating backup...');
        try {
            const products = await db.products.toArray();
            const suppliers = await db.suppliers.toArray();
            const orders = await db.orders.toArray();
            const inventoryLogs = await db.inventoryLogs.toArray();

            const backupData = {
                version: 1,
                timestamp: new Date().toISOString(),
                data: {
                    products,
                    suppliers,
                    orders,
                    inventoryLogs,
                },
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            link.href = url;
            link.download = `invtrack_backup_${date}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            const newTimestamp = new Date().toISOString();
            localStorage.setItem('lastBackupTimestamp', newTimestamp);
            setLastBackup(newTimestamp);

            toast.dismiss();
            toast.success('Local data backup successful!');

        } catch (error) {
            toast.dismiss();
            toast.error('Failed to create backup.');
            console.error("Backup failed:", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-text-primary mb-6">Settings</h1>

            <div className="bg-primary p-6 rounded-lg border border-border max-w-2xl">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary rounded-lg">
                        <HardDrive className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">Local Data Backup</h2>
                        <p className="text-sm text-text-secondary mt-1">
                            Export a complete snapshot of your locally cached data (products, suppliers, orders) as a JSON file. This is useful for safeguarding your data or migrating to another device.
                        </p>
                        {lastBackup && (
                            <p className="text-xs text-text-secondary mt-2">
                                Last backup: {new Date(lastBackup).toLocaleString()}
                            </p>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleManualBackup}
                            className="flex items-center gap-2 mt-4 px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent/90 transition-colors"
                        >
                            <Download size={18} />
                            Download Backup
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;

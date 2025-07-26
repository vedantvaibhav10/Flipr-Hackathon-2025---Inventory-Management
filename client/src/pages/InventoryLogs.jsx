import { useEffect, useState } from 'react';
import apiClient from '../api';
import { motion } from 'framer-motion';
import { Loader2, Calendar, User, ChevronsUpDown } from 'lucide-react';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getActionStyle = (action) => {
    switch (action) {
        case 'SALE':
            return { text: 'Sale', color: 'text-red-500' };
        case 'RESTOCK':
            return { text: 'Restock', color: 'text-green-500' };
        case 'INITIAL':
            return { text: 'Initial Stock', color: 'text-blue-500' };
        case 'ADJUSTMENT':
            return { text: 'Adjustment', color: 'text-yellow-500' };
        default:
            return { text: action, color: 'text-gray-500' };
    }
};


const InventoryLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/logs');
                setLogs(response.data.data);
            } catch (err) {
                setError('Failed to fetch inventory logs.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) {
        return <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>;
    }

    if (error) {
        return <div className="text-center text-danger mt-10 p-4 bg-danger/10 rounded-md">{error}</div>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-text-primary mb-6">Inventory Movement Logs</h1>


            <div className="bg-primary rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="p-4 font-semibold text-text-secondary">Product</th>
                                <th className="p-4 font-semibold text-text-secondary">Action</th>
                                <th className="p-4 font-semibold text-text-secondary text-center">Quantity Change</th>
                                <th className="p-4 font-semibold text-text-secondary">New Stock Level</th>
                                <th className="p-4 font-semibold text-text-secondary">User</th>
                                <th className="p-4 font-semibold text-text-secondary">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => {
                                const actionStyle = getActionStyle(log.actionType);
                                return (
                                    <tr key={log._id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                                        <td className="p-4 text-text-primary font-medium">{log.product?.name || 'N/A'}</td>
                                        <td className={`p-4 font-semibold ${actionStyle.color}`}>{actionStyle.text}</td>
                                        <td className={`p-4 text-center font-bold ${log.quantityChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                                        </td>
                                        <td className="p-4 text-text-primary text-center">{log.newStockLevel}</td>
                                        <td className="p-4 text-text-secondary">{log.user?.username || 'System'}</td>
                                        <td className="p-4 text-text-secondary">{formatDate(log.createdAt)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default InventoryLogs;
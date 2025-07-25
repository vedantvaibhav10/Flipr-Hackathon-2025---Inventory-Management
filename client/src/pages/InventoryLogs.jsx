import { useEffect, useState } from 'react';
import apiClient from '../api';
import { motion } from 'framer-motion';
import { Loader2, ArrowRightLeft, Package, User } from 'lucide-react';

const InventoryLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState(''); // State for the actionType filter

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                // Append filter to the request URL if it exists
                const url = filter ? `/inventory/logs?actionType=${filter}` : '/inventory/logs';
                const response = await apiClient.get(url);
                setLogs(response.data.data);
            } catch (err) {
                setError('Failed to fetch inventory logs.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [filter]); // Re-run the effect when the filter changes

    const getActionStyle = (action) => {
        switch (action) {
            case 'SALE':
            case 'DAMAGE':
            case 'TRANSFER_OUT':
                return 'text-danger';
            case 'RESTOCK':
            case 'RETURN':
            case 'TRANSFER_IN':
                return 'text-success';
            default:
                return 'text-text-secondary';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Inventory Logs</h1>
                <div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 bg-secondary border border-border rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                    >
                        <option value="">All Actions</option>
                        <option value="SALE">Sale</option>
                        <option value="RESTOCK">Restock</option>
                        <option value="RETURN">Return</option>
                        <option value="DAMAGE">Damage</option>
                    </select>
                </div>
            </div>

            {loading && <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>}
            {error && <div className="text-center text-danger mt-10 p-4 bg-danger/10 rounded-md">{error}</div>}

            {!loading && !error && (
                <div className="bg-primary rounded-lg border border-border overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="p-4 font-semibold text-text-secondary">Product</th>
                                <th className="p-4 font-semibold text-text-secondary">Action</th>
                                <th className="p-4 font-semibold text-text-secondary text-center">Quantity Change</th>
                                <th className="p-4 font-semibold text-text-secondary">User</th>
                                <th className="p-4 font-semibold text-text-secondary">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id} className="border-b border-border hover:bg-secondary transition-colors">
                                    <td className="p-4 text-text-primary font-medium">{log.product?.name || 'N/A'}</td>
                                    <td className={`p-4 font-semibold ${getActionStyle(log.actionType)}`}>{log.actionType}</td>
                                    <td className={`p-4 text-center font-mono font-bold ${log.quantityChange > 0 ? 'text-success' : 'text-danger'}`}>
                                        {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                                    </td>
                                    <td className="p-4 text-text-secondary">{log.user?.name || 'N/A'}</td>
                                    <td className="p-4 text-text-secondary">{new Date(log.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};

export default InventoryLogs;

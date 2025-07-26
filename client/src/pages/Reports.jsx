import { useEffect, useState, useCallback } from 'react';
import apiClient from '../api';
import { useCachedData } from '../hooks/useCachedData';
import { motion } from 'framer-motion';
import { Loader2, FileText, ArrowUpCircle, ArrowDownCircle, ArrowRightCircle, AlertCircle, RotateCcw, WifiOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const getActionDetails = (action) => {
    switch (action) {
        case 'RESTOCK': return { text: 'Restock', color: 'text-green-400', icon: <ArrowUpCircle size={18} /> };
        case 'SALE': return { text: 'Sale', color: 'text-red-400', icon: <ArrowDownCircle size={18} /> };
        case 'RETURN': return { text: 'Return', color: 'text-blue-400', icon: <RotateCcw size={18} /> };
        case 'DAMAGE': return { text: 'Damage', color: 'text-yellow-400', icon: <AlertCircle size={18} /> };
        case 'TRANSFER': return { text: 'Transfer', color: 'text-purple-400', icon: <ArrowRightCircle size={18} /> };
        default: return { text: action, color: 'text-gray-400', icon: null };
    }
};

const Reports = () => {
    const { data: logs, loading, error, forceSync } = useCachedData('inventoryLogs', '/inventory/logs');

    const handleExport = async () => {
        try {
            const response = await apiClient.get('/reports/products/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products-export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Product data exported successfully!');
        } catch (err) {
            toast.error('Failed to export products.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent/90 transition-colors"
                >
                    <FileText size={20} />
                    Export Products (CSV)
                </motion.button>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 p-3 rounded-md mb-4 text-sm">
                    <WifiOff size={16} /> {error}
                </div>
            )}

            {(loading && logs.length === 0) ? (
                <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Inventory Movements</h2>
                    <div className="bg-primary rounded-lg border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-secondary">
                                    <tr>
                                        <th className="p-4 font-semibold text-text-secondary">Product</th>
                                        <th className="p-4 font-semibold text-text-secondary">Action</th>
                                        <th className="p-4 font-semibold text-text-secondary text-center">Quantity Change</th>
                                        <th className="p-4 font-semibold text-text-secondary text-center">New Stock</th>
                                        <th className="p-4 font-semibold text-text-secondary">User</th>
                                        <th className="p-4 font-semibold text-text-secondary">Timestamp</th>
                                        <th className="p-4 font-semibold text-text-secondary">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => {
                                        const action = getActionDetails(log.actionType);
                                        const isAddition = log.quantityChange > 0;
                                        return (
                                            <tr key={log._id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                                                <td className="p-4 text-text-primary font-medium">{log.product?.name || 'N/A'}</td>
                                                <td className={`p-4 font-semibold ${action.color}`}>
                                                    <div className="flex items-center gap-2">
                                                        {action.icon}
                                                        <span>{action.text}</span>
                                                    </div>
                                                </td>
                                                <td className={`p-4 text-center font-bold ${isAddition ? 'text-green-400' : 'text-red-400'}`}>
                                                    {isAddition ? `+${log.quantityChange}` : log.quantityChange}
                                                </td>
                                                <td className="p-4 text-text-primary text-center">{log.newStockLevel}</td>
                                                <td className="p-4 text-text-secondary">{log.user?.name || 'System'}</td>
                                                <td className="p-4 text-text-secondary">{formatDate(log.createdAt)}</td>
                                                <td className="p-4 text-text-secondary italic">{log.notes || '-'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Reports;

import { useEffect, useState } from 'react';
import { useCachedData } from '../hooks/useCachedData';
import apiClient from '../api';
import { motion } from 'framer-motion';
import { PlusCircle, Loader2, Trash2, WifiOff } from 'lucide-react';
import Modal from '../components/common/Modal';
import CreateOrderForm from '../components/orders/CreateOrderForm';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import { toast } from 'react-hot-toast';
import { db } from '../db';
import { addToOutbox } from '../services/syncManager';
import { useAuth } from '../hooks/useAuth';

const getStatusColor = (status) => {
    const colors = {
        Ordered: 'bg-blue-500/20 text-blue-400',
        Shipped: 'bg-yellow-500/20 text-yellow-400',
        Delivered: 'bg-success/20 text-success',
        Cancelled: 'bg-danger/20 text-danger',
        Returned: 'bg-purple-500/20 text-purple-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
};

const ORDER_STATUSES = ['Ordered', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

const Orders = () => {
    const { data: orders, loading, error, forceSync } = useCachedData('orders', '/orders');
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deletingOrder, setDeletingOrder] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleMutationSuccess = () => forceSync();

    const handleStatusChange = async (orderId, newStatus) => {
        const originalOrders = JSON.parse(JSON.stringify(orders));
        await db.orders.update(orderId, { status: newStatus });

        try {
            await apiClient.put(`/orders/${orderId}`, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            forceSync();
        } catch (err) {
            if (!err.response) {
                toast.success('Offline: Status change saved, will sync later.');
                await addToOutbox({
                    url: `/orders/${orderId}`,
                    method: 'put',
                    data: { status: newStatus },
                });
            } else {
                await db.orders.bulkPut(originalOrders);
                toast.error(err.response?.data?.message || 'Failed to update order status.');
            }
        }
    };

    const handleDelete = async () => {
        if (!deletingOrder) return;
        setActionLoading(true);
        try {
            await apiClient.delete(`/orders/${deletingOrder._id}`);
            await db.orders.delete(deletingOrder._id);
            toast.success("Order deleted successfully!");
            setDeletingOrder(null);
        } catch (err) {
            if (!err.response && !deletingOrder._id.startsWith('offline_')) {
                toast.success('Offline: Delete action saved, will sync later.');
                await db.orders.delete(deletingOrder._id);
                await addToOutbox({ url: `/orders/${deletingOrder._id}`, method: 'delete' });
                setDeletingOrder(null);
            } else {
                toast.error("Failed to delete order.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Orders</h1>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent/90 transition-colors">
                    <PlusCircle size={20} /> Create Order
                </motion.button>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 p-3 rounded-md mb-4 text-sm">
                    <WifiOff size={16} /> {error}
                </div>
            )}

            {(loading && orders.length === 0) ? (
                <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>
            ) : (
                <div className="bg-primary rounded-lg border border-border overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="p-4 font-semibold text-text-secondary">Product</th>
                                <th className="p-4 font-semibold text-text-secondary">Supplier</th>
                                <th className="p-4 font-semibold text-text-secondary text-center">Quantity</th>
                                <th className="p-4 font-semibold text-text-secondary text-center">Value</th>
                                <th className="p-4 font-semibold text-text-secondary text-center">Status</th>
                                <th className="p-4 font-semibold text-text-secondary">Expected Delivery</th>
                                {user.role === 'Admin' && <th className="p-4 font-semibold text-text-secondary text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b border-border hover:bg-secondary/50">
                                    <td className="p-4 text-text-primary font-medium">{order.product?.name || 'N/A'}</td>
                                    <td className="p-4 text-text-secondary">{order.supplier?.name || 'N/A'}</td>
                                    <td className="p-4 text-text-primary text-center">{order.quantity}</td>
                                    <td className="p-4 text-text-secondary text-center">${order.orderValue?.toFixed(2) || '0.00'}</td>
                                    <td className="p-4 text-center">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`px-3 py-1 text-xs font-semibold border-none outline-none appearance-none rounded-full cursor-pointer ${getStatusColor(order.status)}`}
                                            style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}
                                        >
                                            {ORDER_STATUSES.map(status => (
                                                <option key={status} value={status} className="bg-secondary text-text-primary font-medium">{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-4 text-text-secondary">{new Date(order.expectedDelivery).toLocaleDateString()}</td>
                                    {user.role === 'Admin' && (
                                        <td className="p-4 text-center">
                                            <button onClick={() => setDeletingOrder(order)} className="p-2 text-text-secondary hover:text-danger transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal title="Create New Order" isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <CreateOrderForm onOrderCreated={handleMutationSuccess} onClose={() => setIsAddModalOpen(false)} />
            </Modal>

            {deletingOrder && (
                <DeleteConfirmationModal
                    isOpen={!!deletingOrder}
                    onClose={() => setDeletingOrder(null)}
                    onConfirm={handleDelete}
                    loading={actionLoading}
                    productName={`Order for ${deletingOrder.product?.name || 'N/A'}`}
                />
            )}
        </motion.div>
    );
};

export default Orders;

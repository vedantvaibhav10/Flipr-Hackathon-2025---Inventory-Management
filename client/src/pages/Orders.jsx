import { useEffect, useState, useCallback } from 'react';
import apiClient from '../api';
import { motion } from 'framer-motion';
import { Loader2, PlusCircle } from 'lucide-react';
import Modal from '../components/common/Modal';
import CreateOrderForm from '../components/orders/CreateOrderForm';
import { toast } from 'react-hot-toast';
import ErrorDisplay from '../components/common/ErrorDisplay';

const getStatusColor = (status) => {
    const colors = {
        Ordered: 'bg-blue-500/20 text-blue-400',
        Shipped: 'bg-yellow-500/20 text-yellow-400',
        Delivered: 'bg-green-500/20 text-green-400',
        Cancelled: 'bg-red-500/20 text-red-400',
        Returned: 'bg-purple-500/20 text-purple-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
};

const ORDER_STATUSES = ['Ordered', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get('/orders');
            setOrders(response.data.data);
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError("You are not authorized to view orders.");
            } else {
                setError('Could not load order data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleOrderCreated = (newOrder) => {
        setOrders(prev => [newOrder, ...prev]);
        toast.success('Order created successfully!');
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const originalOrders = [...orders];
        setOrders(prev => prev.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
        ));

        try {
            const response = await apiClient.put(`/orders/${orderId}`, { status: newStatus });
            setOrders(prev => prev.map(order => order._id === orderId ? response.data.data : order));
            toast.success(`Order status updated to ${newStatus}`);
        } catch (err) {
            setOrders(originalOrders);
            toast.error(err.response?.data?.message || 'Failed to update order status.');
        }
    };

    if (error) return <ErrorDisplay message={error} onRetry={fetchOrders} />;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Orders</h1>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent/90 transition-colors">
                    <PlusCircle size={20} /> Create Order
                </motion.button>
            </div>

            {loading ? (
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal title="Create New Order" isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <CreateOrderForm onOrderCreated={handleOrderCreated} onClose={() => setIsAddModalOpen(false)} />
            </Modal>
        </motion.div>
    );
};

export default Orders;
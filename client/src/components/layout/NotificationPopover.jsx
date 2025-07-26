import { Link } from 'react-router-dom';
import { Package, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationPopover = ({ notifications, onMarkAsRead, unreadCount }) => {
    const lastReadTimestamp = localStorage.getItem('lastReadTimestamp') || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-secondary border border-border rounded-lg shadow-lg text-sm z-50"
        >
            <div className="flex justify-between items-center p-3 border-b border-border">
                <h3 className="font-semibold text-text-primary">Notifications</h3>
                {unreadCount > 0 && (
                    <button onClick={onMarkAsRead} className="text-xs text-accent hover:underline focus:outline-none">
                        Mark all as read
                    </button>
                )}
            </div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                    <ul>
                        {notifications.map(product => (
                            <li key={product._id} className={`border-b border-border last:border-b-0 ${new Date(product.updatedAt).getTime() > lastReadTimestamp ? 'bg-accent/5' : ''}`}>
                                <Link to="/inventory" className="flex items-start gap-3 p-3 hover:bg-accent/10 transition-colors">
                                    <div className="w-5 h-5 flex-shrink-0 mt-1">
                                        <Package className={`w-5 h-5 ${product.stockLevel === 0 ? 'text-danger' : 'text-warning'}`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-primary">Low Stock Alert</p>
                                        <p className="text-xs text-text-secondary">
                                            <span className="font-semibold text-text-primary">{product.name}</span> has only {product.stockLevel} units remaining.
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-6 text-center text-text-secondary">
                        <BellOff className="mx-auto h-10 w-10 mb-2" />
                        <p>No notifications right now.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default NotificationPopover;
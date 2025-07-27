import { Home, Package, BarChart2, Users, ShoppingCart, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: BarChart2, label: 'Reports', path: '/reports' },
    { icon: Users, label: 'Suppliers', path: '/suppliers' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
];

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-primary flex flex-col h-screen p-4 border-r border-border flex-shrink-0 sticky top-0">
            <div className="mb-10 p-2 flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-lg">
                    <svg width="24" height="24" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
                        <path d="M75 0 L150 43.3 V129.9 L75 173.2 L0 129.9 V43.3 Z" fill="#3B82F6" />
                        <path d="M75 20 L130 54.6 V123.8 L75 158.4 L20 123.8 V54.6 Z" fill="#161B22" />
                        <path d="M75 40 L110 60.8 V102.4 L75 123.2 L40 102.4 V60.8 Z" fill="#58A6FF" />
                    </svg>
                </div>
                <div className="text-xl">
                    <span className="font-bold text-text-primary">Inv</span>
                    <span className="font-medium text-text-secondary">Track</span>
                </div>
            </div>
            <nav className="flex-grow">
                <p className="px-3 text-xs font-semibold text-text-secondary uppercase mb-2">Menu</p>
                <ul>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path} className={({ isActive }) => `flex items-center p-3 my-1 rounded-lg transition-colors text-text-secondary hover:bg-secondary hover:text-text-primary ${isActive ? 'bg-accent/10 text-accent font-semibold' : ''}`}>
                                <item.icon className="w-5 h-5 mr-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="space-y-1 mb-20">
                <NavLink to="/settings" className={({ isActive }) => `flex items-center p-3 w-full rounded-lg transition-colors text-text-secondary hover:bg-secondary hover:text-text-primary ${isActive ? 'bg-accent/10 text-accent font-semibold' : ''}`}>
                    <Settings className="w-5 h-5 mr-4" />
                    <span>Settings</span>
                </NavLink>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleLogout} className="flex items-center p-3 w-full rounded-lg transition-colors text-text-secondary hover:bg-danger/20 hover:text-danger">
                    <LogOut className="w-5 h-5 mr-4" />
                    <span>Logout</span>
                </motion.button>
            </div>
        </aside>
    );
};

export default Sidebar;
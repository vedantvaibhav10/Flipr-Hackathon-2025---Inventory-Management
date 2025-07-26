import { Home, Package, BarChart2, Users, ShoppingCart, LogOut } from 'lucide-react';
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
        <aside className="w-64 bg-primary flex flex-col h-screen p-4 border-r border-border flex-shrink-0 z-50 sticky top-0">
            <div className="flex items-center gap-3 mb-10 p-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M7 15V12L10 9L14 13L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center p-3 my-1 rounded-lg transition-colors text-text-secondary hover:bg-secondary hover:text-text-primary ${isActive ? 'bg-accent/10 text-accent font-semibold' : ''
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 mr-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center p-3 w-full rounded-lg transition-colors text-text-secondary hover:bg-danger/20 hover:text-danger mb-16"
            >
                <LogOut className="w-5 h-5 mr-4" />
                <span>Logout</span>
            </motion.button>
        </aside>
    );
};

export default Sidebar;
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
        <aside className="w-64 bg-primary flex flex-col h-screen p-4 border-r border-border flex-shrink-0">
            <div className="text-2xl font-bold text-accent mb-10 p-2 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span>KANBAN</span>
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
            <div className="space-y-1">
                <button className="flex items-center p-3 w-full rounded-lg transition-colors text-text-secondary hover:bg-secondary hover:text-text-primary">
                    <Settings className="w-5 h-5 mr-4" />
                    <span>Settings</span>
                </button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex items-center p-3 w-full rounded-lg transition-colors text-text-secondary hover:bg-danger/20 hover:text-danger"
                >
                    <LogOut className="w-5 h-5 mr-4" />
                    <span>Logout</span>
                </motion.button>
            </div>
        </aside>
    );
};

export default Sidebar;

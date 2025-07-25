import { Home, Package, BarChart2, HardDrive, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: BarChart2, label: 'Reports', path: '/reports' },
    { icon: HardDrive, label: 'Inventory Logs', path: '/logs' },
    { icon: ShieldCheck, label: 'Health', path: '/health' },
];

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-primary flex flex-col h-screen p-4 border-r border-primary">
            <div className="text-2xl font-bold text-accent mb-10 p-2">InvTrack</div>
            <nav className="flex-grow">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center p-3 my-2 rounded-lg transition-colors text-text-secondary hover:bg-secondary hover:text-text-primary ${isActive ? 'bg-secondary text-text-primary' : ''
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 mr-4" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex items-center p-3 w-full rounded-lg transition-colors text-text-secondary hover:bg-danger/20 hover:text-danger"
                >
                    <LogOut className="w-5 h-5 mr-4" />
                    <span className="font-medium">Logout</span>
                </motion.button>
            </div>
        </aside>
    );
};

export default Sidebar;

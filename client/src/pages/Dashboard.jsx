import { motion } from 'framer-motion';
import StatCard from '../components/common/StatCard';
import CategoryChart from '../components/common/CategoryChart';
import LowStockTable from '../components/dashboard/LowStockTable';
import { Package, Boxes, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import apiClient from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await apiClient.get('/reports/summary');
                setStats(response.data.data);
            } catch (err) {
                setError('Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (error) {
        return <div className="text-center text-danger mt-10 p-4 bg-danger/10 rounded-md">{error}</div>;
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>

            {/* Top Stat Cards Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} loading={loading} />
                <StatCard title="Total Stock Value" value={stats?.totalStockValue ?? 0} icon={Boxes} loading={loading} />
                <StatCard title="Low Stock Items" value={stats?.lowStockCount ?? 0} icon={AlertTriangle} loading={loading} />
            </motion.div>

            {/* Main Charts and Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <CategoryChart data={stats?.stockByCategory} loading={loading} />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <LowStockTable />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;

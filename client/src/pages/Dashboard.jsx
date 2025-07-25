import { useEffect, useState } from 'react';
import apiClient from '../api';
import StatCard from '../components/common/StatCard';
import CategoryChart from '../components/common/CategoryChart';
import { Package, Boxes, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/reports/summary');
                setStats(response.data.data);
            } catch (err) {
                setError('Failed to fetch dashboard data. Please try refreshing the page.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    // Animation variants for the container to orchestrate children animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1 // Each child will animate 0.1s after the previous one
            }
        }
    };

    if (error) {
        return <div className="text-center text-danger mt-10 p-4 bg-danger/10 rounded-md">{error}</div>;
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            <h1 className="text-3xl font-bold text-text-primary">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} loading={loading} />
                <StatCard title="Total Stock Value" value={stats?.totalStockValue ?? 0} icon={Boxes} loading={loading} />
                <StatCard title="Low Stock Items" value={stats?.lowStockCount ?? 0} icon={AlertTriangle} loading={loading} />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <CategoryChart data={stats?.stockByCategory} loading={loading} />
                {/* You can add more charts here in the future */}
            </div>
        </motion.div>
    );
};

export default Dashboard;

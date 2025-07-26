import { motion } from 'framer-motion';
import StatCard from '../components/common/StatCard';
import CategoryChart from '../components/common/CategoryChart';
import LowStockTable from '../components/dashboard/LowStockTable';
import { Package, Boxes, AlertTriangle } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import apiClient from '../api';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get('/reports/summary');
            setStats(response.data.data);
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError("You are not authorized to view the dashboard.");
            } else {
                setError('The server is currently unavailable. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (error) {
        return <ErrorDisplay message={error} onRetry={fetchSummary} />;
    }

    if (loading) {
        return <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>;
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} loading={loading} />
                <StatCard title="Total Stock Value" value={`$${stats?.totalStockValue?.toFixed(2) ?? 0}`} icon={Boxes} loading={loading} />
                <StatCard title="Low Stock Items" value={stats?.lowStockCount ?? 0} icon={AlertTriangle} loading={loading} />
            </motion.div>

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
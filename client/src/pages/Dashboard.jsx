import { motion } from 'framer-motion';
import StatCard from '../components/common/StatCard';
import CategoryChart from '../components/common/CategoryChart';
import LowStockTable from '../components/dashboard/LowStockTable';
import { Package, Boxes, AlertTriangle } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import apiClient from '../api';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { Loader2 } from 'lucide-react';
import DateRangeFilter from '../components/common/DateRangeFilter';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (dateRange.startDate && dateRange.endDate) {
                params.startDate = dateRange.startDate.toISOString();
                params.endDate = dateRange.endDate.toISOString();
            }
            const response = await apiClient.get('/reports/summary', { params });
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
    }, [dateRange]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const handleDateChange = (newDateRange) => {
        setDateRange(newDateRange);
    };

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

    if (error) return <ErrorDisplay message={error} onRetry={fetchSummary} />;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                <DateRangeFilter onDateChange={handleDateChange} />
            </div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} loading={loading} />
                <StatCard title="Total Stock Value" value={`$${stats?.totalStockValue?.toFixed(2) ?? 0}`} icon={Boxes} loading={loading} />
                <StatCard title="Low Stock Items" value={stats?.lowStockCount ?? 0} icon={AlertTriangle} loading={loading} />
            </motion.div>

            <motion.div variants={itemVariants} className="bg-primary p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Overview for Selected Period</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-text-secondary">Sales</p>
                        <p className="text-2xl font-bold text-text-primary">{stats?.salesOverview?.sales ?? 0}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Revenue</p>
                        <p className="text-2xl font-bold text-success">${stats?.salesOverview?.revenue?.toFixed(2) ?? 0}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Purchases</p>
                        <p className="text-2xl font-bold text-text-primary">{stats?.purchaseOverview?.purchase ?? 0}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Cost</p>
                        <p className="text-2xl font-bold text-danger">${stats?.purchaseOverview?.cost?.toFixed(2) ?? 0}</p>
                    </div>
                </div>
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

import { motion } from 'framer-motion';

const Dashboard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-text-primary mb-6">Dashboard</h1>
            <div className="p-8 bg-primary rounded-lg border border-primary">
                <p className="text-text-secondary">Welcome to your dashboard. Analytics and charts will be displayed here.</p>
            </div>
        </motion.div>
    );
};

export default Dashboard;

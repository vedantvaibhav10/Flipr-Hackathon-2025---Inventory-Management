import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const CategoryChart = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="h-80 flex items-center justify-center bg-primary rounded-lg border border-border">
                <Loader2 className="animate-spin h-8 w-8" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-primary p-6 rounded-lg border border-border"
        >
            <h3 className="text-lg font-semibold text-text-primary mb-4">Stock by Category</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="_id" stroke="var(--text-secondary)" />
                        <YAxis stroke="var(--text-secondary)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--secondary)',
                                borderColor: 'var(--border)',
                                color: 'var(--text-primary)'
                            }}
                        />
                        <Bar dataKey="totalStock" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default CategoryChart;

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// A vibrant, beautiful color palette for our charts
const CHART_COLORS = ['#58A6FF', '#3FB950', '#F778BA', '#A371F7', '#E8C547'];

const CategoryChart = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="h-80 flex items-center justify-center bg-primary rounded-lg border border-border">
                <Loader2 className="animate-spin h-8 w-8" />
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-secondary p-2 border border-border rounded-md shadow-lg">
                    <p className="text-text-secondary">{label}</p>
                    <p className="text-text-primary font-bold">{`Total Stock: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

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
                        <XAxis dataKey="_id" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                        <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--secondary)' }} />
                        <Bar dataKey="totalStock" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default CategoryChart;

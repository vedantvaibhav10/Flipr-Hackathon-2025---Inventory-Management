import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const StockStatusChart = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="h-80 flex items-center justify-center bg-primary rounded-lg border border-border">
                <Loader2 className="animate-spin h-8 w-8" />
            </div>
        );
    }

    const chartData = [
        { name: 'Low Stock', value: data?.lowStockCount || 0 },
        { name: 'Healthy Stock', value: (data?.totalProducts - data?.lowStockCount) || 0 },
    ];

    const COLORS = ['var(--danger)', 'var(--success)'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-secondary p-2 border border-border rounded-md shadow-lg">
                    <p className="text-text-primary">{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-primary p-6 rounded-lg border border-border"
        >
            <h3 className="text-lg font-semibold text-text-primary mb-4">Stock Health Status</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={110}
                            fill="#8884d8"
                            dataKey="value"
                            stroke="var(--primary)"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default StockStatusChart;

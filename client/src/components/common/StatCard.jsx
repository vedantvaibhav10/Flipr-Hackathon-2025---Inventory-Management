import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, loading }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={cardVariants}
            className="bg-primary p-6 rounded-lg border border-border flex items-center justify-between"
        >
            <div>
                <p className="text-sm font-medium text-text-secondary">{title}</p>
                {loading ? (
                    <Loader2 className="animate-spin h-6 w-6 mt-1" />
                ) : (
                    <p className="text-3xl font-bold text-text-primary">{value}</p>
                )}
            </div>
            {Icon && <Icon className="w-10 h-10 text-accent" />}
        </motion.div>
    );
};

export default StatCard;

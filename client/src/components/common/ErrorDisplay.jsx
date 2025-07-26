import { motion } from 'framer-motion';
import { AlertTriangle, RotateCw } from 'lucide-react';

const ErrorDisplay = ({
    title = "Oops! Something went wrong.",
    message,
    onRetry
}) => {
    return (
        <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary p-8 rounded-lg border border-border max-w-md w-full"
            >
                <AlertTriangle className="mx-auto h-16 w-16 text-danger mb-4" />
                <h2 className="text-xl font-bold text-text-primary mb-2">{title}</h2>
                <p className="text-text-secondary mb-8">{message}</p>

                {onRetry && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRetry}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto mx-auto px-6 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent/90 transition-colors"
                    >
                        <RotateCw size={18} />
                        Try Again
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
};

export default ErrorDisplay;
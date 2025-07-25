import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    const backdropVariants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    const modalVariants = {
        hidden: { y: "-50px", opacity: 0 },
        visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { y: "50px", opacity: 0 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdropVariants}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-primary rounded-lg shadow-xl w-full max-w-lg border border-border flex flex-col max-h-[90vh]" // <-- CHANGE HERE
                        variants={modalVariants}
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                            <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
                            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto"> {/* <-- CHANGE HERE */}
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;

import Modal from './Modal';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading, productName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
            <div className="text-center">
                <AlertTriangle className="mx-auto h-16 w-16 text-danger mb-4" />
                <h3 className="text-lg font-medium text-text-primary">Are you sure?</h3>
                <p className="mt-2 text-sm text-text-secondary">
                    Do you really want to delete the product "<strong>{productName}</strong>"? This process cannot be undone.
                </p>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-text-primary bg-secondary rounded-md border border-border hover:bg-secondary/80"
                >
                    Cancel
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onConfirm}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-danger rounded-md hover:bg-danger/90 disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Delete'}
                </motion.button>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal;

import { useEffect, useState } from 'react';
import { useCachedData } from '../hooks/useCachedData';
import apiClient from '../api';
import { motion } from 'framer-motion';
import { PlusCircle, Loader2, Edit, Trash2, BarChart, WifiOff } from 'lucide-react';
import Modal from '../components/common/Modal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import { toast } from 'react-hot-toast';
import AddSupplierForm from '../components/suppliers/AddSupplierForm';
import EditSupplierForm from '../components/suppliers/EditSupplierForm';
import { db } from '../db';
import { addToOutbox } from '../services/syncManager';
import { useAuth } from '../hooks/useAuth';

const Suppliers = () => {
    const { data: suppliers, loading, error, forceSync } = useCachedData('suppliers', '/suppliers');
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [deletingSupplier, setDeletingSupplier] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleMutationSuccess = () => {
        forceSync();
    };

    const handleDelete = async () => {
        if (!deletingSupplier) return;
        setActionLoading(true);
        try {
            await apiClient.delete(`/suppliers/${deletingSupplier._id}`);
            await db.suppliers.delete(deletingSupplier._id);
            toast.success("Supplier deleted!");
            setDeletingSupplier(null);
        } catch (err) {
            if (!err.response && !deletingSupplier._id.startsWith('offline_')) {
                toast.success('Offline: Delete action saved, will sync later.');
                await db.suppliers.delete(deletingSupplier._id);
                await addToOutbox({ url: `/suppliers/${deletingSupplier._id}`, method: 'delete' });
                setDeletingSupplier(null);
            } else {
                toast.error("Failed to delete supplier.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleSupplierAnalysis = async (supplierId, supplierName) => {
        toast.loading(`Analyzing ${supplierName}...`);
        try {
            const res = await apiClient.get(`/ai/supplier-analysis/${supplierId}`);
            toast.dismiss();
            toast.success(res.data.analysis, { duration: 10000 });
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to analyze supplier.");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Suppliers</h1>
                {user.role === 'Admin' && (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent/90 transition-colors">
                        <PlusCircle size={20} /> Create Supplier
                    </motion.button>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 p-3 rounded-md mb-4 text-sm">
                    <WifiOff size={16} /> {error}
                </div>
            )}

            {(loading && suppliers.length === 0) ? (
                <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>
            ) : (
                <div className="bg-primary rounded-lg border border-border overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="p-4 font-semibold text-text-secondary">Name</th>
                                <th className="p-4 font-semibold text-text-secondary">Contact Number</th>
                                <th className="p-4 font-semibold text-text-secondary">Email</th>
                                {user.role === 'Admin' && <th className="p-4 font-semibold text-text-secondary text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier) => (
                                <tr key={supplier._id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                                    <td className="p-4 text-text-primary font-medium">{supplier.name}</td>
                                    <td className="p-4 text-text-secondary">{supplier.contactNumber || '-'}</td>
                                    <td className="p-4 text-text-secondary">{supplier.email || '-'}</td>
                                    {user.role === 'Admin' && (
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => handleSupplierAnalysis(supplier._id, supplier.name)} title="Analyze Supplier Performance" className="p-2 text-text-secondary hover:text-blue-400 transition-colors">
                                                    <BarChart size={18} />
                                                </button>
                                                <button onClick={() => setEditingSupplier(supplier)} className="p-2 text-text-secondary hover:text-accent transition-colors"><Edit size={18} /></button>
                                                <button onClick={() => setDeletingSupplier(supplier)} className="p-2 text-text-secondary hover:text-danger transition-colors"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal title="Create New Supplier" isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <AddSupplierForm onSupplierAdded={handleMutationSuccess} onClose={() => setIsAddModalOpen(false)} />
            </Modal>

            {editingSupplier && (
                <Modal title="Edit Supplier" isOpen={!!editingSupplier} onClose={() => setEditingSupplier(null)}>
                    <EditSupplierForm supplier={editingSupplier} onSupplierUpdated={handleMutationSuccess} onClose={() => setEditingSupplier(null)} />
                </Modal>
            )}

            {deletingSupplier && (
                <DeleteConfirmationModal
                    isOpen={!!deletingSupplier}
                    onClose={() => setDeletingSupplier(null)}
                    onConfirm={handleDelete}
                    loading={actionLoading}
                    productName={deletingSupplier.name}
                />
            )}
        </motion.div>
    );
};

export default Suppliers;

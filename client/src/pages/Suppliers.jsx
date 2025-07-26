import { useEffect, useState } from 'react';
import apiClient from '../api';
import { motion } from 'framer-motion';
import { PlusCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/common/Modal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [deletingSupplier, setDeletingSupplier] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/suppliers');
            setSuppliers(response.data.data);
        } catch (err) {
            setError('Failed to fetch suppliers.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleSupplierAdded = (newSupplier) => {
        setSuppliers(prev => [newSupplier, ...prev]);
    };

    const handleSupplierUpdated = (updatedSupplier) => {
        setSuppliers(prev => prev.map(s => s._id === updatedSupplier._id ? updatedSupplier : s));
    };

    const handleDelete = async () => {
        if (!deletingSupplier) return;
        setActionLoading(true);
        try {
            await apiClient.delete(`/suppliers/${deletingSupplier._id}`);
            setSuppliers(prev => prev.filter(s => s._id !== deletingSupplier._id));
            setDeletingSupplier(null);
        } catch (err) {
            console.error('Failed to delete supplier', err);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Suppliers</h1>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent/90 transition-colors">
                    <PlusCircle size={20} /> Create Supplier
                </motion.button>
            </div>

            {loading && <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>}
            {error && <div className="text-center text-danger mt-10 p-4 bg-danger/10 rounded-md">{error}</div>}

            {!loading && !error && (
                <div className="bg-primary rounded-lg border border-border overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="p-4 font-semibold text-text-secondary">Name</th>
                                <th className="p-4 font-semibold text-text-secondary">Contact Number</th>
                                <th className="p-4 font-semibold text-text-secondary">Email</th>
                                <th className="p-4 font-semibold text-text-secondary text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier) => (
                                <tr key={supplier._id} className="border-b border-border hover:bg-secondary transition-colors">
                                    <td className="p-4 text-text-primary font-medium">{supplier.name}</td>
                                    <td className="p-4 text-text-secondary">{supplier.contactNumber}</td>
                                    <td className="p-4 text-text-secondary">{supplier.email}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => setEditingSupplier(supplier)} className="p-2 text-text-secondary hover:text-accent"><Edit size={18} /></button>
                                            <button onClick={() => setDeletingSupplier(supplier)} className="p-2 text-text-secondary hover:text-danger"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal title="Create New Supplier" isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                {/* You will need to create this form component */}
                {/* <AddSupplierForm onSupplierAdded={handleSupplierAdded} onClose={() => setIsAddModalOpen(false)} /> */}
            </Modal>

            {editingSupplier && (
                <Modal title="Edit Supplier" isOpen={!!editingSupplier} onClose={() => setEditingSupplier(null)}>
                    {/* You will need to create this form component */}
                    {/* <EditSupplierForm supplier={editingSupplier} onSupplierUpdated={handleSupplierUpdated} onClose={() => setEditingSupplier(null)} /> */}
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
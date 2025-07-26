import { useState, useEffect } from 'react';
import apiClient from '../../api';
import { db } from '../../db';
import { addToOutbox } from '../../services/syncManager';
import FormField from '../common/FormField';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EditSupplierForm = ({ supplier, onSupplierUpdated, onClose }) => {
    const [formData, setFormData] = useState({ name: '', contactNumber: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name || '',
                contactNumber: supplier.contactNumber || '',
                email: supplier.email || '',
            });
        }
    }, [supplier]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.put(`/suppliers/${supplier._id}`, formData);
            toast.success('Supplier updated successfully!');
            onSupplierUpdated();
            onClose();
        } catch (err) {
            if (!err.response) { // Offline
                toast.success('Offline: Supplier update saved locally, will sync later.');
                await db.suppliers.update(supplier._id, formData);
                await addToOutbox({
                    url: `/suppliers/${supplier._id}`,
                    method: 'put',
                    data: formData,
                });
                onSupplierUpdated();
                onClose();
            } else {
                const errorMessage = err.response?.data?.message || 'Failed to update supplier.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-danger text-center p-2 bg-danger/10 rounded-md">{error}</p>}
            <FormField label="Supplier Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
            <FormField label="Contact Number" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            <FormField label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            <div className="flex justify-end gap-3 pt-4">
                <motion.button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-secondary rounded-md border border-border" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Cancel
                </motion.button>
                <motion.button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md disabled:opacity-50 flex items-center justify-center w-32" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                </motion.button>
            </div>
        </form>
    );
};

export default EditSupplierForm;

import { useState } from 'react';
import apiClient from '../../api';
import FormField from '../common/FormField';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { db } from '../../db';
import { addToOutbox } from '../../services/syncManager';

const AddSupplierForm = ({ onSupplierAdded, onClose }) => {
    const [formData, setFormData] = useState({ name: '', contactNumber: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await apiClient.post('/suppliers', formData);
            toast.success('Supplier added successfully!');
            onSupplierAdded();
            onClose();
        } catch (err) {
            if (!err.response) {
                toast.success('Offline: Supplier saved locally, will sync later.');
                const offlineId = `offline_${Date.now()}`;
                await db.suppliers.add({ ...formData, _id: offlineId });
                await addToOutbox({ url: '/suppliers/sync', method: 'post', data: formData });
                onClose();
            } else {
                setError(err.response?.data?.message || 'Failed to add supplier.');
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
                <motion.button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md disabled:opacity-50 flex items-center justify-center w-28" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Add Supplier'}
                </motion.button>
            </div>
        </form>
    );
};

export default AddSupplierForm;
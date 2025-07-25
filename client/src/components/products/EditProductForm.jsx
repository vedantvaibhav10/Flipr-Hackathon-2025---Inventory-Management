import { useState, useEffect } from 'react';
import apiClient from '../../api';
import FormField from '../common/FormField';
import { motion } from 'framer-motion';
import { Loader2, Upload } from 'lucide-react';

const EditProductForm = ({ product, onProductUpdated, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        stockLevel: 0,
        threshold: 10,
    });
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Populate form when the component receives a product to edit
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                sku: product.sku,
                category: product.category,
                stockLevel: product.stockLevel,
                threshold: product.threshold,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const productData = new FormData();
        Object.keys(formData).forEach(key => {
            productData.append(key, formData[key]);
        });
        if (imageFile) {
            productData.append('image', imageFile);
        }

        try {
            const response = await apiClient.put(`/products/${product._id}`, productData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onProductUpdated(response.data.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Product Name" id="name" value={formData.name} onChange={handleChange} required />
            <FormField label="SKU" id="sku" value={formData.sku} onChange={handleChange} required />
            <FormField label="Category" id="category" value={formData.category} onChange={handleChange} required />
            <FormField label="Stock Level" id="stockLevel" type="number" value={formData.stockLevel} onChange={handleChange} required />
            <FormField label="Low Stock Threshold" id="threshold" type="number" value={formData.threshold} onChange={handleChange} required />

            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Update Image (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-text-secondary" />
                        <div className="flex text-sm text-text-secondary">
                            <label htmlFor="edit-image" className="relative cursor-pointer bg-secondary rounded-md font-medium text-accent hover:text-accent/80 p-1">
                                <span>Upload a file</span>
                                <input id="edit-image" name="image" type="file" className="sr-only" onChange={handleFileChange} />
                            </label>
                        </div>
                        <p className="text-xs text-text-secondary">{imageFile ? imageFile.name : 'PNG, JPG up to 10MB'}</p>
                    </div>
                </div>
            </div>

            {error && <p className="text-sm text-danger text-center">{error}</p>}

            <div className="pt-2">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save Changes'}
                </motion.button>
            </div>
        </form>
    );
};

export default EditProductForm;

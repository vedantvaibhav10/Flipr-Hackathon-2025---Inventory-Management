import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api';
import { db } from '../../db';
import { addToOutbox } from '../../services/syncManager';
import FormField from '../common/FormField';
import { motion } from 'framer-motion';
import { Loader2, Upload, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddProductForm = ({ onProductAdded, onClose }) => {
    const [formData, setFormData] = useState({
        name: '', sku: '', category: '', description: '', stockLevel: '',
        threshold: '', buyingPrice: '', sellingPrice: '', expiryDate: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestedCategory, setSuggestedCategory] = useState('');

    const suggestCategory = useCallback(async (productName) => {
        if (productName.length > 3 && navigator.onLine) {
            try {
                const res = await apiClient.post('/products/suggest-category', { name: productName });
                setSuggestedCategory(res.data.suggestedCategory);
            } catch (error) {
                console.error("Category suggestion failed:", error);
            }
        }
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            suggestCategory(formData.name);
        }, 500);
        return () => clearTimeout(debounce);
    }, [formData.name, suggestCategory]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e) => setImageFile(e.target.files[0]);

    const handleGenerateDescription = async () => {
        if (!formData.name || !formData.category) {
            return toast.error("Please enter a Name and Category first.");
        }
        setIsGenerating(true);
        try {
            const res = await apiClient.post('/products/generate-description', { name: formData.name, category: formData.category });
            setFormData(prev => ({ ...prev, description: res.data.description }));
            toast.success("Description generated!");
        } catch (error) {
            toast.error("Failed to generate description.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const productPayload = { ...formData };

        try {
            const productFormData = new FormData();
            Object.keys(productPayload).forEach(key => productFormData.append(key, productPayload[key]));
            if (imageFile) productFormData.append('image', imageFile);

            await apiClient.post('/products', productFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Product created successfully!');
            onProductAdded();
            onClose();
        } catch (err) {
            if (!err.response) {
                toast.success('Offline: Product saved locally, will sync later.');
                const offlineId = `offline_${Date.now()}`;

                await db.products.add({ ...productPayload, _id: offlineId });

                await addToOutbox({
                    url: '/products',
                    method: 'post',
                    data: productPayload,
                });

                onClose();
            } else {
                setError(err.response?.data?.message || 'Failed to create product.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-danger text-center">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Product Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
                <FormField label="SKU (Stock Keeping Unit)" id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
                <div>
                    <FormField label="Category" id="category" name="category" value={formData.category} onChange={handleChange} required />
                    {suggestedCategory && formData.category !== suggestedCategory && (
                        <p className="text-xs mt-1 text-text-secondary">
                            Suggestion: <button type="button" className="text-accent underline" onClick={() => { setFormData(prev => ({ ...prev, category: suggestedCategory })); setSuggestedCategory(''); }}>{suggestedCategory}</button>
                        </p>
                    )}
                </div>
                <FormField label="Initial Stock Level" id="stockLevel" name="stockLevel" type="number" value={formData.stockLevel} onChange={handleChange} required />
                <FormField label="Buying Price ($)" id="buyingPrice" name="buyingPrice" type="number" step="0.01" value={formData.buyingPrice} onChange={handleChange} required />
                <FormField label="Selling Price ($)" id="sellingPrice" name="sellingPrice" type="number" step="0.01" value={formData.sellingPrice} onChange={handleChange} required />
                <FormField label="Low Stock Threshold" id="threshold" name="threshold" type="number" value={formData.threshold} onChange={handleChange} required />
                <FormField label="Expiry Date (Optional)" id="expiryDate" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="description" className="form-label flex justify-between items-center">
                    Description
                    <button type="button" onClick={handleGenerateDescription} disabled={isGenerating || loading} className="flex items-center gap-1 text-xs text-accent hover:underline disabled:opacity-50">
                        {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                        Generate with AI
                    </button>
                </label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="input-field"></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-text-secondary">Product Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-text-secondary" />
                        <div className="flex text-sm text-text-secondary">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-secondary rounded-md font-medium text-accent hover:text-accent/80 p-1">
                                <span>Upload a file</span>
                                <input id="file-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} />
                            </label>
                        </div>
                        <p className="text-xs text-text-secondary">{imageFile ? imageFile.name : 'PNG, JPG, GIF up to 10MB'}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <motion.button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md border border-border" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Cancel
                </motion.button>
                <motion.button type="submit" disabled={loading} className="btn-primary w-32" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Create'}
                </motion.button>
            </div>
        </form>
    );
};

export default AddProductForm;

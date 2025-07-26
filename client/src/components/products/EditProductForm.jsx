import { useState, useEffect } from 'react';
import apiClient from '../../api';
import FormField from '../common/FormField';
import { motion } from 'framer-motion';
import { Loader2, Upload, Edit, PackageMinus, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

const EditProductForm = ({ product, onProductUpdated, onClose }) => {
    const [detailsData, setDetailsData] = useState({
        name: '', sku: '', category: '', description: '', threshold: '',
        buyingPrice: '', sellingPrice: '', expiryDate: '', stockLevel: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [adjustmentData, setAdjustmentData] = useState({
        quantity: '', actionType: 'RESTOCK', notes: ''
    });
    const [adjustmentLoading, setAdjustmentLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (product) {
            setDetailsData({
                name: product.name || '',
                sku: product.sku || '',
                category: product.category || '',
                description: product.description || '',
                threshold: product.threshold ?? '',
                buyingPrice: product.buyingPrice ?? '',
                sellingPrice: product.sellingPrice ?? '',
                expiryDate: formatDateForInput(product.expiryDate),
                stockLevel: product.stockLevel ?? '',
            });
        }
    }, [product]);

    const handleDetailsChange = (e) => setDetailsData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleAdjustmentChange = (e) => setAdjustmentData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e) => setImageFile(e.target.files[0]);

    const handlePricingSuggestion = async () => {
        toast.loading("Getting AI suggestion...");
        try {
            const res = await apiClient.get(`/ai/pricing-suggestion/${product._id}`);
            toast.dismiss();
            toast.success(res.data.suggestion, { duration: 8000 });
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to get pricing suggestion.");
        }
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        setDetailsLoading(true);
        setError('');
        const productData = new FormData();
        Object.keys(detailsData).forEach(key => productData.append(key, detailsData[key]));
        if (imageFile) productData.append('image', imageFile);

        try {
            const response = await apiClient.put(`/products/${product._id}`, productData);
            toast.success('Product details updated!');
            onProductUpdated(response.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update details.');
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleStockAdjustment = async (e) => {
        e.preventDefault();
        setAdjustmentLoading(true);
        setError('');
        const payload = {
            productId: product._id,
            quantity: Number(adjustmentData.quantity),
            actionType: adjustmentData.actionType,
            notes: adjustmentData.notes
        };
        try {
            const response = await apiClient.post(`/inventory/update`, payload);
            toast.success('Stock adjusted successfully!');
            onProductUpdated(response.data.data);
            setAdjustmentData({ quantity: '', actionType: 'RESTOCK', notes: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to adjust stock.');
        } finally {
            setAdjustmentLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {error && <p className="text-sm text-danger text-center p-2 bg-danger/10 rounded-md">{error}</p>}
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2 flex items-center gap-2"><Edit size={20} /> Edit Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 p-1">
                    <FormField label="Product Name" id="edit-name" name="name" value={detailsData.name} onChange={handleDetailsChange} required />
                    <FormField label="SKU" id="edit-sku" name="sku" value={detailsData.sku} onChange={handleDetailsChange} required />
                    <FormField label="Category" id="edit-category" name="category" value={detailsData.category} onChange={handleDetailsChange} required />
                    <FormField label="Current Stock Level" id="edit-stockLevel" name="stockLevel" type="number" value={detailsData.stockLevel} onChange={handleDetailsChange} required />
                    <FormField label="Low Stock Threshold" id="edit-threshold" name="threshold" type="number" value={detailsData.threshold} onChange={handleDetailsChange} required />
                    <FormField label="Buying Price ($)" id="edit-buyingPrice" name="buyingPrice" type="number" step="0.01" value={detailsData.buyingPrice} onChange={handleDetailsChange} required />
                    <div>
                        <label htmlFor="edit-sellingPrice" className="form-label flex justify-between items-center">
                            Selling Price ($)
                            <button type="button" onClick={handlePricingSuggestion} className="flex items-center gap-1 text-xs text-accent hover:underline">
                                <Sparkles size={14} /> Get Suggestion
                            </button>
                        </label>
                        <input id="edit-sellingPrice" name="sellingPrice" type="number" step="0.01" value={detailsData.sellingPrice} onChange={handleDetailsChange} required className="input-field" />
                    </div>
                    <FormField label="Expiry Date" id="edit-expiryDate" name="expiryDate" type="date" value={detailsData.expiryDate} onChange={handleDetailsChange} />
                </div>
                <div>
                    <label htmlFor="edit-description" className="form-label">Description</label>
                    <textarea id="edit-description" name="description" value={detailsData.description} onChange={handleDetailsChange} rows="3" className="input-field"></textarea>
                </div>
            </form>
        </div>
    );
};

export default EditProductForm;
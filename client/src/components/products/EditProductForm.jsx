import { useState, useEffect } from 'react';
import apiClient from '../../api';
import { db } from '../../db';
import { addToOutbox } from '../../services/syncManager';
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
        barcode: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [adjustmentData, setAdjustmentData] = useState({
        quantity: '',
        actionType: 'RESTOCK',
        notes: ''
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
                barcode: product.barcode || '',
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

        const productPayload = { ...detailsData };
        const productFormData = new FormData();
        Object.keys(productPayload).forEach(key => productFormData.append(key, productPayload[key]));
        if (imageFile) productFormData.append('image', imageFile);

        try {
            const response = await apiClient.put(`/products/${product._id}`, productFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Product details updated!');
            onProductUpdated();
            onClose();
        } catch (err) {
            if (!err.response) {
                toast.success('Offline: Product update saved locally, will sync later.');
                await db.products.update(product._id, productPayload);
                await addToOutbox({
                    url: `/products/${product._id}`,
                    method: 'put',
                    data: productPayload,
                });
                onProductUpdated();
                onClose();
            } else {
                const errorMessage = err.response?.data?.message || 'Failed to update details.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleStockAdjustment = async (e) => {
        e.preventDefault();
        const qty = Number(adjustmentData.quantity);
        if (!qty || qty <= 0 || isNaN(qty)) {
            return setError('Please enter a valid, positive quantity.');
        }
        setAdjustmentLoading(true);
        setError('');

        const payload = {
            productId: product._id,
            quantity: qty,
            actionType: adjustmentData.actionType,
            notes: adjustmentData.notes
        };

        try {
            const response = await apiClient.post(`/inventory/update`, payload);
            toast.success('Stock adjusted successfully!');
            onProductUpdated();
            setAdjustmentData({ quantity: '', actionType: 'RESTOCK', notes: '' });
        } catch (err) {
            if (!err.response) { // Offline
                toast.error('Offline mode: Manual stock adjustments cannot be made offline.');
            } else {
                const errorMessage = err.response?.data?.message || 'Failed to adjust stock.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
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
                <div className="pt-2">
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
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={detailsLoading} className="px-4 py-2 bg-accent text-white font-semibold rounded-lg flex items-center justify-center w-36">
                        {detailsLoading ? <Loader2 className="animate-spin" /> : 'Save Details'}
                    </button>
                </div>
                <FormField label="Barcode (UPC/EAN)" id="edit-barcode" name="barcode" value={detailsData.barcode} onChange={handleDetailsChange} />
            </form>

            <form onSubmit={handleStockAdjustment} className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2"><PackageMinus size={20} /> Manual Stock Adjustment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 p-1">
                    <div>
                        <label htmlFor="actionType" className="form-label">Reason / Action</label>
                        <select
                            id="actionType"
                            name="actionType"
                            value={adjustmentData.actionType}
                            onChange={handleAdjustmentChange}
                            className="select-field"
                            required
                        >
                            <option value="RESTOCK">Restock (+)</option>
                            <option value="RETURN">Customer Return (+)</option>
                            <option value="SALE">Manual Sale (-)</option>
                            <option value="DAMAGE">Damaged Goods (-)</option>
                        </select>
                    </div>
                    <FormField label="Quantity" id="quantity" name="quantity" type="number" value={adjustmentData.quantity} onChange={handleAdjustmentChange} placeholder="e.g., 10" required />
                </div>
                <FormField label="Notes (Optional)" id="notes" name="notes" value={adjustmentData.notes} onChange={handleAdjustmentChange} placeholder="e.g., Warehouse transfer" />
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={adjustmentLoading} className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg border border-border flex items-center justify-center w-36">
                        {adjustmentLoading ? <Loader2 className="animate-spin" /> : 'Adjust Stock'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductForm;

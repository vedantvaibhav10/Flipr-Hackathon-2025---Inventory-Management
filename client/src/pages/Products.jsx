import { useEffect, useState } from 'react';
import { useCachedData } from '../hooks/useCachedData';
import apiClient from '../api';
import { motion } from 'framer-motion';
import { PlusCircle, Loader2, Edit, Trash2, Lightbulb, Camera, WifiOff } from 'lucide-react';
import Modal from '../components/common/Modal';
import AddProductForm from '../components/products/AddProductForm';
import EditProductForm from '../components/products/EditProductForm';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import BarcodeScannerModal from '../components/common/BarcodeScannerModal';
import { toast } from 'react-hot-toast';
import { db } from '../db';
import { addToOutbox } from '../services/syncManager';
import { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

const Products = () => {
    const { data: products, loading, error, forceSync } = useCachedData('products', '/products');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const barcodeFileInputRef = useRef(null);

    const handleMutationSuccess = () => {
        forceSync();
    };

    const handleDelete = async () => {
        if (!deletingProduct) return;
        setActionLoading(true);
        try {
            await apiClient.delete(`/products/${deletingProduct._id}`);
            await db.products.delete(deletingProduct._id);
            toast.success("Product deleted!");
            setDeletingProduct(null);
        } catch (err) {
            if (!err.response && !deletingProduct._id.startsWith('offline_')) {
                toast.success('Offline: Delete action saved, will sync later.');
                await db.products.delete(deletingProduct._id);
                await addToOutbox({ url: `/products/${deletingProduct._id}`, method: 'delete' });
                setDeletingProduct(null);
            } else {
                toast.error("Failed to delete product.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleReorderSuggestion = async (productId, productName) => {
        toast.loading(`Getting suggestion for ${productName}...`);
        try {
            const res = await apiClient.get(`/ai/reorder-suggestion/${productId}`);
            toast.dismiss();
            toast.success(res.data.suggestion, { duration: 8000 });
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to get reorder suggestion.");
        }
    };

    const handleScanSuccess = async (barcode) => {
        setIsScannerOpen(false);
        toast.loading(`Searching for barcode: ${barcode}`);
        try {
            const response = await apiClient.get(`/products/barcode/${barcode}`);
            toast.dismiss();
            toast.success(`Product "${response.data.data.name}" found!`);
            setEditingProduct(response.data.data);
        } catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.message || 'Failed to find product.');
        }
    };

    const handleBarcodeImageSearch = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('barcodeImage', file);

        toast.loading('Decoding and searching...');
        try {
            const response = await apiClient.post('/products/decode-barcode', uploadFormData);
            handleScanSuccess(response.data.barcode); // Reuse the scan success logic
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || 'Could not find product from image.');
        } finally {
            if (barcodeFileInputRef.current) {
                barcodeFileInputRef.current.value = "";
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Inventory</h1>
                <div className="flex items-center gap-2 sm:gap-4">
                    <input type="file" ref={barcodeFileInputRef} onChange={handleBarcodeImageSearch} className="hidden" accept="image/*" id="barcode-search-upload" />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => document.getElementById('barcode-search-upload').click()} className="flex items-center gap-2 px-4 py-2 bg-secondary text-text-primary font-semibold rounded-lg shadow-sm hover:bg-secondary/80 border border-border transition-colors">
                        <UploadCloud size={20} />
                        <span className="hidden sm:inline">Upload Barcode</span>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsScannerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-secondary text-text-primary font-semibold rounded-lg shadow-sm hover:bg-secondary/80 border border-border transition-colors">
                        <Camera size={20} />
                        <span className="hidden sm:inline">Scan Barcode</span>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent/90 transition-colors">
                        <PlusCircle size={20} /> Add Product
                    </motion.button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 p-3 rounded-md mb-4 text-sm">
                    <WifiOff size={16} /> {error}
                </div>
            )}

            {(loading && products.length === 0) ? (
                <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>
            ) : (
                <div className="bg-primary rounded-lg border border-border overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="p-4 font-semibold text-text-secondary">Image</th>
                                <th className="p-4 font-semibold text-text-secondary">Name</th>
                                <th className="p-4 font-semibold text-text-secondary">SKU</th>
                                <th className="p-4 font-semibold text-text-secondary">Category</th>
                                <th className="p-4 font-semibold text-text-secondary text-center">Stock</th>
                                <th className="p-4 font-semibold text-text-secondary text-center">Price</th>
                                <th className="p-4 font-semibold text-text-secondary text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                                    <td className="p-4">
                                        <img src={product.image?.url || `https://placehold.co/40x40/1C222B/9DA3AE?text=${product.name.charAt(0)}`} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                                    </td>
                                    <td className="p-4 text-text-primary font-medium">{product.name}</td>
                                    <td className="p-4 text-text-secondary">{product.sku}</td>
                                    <td className="p-4 text-text-secondary">{product.category}</td>
                                    <td className="p-4 text-text-primary text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stockLevel < product.threshold ? 'bg-danger/20 text-danger' : 'bg-success/20 text-success'}`}>
                                            {product.stockLevel}
                                        </span>
                                    </td>
                                    <td className="p-4 text-text-primary text-center">${product.sellingPrice?.toFixed(2)}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            {product.stockLevel < product.threshold && (
                                                <button onClick={() => handleReorderSuggestion(product._id, product.name)} title="AI Reorder Suggestion" className="p-2 text-text-secondary hover:text-yellow-400 transition-colors">
                                                    <Lightbulb size={18} />
                                                </button>
                                            )}
                                            <button onClick={() => setEditingProduct(product)} className="p-2 text-text-secondary hover:text-accent transition-colors"><Edit size={18} /></button>
                                            <button onClick={() => setDeletingProduct(product)} className="p-2 text-text-secondary hover:text-danger transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal title="Create New Product" isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <AddProductForm onProductAdded={handleMutationSuccess} onClose={() => setIsAddModalOpen(false)} />
            </Modal>

            {editingProduct && (
                <Modal title="Edit Product" isOpen={!!editingProduct} onClose={() => setEditingProduct(null)}>
                    <EditProductForm product={editingProduct} onProductUpdated={handleMutationSuccess} onClose={() => setEditingProduct(null)} />
                </Modal>
            )}

            {deletingProduct && (
                <DeleteConfirmationModal
                    isOpen={!!deletingProduct}
                    onClose={() => setDeletingProduct(null)}
                    onConfirm={handleDelete}
                    loading={actionLoading}
                    productName={deletingProduct.name}
                />
            )}

            <BarcodeScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
            />
        </motion.div>
    );
};

export default Products;

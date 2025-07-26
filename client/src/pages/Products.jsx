import { useEffect, useState } from 'react';
import apiClient from '../api';
import { motion } from 'framer-motion';
import { PlusCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/common/Modal';
import AddProductForm from '../components/products/AddProductForm';
import EditProductForm from '../components/products/EditProductForm';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import { toast } from 'react-hot-toast';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // Holds the product object being edited
    const [deletingProduct, setDeletingProduct] = useState(null); // Holds the product object being deleted
    const [actionLoading, setActionLoading] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/products');
            setProducts(response.data.data);
        } catch (err) {
            setError('Failed to fetch products.');
            toast.error('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Callback for when a new product is successfully added
    const handleProductAdded = (newProduct) => {
        setProducts(prev => [newProduct, ...prev]);
    };

    // Callback for when a product is successfully updated
    const handleProductUpdated = (updatedProduct) => {
        setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    };

    // Handler for the delete confirmation
    const handleDelete = async () => {
        if (!deletingProduct) return;
        setActionLoading(true);
        try {
            await apiClient.delete(`/products/${deletingProduct._id}`);
            setProducts(prev => prev.filter(p => p._id !== deletingProduct._id));
            toast.success('Product deleted successfully!');
            setDeletingProduct(null); // Close modal on success
        } catch (err) {
            toast.error('Failed to delete product.');
            console.error('Failed to delete product', err);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Products</h1>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent/90 transition-colors">
                    <PlusCircle size={20} /> Add Product
                </motion.button>
            </div>

            {loading && <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>}
            {error && <div className="text-center text-danger mt-10 p-4 bg-danger/10 rounded-md">{error}</div>}

            {!loading && !error && (
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
                                    <td className="p-4 text-text-primary text-center">${product.sellingPrice.toFixed(2)}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
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

            {/* --- MODALS --- */}
            <Modal title="Create New Product" isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <AddProductForm onProductAdded={handleProductAdded} onClose={() => setIsAddModalOpen(false)} />
            </Modal>

            {editingProduct && (
                <Modal title="Edit Product" isOpen={!!editingProduct} onClose={() => setEditingProduct(null)}>
                    <EditProductForm product={editingProduct} onProductUpdated={handleProductUpdated} onClose={() => setEditingProduct(null)} />
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
        </motion.div>
    );
};

export default Products;

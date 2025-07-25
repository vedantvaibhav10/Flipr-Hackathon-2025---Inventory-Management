import { useEffect, useState } from 'react';
import apiClient from '../api';
import { motion } from 'framer-motion';
import { PlusCircle, Loader2 } from 'lucide-react';
import Modal from '../components/common/Modal';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/products');
                setProducts(response.data.data);
            } catch (err) {
                setError('Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Products</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent/90 transition-colors"
                >
                    <PlusCircle size={20} />
                    Create Product
                </motion.button>
            </div>

            {/* Product Table will go here */}
            {loading && <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8" /></div>}
            {error && <div className="text-center text-danger mt-10">{error}</div>}

            {!loading && !error && (
                <div className="bg-primary p-4 rounded-lg border border-border">
                    <p className="text-text-secondary">Product table will be implemented here. Found {products.length} products.</p>
                </div>
            )}

            <Modal title="Create New Product" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {/* The Add Product Form will go here */}
                <p>Add Product Form will be implemented here.</p>
            </Modal>

        </motion.div>
    );
};

export default Products;

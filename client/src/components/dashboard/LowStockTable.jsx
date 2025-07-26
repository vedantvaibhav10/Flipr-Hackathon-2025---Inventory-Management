import { useEffect, useState } from 'react';
import apiClient from '../../api';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const LowStockTable = () => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLowStockProducts = async () => {
            try {
                const response = await apiClient.get('/products');
                const allProducts = response.data.data;
                const lowStock = allProducts.filter(p => p.stockLevel < p.threshold);
                setLowStockProducts(lowStock);
            } catch (error) {
                console.error("Failed to fetch low stock products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLowStockProducts();
    }, []);

    return (
        <div className="bg-primary p-6 rounded-lg border border-border h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Low Quantity Stock</h3>
                <Link to="/inventory" className="text-sm text-accent hover:underline">See All</Link>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin h-8 w-8 text-accent" />
                </div>
            ) : (
                <div className="space-y-4">
                    {lowStockProducts.length > 0 ? (
                        lowStockProducts.slice(0, 5).map(product => (
                            <div key={product._id} className="flex items-center gap-4">
                                <img src={product.image?.url || `https://placehold.co/40x40/21262D/C9D1D9?text=${product.name.charAt(0)}`} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                                <div className="flex-1">
                                    <p className="font-medium text-text-primary">{product.name}</p>
                                    <p className="text-xs text-text-secondary">Remaining: {product.stockLevel}</p>
                                </div>
                                <span className="px-2 py-1 text-xs font-semibold text-danger bg-danger/10 rounded-full">Low</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-text-secondary text-center py-10">No items are low on stock. Great job!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default LowStockTable;

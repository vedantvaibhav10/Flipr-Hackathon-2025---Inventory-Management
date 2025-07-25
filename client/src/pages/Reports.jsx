import { useEffect, useState } from 'react';
import apiClient from '../api';
import { motion } from 'framer-motion';
import { Loader2, FileText } from 'lucide-react';
import CategoryChart from '../components/common/CategoryChart';

const Reports = () => {
    const [summary, setSummary] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReportsData = async () => {
            try {
                setLoading(true);
                // Fetch both summary and all products in parallel for efficiency
                const [summaryRes, productsRes] = await Promise.all([
                    apiClient.get('/reports/summary'),
                    apiClient.get('/products')
                ]);

                setSummary(summaryRes.data.data);

                // Filter products to find low stock items
                const lowStock = productsRes.data.data.filter(p => p.stockLevel < p.threshold);
                setLowStockProducts(lowStock);

            } catch (err) {
                setError('Failed to fetch reports data.');
            } finally {
                setLoading(false);
            }
        };
        fetchReportsData();
    }, []);

    const handleExport = async () => {
        try {
            const response = await apiClient.get('/reports/products/export', {
                responseType: 'blob', // Important to handle the file download
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products-export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Failed to export products', err);
            // You could show an error toast here
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent/90 transition-colors"
                >
                    <FileText size={20} />
                    Export Products (CSV)
                </motion.button>
            </div>

            {loading && <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>}
            {error && <div className="text-center text-danger mt-10 p-4 bg-danger/10 rounded-md">{error}</div>}

            {!loading && !error && summary && (
                <div className="space-y-8">
                    <CategoryChart data={summary.stockByCategory} loading={loading} />

                    <div>
                        <h2 className="text-xl font-semibold text-text-primary mb-4">Low Stock Items ({lowStockProducts.length})</h2>
                        <div className="bg-primary rounded-lg border border-border overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-secondary">
                                    <tr>
                                        <th className="p-4 font-semibold text-text-secondary">Name</th>
                                        <th className="p-4 font-semibold text-text-secondary">SKU</th>
                                        <th className="p-4 font-semibold text-text-secondary text-center">Current Stock</th>
                                        <th className="p-4 font-semibold text-text-secondary text-center">Threshold</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockProducts.map((product) => (
                                        <tr key={product._id} className="border-b border-border hover:bg-secondary transition-colors">
                                            <td className="p-4 text-text-primary font-medium">{product.name}</td>
                                            <td className="p-4 text-text-secondary">{product.sku}</td>
                                            <td className="p-4 text-center font-bold text-danger">{product.stockLevel}</td>
                                            <td className="p-4 text-center text-warning">{product.threshold}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Reports;

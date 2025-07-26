import { useState, useEffect } from 'react';
import apiClient from '../../api';
import FormField from '../common/FormField';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateOrderForm = ({ onOrderCreated, onClose }) => {
    const [formData, setFormData] = useState({
        product: '',
        supplier: '',
        quantity: '',
        expectedDelivery: '',
    });
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch products and suppliers for the dropdowns
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, suppliersRes] = await Promise.all([
                    apiClient.get('/products'),
                    apiClient.get('/suppliers')
                ]);
                setProducts(productsRes.data.data);
                setSuppliers(suppliersRes.data.data);
            } catch (err) {
                setError('Failed to load products or suppliers.');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.post('/orders', formData);
            toast.success('Order created successfully!');
            onOrderCreated(response.data.data);
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create order.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-danger text-center">{error}</p>}

            <div>
                <label htmlFor="product" className="form-label">Product</label>
                <select id="product" name="product" value={formData.product} onChange={handleChange} className="input-field" required>
                    <option value="" disabled>Select a product</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="supplier" className="form-label">Supplier</label>
                <select id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} className="input-field" required>
                    <option value="" disabled>Select a supplier</option>
                    {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
            </div>

            <FormField label="Quantity" id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
            <FormField label="Expected Delivery" id="expectedDelivery" name="expectedDelivery" type="date" value={formData.expectedDelivery} onChange={handleChange} required />

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary w-32">
                    {loading ? <Loader2 className="animate-spin" /> : 'Create Order'}
                </button>
            </div>
        </form>
    );
};

export default CreateOrderForm;

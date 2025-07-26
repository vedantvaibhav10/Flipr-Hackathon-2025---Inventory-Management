import { useState, useEffect } from 'react';
import apiClient from '../../api';
import { db } from '../../db';
import { addToOutbox } from '../../services/syncManager';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [localProducts, localSuppliers] = await Promise.all([
                    db.products.toArray(),
                    db.suppliers.toArray()
                ]);
                setProducts(localProducts);
                setSuppliers(localSuppliers);
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

        const selectedProduct = products.find(p => p._id === formData.product);
        if (!selectedProduct) {
            setError('Please select a valid product.');
            setLoading(false);
            return;
        }

        const orderPayload = {
            ...formData,
            orderValue: selectedProduct.buyingPrice * Number(formData.quantity)
        };

        try {
            const response = await apiClient.post('/orders', orderPayload);
            toast.success('Order created successfully!');
            onOrderCreated();
            onClose();
        } catch (err) {
            if (!err.response) {
                toast.success('Offline: Order saved locally, will sync later.');
                const offlineId = `offline_${Date.now()}`;

                const selectedSupplier = suppliers.find(s => s._id === formData.supplier);
                const offlineOrder = {
                    ...orderPayload,
                    _id: offlineId,
                    product: selectedProduct,
                    supplier: selectedSupplier,
                };

                await db.orders.add(offlineOrder);
                await addToOutbox({ url: '/orders', method: 'post', data: orderPayload });

                onClose();
            } else {
                const errorMessage = err.response?.data?.message || 'Failed to create order.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-danger text-center">{error}</p>}

            <div>
                <label htmlFor="product" className="block text-sm font-medium text-text-secondary mb-1">Product</label>
                <select id="product" name="product" value={formData.product} onChange={handleChange} className="block w-full px-3 py-2 bg-secondary border border-border rounded-md" required>
                    <option value="" disabled>Select a product</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-text-secondary mb-1">Supplier</label>
                <select id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} className="block w-full px-3 py-2 bg-secondary border border-border rounded-md" required>
                    <option value="" disabled>Select a supplier</option>
                    {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
            </div>

            <FormField label="Quantity" id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
            <FormField label="Expected Delivery" id="expectedDelivery" name="expectedDelivery" type="date" value={formData.expectedDelivery} onChange={handleChange} required />

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md border border-border">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-white bg-accent rounded-md w-32 flex justify-center">
                    {loading ? <Loader2 className="animate-spin" /> : 'Create Order'}
                </button>
            </div>
        </form>
    );
};

export default CreateOrderForm;

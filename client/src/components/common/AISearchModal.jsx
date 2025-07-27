import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Package, Users } from 'lucide-react';
import apiClient from '../../api';
import { Link } from 'react-router-dom';

const AISearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (query.trim().length < 3) return;

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const response = await apiClient.post('/ai/search', { query });
            setResults(response.data);
        } catch (err) {
            setError('AI search failed. Please try a different query.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setQuery('');
        setResults(null);
        setError('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 pt-[15vh]"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="bg-primary rounded-xl shadow-2xl w-full max-w-2xl border border-border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSearch} className="flex items-center gap-4 p-4 border-b border-border">
                            <Search className="text-accent" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask anything... e.g., 'show me low stock beverages'"
                                className="w-full bg-transparent focus:outline-none text-lg text-text-primary"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="px-4 py-1.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-24"
                                disabled={loading || query.trim().length < 3}
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
                            </button>
                            <button type="button" onClick={handleClose} className="text-text-secondary hover:text-text-primary">
                                <X />
                            </button>
                        </form>

                        <div className="p-6 min-h-[200px]">
                            {loading && <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>}
                            {error && <p className="text-center text-danger">{error}</p>}

                            {results && (
                                <div>
                                    {results.type === 'answer' && <p className="text-text-primary">{results.data}</p>}
                                    {results.type === 'results' && (
                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-text-secondary">Found {results.data.length} {results.collection}:</h3>
                                            <ul className="space-y-2">
                                                {results.data.map(item => (
                                                    <li key={item._id}>
                                                        <Link to={`/${results.collection === 'products' ? 'inventory' : 'suppliers'}`} onClick={handleClose} className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary">
                                                            {results.collection === 'products' ? <Package size={18} /> : <Users size={18} />}
                                                            <span>{item.name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AISearchModal;
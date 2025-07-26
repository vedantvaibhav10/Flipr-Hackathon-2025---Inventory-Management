import { Link } from 'react-router-dom';
import { Loader2, Package, Users, SearchX } from 'lucide-react';

const SearchResults = ({ results, loading, onLinkClick }) => {
    if (loading) {
        return (
            <div className="absolute top-full mt-2 w-96 bg-secondary border border-border rounded-lg shadow-lg p-4 flex items-center justify-center z-50">
                <Loader2 className="animate-spin h-6 w-6 text-accent" />
            </div>
        );
    }

    const hasProducts = results.products && results.products.length > 0;
    const hasSuppliers = results.suppliers && results.suppliers.length > 0;
    const noResults = !hasProducts && !hasSuppliers;

    if (noResults) {
        return (
            <div className="absolute top-full mt-2 w-96 bg-secondary border border-border rounded-lg shadow-lg p-4 flex flex-col items-center justify-center text-center z-50">
                <SearchX className="h-10 w-10 text-text-secondary mb-2" />
                <p className="font-semibold text-text-primary">No Results Found</p>
                <p className="text-sm text-text-secondary">Try a different search term.</p>
            </div>
        );
    }

    return (
        <div className="absolute top-full mt-2 w-96 max-h-[70vh] overflow-y-auto bg-secondary border border-border rounded-lg shadow-lg text-sm z-50">
            {hasProducts && (
                <div>
                    <h3 className="p-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Products</h3>
                    <ul>
                        {results.products.map(product => (
                            <li key={`prod-${product._id}`}>
                                <Link to="/inventory" onClick={onLinkClick} className="flex items-center gap-3 p-3 hover:bg-accent/10 transition-colors">
                                    <Package className="w-5 h-5 text-text-secondary flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-text-primary">{product.name}</p>
                                        <p className="text-xs text-text-secondary">SKU: {product.sku}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {hasSuppliers && (
                <div>
                    <h3 className="p-3 text-xs font-semibold text-text-secondary uppercase tracking-wider border-t border-border">Suppliers</h3>
                    <ul>
                        {results.suppliers.map(supplier => (
                            <li key={`sup-${supplier._id}`}>
                                <Link to="/suppliers" onClick={onLinkClick} className="flex items-center gap-3 p-3 hover:bg-accent/10 transition-colors">
                                    <Users className="w-5 h-5 text-text-secondary flex-shrink-0" />
                                    <p className="font-medium text-text-primary">{supplier.name}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
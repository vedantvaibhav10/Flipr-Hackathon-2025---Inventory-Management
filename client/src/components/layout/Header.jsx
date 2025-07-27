import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api';
import SearchResults from './SearchResults';
import AISearchModal from '../common/AISearchModal';

const useClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

const Header = () => {
    const { user } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    useClickOutside(searchRef, () => setShowResults(false));

    const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults({});
            setShowResults(false);
            return;
        }
        const debounceSearch = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await apiClient.get(`/search?q=${searchQuery}`);
                setSearchResults(response.data.data);
                setShowResults(true);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(debounceSearch);
    }, [searchQuery]);

    return (
        <>
            <header className="bg-primary h-16 flex items-center justify-between px-8 border-b border-border">
                <div className="flex items-center gap-6">
                    <div className="relative" ref={searchRef}>
                        <div className="flex items-center gap-4">
                            <Search className="text-text-secondary" size={20} />
                            <input
                                type="text"
                                placeholder="Search products, suppliers..."
                                className="bg-transparent focus:outline-none text-text-primary placeholder:text-text-secondary w-80"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => { if (searchQuery.trim().length > 1) setShowResults(true) }}
                            />
                        </div>
                        {showResults && <SearchResults
                            results={searchResults}
                            loading={isSearching}
                            onLinkClick={() => {
                                setShowResults(false);
                                setSearchQuery('');
                            }}
                        />}
                    </div>
                    <button
                        onClick={() => setIsAiSearchOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-accent/50 hover:bg-accent/10 transition-colors text-text-secondary hover:text-text-primary"
                    >
                        <Sparkles className="text-accent" size={16} />
                        <span className="text-sm font-medium">NLP Search</span>
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <button className="relative text-text-secondary hover:text-text-primary transition-colors">
                        <Bell size={22} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full border-2 border-primary"></span>
                    </button>
                    <div className="flex items-center gap-3">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.name}&background=58A6FF&color=fff&bold=true`}
                            alt="User Avatar"
                            className="w-9 h-9 rounded-full"
                        />
                        <div>
                            <p className="font-semibold text-sm text-text-primary">{user?.name}</p>
                            <p className="text-xs text-text-secondary">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </header>

            <AISearchModal isOpen={isAiSearchOpen} onClose={() => setIsAiSearchOpen(false)} />
        </>
    );
};

export default Header;

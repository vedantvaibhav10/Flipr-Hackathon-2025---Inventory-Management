import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import apiClient from '../../api';
import SearchResults from './SearchResults';
import NotificationPopover from './NotificationPopover';

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

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationsRef = useRef(null);

    useClickOutside(searchRef, () => setShowResults(false));
    useClickOutside(notificationsRef, () => setShowNotifications(false));

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await apiClient.get('/products');
                const lowStockProducts = response.data.data.filter(p => p.stockLevel < p.threshold);
                setNotifications(lowStockProducts);

                const lastRead = localStorage.getItem('lastReadTimestamp') || 0;
                const newUnreadCount = lowStockProducts.filter(p => new Date(p.updatedAt).getTime() > lastRead).length;
                setUnreadCount(newUnreadCount);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 30000);

        return () => clearInterval(intervalId);
    }, []);

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

    const handleMarkAsRead = () => {
        localStorage.setItem('lastReadTimestamp', Date.now().toString());
        setUnreadCount(0);
        setTimeout(() => setShowNotifications(false), 300);
    };

    return (
        <header className="bg-primary h-16 flex items-center justify-between px-8 border-b border-border flex-shrink-0">
            <div className="relative" ref={searchRef}>
                <div className="flex items-center gap-4">
                    <Search className="text-text-secondary" size={20} />
                    <input
                        type="text"
                        placeholder="Search products, suppliers..."
                        className="bg-transparent focus:outline-none text-text-primary placeholder:text-text-secondary w-96"
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

            <div className="flex items-center gap-6">
                <div className="relative" ref={notificationsRef}>
                    <button onClick={() => setShowNotifications(prev => !prev)} className="relative text-text-secondary hover:text-text-primary transition-colors">
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full border-2 border-primary text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {showNotifications && (
                        <NotificationPopover
                            notifications={notifications}
                            unreadCount={unreadCount}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    )}
                </div>

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
    );
};

export default Header;
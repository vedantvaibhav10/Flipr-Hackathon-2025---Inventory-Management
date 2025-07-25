import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="bg-primary h-16 flex items-center justify-between px-8 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-4">
                <Search className="text-text-secondary" size={20} />
                <input
                    type="text"
                    placeholder="Search product, supplier, order..."
                    className="bg-transparent focus:outline-none text-text-primary placeholder:text-text-secondary w-96"
                />
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
    );
};

export default Header;

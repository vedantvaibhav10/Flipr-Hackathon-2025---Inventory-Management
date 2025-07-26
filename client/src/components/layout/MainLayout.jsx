import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, Link } from 'react-router-dom';
import SyncStatusIndicator from '../common/SyncStatusIndicator';
import HealthStatusBar from '../common/HealthStatusBar';
import { toast } from 'react-hot-toast';
import { HardDrive } from 'lucide-react';

const MainLayout = () => {
    useEffect(() => {
        const checkBackupStatus = () => {
            const lastBackupTimestamp = localStorage.getItem('lastBackupTimestamp');
            if (!lastBackupTimestamp) return; // Don't remind if they've never backed up

            const oneDay = 24 * 60 * 60 * 1000;
            if (Date.now() - new Date(lastBackupTimestamp).getTime() > oneDay) {
                toast((t) => (
                    <div className="flex items-start gap-3">
                        <HardDrive className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div className="flex-grow">
                            <p className="font-semibold">Backup Recommended</p>
                            <p className="text-sm">Your last local backup was over 24 hours ago.</p>
                            <Link to="/settings" onClick={() => toast.dismiss(t.id)} className="mt-2 inline-block text-sm font-bold text-accent hover:underline">
                                Go to Settings
                            </Link>
                        </div>
                    </div>
                ), {
                    duration: 10000, // Keep the toast on screen for 10 seconds
                });
            }
        };

        // Check once, 5 seconds after the app loads
        const timer = setTimeout(checkBackupStatus, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-grow p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            <div className="fixed bottom-4 left-4 z-50 space-y-2">
                <HealthStatusBar />
                <SyncStatusIndicator />
            </div>
        </div>
    );
};

export default MainLayout;

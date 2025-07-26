import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import HealthStatusBar from '../common/HealthStatusBar';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-grow p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
            <HealthStatusBar />
        </div>
    );
};

export default MainLayout;
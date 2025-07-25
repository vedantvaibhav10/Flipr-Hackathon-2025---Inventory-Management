import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-grow p-8 bg-background">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;

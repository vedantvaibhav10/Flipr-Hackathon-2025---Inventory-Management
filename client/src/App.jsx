import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';

import MainLayout from './components/layout/MainLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyOTP from './pages/Auth/VerifyOTP';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Suppliers from './pages/Suppliers';
import Orders from './pages/Orders';
import HealthCheck from './pages/HealthCheck';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // While checking for a user session, you can show a global loader
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    // If no user is found after checking, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            background: '#161B22', // primary color
            color: '#C9D1D9',      // text-primary color
            border: '1px solid #30363D', // border color
          },
        }}
      />
      <Routes>
        {/* Public routes for authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Protected routes that use the MainLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Child routes will be rendered inside MainLayout's <Outlet /> */}
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Products />} />
          <Route path="reports" element={<Reports />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="health" element={<HealthCheck />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

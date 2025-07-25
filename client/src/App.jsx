import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import MainLayout from './components/layout/MainLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyOTP from './pages/Auth/VerifyOTP';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Reports from './pages/Reports';
import InventoryLogs from './pages/InventoryLogs';
import HealthCheck from './pages/HealthCheck';

// A wrapper component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking for user session, show a loader or nothing
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
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
        <Route path="products" element={<Products />} />
        <Route path="reports" element={<Reports />} />
        <Route path="logs" element={<InventoryLogs />} />
        <Route path="health" element={<HealthCheck />} />
      </Route>
    </Routes>
  );
}

export default App;

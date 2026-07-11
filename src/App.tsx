import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/layout/Navbar/Navbar';
import { useAuthStore } from './stores/auth.store';
import { lazy, Suspense } from 'react';
import './styles/global.scss';

// Lazy load pages
const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Restaurants = lazy(() => import('./pages/Restaurants/Restaurants'));
const RestaurantDetail = lazy(() => import('./pages/RestaurantDetail/RestaurantDetail'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Orders = lazy(() => import('./pages/Orders/Orders'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Loading spinner component
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid #e5e5e5',
        borderTopColor: '#FF6B35',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
}

// Layout with Navbar
function MainLayout() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

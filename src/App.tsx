import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import RequireAuth from './components/auth/RequireAuth';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Marketplace from './pages/Marketplace';
import ListingDetail from './pages/ListingDetail';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';

// Buyer Dashboard Pages
import BuyerPurchases from './pages/dashboard/buyer/Purchases';
import BuyerSubscriptions from './pages/dashboard/buyer/Subscriptions';
import BuyerProfile from './pages/dashboard/buyer/ProfileSettings';

// Seller Dashboard Pages
import SellerListings from './pages/dashboard/seller/Listings';
import CreateListing from './pages/dashboard/seller/CreateListing';
import SellerOrders from './pages/dashboard/seller/Orders';
import SellerAnalytics from './pages/dashboard/seller/Analytics';
import SellerCustomers from './pages/dashboard/seller/Customers';
import SellerSettings from './pages/dashboard/seller/Settings';

// Admin Dashboard Pages
import UserManagement from './pages/dashboard/admin/UserManagement';
import AdminOrders from './pages/dashboard/admin/AdminOrders';
import ListingModeration from './pages/dashboard/admin/ListingModeration';
import AdminOverview from './pages/dashboard/admin/AdminOverview';
import AdminReports from './pages/dashboard/admin/AdminReports';
import AdminSettings from './pages/dashboard/admin/Settings';

const NotFound = () => <div className="p-8 text-center text-2xl font-bold flex flex-col items-center justify-center h-[50vh]">404 - Page Not Found</div>;

const DashboardRedirect = () => {
  const { user } = useAuth();
  const role = user?.roles?.[0] || 'buyer';
  return <Navigate to={`/dashboard/${role}`} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardRedirect />} />
          <Route path="overview" element={<DashboardOverview />} />

          <Route path="marketplace" element={<Marketplace />} />
          <Route path="listing/:id" element={<ListingDetail />} />

          {/* Role specific sub-routes */}
          <Route path="buyer" element={<RequireAuth allowedRoles={['buyer']}><Outlet /></RequireAuth>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="purchases" element={<BuyerPurchases />} />
            <Route path="subscriptions" element={<BuyerSubscriptions />} />
            <Route path="settings" element={<BuyerProfile />} />
          </Route>

          <Route path="seller" element={<RequireAuth allowedRoles={['seller']}><Outlet /></RequireAuth>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="listings" element={<SellerListings />} />
            <Route path="new" element={<CreateListing />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="analytics" element={<SellerAnalytics />} />
            <Route path="customers" element={<SellerCustomers />} />
            <Route path="settings" element={<SellerSettings />} />
          </Route>

          <Route path="admin" element={<RequireAuth allowedRoles={['admin']}><Outlet /></RequireAuth>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="listings" element={<ListingModeration />} />
            <Route path="stats" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all for dashboards */}
          <Route path="*" element={<DashboardOverview />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

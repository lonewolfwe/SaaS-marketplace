import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface RequireAuthProps {
    allowedRoles: string[];
    children?: React.ReactNode; // Make it optional since we might use Outlet
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles, children }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // Or a spinner component
        return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && user && !user.roles.some(role => allowedRoles.includes(role))) {
        return <Navigate to="/dashboard/overview" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default RequireAuth;

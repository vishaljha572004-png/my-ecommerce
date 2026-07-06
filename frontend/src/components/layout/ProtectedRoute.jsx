import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

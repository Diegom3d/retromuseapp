import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';

export default function PrivateRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

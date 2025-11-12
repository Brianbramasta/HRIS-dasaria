import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { canAccessRoute } from '../config/rolePermissions';

// Role-based access: HR/Admin -> full access; staff -> only data master karyawan
// const STAFF_ALLOWED_PATHS = ['/data-karyawan', '/data-karyawan/form'];

export default function ProtectedOutlet() {
  const { isAuthenticated, user } = useAuthStore((s) => ({ isAuthenticated: s.isAuthenticated, user: s.user }));
  const location = useLocation();

  if (!isAuthenticated) {
    // Simpan intended URL agar setelah login bisa diarahkan kembali
    localStorage.setItem('intended_url', location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  // Role-based access via centralized policy
  const path = location.pathname;
  if (!canAccessRoute(user?.role, path)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
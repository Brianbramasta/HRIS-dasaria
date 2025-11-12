import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

// Role-based access: HR/Admin -> full access; staff -> only data master karyawan
const STAFF_ALLOWED_PATHS = ['/data-karyawan', '/data-karyawan/form'];

export default function ProtectedOutlet() {
  const { isAuthenticated, user } = useAuthStore((s) => ({ isAuthenticated: s.isAuthenticated, user: s.user }));
  const location = useLocation();

  if (!isAuthenticated) {
    // Simpan intended URL agar setelah login bisa diarahkan kembali
    localStorage.setItem('intended_url', location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  // Role check: staff dibatasi
  if (user?.role?.toLowerCase() === 'staff') {
    const path = location.pathname;
    const isAllowed = STAFF_ALLOWED_PATHS.some((p) => path === p || path.startsWith(p + '/'));
    if (!isAllowed) {
      return <Navigate to="/data-karyawan" replace />;
    }
  }

  return <Outlet />;
}
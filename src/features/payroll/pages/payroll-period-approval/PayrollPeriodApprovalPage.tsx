

// Dokumentasi: Halaman Approval Periode Gajian dengan skema Tabs + Outlet, mirip PeriodePenggajianPage
import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '@/components/shared/Tabs';

export default function ApprovalPeriodeGajianPage() {
  // Dokumentasi: menentukan tab aktif dan menyembunyikan Tabs saat halaman detail
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'non-ae';
  const isDetailPage = pathParts.length > 2;

  const tabs = [
    { id: 'non-ae', label: 'Non AE', link: '/payroll-period-approval/non-ae' },
    { id: 'ae', label: 'AE', link: '/payroll-period-approval/ae' },
    { id: 'pkl', label: 'PKL', link: '/payroll-period-approval/pkl' },
    { id: 'thr', label: 'THR', link: '/payroll-period-approval/thr' },
  ];

  return (
    <div className="space-y-6">
      {!isDetailPage && (
        <Tabs tabs={tabs} activeTab={activeTab} />
      )}
      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
}

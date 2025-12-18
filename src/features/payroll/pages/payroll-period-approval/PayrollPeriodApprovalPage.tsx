

// Dokumentasi: Halaman Approval Periode Gajian dengan skema Tabs + Outlet, mirip PeriodePenggajianPage
import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '@/features/structure-and-organize/components/Tabs';

export default function ApprovalPeriodeGajianPage() {
  // Dokumentasi: menentukan tab aktif dan menyembunyikan Tabs saat halaman detail
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'non-ae';
  const isDetailPage = pathParts.length > 2;

  const tabs = [
    { id: 'non-ae', label: 'Non AE', link: '/approval-periode-gajian/non-ae' },
    { id: 'ae', label: 'AE', link: '/approval-periode-gajian/ae' },
    { id: 'pkl', label: 'PKL', link: '/approval-periode-gajian/pkl' },
    { id: 'thr', label: 'THR', link: '/approval-periode-gajian/thr' },
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

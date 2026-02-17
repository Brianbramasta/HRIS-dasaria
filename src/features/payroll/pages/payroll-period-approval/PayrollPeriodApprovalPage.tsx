

// Dokumentasi: Halaman Approval Periode Gajian dengan skema Tabs + Outlet, mirip PeriodePenggajianPage
import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '@/components/shared/Tabs';
import CardsPayroll, { PayrollCard } from '../../components/cards/CardsPayroll';

export default function ApprovalPeriodeGajianPage() {
  // Dokumentasi: menentukan tab aktif dan menyembunyikan Tabs saat halaman detail
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'non-ae';
  const isDetailPage = pathParts.length > 2;

  const tabs = [
    { id: 'non-ae', label: 'Non AE', link: '/payroll-period-approval/non-ae' },
    { id: 'ae', label: 'AE', link: '/payroll-period-approval/ae' },
    // { id: 'pkl', label: 'PKL', link: '/payroll-period-approval/pkl' },
    { id: 'thr', label: 'THR', link: '/payroll-period-approval/thr' },
  ];

  const cardsData: PayrollCard[] = [
    { name: 'Dasarata', statusLabel: 'Dalam Proses', statusColor: 'info', remaining: 20, progressCurrent: 80, progressTotal: 100 },
    { name: 'GriyaNet', statusLabel: 'Belum Proses', statusColor: 'error', remaining: 100, progressCurrent: 0, progressTotal: 100 },
  ];

  return (
    <div className="space-y-6">
      {!isDetailPage && (
        <>
          <Tabs tabs={tabs} activeTab={activeTab} />
          <div className="mt-4">
            <CardsPayroll items={cardsData} />
          </div>
        </>
      )}
      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
}

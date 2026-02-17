

// Dokumentasi: Halaman induk Periode Penggajian dengan skema Tabs + Outlet (mirip StrukturOrganisasiPage)
import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '@/components/shared/Tabs';
import CardsPayroll, { PayrollCard } from '../../components/cards/CardsPayroll';

export default function PeriodePenggajianPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'non-ae';

  // Dokumentasi: sembunyikan Tabs jika sedang berada di halaman detail (contoh: /daftar-penggajian/non-ae/123)
  const isDetailPage = pathParts.length > 2;

  const tabs = [
    { id: 'non-ae', label: 'Non AE', link: '/payroll-period/non-ae' },
    { id: 'ae', label: 'AE', link: '/payroll-period/ae' },
    // { id: 'pkl', label: 'PKL', link: '/payroll-period/pkl' },
    { id: 'thr', label: 'THR', link: '/payroll-period/thr' },
  ];

  const cardsData: PayrollCard[] = [
    { name: 'Maker', statusLabel: 'Selesai', statusColor: 'success', remaining: 0, progressCurrent: 120, progressTotal: 120 },
    { name: 'Dasarata', statusLabel: 'Dalam Proses', statusColor: 'info', remaining: 20, progressCurrent: 80, progressTotal: 100 },
    { name: 'GriyaNet', statusLabel: 'Belum Proses', statusColor: 'error', remaining: 100, progressCurrent: 0, progressTotal: 100 },
  ];

  return (
    <div className="space-y-6">
      {!isDetailPage && (
        <>
          {/* <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Periode Gajian</h1>
          </div> */}
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

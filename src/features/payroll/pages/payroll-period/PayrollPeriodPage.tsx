

// Dokumentasi: Halaman induk Periode Penggajian dengan skema Tabs + Outlet (mirip StrukturOrganisasiPage)
import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '@/features/structure-and-organize/components/Tabs';

export default function PeriodePenggajianPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'non-ae';

  // Dokumentasi: sembunyikan Tabs jika sedang berada di halaman detail (contoh: /daftar-penggajian/non-ae/123)
  const isDetailPage = pathParts.length > 2;

  const tabs = [
    { id: 'non-ae', label: 'Non AE', link: '/payroll-period/non-ae' },
    { id: 'ae', label: 'AE', link: '/payroll-period/ae' },
    { id: 'pkl', label: 'PKL', link: '/payroll-period/pkl' },
    { id: 'thr', label: 'THR', link: '/payroll-period/thr' },
  ];

  return (
    <div className="space-y-6">
      {!isDetailPage && (
        <>
          {/* <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Periode Gajian</h1>
          </div> */}
          <Tabs tabs={tabs} activeTab={activeTab} />
        </>
      )}
      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
}

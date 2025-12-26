// Dokumentasi: Halaman induk Konfigurasi Penggajian dengan skema Tabs + Outlet (mirip PeriodePenggajianPage)
import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '@/components/shared/Tabs';

export default function KonfigurasiPenggajianPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'compensation';

  // Dokumentasi: sembunyikan Tabs jika sedang berada di halaman detail: /konfigurasi-penggajian/<tab>/<id>
  const isDetailPage = pathParts.length > 2;

  const tabs = [
    { id: 'compensation', label: 'Kompensasi', link: '/payroll-configuration/compensation' },
    { id: 'bpjs', label: 'BPJS', link: '/payroll-configuration/bpjs' },
    { id: 'deduction-reference', label: 'Acuan Potongan', link: '/payroll-configuration/deduction-reference' },
    { id: 'fixed-allowance', label: 'Tunjangan Tetap', link: '/payroll-configuration/fixed-allowance' },
    { id: 'non-recurring-allowance', label: 'Tunjangan Tidak Tetap', link: '/payroll-configuration/non-recurring-allowance' },
    { id: 'non-recurring-deduction', label: 'Potongan Tidak Tetap', link: '/payroll-configuration/non-recurring-deduction' },
    { id: 'thr', label: 'THR', link: '/payroll-configuration/thr' },
  ];

  return (
    <div className="space-y-6">
      {!isDetailPage && (
        <>
          <Tabs tabs={tabs} activeTab={activeTab} />
        </>
      )}
      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
}

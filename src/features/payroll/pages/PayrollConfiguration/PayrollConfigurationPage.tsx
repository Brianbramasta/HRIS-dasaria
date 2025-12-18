// Dokumentasi: Halaman induk Konfigurasi Penggajian dengan skema Tabs + Outlet (mirip PeriodePenggajianPage)
import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '@/features/structure-and-organize/components/Tabs';

export default function KonfigurasiPenggajianPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'kompensasi';

  // Dokumentasi: sembunyikan Tabs jika sedang berada di halaman detail: /konfigurasi-penggajian/<tab>/<id>
  const isDetailPage = pathParts.length > 2;

  const tabs = [
    { id: 'kompensasi', label: 'Kompensasi', link: '/konfigurasi-penggajian/kompensasi' },
    { id: 'bpjs', label: 'BPJS', link: '/konfigurasi-penggajian/bpjs' },
    { id: 'acuan-potongan', label: 'Acuan Potongan', link: '/konfigurasi-penggajian/acuan-potongan' },
    { id: 'tunjangan-tetap', label: 'Tunjangan Tetap', link: '/konfigurasi-penggajian/tunjangan-tetap' },
    { id: 'tunjangan-tidak-tetap', label: 'Tunjangan Tidak Tetap', link: '/konfigurasi-penggajian/tunjangan-tidak-tetap' },
    { id: 'potongan-tidak-tetap', label: 'Potongan Tidak Tetap', link: '/konfigurasi-penggajian/potongan-tidak-tetap' },
    { id: 'thr', label: 'THR', link: '/konfigurasi-penggajian/thr' },
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

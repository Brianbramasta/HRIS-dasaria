// Dokumentasi: Halaman Distribusi Gaji menggunakan skema Tabs + Outlet (mirip PeriodePenggajianPage)
import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '@/features/structure-and-organize/components/Tabs';

export default function DistribusiGajiPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'non-ae';
  // Dokumentasi: sembunyikan Tabs jika berada di halaman detail (contoh: /distribusi-gaji/non-ae/123)
  const isDetailPage = pathParts.length > 2;

  const tabs = [
    { id: 'non-ae', label: 'Non AE', link: '/distribusi-gaji/non-ae' },
    { id: 'ae', label: 'AE', link: '/distribusi-gaji/ae' },
    { id: 'pkl', label: 'PKL', link: '/distribusi-gaji/pkl' },
    { id: 'thr', label: 'THR', link: '/distribusi-gaji/thr' },
  ];

  return (
    <div className="space-y-6">
      {!isDetailPage && <Tabs tabs={tabs} activeTab={activeTab} />}
      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
}

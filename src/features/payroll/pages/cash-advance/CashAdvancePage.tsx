// Dokumentasi: Halaman induk Kasbon, Tabs disembunyikan pada halaman formulir
import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '@/features/structure-and-organize/components/Tabs';

export default function KasbonPage() {
  // Dokumentasi: menentukan tab aktif dari path URL
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'submission-history';

  // Dokumentasi: sembunyikan Tabs jika sedang berada di halaman detail
  // contoh: /kasbon/riwayat-pengajuan/123
  const isDetailPage = pathParts.length > 2 || pathParts[1] === 'formulir-kasbon';

  // Dokumentasi: daftar Tabs Kasbon
  const tabs = [
    { id: 'submission-history', label: 'Riwayat Pengajuan', link: '/cash-advance/submission-history' },
    { id: 'cash-advance-status', label: 'Status Kasbon', link: '/cash-advance/cash-advance-status' },
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

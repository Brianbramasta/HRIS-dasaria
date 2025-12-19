// Dokumentasi: Halaman induk Kasbon, Tabs disembunyikan pada halaman formulir
import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '@/features/structure-and-organize/components/Tabs';
import { useEffect, useState } from 'react';

export default function KasbonPage() {
  // Dokumentasi: menentukan tab aktif dari path URL
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'submission-history';
  const isApprovalPage = pathParts[1] === 'approval';
  // Dokumentasi: sembunyikan Tabs jika sedang berada di halaman detail atau form
  // contoh: /cash-advance/submission-history/123 atau /cash-advance/cash-advance-form
  const isDetailPage = pathParts.length > 2 || pathParts[1] === 'cash-advance-form';

  // Dokumentasi: daftar Tabs Kasbon
  const [tabs, setTabs] = useState([
    { id: 'submission-history', label: 'Riwayat Pengajuan', link: '/cash-advance/submission-history' },
    { id: 'cash-advance-status', label: 'Status Kasbon', link: '/cash-advance/cash-advance-status' },
  ]);
  
  useEffect(() => {
    if (isApprovalPage) {
      setTabs([
        { id: 'approval', label: 'Persetujuan Kasbon', link: '/cash-advance/approval' },
        { id: 'cash-advance-status', label: 'Status Kasbon', link: '/cash-advance/cash-advance-status' },
      ]);
    } else {
      setTabs([
        { id: 'submission-history', label: 'Riwayat Pengajuan', link: '/cash-advance/submission-history' },
        { id: 'cash-advance-status', label: 'Status Kasbon', link: '/cash-advance/cash-advance-status' },
      ]);
    }
  }, [isApprovalPage]);
  

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

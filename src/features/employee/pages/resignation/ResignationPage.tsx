import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '@/components/shared/Tabs';

export default function PengunduranDiriPage() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  const activeTab = parts[1] || 'pengunduran-diri';

  const tabs = [
    { id: 'pengunduran-diri', label: 'Pengunduran Diri', link: '/resignation' },
    { id: 'termination-administration', label: 'Terminasi Administrasi', link: '/resignation/termination-administration' },
  ];

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} activeTab={activeTab} />
      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
}

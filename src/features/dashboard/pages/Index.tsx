import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '../../../components/shared/Tabs';

export default function DashboardPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'dashboard';

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', link: '/dashboard' },
    { id: 'notification', label: 'Notifikasi', link: '/dashboard/notification' },
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

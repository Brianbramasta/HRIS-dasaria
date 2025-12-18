import { Outlet, useLocation } from 'react-router-dom';
import Tabs from '../components/Tabs';



export default function StrukturOrganisasiPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'business-lines';
  
  // Check if we're viewing a detail page (e.g., /structure-and-organize/companies/123)
  const isDetailPage = pathParts.length > 2;

  const tabs = [
    { id: 'business-lines', label: 'Lini Bisnis', link: '/structure-and-organize/business-lines' },
    { id: 'companies', label: 'Perusahaan', link: '/structure-and-organize/companies' },
    { id: 'offices', label: 'Kantor', link: '/structure-and-organize/offices' },
    { id: 'directorates', label: 'Direktorat', link: '/structure-and-organize/directorates' },
    { id: 'divisions', label: 'Divisi', link: '/structure-and-organize/divisions' },
    { id: 'departments', label: 'Departemen', link: '/structure-and-organize/departments' },
    { id: 'positions', label: 'Jabatan', link: '/structure-and-organize/positions' },
    { id: 'employee-positions', label: 'Posisi Pegawai', link: '/structure-and-organize/employee-positions' },
  ];

  return (
    <div className="space-y-6">
      {!isDetailPage && (
        <>
          {/* <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Struktur Organisasi</h1>
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
  
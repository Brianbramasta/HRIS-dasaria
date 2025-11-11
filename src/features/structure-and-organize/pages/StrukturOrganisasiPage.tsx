import { Link, Outlet, useLocation } from 'react-router-dom';



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
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Struktur Organisasi</h1>
          </div>
          <div className="px-6 flex justify-between overflow-x-auto rounded-lg bg-[var(--color-brand-50)] p-1 dark:bg-gray-900 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 mb-0">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.link}
                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-900 shadow-theme-xs dark:bg-white/[0.03] dark:text-white'
                      : 'bg-transparent text-[#000] hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </>
      )}
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}
  
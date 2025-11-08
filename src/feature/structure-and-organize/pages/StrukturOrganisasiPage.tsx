import React, { useState } from 'react';
import Tabs from '../components/Tabs';

import BusinessLinesTab from './LiniBisnis/BusinessLinesTab';
import CompaniesTab from './Perusahaan/CompaniesTab';
import OfficesTab from './Kantor/OfficesTab';
import DirectoratesTab from './Direktorat/DirectoratesTab';
import DivisionsTab from './Divisi/DivisionsTab';
import DepartmentsTab from './Departemen/DepartmentsTab';
import PositionsTab from './Jabatan/PositionsTab';
import EmployeePositionsTab from './PosisiPegawai/EmployeePositionsTab';

export default function StrukturOrganisasiPage() {
  const [activeTab, setActiveTab] = useState('business-lines');

  const tabs = [
    { id: 'business-lines', label: 'Lini Bisnis', content: <BusinessLinesTab resetKey={activeTab} /> },
    { id: 'companies', label: 'Perusahaan', content: <CompaniesTab resetKey={activeTab} /> },
    { id: 'offices', label: 'Kantor', content: <OfficesTab resetKey={activeTab} /> },
    { id: 'directorates', label: 'Direktorat', content: <DirectoratesTab resetKey={activeTab} /> },
    { id: 'divisions', label: 'Divisi', content: <DivisionsTab resetKey={activeTab} /> },
    { id: 'departments', label: 'Departemen', content: <DepartmentsTab resetKey={activeTab} /> },
    { id: 'positions', label: 'Jabatan', content: <PositionsTab resetKey={activeTab} /> },
    { id: 'employee-positions', label: 'Posisi Pegawai', content: <EmployeePositionsTab resetKey={activeTab} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Struktur Organisasi</h1>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
  
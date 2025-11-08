import React, { useState } from 'react';
import Tabs from '../components/Tabs';
import DataTable, { DataTableColumn, DataTableAction } from '../components/DataTable';
import { Edit, Trash, FileText } from 'react-feather';

type BusinessLine = { id: number; no: number; "Lini Bisnis": string; "Deskripsi Umum": string; "File SK & Memin": string; };
type Company = { id: number; no: number; "Nama Perusahaan": string; "Deskripsi Umum": string; "Lini Bisnis": string; Detail: string; };

const businessLinesSample: BusinessLine[] = [
  { id: 1, no: 1, "Lini Bisnis": 'Internet Service Provider', "Deskripsi Umum": 'Lorem ipsum dolor sit amet consectetur. Nunc et vel nec.', "File SK & Memin": 'file.pdf' },
  { id: 2, no: 2, "Lini Bisnis": 'Teknologi & Layanan Drone', "Deskripsi Umum": 'Lorem ipsum dolor sit amet consectetur. Nunc et vel nec.', "File SK & Memin": 'file.pdf' },
];

const companiesSample: Company[] = [
  { id: 1, no: 1, "Nama Perusahaan": 'PT Alpha', "Deskripsi Umum": 'Lorem ipsum dolor sit amet consectetur. Nunc et vel nec.', "Lini Bisnis": 'Internet Service Provider', Detail: 'detail.pdf' },
  { id: 2, no: 2, "Nama Perusahaan": 'PT Beta', "Deskripsi Umum": 'Lorem ipsum dolor sit amet consectetur. Nunc et vel nec.', "Lini Bisnis": 'Teknologi & Layanan Drone', Detail: 'detail.pdf' },
];

const businessLineColumns: DataTableColumn<BusinessLine>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Lini Bisnis', label: 'Lini Bisnis', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'File SK & Memin', label: 'File SK & Memin', sortable: true, format: (value) => <FileText size={16} /> },
];

const companyColumns: DataTableColumn<Company>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Perusahaan', label: 'Nama Perusahaan', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'Lini Bisnis', label: 'Lini Bisnis', sortable: true },
  { id: 'Detail', label: 'Detail', sortable: true, format: (value) => <FileText size={16} /> },
];

export default function StrukturOrganisasiPage() {
  const [activeTab, setActiveTab] = useState('business-lines');

  const actionsBL: DataTableAction<BusinessLine>[] = [
    { label: '', onClick: (row) => console.log('Edit BL', row), variant: 'outline', className:'border-0', icon: <Edit size={16} /> },
    { label: '', onClick: (row) => console.log('Delete BL', row), variant: 'outline', className:'border-0', color: 'error', icon: <Trash size={16} /> },
  ];

  const actionsCompany: DataTableAction<Company>[] = [
    { label: '', onClick: (row) => console.log('Edit Company', row), variant: 'outline', className:'border-0', icon: <Edit size={16} /> },
    { label: '', onClick: (row) => console.log('Delete Company', row), variant: 'outline', className:'border-0', color: 'error', icon: <Trash size={16} /> },
  ];

  const tabs = [
    {
      id: 'business-lines',
      label: 'Lini Bisnis',
      content: (
        <DataTable
          title="Lini Bisnis"
          data={businessLinesSample}
          columns={businessLineColumns}
          actions={actionsBL}
          searchable
          onAdd={() => console.log('Add Business Line')}
          onExport={() => console.log('Export Business Line')}
        />
      ),
    },
    {
      id: 'companies',
      label: 'Perusahaan',
      content: (
        <DataTable
          title="Perusahaan"
          data={companiesSample}
          columns={companyColumns}
          actions={actionsCompany}
          searchable
          onAdd={() => console.log('Add Company')}
          onExport={() => console.log('Export Company')}
        />
      ),
    },
    { id: 'offices', label: 'Kantor', content: <div className="py-8 text-center text-gray-500">Segera hadir</div> },
    { id: 'directorates', label: 'Direktorat', content: <div className="py-8 text-center text-gray-500">Segera hadir</div> },
    { id: 'divisions', label: 'Divisi', content: <div className="py-8 text-center text-gray-500">Segera hadir</div> },
    { id: 'departments', label: 'Departemen', content: <div className="py-8 text-center text-gray-500">Segera hadir</div> },
    { id: 'positions', label: 'Jabatan', content: <div className="py-8 text-center text-gray-500">Segera hadir</div> },
    { id: 'employee-positions', label: 'Posisi Pegawai', content: <div className="py-8 text-center text-gray-500">Segera hadir</div> },
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
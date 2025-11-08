import React, { useMemo, useState } from 'react';
import Tabs from '../components/Tabs';
import DataTable, { DataTableColumn, DataTableAction } from '../components/datatable/DataTable';
import { Edit, Trash, FileText } from 'react-feather';
import { 
  useBusinessLines,
  useCompanies,
  useOffices,
  useDirectorates,
  useDivisions,
  useDepartments,
  usePositions,
  useEmployeePositions,
} from '../index';
import { BLRow, CompanyRow, OfficeRow, DirectorateRow, DivisionRow, DepartmentRow, PositionRow, EmployeePositionRow } from '../types/organizationTable.types';


const businessLineColumns: DataTableColumn<BLRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Lini Bisnis', label: 'Lini Bisnis', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: true, format: () => <FileText size={16} /> },
];

const companyColumns: DataTableColumn<CompanyRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Perusahaan', label: 'Nama Perusahaan', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'Lini Bisnis', label: 'Lini Bisnis', sortable: true },
  { id: 'Detail', label: 'Detail', sortable: true, format: () => <FileText size={16} /> },
];

const officeColumns: DataTableColumn<OfficeRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Office', label: 'Office', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: true, format: () => <FileText size={16} /> },
];

const directorateColumns: DataTableColumn<DirectorateRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Direktorat', label: 'Nama Direktorat', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: true, format: () => <FileText size={16} /> },
];

const divisionColumns: DataTableColumn<DivisionRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Divisi', label: 'Nama Divisi', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: true, format: () => <FileText size={16} /> },
];

const departmentColumns: DataTableColumn<DepartmentRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Departemen', label: 'Nama Departemen', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: true, format: () => <FileText size={16} /> },
];

const positionColumns: DataTableColumn<PositionRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Jabatan', label: 'Nama Jabatan', sortable: true },
  { id: 'Grade', label: 'Grade', sortable: true },
  { id: 'Deskripsi Tugas', label: 'Deskripsi Tugas', sortable: true },
  { id: 'Bawahan Langsung', label: 'Bawahan Langsung', sortable: true },
  { id: 'File SK & MoU', label: 'File SK & MoU', sortable: true, format: () => <FileText size={16} /> },
];

const employeePositionColumns: DataTableColumn<EmployeePositionRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Posisi', label: 'Nama Posisi', sortable: true },
  { id: 'Jabatan', label: 'Jabatan', sortable: true },
  { id: 'Direktorat', label: 'Direktorat', sortable: true },
  { id: 'Divisi', label: 'Divisi', sortable: true },
  { id: 'Departemen', label: 'Departemen', sortable: true },
  { id: 'File SK & MoU', label: 'File SK & MoU', sortable: true, format: () => <FileText size={16} /> },
];

export default function StrukturOrganisasiPage() {
  const [activeTab, setActiveTab] = useState('business-lines');

  // Hooks to fetch data from services/json-server
  const { businessLines } = useBusinessLines();
  const { companies } = useCompanies();
  const { offices } = useOffices();
  const { directorates } = useDirectorates();
  const { divisions } = useDivisions();
  const { departments } = useDepartments();
  const { positions } = usePositions();
  const { employeePositions } = useEmployeePositions();

  // Map service data to display rows expected by DataTable
  const blRows: BLRow[] = useMemo(() => {
    console.log('businessLines',businessLines);
    return (businessLines || []).map((b, idx) => ({
      no: idx + 1,
      'Lini Bisnis': (b as any).name ?? '—',
      'Deskripsi Umum': (b as any).description ?? '—',
      'File SK dan Memo': ((b as any).skFile || (b as any).memoFile) ? 'Ada' : '—',
    }));
  }, [businessLines]);
  console.log('blRows',blRows)

  const companyRows: CompanyRow[] = useMemo(() => {
    return (companies || []).map((c, idx) => ({
      no: idx + 1,
      'Nama Perusahaan': (c as any).name ?? '—',
      'Deskripsi Umum': (c as any).description ?? '—',
      'Lini Bisnis': (c as any).businessLineName ?? (c as any).businessLine?.name ?? '—',
      Detail: (c as any).website ?? (c as any).details ?? '—',
    }));
  }, [companies]);

  const officeRows: OfficeRow[] = useMemo(() => {
    return (offices || []).map((o, idx) => ({
      no: idx + 1,
      Office: (o as any).name ?? '—',
      'Deskripsi Umum': (o as any).description ?? '—',
      'File SK dan Memo': ((o as any).skFile || (o as any).memoFile) ? 'Ada' : '—',
    }));
  }, [offices]);

  const directorateRows: DirectorateRow[] = useMemo(() => {
    return (directorates || []).map((d, idx) => ({
      no: idx + 1,
      'Nama Direktorat': (d as any).name ?? '—',
      'Deskripsi Umum': (d as any).description ?? '—',
      'File SK dan Memo': ((d as any).skFile || (d as any).memoFile) ? 'Ada' : '—',
    }));
  }, [directorates]);

  const divisionRows: DivisionRow[] = useMemo(() => {
    return (divisions || []).map((d, idx) => ({
      no: idx + 1,
      'Nama Divisi': (d as any).name ?? '—',
      'Deskripsi Umum': (d as any).description ?? '—',
      'File SK dan Memo': ((d as any).skFile || (d as any).memoFile) ? 'Ada' : '—',
    }));
  }, [divisions]);

  const departmentRows: DepartmentRow[] = useMemo(() => {
    return (departments || []).map((d, idx) => ({
      no: idx + 1,
      'Nama Departemen': (d as any).name ?? '—',
      'File SK dan Memo': ((d as any).skFile || (d as any).memoFile) ? 'Ada' : '—',
    }));
  }, [departments]);

  const positionRows: PositionRow[] = useMemo(() => {
    return (positions || []).map((p, idx) => ({
      no: idx + 1,
      'Nama Jabatan': (p as any).name ?? '—',
      Grade: (p as any).grade ?? (p as any).level ?? '—',
      'Deskripsi Tugas': (p as any).jobDescription ?? (p as any).description ?? '—',
      'Bawahan Langsung': Array.isArray((p as any).directSubordinates) ? (p as any).directSubordinates.join(', ') : '—',
      'File SK & MoU': ((p as any).skFile || (p as any).memoFile) ? 'Ada' : '—',
    }));
  }, [positions]);

  const employeePositionRows: EmployeePositionRow[] = useMemo(() => {
    
    return (employeePositions || []).map((ep, idx) => ({
      no: idx + 1,
      'Nama Posisi': (ep as any).name ?? (ep as any).positionName ?? '—',
      Jabatan: (ep as any).position?.name ?? (ep as any).positionName ?? '—',
      Direktorat: (ep as any).directorate?.name ?? (ep as any).directorateName ?? '—',
      Divisi: (ep as any).division?.name ?? (ep as any).divisionName ?? '—',
      Departemen: (ep as any).department?.name ?? (ep as any).departmentName ?? '—',
      'File SK & MoU': ((ep as any).skFile || (ep as any).memoFile) ? 'Ada' : '—',
    }));
  }, [employeePositions]);

  // Actions (icons only)
  const actionsIconOnly = [
    { label: '', onClick: (row: any) => console.log('Edit', row), variant: 'outline', className: 'border-0', icon: <Edit size={16} /> },
    { label: '', onClick: (row: any) => console.log('Delete', row), variant: 'outline', className: 'border-0', color: 'error', icon: <Trash size={16} /> },
  ] as DataTableAction<any>[];

  // Simple CSV export for current rows
  const exportCSV = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    {
      id: 'business-lines',
      label: 'Lini Bisnis',
      content: (
        <DataTable
          title="Lini Bisnis"
          data={blRows}
          columns={businessLineColumns}
          actions={actionsIconOnly}
          searchable
          filterable
          onAdd={() => console.log('Add Business Line')}
          onExport={() => exportCSV('lini-bisnis.csv', blRows)}
        />
      ),
    },
    {
      id: 'companies',
      label: 'Perusahaan',
      content: (
        <DataTable
          title="Perusahaan"
          data={companyRows}
          columns={companyColumns}
          actions={actionsIconOnly}
          searchable
          filterable
          onAdd={() => console.log('Add Company')}
          onExport={() => exportCSV('perusahaan.csv', companyRows)}
        />
      ),
    },
    {
      id: 'offices',
      label: 'Kantor',
      content: (
        <DataTable
          title="Office"
          data={officeRows}
          columns={officeColumns}
          actions={actionsIconOnly}
          searchable
          filterable
          onAdd={() => console.log('Add Office')}
          onExport={() => exportCSV('office.csv', officeRows)}
        />
      ),
    },
    {
      id: 'directorates',
      label: 'Direktorat',
      content: (
        <DataTable
          title="Direktorat"
          data={directorateRows}
          columns={directorateColumns}
          actions={actionsIconOnly}
          searchable
          filterable
          onAdd={() => console.log('Add Directorate')}
          onExport={() => exportCSV('direktorat.csv', directorateRows)}
        />
      ),
    },
    {
      id: 'divisions',
      label: 'Divisi',
      content: (
        <DataTable
          title="Divisi"
          data={divisionRows}
          columns={divisionColumns}
          actions={actionsIconOnly}
          searchable
          filterable
          onAdd={() => console.log('Add Division')}
          onExport={() => exportCSV('divisi.csv', divisionRows)}
        />
      ),
    },
    {
      id: 'departments',
      label: 'Departemen',
      content: (
        <DataTable
          title="Departemen"
          data={departmentRows}
          columns={departmentColumns}
          actions={actionsIconOnly}
          searchable
          filterable
          onAdd={() => console.log('Add Department')}
          onExport={() => exportCSV('departemen.csv', departmentRows)}
        />
      ),
    },
    {
      id: 'positions',
      label: 'Jabatan',
      content: (
        <DataTable
          title="Jabatan"
          data={positionRows}
          columns={positionColumns}
          actions={actionsIconOnly}
          searchable
          filterable
          onAdd={() => console.log('Add Position')}
          onExport={() => exportCSV('jabatan.csv', positionRows)}
        />
      ),
    },
    {
      id: 'employee-positions',
      label: 'Posisi Pegawai',
      content: (
        <DataTable
          title="Posisi Pegawai"
          data={employeePositionRows}
          columns={employeePositionColumns}
          actions={actionsIconOnly}
          searchable
          filterable
          onAdd={() => console.log('Add Employee Position')}
          onExport={() => exportCSV('posisi-pegawai.csv', employeePositionRows)}
        />
      ),
    },
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
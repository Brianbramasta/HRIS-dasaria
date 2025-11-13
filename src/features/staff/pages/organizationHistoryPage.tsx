import  { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';

type OrgHistoryListRow = {
  id: number; // id karyawan
  idKaryawan: string;
  user: { name: string; avatar?: string };
  jenisPerubahan: string;
  tanggalEfektif: string; // yyyy-MM-dd
  posisiLama: string;
  posisiBaru: string;
  divisiLama: string;
  divisiBaru: string;
  direktoratLama: string;
  direktoratBaru: string;
  alasanPerubahan: string;
};

const formatDate = (iso: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  return fmt.format(d);
};

export default function OrganizationHistoryPage() {
  const navigate = useNavigate();
  const [rows] = useState<OrgHistoryListRow[]>([
    { id: 1, idKaryawan: '12345678910', user: { name: 'Lindsey Curtis' }, jenisPerubahan: 'Promosi', tanggalEfektif: '2025-03-01', posisiLama: 'Staf/HR', posisiBaru: 'HR Supervisor', divisiLama: 'HRD', divisiBaru: 'HRD', direktoratLama: 'Direktorat Lama', direktoratBaru: 'Direktorat Baru', alasanPerubahan: 'Kinerja Sangat Baik' },
    { id: 2, idKaryawan: '12345678910', user: { name: 'Dedik Mujyadi' }, jenisPerubahan: 'Promosi', tanggalEfektif: '2025-03-01', posisiLama: 'Staf/HR', posisiBaru: 'HR Supervisor', divisiLama: 'HRD', divisiBaru: 'HRD', direktoratLama: 'Direktorat Lama', direktoratBaru: 'Direktorat Baru', alasanPerubahan: 'Kinerja Sangat Baik' },
    { id: 3, idKaryawan: '12345678910', user: { name: 'Onana' }, jenisPerubahan: 'Promosi', tanggalEfektif: '2025-03-01', posisiLama: 'Staf/HR', posisiBaru: 'HR Supervisor', divisiLama: 'HRD', divisiBaru: 'HRD', direktoratLama: 'Direktorat Lama', direktoratBaru: 'Direktorat Baru', alasanPerubahan: 'Kinerja Sangat Baik' },
    { id: 4, idKaryawan: '12345678910', user: { name: 'Maguire' }, jenisPerubahan: 'Promosi', tanggalEfektif: '2025-03-01', posisiLama: 'Staf/HR', posisiBaru: 'HR Supervisor', divisiLama: 'HRD', divisiBaru: 'Finance', direktoratLama: 'Direktorat Lama', direktoratBaru: 'Direktorat Baru', alasanPerubahan: 'Kinerja Sangat Baik' },
  ]);

  const columns: DataTableColumn<OrgHistoryListRow>[] = useMemo(
    () => [
      { id: 'no', label: 'No.', align: 'center', format: (_v, row) => rows.findIndex((r) => r.id === row.id) + 1 },
      { id: 'idKaryawan', label: 'ID Karyawan' },
      {
        id: 'user',
        label: 'User',
        format: (_v, row) => (
          <div className="flex items-center gap-2">
            <img
              src={row.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.user.name}`}
              alt={row.user.name}
              className="h-6 w-6 rounded-full"
            />
            <span>{row.user.name}</span>
          </div>
        ),
      },
      { id: 'jenisPerubahan', label: 'Jenis Perubahan' },
      { id: 'tanggalEfektif', label: 'Tanggal Efektif', format: (v) => formatDate(v as string) },
      { id: 'posisiLama', label: 'Posisi Lama' },
      { id: 'posisiBaru', label: 'Posisi Baru' },
      { id: 'divisiLama', label: 'Divisi Lama' },
      { id: 'divisiBaru', label: 'Divisi Baru' },
      { id: 'direktoratLama', label: 'Direktorat Lama' },
      { id: 'direktoratBaru', label: 'Direktorat Baru' },
      { id: 'alasanPerubahan', label: 'Alasan Perubahan' },
    ],
    [rows]
  );

  const actions: DataTableAction<OrgHistoryListRow>[] = [
    {
      label: 'Detail',
      variant: 'outline',
      onClick: (row) => {
        // Arahkan ke halaman detail karyawan dengan tab organization-history
        navigate(`/data-karyawan/${row.id}?tab=organization-history`);
      },
    },
  ];

  return (
    <div className="p-4">
      <DataTable<OrgHistoryListRow>
        title="Organization History"
        data={rows}
        columns={columns}
        actions={actions}
        filterable
        emptyMessage="Belum ada riwayat organisasi"
        addButtonLabel="Tambah Riwayat"
        onAdd={() => {}}
        searchPlaceholder="Cari berdasarkan kata kunci"
      />
    </div>
  );
}
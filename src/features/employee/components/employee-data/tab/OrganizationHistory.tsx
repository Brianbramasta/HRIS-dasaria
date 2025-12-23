import  { useState } from 'react';
 
import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';

 

type OrgHistoryRow = {
  id: number;
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

interface Props { data: import('../../../types/Employee').Karyawan; isEditable: boolean }
export default function OrganizationHistoryTab({ isEditable }: Props) {
  console.log(isEditable);
  const [rows] = useState<OrgHistoryRow[]>([
    { id: 1, jenisPerubahan: 'Promosi', tanggalEfektif: '2025-03-01', posisiLama: 'Staf/HR', posisiBaru: 'HR Supervisor', divisiLama: 'HRD', divisiBaru: 'HRD', direktoratLama: 'Direktorat Lama', direktoratBaru: 'Direktorat Baru', alasanPerubahan: 'Kinerja Sangat Baik' },
    { id: 2, jenisPerubahan: 'Mutasi', tanggalEfektif: '2025-03-01', posisiLama: 'HR Supervisor', posisiBaru: 'HR Supervisor', divisiLama: 'HRD', divisiBaru: 'Finance', direktoratLama: 'Direktorat Lama', direktoratBaru: 'Direktorat Baru', alasanPerubahan: 'Kinerja Sangat Baik' },
    { id: 3, jenisPerubahan: 'Demosi', tanggalEfektif: '2025-03-01', posisiLama: 'HR Supervisor', posisiBaru: 'HR', divisiLama: 'HRD', divisiBaru: 'HRD', direktoratLama: 'Direktorat Lama', direktoratBaru: 'Direktorat Baru', alasanPerubahan: 'Kinerja Sangat Baik' },
    { id: 4, jenisPerubahan: 'Rotasi', tanggalEfektif: '2025-03-01', posisiLama: 'HR Supervisor', posisiBaru: 'HR', divisiLama: 'HRD', divisiBaru: 'Finance', direktoratLama: 'Direktorat Lama', direktoratBaru: 'Direktorat Baru', alasanPerubahan: 'Kinerja Sangat Baik' },
  ]);

  const columns: DataTableColumn<OrgHistoryRow>[] = [
    { id: 'no', label: 'No.', align: 'center', format: (v, row) => { void v; return rows.findIndex((r) => r.id === row.id) + 1; }, sortable: false },
    { id: 'jenisPerubahan', label: 'Jenis Perubahan' },
    { id: 'tanggalEfektif', label: 'Tanggal Efektif', format: (v) => formatDate(v) },
    { id: 'posisiLama', label: 'Posisi Lama' },
    { id: 'posisiBaru', label: 'Posisi Baru' },
    { id: 'divisiLama', label: 'Divisi Lama' },
    { id: 'divisiBaru', label: 'Divisi Baru' },
    { id: 'direktoratLama', label: 'Direktorat Lama' },
    { id: 'direktoratBaru', label: 'Direktorat Baru' },
    { id: 'alasanPerubahan', label: 'Alasan Perubahan' },
  ];

  const actions: DataTableAction<OrgHistoryRow>[] = [
    {
      variant: 'outline',
      icon: <IconFileDetail />,
      onClick: (row) => console.log('Edit Org History', row),
    },
  ];

  return (
      <DataTable<OrgHistoryRow>
        title="Organization History"
        data={rows}
        columns={columns}
        actions={actions ? actions : []}
        filterable
        emptyMessage="Belum ada riwayat organisasi"
        // addButtonLabel="Tambah Riwayat"
        // onAdd={() => console.log('Add Org History')}
      />
  );
}
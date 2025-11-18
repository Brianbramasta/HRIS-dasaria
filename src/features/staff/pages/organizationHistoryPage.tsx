import  { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import { useOrganizationHistory } from '@/features/staff/hooks/useOrganizationHistory';
import type { OrganizationHistoryItem } from '@/features/staff/services/organizationHistoryService';

type OrgHistoryListRow = OrganizationHistoryItem;

const formatDate = (iso: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  return fmt.format(d);
};

export default function OrganizationHistoryPage() {
  const navigate = useNavigate();
  const { data: rows, loading, handleSearchChange, handleSortChange } = useOrganizationHistory();

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
              src={(row.user?.avatar as string) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.user?.name || 'User'}`}
              alt={row.user?.name || 'User'}
              className="h-6 w-6 rounded-full"
            />
            <span>{row.user?.name || '-'}</span>
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
        navigate(`/data-karyawan/${row.idKaryawan}?tab=organization-history`);
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
        loading={loading}
        filterable
        emptyMessage="Belum ada riwayat organisasi"
        // addButtonLabel="Tambah Riwayat"
        // onAdd={() => {}}
        searchPlaceholder="Cari berdasarkan kata kunci"
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
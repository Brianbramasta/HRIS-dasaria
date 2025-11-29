import  { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import { useOrganizationHistory } from '@/features/staff/hooks/useOrganizationHistory';
import type { OrganizationHistoryItem } from '@/features/staff/services/organizationHistoryService';
import { IconPencil, IconFileDetail } from '@/icons/components/icons';
import EditRiwayatOrganisasiModal from '@/features/staff/components/riwayatOrganisasi/editRiwayatOrganisasiModal';

type OrgHistoryListRow = OrganizationHistoryItem & { statusPerubahan: 'Rekomendasi' | 'Selesai' };

const formatDate = (iso: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  return fmt.format(d);
};

export default function OrganizationHistoryPage() {
  const navigate = useNavigate();
  const { data: rows, loading, handleSearchChange, handleSortChange } = useOrganizationHistory();
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const rowsWithStatus: OrgHistoryListRow[] = useMemo(
    () => (rows || []).map((r, idx) => ({ ...r, statusPerubahan: idx % 2 === 0 ? 'Rekomendasi' : 'Selesai' })),
    [rows]
  );

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
      {
        id: 'statusPerubahan',
        label: 'Status Perubahan',
        align: 'center',
        format: (v) => {
          const val = (v as string) || '-';
          const isRekom = val === 'Rekomendasi';
          const base = 'inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium';
          const cls = isRekom ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600';
          return <span className={`${base} ${cls}`}>{val}</span>;
        },
      },
    ],
    [rows]
  );

  const actions: DataTableAction<OrgHistoryListRow>[] = [
    {
      icon: <IconPencil />,
      className: 'text-gray-700',
      onClick: (row) => {
        navigate(`/organization-history/edit?id=${row.id}`);
      },
      condition: (row) => row.statusPerubahan === 'Rekomendasi',
    },
    {
      icon: <IconFileDetail />,
      className: 'text-gray-700',
      onClick: (row) => {
        navigate(`/organization-history/preview?id=${row.id}`);
      },
      condition: (row) => row.statusPerubahan === 'Selesai',
    },
  ];

  return (
    <div className="p-4">
      <DataTable<OrgHistoryListRow>
        title="Organization History"
        data={rowsWithStatus}
        columns={columns}
        actions={actions}
        loading={loading}
        filterable
        emptyMessage="Belum ada riwayat organisasi"
        addButtonLabel="Tambah Organisasi"
        onAdd={() => {
          setIsEditOrgOpen(true);
        }}
        searchPlaceholder="Cari berdasarkan kata kunci"
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
      />

      <EditRiwayatOrganisasiModal
        isOpen={isEditOrgOpen}
        onClose={() => setIsEditOrgOpen(false)}
        onSubmit={() => {
          setIsEditOrgOpen(false);
        }}
        submitting={false}
      />
    </div>
  );
}

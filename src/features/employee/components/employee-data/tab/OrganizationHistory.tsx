// import  { useMemo } from 'react';
 
import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import { useOrganizationHistory, type OrgHistoryRow } from '@/features/employee/hooks/employee-data/detail/contract/useOrganizationHistory';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { formatDateToIndonesian } from '@/utils/formatDate';

 

 

// const formatDate = (iso: string) => {
//   if (!iso) return '-';
//   const d = new Date(iso);
//   const fmt = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
//   return fmt.format(d);
// };

interface Props { 
  employeeId?: string;
  isEditable: boolean }

export default function OrganizationHistoryTab({employeeId,  isEditable }: Props) {
  void isEditable;
  // const employeeId = useMemo(() => {
  //   return data?.employee_id || data?.idKaryawan || data?.id;
  // }, [data]);

  const { rows } = useOrganizationHistory(employeeId);

  const columns: DataTableColumn<OrgHistoryRow>[] = [
    { id: 'no', label: 'No.', align: 'center', format: (v, row) => { void v; return rows.findIndex((r) => r.id === row.id) + 1; }, sortable: false },
    { id: 'jenisPerubahan', label: 'Jenis Perubahan' },
    { id: 'tanggalEfektif', label: 'Tanggal Efektif', format: (v) => formatDateToIndonesian(v) },
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
      condition: (row) => Boolean((row as any)?.decree_file),
      onClick: (row) => {window.open(formatUrlFile((row as any)?.decree_file) || '', '_blank');},
    },
  ];

  return (
      <DataTable<OrgHistoryRow>
        title="Riwayat Organisasi"
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

import { useMemo } from 'react';
import { formatDateToIndonesian } from '@/utils/formatDate';
import type { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import { useOrganizationHistory, type OrgHistoryRow } from '@/features/employee/hooks/employee-data/detail/contract/useOrganizationHistory';
import { formatUrlFile } from '@/utils/formatUrlFile';

export function useOrganizationHistoryTab(employeeId?: string) {
  const { rows } = useOrganizationHistory(employeeId);

  const columns: DataTableColumn<OrgHistoryRow>[] = useMemo(
    () => [
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
    ],
    [rows],
  );

  const actions: DataTableAction<OrgHistoryRow>[] = [
    {
      variant: 'outline',
      icon: <IconFileDetail />,
      condition: (row) => Boolean((row as any)?.decree_file),
      onClick: (row) => {
        window.open(formatUrlFile((row as any)?.decree_file) || '', '_blank');
      },
    },
  ];

  return { rows, columns, actions };
}


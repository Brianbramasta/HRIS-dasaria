import { useMemo } from 'react';
import { formatDateToIndonesian } from '@/utils/formatDate';
import type { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconPencil, IconFileDetail } from '@/icons/components/icons';
import type { ContractHistoryItem } from '@/features/employee/services/detail/ContractService';

interface Params {
  rows: ContractHistoryItem[];
  handleViewDetail: (row: ContractHistoryItem) => void;
  handleEditRow: (row: ContractHistoryItem) => void;
}

export function useContractTabConfig({ rows, handleViewDetail, handleEditRow }: Params) {
  const columns: DataTableColumn<ContractHistoryItem>[] = useMemo(
    () => [
      { id: 'no', label: 'No.', align: 'center', format: (_v, row) => rows.findIndex((r) => r.id === row.id) + 1, sortable: false },
      { id: 'contract_type', label: 'Jenis Kontrak' },
      { id: 'last_contract_signed_date', label: 'Tanggal Tanda Tangan Kontrak', format: (v) => formatDateToIndonesian(v) },
      { id: 'end_date', label: 'Tanggal Berakhir Kontrak', format: (v) => (v ? formatDateToIndonesian(v) : '-') },
      { id: 'note', label: 'Catatan', format: (v) => v },
    ],
    [rows],
  );

  const actions: DataTableAction<ContractHistoryItem>[] = useMemo(
    () => [
      {
        variant: 'outline',
        color: 'error',
        icon: <IconFileDetail />,
        condition: (row) => row.contract_status === 'Tidak Aktif',
        onClick: (row) => {
          handleViewDetail(row);
        },
      },
      {
        variant: 'outline',
        icon: <IconPencil />,
        condition: (row) => row.contract_status === 'Aktif',
        onClick: (row) => handleEditRow(row),
      },
    ],
    [handleViewDetail, handleEditRow],
  );

  return { columns, actions };
}


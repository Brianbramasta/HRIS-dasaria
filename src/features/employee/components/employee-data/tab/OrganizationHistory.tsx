import { DataTable } from '@/components/shared/datatable/DataTable';
import { type OrgHistoryRow } from '@/features/employee/hooks/employee-data/detail/contract/useOrganizationHistory';
import { useOrganizationHistoryTab } from '@/features/employee/hooks/tab/useOrganizationHistoryTab';

 

 

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
  const { rows, columns, actions } = useOrganizationHistoryTab(employeeId);

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

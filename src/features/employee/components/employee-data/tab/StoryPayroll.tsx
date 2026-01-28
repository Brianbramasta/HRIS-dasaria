import { type ReactNode, useState } from 'react';
import SectionCard from '@/features/structure-and-organize/components/card/SectionCard';
import { DataTable } from '@/components/shared/datatable/DataTable';
import PayrollDetailCard from '@/features/employee/components/employee-data/card/story-payroll/PayrollDetailCard';
import { useStoryPayrollTab } from '@/features/employee/hooks/tab/useStoryPayrollTab';
import { formatCurrency } from '@/utils/formatCurrency';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import EditStoryPayrollModal from '@/features/employee/components/modals/story-payroll/EditStoryPayrollModal';

interface Props {
  employeeId?: string;
  isEditable: boolean;
}

function SummaryItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="h-fit rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-300">{label}</div>
      <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{children}</div>
    </div>
  );
}

export default function StoryPayrollTab({ employeeId, isEditable }: Props) {
  const { title, payrollInfo, payrollDetailCards, historyRows, historyColumns, temporarySalary, refetch } = useStoryPayrollTab(
    employeeId,
    isEditable,
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSuccessUpdate = () => {
    refetch();
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title={title}
        withHeaderDivider
        headerRight={
          // isEditable && (
          <>
            <Button size="sm" variant="primary" startIcon={<Edit2 size={16} />} onClick={handleEditClick}>
              Edit
            </Button>
            </>
          // )
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h5 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Informasi Penggajian</h5>
            <div className="grid grid-cols-1 gap-3">
              <SummaryItem label="Bank">{payrollInfo.bank || '-'}</SummaryItem>
              <SummaryItem label="Nama Akun Bank">{payrollInfo.namaAkunBank || '-'}</SummaryItem>
              <SummaryItem label="No. Rekening">{payrollInfo.noRekening || '-'}</SummaryItem>
              <SummaryItem label="NPWP">{payrollInfo.npwp || '-'}</SummaryItem>
              <SummaryItem label="PTKP Status">{payrollInfo.ptkpStatus || '-'}</SummaryItem>
              <SummaryItem label="Gaji Bersih">{formatCurrency(payrollInfo.gajiBersih)}</SummaryItem>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-4 md:border-l-[2px] md:border-gray-200 md:dark:border-gray-800 md:pl-4">
            <h5 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Detail Gaji</h5>
            {payrollDetailCards.map((card) => (
              <PayrollDetailCard key={card.id} title={card.title} variant={card.id} items={card.items} />
            ))}
          </div>
        </div>
      </SectionCard>

      <DataTable
        data={historyRows}
        columns={historyColumns}
        title="Riwayat Penggajian"
        isNewLine
        emptyMessage="Belum ada riwayat penggajian."
      />

      {employeeId && (
        <EditStoryPayrollModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          employeeId={employeeId}
          data={temporarySalary || null}
          onSuccess={handleSuccessUpdate}
        />
      )}
    </div>
  );
}

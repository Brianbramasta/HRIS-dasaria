import { type ReactNode, useState } from 'react';
import SectionCard from '@/features/structure-and-organize/components/card/SectionCard';
import { DataTable } from '@/components/shared/datatable/DataTable';
import PayrollDetailCard from '@/features/employee/components/employee-data/card/story-payroll/PayrollDetailCard';
import { useStoryPayrollTab } from '@/features/employee/hooks/tab/useStoryPayrollTab';
import { formatCurrency } from '@/utils/formatCurrency';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import EditStoryPayrollModal from '@/features/employee/components/modals/employee-data/story-payroll/EditStoryPayrollModal';

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
  const { 
    title, 
    payrollInfo, 
    payrollDetailCards, 
    historyRows, 
    historyColumns, 
    kasbonHistoryRows, 
    kasbonHistoryColumns,
    employeeSalaryShow, 
    refetch, 
    error 
  } = useStoryPayrollTab(
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
      {!error ?<div className="h-fit rounded-lg border border-l-8 border-[#EE0017] bg-[#F1AEB580]/60 p-4 dark:border-red-800 dark:bg-red-900/20 mb-6 shadow-lg">
        <div className="text-lg font-semibold text-[#212529] dark:text-red-300 mb-2 text-center">Skema Baru Belum Digunakan</div>
        <div className="text-xs text-[#626262] dark:text-red-400 text-center">
          Perhitungan di bawah adalah skema terbaru, namun belum berlaku secara resmi. Harap tetap mengacu pada kebijakan yang saat ini berjalan.
        </div>
      </div>:null}
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
         {error ? (
              <div className="h-fit rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                {/* <div className="text-xs font-semibold text-red-600 dark:text-red-400">Error</div> */}
                <div className="mt-1 text-sm font-semibold text-red-800 dark:text-red-300 text-center">{error}</div>
              </div>
            ) : (
              <>
                
                
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
                      <SummaryItem label="Kasbon Berjalan">{formatCurrency(300000)}</SummaryItem>
                    </div>
                  
                </div>
                
                <div className="lg:col-span-2 space-y-4 md:border-l-[2px] md:border-gray-200 md:dark:border-gray-800 md:pl-4">
                  <h5 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Detail Gaji</h5>
                  {payrollDetailCards.map((card) => (
                    <PayrollDetailCard key={card.id} title={card.title} variant={card.id} items={card.items} />
                  ))}
                </div>
              </div>
              </>
              )}
      </SectionCard>

      {!error && (
        <DataTable
          resetKey='riwayat-penggajian'
          data={historyRows}
          columns={historyColumns}
          title="Riwayat Penggajian"
          isNewLine
          emptyMessage="Belum ada riwayat penggajian."
        />
      )}

      {!error && (
        <DataTable
          resetKey='riwayat-kasbon'
          data={kasbonHistoryRows}
          columns={kasbonHistoryColumns}
          title="Riwayat Kasbon"
          isNewLine
          emptyMessage="Belum ada riwayat kasbon."
        />
      )}

      {employeeId && (
        <EditStoryPayrollModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          employeeId={employeeId}
          data={employeeSalaryShow}
          onSuccess={handleSuccessUpdate}
        />
      )}
    </div>
  );
}

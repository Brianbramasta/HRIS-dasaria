import { type ReactNode } from 'react';
import type { Karyawan } from '@/features/employee/types/Employee';
import Button from '@/components/ui/button/Button';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import AddContractModal from '@/features/employee/components/modals/employee-data/contract/AddContractModal';
import EditContractModal from '@/features/employee/components/modals/employee-data/contract/EditContractModal';
import DetailContractModal from '@/features/employee/components/modals/employee-data/contract/DetailContractModal';
import { useContractTab } from '@/features/employee/hooks/employee-data/detail/contract/useContract';
import { IconPencil, IconFileDetail } from '@/icons/components/icons';
import ComponentCard from '@/components/common/ComponentCard';
import type { ContractHistoryItem } from '@/features/employee/services/detail/ContractService';
import { formatUrlFile } from '@/utils/formatUrlFile';
import PdfPreviewEmbed from '@/components/shared/modal/PdfPreviewEmbed';
import { clearSkFile } from '@/stores/fileStore';
import { formatDateToIndonesian } from '@/utils/formatDate';

interface Props {
  employeeId?: string;
  data?: Karyawan;
}

function SummaryItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="h-fit rounded-lg border border-gray-200 bg-white p-3">
      <div className="text-sm font-bold ">{label}</div>
      <div className="mt-1 text-xs ">{children}</div>
    </div>
  );
}

export default function ContractTab({ employeeId: employeeIdProp, data }: Props) {
  const {
    summary,
    rows,
    isAddModalOpen,
    setAddModalOpen,
    isEditModalOpen,
    setEditModalOpen,
    isDetailModalOpen,
    setDetailModalOpen,
    editingData,
    detailData,
    setDetailData,
    setSelectedFile,
    handleAdd,
    handleViewDetail,
    handleAddSubmit,
    handleEditRow,
    handleEditSubmit,
    contractData,
    isSubmitting,
  } = useContractTab({ employeeIdProp, data });

  const columns: DataTableColumn<ContractHistoryItem>[] = [
    { id: 'no', label: 'No.', align: 'center', format: (_v, row) => rows.findIndex((r) => r.id === row.id) + 1, sortable: false },
    { id: 'contract_type', label: 'Jenis Kontrak' },
    { id: 'last_contract_signed_date', label: 'Tanggal Tanda Tangan Kontrak', format: (v) => formatDateToIndonesian(v) },
    { id: 'end_date', label: 'Tanggal Berakhir Kontrak', format: (v) => (v ? formatDateToIndonesian(v) : '-') },
    { id: 'note', label: 'Catatan', format: (v) => (v) },
  ];

  const actions: DataTableAction<ContractHistoryItem>[] = [
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
  ];

  return (
    <>
      <ComponentCard title="Kontrak">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          {/* Left PDF Preview */}
          <div className="col-span-1 flex flex-col">
            <PdfPreviewEmbed 
              fileUrl={summary?.file_contract ? formatUrlFile(summary?.file_contract as string) : undefined}
              className="w-full h-full"
            />
            <div className="mt-3 w-full flex justify-center">
              <Button variant="primary" onClick={() => window.open(formatUrlFile(summary?.file_contract as string), '_blank')} disabled={summary?.file_contract === null || summary?.file_contract === undefined}>Pratinjau PDF</Button>
            </div>
          </div>

          {/* Summary Fields */}
          <div className="col-span-4 grid grid-cols-1 gap-4 sm:grid-cols-2 h-fit">
            <SummaryItem label="Status Kontrak">{summary?.contract_status_name}</SummaryItem>
            <SummaryItem label="Tanggal Tanda Tangan Kontrak">{formatDateToIndonesian(summary?.last_contract_signed_date)}</SummaryItem>
            <SummaryItem label="Tanggal Berakhir Kontrak">{formatDateToIndonesian(summary?.end_date)}</SummaryItem>
            <SummaryItem label="Lama Bekerja">{summary?.lamaBekerja}</SummaryItem>
            <SummaryItem label="Sisa Kontrak">{contractData?.summary?.sisa_kontrak || '-'}</SummaryItem>
            <SummaryItem label="Jenis Kontrak">{summary?.contract_type}</SummaryItem>
            <SummaryItem label="Kontrak ke">{summary?.contract_number}</SummaryItem>
            <SummaryItem label="Status Berakhir">{summary?.contract_end_status_name || '-'}</SummaryItem>
          </div>
        </div>
      </ComponentCard>

      {/* History Table */}
      <div className="mt-6">
        <DataTable<ContractHistoryItem>
          title="Riwayat Kontrak"
          data={rows}
          columns={columns}
          actions={actions}
          onAdd={handleAdd}
          addButtonLabel="Tambah Dokumen"
          emptyMessage="Belum ada riwayat kontrak"
        />
      </div>

      <AddContractModal
        isOpen={isAddModalOpen}
        initialData={editingData}
        onClose={() => {
          setAddModalOpen(false);
          setSelectedFile(null);
          clearSkFile();
        }}
        onSubmit={handleAddSubmit}
        submitting={isSubmitting}
        onFileChange={setSelectedFile}
      />

      <EditContractModal
        isOpen={isEditModalOpen}
        initialData={editingData}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedFile(null);
          clearSkFile();
        }}
        onSubmit={handleEditSubmit}
        submitting={isSubmitting}
        onFileChange={setSelectedFile}
      />

      <DetailContractModal
        isOpen={isDetailModalOpen}
        initialData={detailData}
        onClose={() => {
          setDetailModalOpen(false);
          setDetailData(null);
        }}
      />
    </>
  );
}

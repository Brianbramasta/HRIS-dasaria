import { type ReactNode, useEffect, useState } from "react";
import type { Karyawan } from "@/features/employee/types/dto/EmployeeType";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/shared/datatable/DataTable";
import AddContractModal from "@/features/employee/components/modals/employee-data/contract/AddContractModal";
// import EditContractModal from "@/features/employee/components/modals/employee-data/contract/EditContractModal";
import DetailContractModal from "@/features/employee/components/modals/employee-data/contract/DetailContractModal";
import { useContractTab } from "@/features/employee/hooks/employee-data/detail/contract/useContract";
import ComponentCard from "@/components/common/ComponentCard";
import type { ContractHistoryItem } from "@/features/employee/types/dto/ContractType";
import PdfPreviewEmbed from "@/components/shared/modal/PdfPreviewEmbed";
import { clearSkFile } from "@/stores/fileStore";
import { formatDateToIndonesian } from "@/utils/formatDate";
import { useContractTabConfig } from "@/features/employee/hooks/tab/useContractTabConfig";
import { handleViewFileByUrl, getTemporaryUrl } from "@/utils/viewFileHandle";
import { useDetailDataKaryawanPersonalInfo } from "@/features/employee/stores/useDetailDataKaryawanPersonalInfo";

interface Props {
  employeeId?: string;
  data?: Karyawan;
}

function SummaryItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="h-fit rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="text-sm font-bold ">{label}</div>
      <div className="mt-1 text-xs ">{children}</div>
    </div>
  );
}

export default function ContractTab({
  employeeId: employeeIdProp,
  data,
}: Props) {
  const { detail } = useDetailDataKaryawanPersonalInfo();
  const employeeJoinDate = detail?.Employment_Position_Data?.start_date;

  const {
    summary,
    rows,
    isAddModalOpen,
    setAddModalOpen,
    // isEditModalOpen,
    // setEditModalOpen,
    isDetailModalOpen,
    setDetailModalOpen,
    editingData,
    detailData,
    setDetailData,
    setSelectedFile,
    handleAdd,
    handleAddSubmit,
    handleViewDetail,
    // handleEditRow,
    // handleEditSubmit,
    // contractData,
    isSubmitting,
  } = useContractTab({ employeeIdProp, data });

  const [temporaryFileUrl, setTemporaryFileUrl] = useState<string>('');

  const { columns, actions } = useContractTabConfig({
    rows,
    setDetailModalOpen,
    setDetailData,
    handleViewDetail,
    // handleEditRow,
  });
  const showAddButton = rows.length === 0;

  const handlePreviewPDF = async () => {
    const documentUrl = summary?.file_contract;
    if (!documentUrl) {
      return;
    }
    
    try {
      await handleViewFileByUrl(documentUrl);
    } catch (error) {
      console.error('Error viewing file:', error);
    }
  };

  // Fetch temporary URL for contract document
  useEffect(() => {
    const fetchTemporaryUrl = async () => {
      const documentUrl = summary?.file_contract;
      if (documentUrl) {
        try {
          const temporaryUrlData = await getTemporaryUrl(documentUrl);
          if (temporaryUrlData?.temporary_url) {
            setTemporaryFileUrl(temporaryUrlData.temporary_url);
          }
        } catch (error) {
          console.error('Error fetching temporary URL:', error);
        }
      }
    };

    fetchTemporaryUrl();
  }, [summary?.file_contract]);

  return (
    <>
      <ComponentCard title="Kontrak">
        <div className="grid grid-cols-1 gap-0 md:gap-6 md:grid-cols-5 ">
          {/* Left PDF Preview */}
          <div className="col-span-1 flex flex-col mb-6 md:mb-0">
            <PdfPreviewEmbed
              fileUrl={temporaryFileUrl || undefined}
              className="w-full md:h-full min-h-[300px] md:min-h-max"
            />
            <div className="mt-3 w-full flex justify-center">
              <Button
                variant="primary"
                onClick={handlePreviewPDF}
                disabled={
                  summary?.file_contract === null ||
                  summary?.file_contract === undefined
                }
              >
                Pratinjau PDF
              </Button>
            </div>
          </div>

          {/* Summary Fields */}
          <div className="col-span-4 grid grid-cols-1 gap-4 sm:grid-cols-2 h-fit">
            <SummaryItem label="Status Kontrak">
              {summary?.contract_status}
            </SummaryItem>
            <SummaryItem label="Tanggal Mulai Kontrak">
              {formatDateToIndonesian(summary?.last_contract_signed_date)}
            </SummaryItem>
            <SummaryItem label="Tanggal Berakhir Kontrak">
              {formatDateToIndonesian(summary?.end_date)}
            </SummaryItem>
            <SummaryItem label="Lama Bekerja">
              {summary?.lama_bekerja}
            </SummaryItem>
            <SummaryItem label="Sisa Kontrak">
              {summary?.sisa_kontrak || "-"}
            </SummaryItem>
            <SummaryItem label="Jenis Kontrak">
              {summary?.contract_type_name}
            </SummaryItem>
            <SummaryItem label="Kontrak ke">
              {summary?.contract_number}
            </SummaryItem>
            <SummaryItem label="Status Berakhir">
              {summary?.contract_end_status_name || "-"}
            </SummaryItem>
          </div>
        </div>
      </ComponentCard>

      {/* History Table */}
      <div className="mt-6">
        <DataTable<ContractHistoryItem>
          resetKey="riwayat-kontrak"
          title="Riwayat Kontrak"
          data={rows}
          columns={columns}
          actions={actions}
          onAdd={showAddButton ? handleAdd : undefined}
          addButtonLabel={showAddButton ? "Tambah Dokumen" : undefined}
          emptyMessage="Belum ada riwayat kontrak"
          filterable={false}
          searchable={true}
          searchPlaceholder="Cari riwayat kontrak..."
          disablePagination={false}
          clientSide={true}
        />
      </div>
      {showAddButton && (
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
          employeeJoinDate={employeeJoinDate}
        />
      )}

      {/* <EditContractModal
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
      /> */}

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

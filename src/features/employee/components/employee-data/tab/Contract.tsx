import { useMemo, useState, type ReactNode, useEffect } from 'react';
import type { Karyawan } from '@/features/employee/types/Employee';
import Button from '@/components/ui/button/Button';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import AddContractModal from '@/features/employee/components/modals/employee-data/contract/AddContractModal';
import EditContractModal from '@/features/employee/components/modals/employee-data/contract/EditContractModal';
import DetailContractModal from '@/features/employee/components/modals/employee-data/contract/DetailContractModal';
import type { ContractEntry } from '@/features/employee/components/modals/employee-data/contract/BaseModal';
import { IconPencil, IconFileDetail } from '@/icons/components/icons';
import ComponentCard from '@/components/common/ComponentCard';
import { getContractForEdit, useContract, updateContract } from '@/features/employee/hooks/employee-data/detail/useContract';
import type { ContractHistoryItem, CreateContractPayload } from '@/features/employee/services/detail/ContractService';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';
import PdfPreviewEmbed from '@/components/shared/modal/PdfPreviewEmbed';
import { clearSkFile } from '@/stores/fileStore';
import { formatDateToIndonesian } from '@/utils/formatDate';

interface Props {
  employeeId?: string;
  data?: Karyawan;
  isEditable?: boolean;
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
  const { detail } = useDetailDataKaryawanPersonalInfo();
  const defaultName = useMemo(() => (data as any)?.name ?? (data as any)?.fullName ?? '', [data]);
  const memoizedEmployeeId = useMemo(() => (data as any)?.id ?? '', [data]);
  const employeeId = employeeIdProp || memoizedEmployeeId;

  // Use the contract hook
  const { contractData, isSubmitting, createContract } = useContract({
    employeeId,
    autoFetch: !!employeeId,
  });

  const [summary, setSummary] = useState<ContractEntry>({
    full_name: defaultName || 'Megawati',
    contract_status_id: '',
    last_contract_signed_date: '',
    end_date: '',
    contract_type: '',
    contract_number: 0,
    contract_end_status_id: '',
    deskripsi: '',
    file_contract: '',
    lamaBekerja: '',
  });

  const [rows, setRows] = useState<ContractHistoryItem[]>([]);

  // Update summary and rows when contract data is loaded
  useEffect(() => {
    if (contractData) {
      console.log('Contract Data Loaded:', contractData);
      setSummary({
        full_name: detail?.Data_Pribadi.full_name || '',
        contract_status_id: contractData.summary?.contract_status_id || '',
        contract_status_name: contractData.summary?.status_kontrak,
        last_contract_signed_date: contractData.summary?.ttd_kontrak_terakhir,
        lamaBekerja: contractData.summary?.lama_bekerja,
        end_date: contractData.summary?.berakhir_kontrak,
        contract_type: contractData.summary?.jenis_kontrak,
        contract_number: contractData.summary?.kontrak_ke,
        contract_end_status_id: contractData.summary?.contract_end_status_id || '',
        deskripsi: '',
        file_contract: contractData.summary?.kontrak_aktif,
      });
      setRows(contractData.contracts);
    }
  }, [contractData, detail]);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<ContractEntry | null>(null);
  const [detailData, setDetailData] = useState<ContractEntry | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAdd = () => {
    setEditingData({
      full_name: summary.full_name,
      contract_status_id: '',
      last_contract_signed_date: '',
      end_date: '',
      contract_type: '',
      contract_number: (summary.contract_number ?? 0) + 1,
      contract_end_status_id: '',
      deskripsi: '',
    });
    setSelectedFile(null);
    setAddModalOpen(true);
  };

  const handleViewDetail = (row: ContractHistoryItem) => {
    getContractForEdit(row.id as unknown as string).then((response) => {
      const data = response.data as any;
      setDetailData({
        id: row.id,
        full_name: data.full_name || detail?.Data_Pribadi.full_name,
        contract_status_id: data.contract_status_id,
        contract_status_name: data.contract_status_name,
        last_contract_signed_date: data.last_contract_signed_date,
        end_date: data.end_date,
        contract_type: data.contract_type,
        contract_number: data.contract_number,
        contract_end_status_id: data.contract_end_status_id,
        contract_end_status_name: data.contract_end_status_name,
        file_contract: data.file_contract,
      });
      setDetailModalOpen(true);
    });
  };

  const handleAddSubmit = async (entry: ContractEntry) => {
    // For add mode, file is required
    if (!selectedFile) {
      alert('Please select a contract file');
      return;
    }

    const payload: CreateContractPayload = {
      contract_status: parseInt(entry.contract_status_id) || 1,
      last_contract_signed_date: entry.last_contract_signed_date,
      end_date: entry.end_date,
      contract_type: entry.contract_type === 'PKWT' ? 1 : entry.contract_type === 'PKWTT' ? 2 : 1,
      contract_number: String(entry.contract_number),
      file_contract: selectedFile || new File([], ''),
    };

    const success = await createContract(payload);
    if (success) {
      setAddModalOpen(false);
      setSelectedFile(null);
    }
  };

  const handleEditSubmit = async (entry: ContractEntry) => {
    if (!entry.id) return;

    const formData = new FormData();
    formData.append('contract_status_id', entry.contract_status_id);
    formData.append('contract_end_status_id', entry.contract_end_status_id || '');
    formData.append('note_for_resign', entry.catatan || '');
    
    if (selectedFile) {
      formData.append('file_for_resign', selectedFile);
    }
    
    try {
      await updateContract(employeeId, entry.id, formData as any);
      setEditModalOpen(false);
      setSelectedFile(null);
    } catch (err: any) {
      console.error('Update contract error:', err);
    }
  };

  const handleEditRow = (row: ContractHistoryItem) => {
    getContractForEdit(row.id as unknown as string).then((response) => {
      const data = response.data as any;
      
      // Map API response to ContractEntry
      setEditingData({
        id: row.id,
        full_name: data.full_name || detail?.Data_Pribadi.full_name,
        contract_status_id: data.contract_status_id,
        contract_status_name: data.contract_status_name,
        last_contract_signed_date: data.last_contract_signed_date,
        end_date: data.end_date,
        contract_type: data.contract_type,
        contract_number: data.contract_number,
        contract_end_status_id: data.contract_end_status_id,
        contract_end_status_name: data.contract_end_status_name,
        file_contract: data.file_contract,
      });
      setSelectedFile(null);
      setEditModalOpen(true);
    });
  };

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
      onClick: (row) => {
        handleViewDetail(row);
      },
    },
    {
      variant: 'outline',
      icon: <IconPencil />,
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
          // isLoading={isLoading}
        />
      </div>

      {/* Add/Edit Modal */}
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

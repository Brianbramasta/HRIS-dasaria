import { useMemo, useState, type ReactNode, useEffect } from 'react';
import type { Karyawan } from '@/features/employee/types/Employee';
import Button from '@/components/ui/button/Button';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import ContractModal, { type ContractEntry } from '@/features/employee/components/modals/employee-data/contract/ContractModal';
import { IconPencil, IconFileDetail } from '@/icons/components/icons';
import ComponentCard from '@/components/common/ComponentCard';
import { useContract } from '@/features/employee/hooks/employee-data/detail/useContract';
import type { ContractHistoryItem, CreateContractPayload } from '@/features/employee/services/detail/ContractService';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';
import PdfPreviewEmbed from '@/components/shared/modal/PdfPreviewEmbed';
import { clearSkFile } from '@/stores/fileStore';

interface Props {
  employeeId?: string;
  data?: Karyawan;
  isEditable?: boolean;
}

const formatDate = (iso: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  return fmt.format(d);
};

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
  const { contractData, isLoading, isSubmitting, createContract } = useContract({
    employeeId,
    autoFetch: !!employeeId,
  });

  const [summary, setSummary] = useState<ContractEntry>({
    namaLengkap: defaultName || 'Megawati',
    statusKontrak: 'Aktif',
    lamaBekerja: '3 Tahun',
    ttdKontrakTerakhir: '2025-10-01',
    berakhirKontrak: '2026-04-01',
    jenisKontrak: 'PKWT',
    kontrakKe: 6,
    statusBerakhir: '-',
    deskripsi: '',
    fileContractUrl: '',
  });

  const [rows, setRows] = useState<ContractHistoryItem[]>([]);

  // Update summary and rows when contract data is loaded
  useEffect(() => {
    if (contractData) {
      console.log('Contract Data Loaded:', contractData);
      setSummary({
        namaLengkap: detail?.Data_Pribadi.full_name || '',
        statusKontrak: contractData.summary?.status_kontrak,
        lamaBekerja: contractData.summary?.lama_bekerja,
        ttdKontrakTerakhir: contractData.summary?.ttd_kontrak_terakhir,
        berakhirKontrak: contractData.summary?.berakhir_kontrak,
        jenisKontrak: contractData.summary?.jenis_kontrak,
        kontrakKe: contractData.summary?.kontrak_ke,
        statusBerakhir: contractData.summary?.status_berakhir,
        deskripsi: '',
        fileContractUrl: contractData.summary?.kontrak_aktif,
      });
      setRows(contractData.contracts);
    }
  }, [contractData, defaultName]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editing, setEditing] = useState<ContractEntry | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAdd = () => {
    setModalMode('add');
    setEditing({
      ...summary,
      deskripsi: '',
      kontrakKe: (summary.kontrakKe ?? 0) + 1,
    });
    setSelectedFile(null);
    setModalOpen(true);
  };

  const handleEditRow = (row: ContractHistoryItem) => {
    setModalMode('edit');
    setEditing({
      namaLengkap: defaultName,
      statusKontrak: row.contract_status,
      lamaBekerja: summary.lamaBekerja,
      ttdKontrakTerakhir: row.last_contract_signed_date,
      berakhirKontrak: row.end_date,
      jenisKontrak: row.contract_type,
      kontrakKe: summary.kontrakKe,
      statusBerakhir: summary.statusBerakhir,
      deskripsi: row.contract_number,
    });
    setSelectedFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (entry: ContractEntry) => {
    if (!selectedFile) {
      alert('Please select a contract file');
      return;
    }

    // Map contract status to number
    const contractStatusMap: Record<string, number> = {
      'Aktif': 1,
      'Tidak Aktif': 2,
      'Probation': 3,
      'Resigned': 4,
    };

    // Map contract type to number
    const contractTypeMap: Record<string, number> = {
      'PKWT': 1,
      'PKWTT': 2,
    };

    const payload: CreateContractPayload = {
      contract_status: contractStatusMap[entry.statusKontrak] || 1,
      last_contract_signed_date: entry.ttdKontrakTerakhir,
      end_date: entry.berakhirKontrak,
      contract_type: contractTypeMap[entry.jenisKontrak] || 1,
      contract_number: entry.deskripsi || '1',
      file_contract: selectedFile,
    };

    const success = await createContract(payload);
    if (success) {
      setModalOpen(false);
      setSelectedFile(null);
    }
  };

  const columns: DataTableColumn<ContractHistoryItem>[] = [
    { id: 'no', label: 'No.', align: 'center', format: (_v, row) => rows.findIndex((r) => r.id === row.id) + 1, sortable: false },
    { id: 'contract_type', label: 'Jenis Kontrak' },
    { id: 'last_contract_signed_date', label: 'TTD Kontrak Terakhir', format: (v) => formatDate(v) },
    { id: 'end_date', label: 'Berakhir Kontrak', format: (v) => (v ? formatDate(v) : '-') },
  ];

  const actions: DataTableAction<ContractHistoryItem>[] = [
    {
      variant: 'outline',
      color: 'error',
      icon: <IconFileDetail />,
      onClick: (row) => {
        if (row.file_contract) {
          window.open(formatUrlFile(row.file_contract), '_blank');
        }
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
          <div className="col-span-1">
            <PdfPreviewEmbed 
              fileUrl={summary?.fileContractUrl ? formatUrlFile(summary?.fileContractUrl as string) : undefined}
              className="w-full h-56"
            />
            <div className="mt-3 w-full flex justify-center">
              <Button variant="primary" onClick={() => window.open(formatUrlFile(summary?.fileContractUrl as string), '_blank')} disabled={summary?.fileContractUrl === null || summary?.fileContractUrl === undefined}>Pratinjau PDF</Button>
            </div>
          </div>

          {/* Summary Fields */}
          <div className="col-span-4 grid grid-cols-1 gap-4 sm:grid-cols-3 h-fit">
            <SummaryItem label="Status Kontrak">{summary?.statusKontrak}</SummaryItem>
            <SummaryItem label="TTD Kontrak Terakhir">{formatDate(summary?.ttdKontrakTerakhir)}</SummaryItem>
            <SummaryItem label="Berakhir Kontrak">{formatDate(summary?.berakhirKontrak)}</SummaryItem>
            <SummaryItem label="Lama Bekerja">{summary?.lamaBekerja}</SummaryItem>
            <SummaryItem label="Sisa Kontrak">{contractData?.summary?.sisa_kontrak || '-'}</SummaryItem>
            <SummaryItem label="Jenis Kontrak">{summary?.jenisKontrak}</SummaryItem>
            <SummaryItem label="Kontrak ke">{summary?.kontrakKe}</SummaryItem>
            <SummaryItem label="Status Berakhir">{summary?.statusBerakhir}</SummaryItem>
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
      <ContractModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={editing}
        onClose={() => {
          setModalOpen(false);
          setSelectedFile(null);
          clearSkFile();
        }}
        onSubmit={handleSubmit}
        submitting={isSubmitting}
        onFileChange={setSelectedFile}
        showStatusBerakhir={modalMode === 'edit'}
      />
    </>
  );
}

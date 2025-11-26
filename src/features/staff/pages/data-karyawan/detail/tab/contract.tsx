import { useMemo, useState, type ReactNode } from 'react';
import type { Karyawan } from '@/features/staff/types/Karyawan';
import Button from '@/components/ui/button/Button';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import ContractModal, { type ContractEntry } from '@/features/staff/components/modals/dataKaryawan/contract/ContractModal';
import { IconPencil, IconFileDetail } from '@/icons/components/icons';
import ComponentCard from '@/components/common/ComponentCard';

interface Props {
  data?: Karyawan;
  isEditable?: boolean;
}

type HistoryRow = {
  id: number;
  deskripsi: string;
  jenisKontrak: string;
  ttdKontrakTerakhir: string; // yyyy-MM-dd
  berakhirKontrak: string; // yyyy-MM-dd
};

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

export default function ContractTab({ data }: Props) {
  const defaultName = useMemo(() => (data as any)?.name ?? (data as any)?.fullName ?? '', [data]);

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
  });

  const [rows, setRows] = useState<HistoryRow[]>([
    { id: 1, deskripsi: 'Kartu Keluarga', jenisKontrak: 'PKWTT', ttdKontrakTerakhir: '2026-04-01', berakhirKontrak: '' },
    { id: 2, deskripsi: 'Kartu Tanda Penduduk', jenisKontrak: 'PKWT', ttdKontrakTerakhir: '2025-10-01', berakhirKontrak: '2026-04-01' },
    { id: 3, deskripsi: 'Ijazah Terakhir', jenisKontrak: 'Part Time', ttdKontrakTerakhir: '2025-03-01', berakhirKontrak: '2025-10-01' },
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editing, setEditing] = useState<ContractEntry | null>(null);

  const handleAdd = () => {
    setModalMode('add');
    setEditing({
      ...summary,
      deskripsi: '',
      kontrakKe: summary.kontrakKe ?? 0,
    });
    setModalOpen(true);
  };

  const handleEditRow = (row: HistoryRow) => {
    setModalMode('edit');
    setEditing({
      ...summary,
      deskripsi: row.deskripsi,
      jenisKontrak: row.jenisKontrak,
      ttdKontrakTerakhir: row.ttdKontrakTerakhir,
      berakhirKontrak: row.berakhirKontrak,
    });
    setModalOpen(true);
  };

  const handleSubmit = (entry: ContractEntry) => {
    if (modalMode === 'add') {
      const nextId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
      setRows((prev) => [
        ...prev,
        {
          id: nextId,
          deskripsi: entry.deskripsi || '- ',
          jenisKontrak: entry.jenisKontrak,
          ttdKontrakTerakhir: entry.ttdKontrakTerakhir,
          berakhirKontrak: entry.berakhirKontrak,
        },
      ]);
      setSummary(entry); // opsional: perbarui ringkasan ke entry terbaru
    } else {
      // edit: sinkronkan ringkasan dan baris terkait dengan tanggal dan jenis kontrak
      setSummary(entry);
      setRows((prev) => {
        // pilih baris yang cocok dengan ttd dan deskripsi sebelum edit jika ada
        return prev.map((r) =>
          r.deskripsi === (editing?.deskripsi || '') && r.ttdKontrakTerakhir === (editing?.ttdKontrakTerakhir || '')
            ? {
                ...r,
                deskripsi: entry.deskripsi || r.deskripsi,
                jenisKontrak: entry.jenisKontrak,
                ttdKontrakTerakhir: entry.ttdKontrakTerakhir,
                berakhirKontrak: entry.berakhirKontrak,
              }
            : r,
        );
      });
    }
    setModalOpen(false);
  };

  const columns: DataTableColumn<HistoryRow>[] = [
    { id: 'no', label: 'No.', align: 'center', format: (_v, row) => rows.findIndex((r) => r.id === row.id) + 1 , sortable: false},
    { id: 'jenisKontrak', label: 'Jenis Kontrak' },
    { id: 'ttdKontrakTerakhir', label: 'TTD Kontrak Terakhir', format: (v) => formatDate(v) },
    { id: 'berakhirKontrak', label: 'Berakhir Kontrak', format: (v) => (v ? formatDate(v) : '-') },
  ];

  const actions: DataTableAction<HistoryRow>[] = [
    {
      // label: '',
      variant: 'outline',
      color: 'error',
      icon: <IconFileDetail />,
      onClick: (row) => console.log(row),
    },
    {
      // label: '',
      variant: 'outline',
      icon: <IconPencil />,
      onClick: (row) => handleEditRow(row),
    },
    
  ];

  return (
    <>
      <ComponentCard title="Kontrak">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          {/* Left Image + Preview */}
          <div className="col-span-1">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img src="/images/user/user-10.png" alt="Preview" className="w-full h-56 object-cover" />
            </div>
            <div className="mt-3 w-full flex justify-center">
              <Button variant="primary" >Pratinjau PDF</Button>
            </div>
          </div>

          {/* Summary Fields */}
          <div className="col-span-4 grid grid-cols-1 gap-4 sm:grid-cols-3 h-fit">
            <SummaryItem label="Status Kontrak">{summary.statusKontrak}</SummaryItem>
            <SummaryItem label="TTD Kontrak Terakhir">{formatDate(summary.ttdKontrakTerakhir)}</SummaryItem>
            <SummaryItem label="Berakhir Kontrak">{formatDate(summary.berakhirKontrak)}</SummaryItem>
            <SummaryItem label="Lama Bekerja">{summary.lamaBekerja}</SummaryItem>
            <SummaryItem label="Sisa Kontrak">5 Bulan</SummaryItem>
            <SummaryItem label="Jenis Kontrak">{summary.jenisKontrak}</SummaryItem>
            <SummaryItem label="Kontrak ke">{summary.kontrakKe}</SummaryItem>
            <SummaryItem label="Status Berakhir">{summary.statusBerakhir}</SummaryItem>
            {/* <div className="col-span-2">
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="text-xs text-gray-500 mb-1">Deskripsi</div>
                <div className="text-sm text-gray-700 min-h-[80px]">{summary.deskripsi || '-'}</div>
              </div>
            </div> */}
          </div>
        </div>
      </ComponentCard>

      {/* History Table */}
      <div className="mt-6">
        <DataTable<HistoryRow>
          title="Riwayat Kontrak"
          data={rows}
          columns={columns}
          actions={actions}
          onAdd={handleAdd}
          addButtonLabel="Tambah Dokumen"
          emptyMessage="Belum ada riwayat kontrak"
        />
      </div>

      {/* Add/Edit Modal */}
      <ContractModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={false}
      />
    </>
  );
}

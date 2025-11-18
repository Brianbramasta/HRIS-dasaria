import React, { useMemo, useState } from 'react';
import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import type { Karyawan } from '@/features/staff/types/Karyawan';
import Button from '@/components/ui/button/Button';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import ContractModal, { type ContractEntry } from '@/features/staff/components/modals/dataKaryawan/contract/ContractModal';

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
    { id: 'no', label: 'No.', align: 'center', format: (_v, row) => rows.findIndex((r) => r.id === row.id) + 1 },
    { id: 'deskripsi', label: 'Deskripsi' },
    { id: 'jenisKontrak', label: 'Jenis Kontrak' },
    { id: 'ttdKontrakTerakhir', label: 'TTD Kontrak Terakhir', format: (v) => formatDate(v) },
    { id: 'berakhirKontrak', label: 'Berakhir Kontrak', format: (v) => (v ? formatDate(v) : '-') },
  ];

  const actions: DataTableAction<HistoryRow>[] = [
    {
      label: 'Edit',
      variant: 'outline',
      onClick: (row) => handleEditRow(row),
    },
    {
      label: 'Delete',
      variant: 'outline',
      color: 'error',
      onClick: (row) => setRows((prev) => prev.filter((r) => r.id !== row.id)),
    },
  ];

  return (
    <>
      <ExpandCard title="Contract" withHeaderDivider>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Image + Preview */}
          <div className="col-span-1">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img src="/images/user/user-10.png" alt="Preview" className="w-full h-56 object-cover" />
            </div>
            <div className="mt-3 w-full flex justify-center">
              <Button variant="primary" >Preview PDF</Button>
            </div>
          </div>

          {/* Summary Fields */}
          <div className="col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Status Kontrak</div>
              <div className="text-sm font-medium">{summary.statusKontrak}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">TTD Kontrak Terakhir</div>
              <div className="text-sm font-medium">{formatDate(summary.ttdKontrakTerakhir)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Berakhir Kontrak</div>
              <div className="text-sm font-medium">{formatDate(summary.berakhirKontrak)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Lama Bekerja</div>
              <div className="text-sm font-medium">{summary.lamaBekerja}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Sisa Kontrak</div>
              <div className="text-sm font-medium">5 Bulan</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Jenis Kontrak</div>
              <div className="text-sm font-medium">{summary.jenisKontrak}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Kontrak ke</div>
              <div className="text-sm font-medium">{summary.kontrakKe}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Status Berakhir</div>
              <div className="text-sm font-medium">{summary.statusBerakhir}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-gray-500 mb-1">Deskripsi</div>
              <div className="rounded-lg border border-gray-200 p-2 text-sm text-gray-700 min-h-[80px]">{summary.deskripsi || '-'}</div>
            </div>
          </div>
        </div>
      </ExpandCard>

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
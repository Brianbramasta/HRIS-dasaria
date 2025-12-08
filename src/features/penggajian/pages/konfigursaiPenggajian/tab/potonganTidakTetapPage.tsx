

// Dokumentasi: Tabel Potongan Tidak Tetap menggunakan DataTable dengan tombol Ekspor & Tambah Potongan
import React, { useMemo } from 'react';
import DataTable, { type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import { IconPencil, IconHapus } from '@/icons/components/icons';

type PotonganTidakTetapRow = {
  no?: number;
  'Nama Potongan': string;
  'Deksripsi Umum': string;
};

export default function PotonganTidakTetapPage() {
  const columns: DataTableColumn<PotonganTidakTetapRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'Nama Potongan', label: 'Nama Potongan', sortable: true },
    { id: 'Deksripsi Umum', label: 'Deksripsi Umum', sortable: true },
  ];

  const actions: DataTableAction<PotonganTidakTetapRow>[] = [
    { label: '', icon: <IconHapus />, onClick: (row) => { console.log('hapus', row); }, variant: 'outline', className: 'border-0' },
    { label: '', icon: <IconPencil />, onClick: (row) => { console.log('edit', row); }, variant: 'outline', className: 'border-0' },
  ];

  const rows: PotonganTidakTetapRow[] = useMemo(() => (
    [
      { 'Nama Potongan': 'Denda Keterlambatan', 'Deksripsi Umum': 'Potongan karena keterlambatan hadir atau melewati jam kerja yang ditentukan.' },
      { 'Nama Potongan': 'Kerusakan Inventaris', 'Deksripsi Umum': 'Potongan atas biaya penggantian inventaris atau peralatan perusahaan yang rusak karena kelalaian.' },
      { 'Nama Potongan': 'Kedisiplinan', 'Deksripsi Umum': 'Potongan terkait pelanggaran kebijakan internal perusahaan yang bersifat administratif.' },
      { 'Nama Potongan': 'Lainnya', 'Deksripsi Umum': 'Potongan tidak tetap lain sesuai kebijakan dan persetujuan terkait.' },
    ]
  ), []);

  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(',') , ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <DataTable
        title="Potongan Tidak Tetap"
        data={rows}
        columns={columns}
        actions={actions}
        searchable
        filterable
        onExport={() => exportCSV('potongan-tidak-tetap.csv', rows)}
        onAdd={() => console.log('tambah potongan')}
        addButtonLabel="Tambah Potongan"
      />
    </div>
  );
}



// Dokumentasi: Tabel Potongan Tidak Tetap + integrasi Modal Tambah/Edit
import  { useMemo, useState } from 'react';
import DataTable, { type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconPencil, IconHapus } from '@/icons/components/icons';
import PotonganTidakTetapModal from '@/features/payroll/components/modals/payroll-configuration/non-recurring-deduction/NonRecurringDeductionModal';

type PotonganTidakTetapRow = {
  no?: number;
  'Nama Potongan': string;
  'Deksripsi Umum': string;
};

export default function PotonganTidakTetapPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState<{ namaPotongan: string; deskripsiUmum: string } | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('Edit Potongan Tidak Tetap');
  const [confirmTitleButton, setConfirmTitleButton] = useState<string>('Simpan Perubahan');
  const columns: DataTableColumn<PotonganTidakTetapRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'Nama Potongan', label: 'Nama Potongan', sortable: true },
    { id: 'Deksripsi Umum', label: 'Deksripsi Umum', sortable: true },
  ];

  const actions: DataTableAction<PotonganTidakTetapRow>[] = [
    { label: '', icon: <IconHapus />, onClick: (row) => { console.log('hapus', row); }, variant: 'outline', className: 'border-0' },
    { label: '', icon: <IconPencil />, onClick: (row) => {
      setDefaultValues({ namaPotongan: row['Nama Potongan'], deskripsiUmum: row['Deksripsi Umum'] });
      setModalTitle('Edit Potongan Tidak Tetap');
      setConfirmTitleButton('Simpan Perubahan');
      setIsModalOpen(true);
    }, variant: 'outline', className: 'border-0' },
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
        onAdd={() => { setDefaultValues({ namaPotongan: '', deskripsiUmum: '' }); setModalTitle('Tambah Potongan Tidak Tetap'); setConfirmTitleButton('Simpan'); setIsModalOpen(true); }}
        addButtonLabel="Tambah Potongan"
      />
      {isModalOpen && (
        <PotonganTidakTetapModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultValues={defaultValues}
          onSave={(values) => { console.log('save potongan tidak tetap', values); }}
          title={modalTitle}
          confirmTitleButton={confirmTitleButton}
        />
      )}
    </div>
  );
}

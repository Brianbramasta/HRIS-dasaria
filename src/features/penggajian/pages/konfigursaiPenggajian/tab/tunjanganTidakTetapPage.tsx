// Dokumentasi: Tabel Tunjangan Tidak Tetap + integrasi Modal Tambah/Edit
import  { useMemo, useState } from 'react';
import DataTable, { type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import { IconPencil, IconHapus } from '@/icons/components/icons';
import EditTunjanganTidakTetapModal from '@/features/penggajian/components/modals/konfigurasiPenggajian/tunjanganTidaktetap/editTunjanganTidakTetapModal';

type TunjanganTidakTetapRow = {
  no?: number;
  'Nama Tunjangan': string;
  'Deksripsi Umum': string;
};

export default function TunjanganTidakTetapPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState<{ namaTunjangan: string; deskripsiUmum: string } | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('Edit Tunjangan Tidak Tetap');
  const [confirmTitleButton, setConfirmTitleButton] = useState<string>('Simpan Perubahan');

  const columns: DataTableColumn<TunjanganTidakTetapRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'Nama Tunjangan', label: 'Nama Tunjangan', sortable: true },
    { id: 'Deksripsi Umum', label: 'Deksripsi Umum', sortable: true },
  ];

  const actions: DataTableAction<TunjanganTidakTetapRow>[] = [
    { label: '', icon: <IconHapus />, onClick: (row) => { console.log('hapus', row); }, variant: 'outline', className: 'border-0' },
    { label: '', icon: <IconPencil />, onClick: (row) => {
      setDefaultValues({ namaTunjangan: row['Nama Tunjangan'], deskripsiUmum: row['Deksripsi Umum'] });
      setModalTitle('Edit Tunjangan Tidak Tetap');
      setConfirmTitleButton('Simpan Perubahan');
      setIsModalOpen(true);
    }, variant: 'outline', className: 'border-0' },
  ];

  const rows: TunjanganTidakTetapRow[] = useMemo(() => (
    [
      { 'Nama Tunjangan': 'Tunjangan PPH 21', 'Deksripsi Umum': 'Biasanya tunjangan untuk menanggung PPh pasal 24 atas penghasilan dari luar negeri' },
      { 'Nama Tunjangan': 'Tunjangan Pendidikan', 'Deksripsi Umum': 'Tunjangan untuk membantu biaya pendidikan karyawan atau keluarga (anak/spouse). Dapat berupa reimbursement biaya sekolah, kursus, atau pelatihan.' },
      { 'Nama Tunjangan': 'Tunjangan Performa', 'Deksripsi Umum': 'Tunjangan berdasarkan penilaian kinerja (performance appraisal). Besarnya tergantung pencapaian target atau kontribusi individu/departemen dalam periode tertentu.' },
      { 'Nama Tunjangan': 'Insentif', 'Deksripsi Umum': 'Pembayaran tambahan di luar gaji pokok yang diberikan sebagai bentuk apresiasi atas pencapaian tertentu, misalnya target penjualan, efisiensi, atau inovasi.' },
      { 'Nama Tunjangan': 'Overtime', 'Deksripsi Umum': 'Pembayaran tambahan untuk jam kerja di luar waktu normal sesuai ketentuan ketenagakerjaan.' },
      { 'Nama Tunjangan': 'Komisi Sales', 'Deksripsi Umum': 'Pembayaran berdasarkan nilai penjualan atau transaksi yang berhasil ditutup. Merupakan bagian dari skema kompensasi variabel.' },
    ]
  ), []);

  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
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
        title="Tunjangan Tidak Tetap"
        data={rows}
        columns={columns}
        actions={actions}
        searchable
        filterable
        onExport={() => exportCSV('tunjangan-tidak-tetap.csv', rows)}
        onAdd={() => { setDefaultValues({ namaTunjangan: '', deskripsiUmum: '' }); setModalTitle('Tambah Tunjangan Tidak Tetap'); setConfirmTitleButton('Simpan'); setIsModalOpen(true); }}
        addButtonLabel="Tambah Tunjangan"
      />
      {isModalOpen && (
        <EditTunjanganTidakTetapModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultValues={defaultValues}
          onSave={(values) => { console.log('save tunjangan tidak tetap', values); }}
          title={modalTitle}
          confirmTitleButton={confirmTitleButton}
        />
      )}
    </div>
  );
}

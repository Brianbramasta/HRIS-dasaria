// Dokumentasi: Tabel Tunjangan Tidak Tetap menggunakan DataTable dengan tombol Ekspor & Tambah Tunjangan
import  { useMemo } from 'react';
import DataTable, { type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import { IconPencil, IconHapus } from '@/icons/components/icons';

type TunjanganTidakTetapRow = {
  no?: number;
  'Nama Tunjangan': string;
  'Deksripsi Umum': string;
};

export default function TunjanganTidakTetapPage() {
  const columns: DataTableColumn<TunjanganTidakTetapRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'Nama Tunjangan', label: 'Nama Tunjangan', sortable: true },
    { id: 'Deksripsi Umum', label: 'Deksripsi Umum', sortable: true },
  ];

  const actions: DataTableAction<TunjanganTidakTetapRow>[] = [
    { label: '', icon: <IconHapus />, onClick: (row) => { console.log('hapus', row); }, variant: 'outline', className: 'border-0' },
    { label: '', icon: <IconPencil />, onClick: (row) => { console.log('edit', row); }, variant: 'outline', className: 'border-0' },
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
        onAdd={() => console.log('tambah tunjangan')}
        addButtonLabel="Tambah Tunjangan"
      />
    </div>
  );
}

// Dokumentasi: Komponen tabel daftar pelanggaran aktif menggunakan DataTable
import { useMemo } from 'react';
import DataTable, { type DataTableColumn } from '@/components/shared/datatable/DataTable';

type ActivePenaltyRow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  jenisPelanggaran: string;
  jenisTindakan: 'Teguran Lisan' | 'Teguran Tertulis' | 'Skorsing' | 'Pemutusan Hubungan Kerja';
  tanggalKejadian: string;
  masaBerlakuTindakan: string;
};

// Dokumentasi: Definisi kolom untuk DataTable Daftar Pelanggaran Aktif
const columns: DataTableColumn<ActivePenaltyRow>[] = [
  { id: 'no', label: 'No.', sortable: false },
  { id: 'idKaryawan', label: 'NIP', sortable: true },
  { id: 'pengguna', label: 'Pengguna', sortable: true, format: (val: string) => (
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600">
        {val?.charAt(0).toUpperCase()}
      </div>
      <span className="whitespace-nowrap">{val}</span>
    </div>
  ) },
  { id: 'jenisPelanggaran', label: 'Jenis Pelanggaran', sortable: true },
  { id: 'jenisTindakan', label: 'Jenis Tindakan', align: 'center', sortable: true, format: (val: ActivePenaltyRow['jenisTindakan']) => {
    const map: Record<ActivePenaltyRow['jenisTindakan'], string> = {
      'Teguran Lisan': 'bg-blue-100 text-blue-700',
      'Teguran Tertulis': 'bg-yellow-100 text-yellow-700',
      'Skorsing': 'bg-orange-100 text-orange-700',
      'Pemutusan Hubungan Kerja': 'bg-red-100 text-red-700',
    };
    return (
      <span className={`status-styling items-center justify-center rounded-full  text-xs font-semibold ${map[val]}`}>{val}</span>
    );
  } },
  { id: 'tanggalKejadian', label: 'Tanggal Kejadian', sortable: true },
  { id: 'masaBerlakuTindakan', label: 'Masa Berlaku Tindakan', sortable: true },
];

// Dokumentasi: Data dummy untuk menampilkan tabel yang konsisten dengan desain
const sampleRows: ActivePenaltyRow[] = [
  { idKaryawan: '12345678910', pengguna: 'Lindsey Curtis', jenisPelanggaran: 'Keterlambatan', jenisTindakan: 'Teguran Lisan', tanggalKejadian: '12 Januari 2025', masaBerlakuTindakan: '12 Februari 2025' },
  { idKaryawan: '12345678911', pengguna: 'Dedik Mulyadi', jenisPelanggaran: 'Absensi Tanpa Izin', jenisTindakan: 'Teguran Tertulis', tanggalKejadian: '10 Januari 2025', masaBerlakuTindakan: '10 April 2025' },
  { idKaryawan: '12345678912', pengguna: 'Onana', jenisPelanggaran: 'Tidak Mematuhi SOP', jenisTindakan: 'Teguran Tertulis', tanggalKejadian: '05 Januari 2025', masaBerlakuTindakan: '05 April 2025' },
  { idKaryawan: '12345678913', pengguna: 'Maguire', jenisPelanggaran: 'Pelanggaran Disiplin', jenisTindakan: 'Skorsing', tanggalKejadian: '01 Januari 2025', masaBerlakuTindakan: '31 Januari 2025' },
  { idKaryawan: '12345678914', pengguna: 'Mulyadi', jenisPelanggaran: 'Kelalaian Pekerjaan', jenisTindakan: 'Teguran Lisan', tanggalKejadian: '15 Desember 2024', masaBerlakuTindakan: '15 Januari 2025' },
];

// Dokumentasi: Komponen utama ActivePenaltyList merender DataTable dengan kolom dan data
export default function ActivePenaltyList() {
  const rows = useMemo(() => sampleRows.map((r, idx) => ({ ...r, no: idx + 1 })), []);
  return (
    <DataTable
      title="Daftar Pelanggaran Aktif"
      data={rows}
      columns={columns}
      pageSize={10}
      pageSizeOptions={[10, 25, 50]}
      resetKey="dashboard-active-penalty"
    />
  );
}

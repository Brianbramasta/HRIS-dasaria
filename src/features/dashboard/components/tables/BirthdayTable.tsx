// Dokumentasi: Komponen tabel ulang tahun bulan ini menggunakan DataTable
import { useMemo } from 'react';
import DataTable, { type DataTableColumn } from '@/features/structure-and-organize/components/datatable/DataTable';

type BirthdayRow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  tanggalLahir: string;
  perusahaan: string;
  posisi: string;
  departemen: string;
  divisi: string;
  direktorat: string;
  statusKaryawan: 'Aktif' | 'Tidak Aktif' | 'Evaluasi' | 'Mengundurkan Diri';
  kategoriKaryawan: 'Staff' | 'Tidak Staff';
};

// Dokumentasi: Definisi kolom untuk DataTable Ulang Tahun
const columns: DataTableColumn<BirthdayRow>[] = [
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
  { id: 'tanggalLahir', label: 'Tanggal Lahir', sortable: true },
  { id: 'perusahaan', label: 'Perusahaan', sortable: true },
  { id: 'posisi', label: 'Posisi', sortable: true },
  { id: 'departemen', label: 'Departemen', sortable: true },
  { id: 'divisi', label: 'Divisi', sortable: true },
  { id: 'direktorat', label: 'Direktorat', sortable: true },
  { id: 'statusKaryawan', label: 'Status Karyawan', align: 'center', sortable: true, format: (val: BirthdayRow['statusKaryawan']) => {
    const map: Record<BirthdayRow['statusKaryawan'], string> = {
      'Aktif': 'bg-green-100 text-green-700',
      'Tidak Aktif': 'bg-red-100 text-red-700',
      'Evaluasi': 'bg-orange-100 text-orange-700',
      'Mengundurkan Diri': 'bg-violet-100 text-violet-700',
    };
    return (
      <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${map[val]}`}>{val}</span>
    );
  } },
  { id: 'kategoriKaryawan', label: 'Kategori Karyawan', sortable: true },
];

// Dokumentasi: Data dummy untuk menampilkan tabel yang konsisten dengan desain
const sampleRows: BirthdayRow[] = [
  { idKaryawan: '12345678910', pengguna: 'Lindsey Curtis', tanggalLahir: '28 Januari 1999', perusahaan: 'Dasarata', posisi: 'Web Designer', departemen: 'HRIS', divisi: 'Direktur Teknologi dan Jaringan', direktorat: 'Direktur Teknologi dan Jaringan', statusKaryawan: 'Aktif', kategoriKaryawan: 'Staff' },
  { idKaryawan: '12345678910', pengguna: 'Dedik Mulyadi', tanggalLahir: '28 Januari 1999', perusahaan: 'Dasarata', posisi: 'Data Analyst', departemen: 'BA', divisi: 'Manier Teknologi dan Jaringan', direktorat: 'Manier Teknologi dan Jaringan', statusKaryawan: 'Aktif', kategoriKaryawan: 'Staff' },
  { idKaryawan: '12345678910', pengguna: 'Onana', tanggalLahir: '28 Januari 1999', perusahaan: 'Dasarata', posisi: 'UI/UX Designer', departemen: 'HRIS', divisi: 'Fullstack', direktorat: 'Fullstack', statusKaryawan: 'Aktif', kategoriKaryawan: 'Staff' },
  { idKaryawan: '12345678910', pengguna: 'Maguire', tanggalLahir: '28 Januari 1999', perusahaan: 'Dasarata', posisi: 'Project Manager', departemen: 'IT', divisi: 'Fullstack Developer', direktorat: 'Fullstack Developer', statusKaryawan: 'Tidak Aktif', kategoriKaryawan: 'Tidak Staff' },
  { idKaryawan: '12345678910', pengguna: 'Mulyadi', tanggalLahir: '28 Januari 1999', perusahaan: 'GriyaNet', posisi: 'Front-end Developer', departemen: 'HRIS', divisi: 'Fullstack Developer', direktorat: 'Fullstack Developer', statusKaryawan: 'Tidak Aktif', kategoriKaryawan: 'Tidak Staff' },
  { idKaryawan: '12345678910', pengguna: 'Lindsey Curtis', tanggalLahir: '28 Januari 1999', perusahaan: 'GriyaNet', posisi: 'Human Resource', departemen: 'HR', divisi: 'Recruiter', direktorat: 'Recruiter', statusKaryawan: 'Evaluasi', kategoriKaryawan: 'Tidak Staff' },
  { idKaryawan: '12345678910', pengguna: 'Kayla Curtis', tanggalLahir: '28 Januari 1999', perusahaan: 'GriyaNet', posisi: 'Accounting', departemen: 'Accounting', divisi: 'Accounting', direktorat: 'Accounting', statusKaryawan: 'Evaluasi', kategoriKaryawan: 'Tidak Staff' },
  { idKaryawan: '12345678910', pengguna: 'Carla George', tanggalLahir: '28 Januari 1999', perusahaan: 'GriyaNet', posisi: 'Accounting', departemen: 'Accounting', divisi: 'Accounting', direktorat: 'Accounting', statusKaryawan: 'Evaluasi', kategoriKaryawan: 'Tidak Staff' },
  { idKaryawan: '12345678910', pengguna: 'Abram Schleffer', tanggalLahir: '28 Januari 1999', perusahaan: 'GriyaNet', posisi: 'BA', departemen: 'BA', divisi: 'BA', direktorat: 'BA', statusKaryawan: 'Mengundurkan Diri', kategoriKaryawan: 'Tidak Staff' },
  { idKaryawan: '12345678910', pengguna: 'Rain Schleffer', tanggalLahir: '28 Januari 1999', perusahaan: 'GriyaNet', posisi: 'Digital Marketer', departemen: 'BA', divisi: 'BA', direktorat: 'BA', statusKaryawan: 'Mengundurkan Diri', kategoriKaryawan: 'Tidak Staff' },
];

// Dokumentasi: Komponen utama TableUlangtahun merender DataTable dengan kolom dan data
export default function TableUlangtahun() {
  const rows = useMemo(() => sampleRows.map((r, idx) => ({ ...r, no: idx + 1 })), []);
  return (
    <DataTable
      title="Yang Ulang Tahun Bulan ini"
      data={rows}
      columns={columns}
      pageSize={10}
      pageSizeOptions={[10, 25, 50]}
      resetKey="dashboard-birthday"
    />
  );
}


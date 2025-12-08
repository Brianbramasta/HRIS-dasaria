// Dokumentasi: Tabel "Status Kasbon" menggunakan DataTable
import { useMemo } from 'react';
import { DataTable, type DataTableColumn } from '@/features/structure-and-organize/components/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';

type StatusKasbonRow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  avatar?: string;
  tanggalPengajuan: string;
  posisi: string;
  departemen: string;
  tanggalMulaiPotongan: string;
  tanggalPencairan: string;
  jenisKasbon: string;
  nominalKasbon: string;
  nominalCicilan: string;
  sisaPeriodeCicilan: string;
  periodeCicilan: string;
  statusKasbon: 'Menunggu Cicilan' | 'Selesai' | 'New Cicilan';
  detail?: string;
};

export default function StatusKasbonPage() {
  // Dokumentasi: util ekspor CSV sederhana
//   const exportCSV = (filename: string, data: any[]) => {
//     if (!data || data.length === 0) return;
//     const headers = Object.keys(data[0]);
//     const csv = [headers.join(','), ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', filename);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

  // Dokumentasi: definisi kolom tabel sesuai kebutuhan UI
  const columns: DataTableColumn<StatusKasbonRow>[] = [
    {
      id: 'no',
      label: 'No.',
      align: 'center',
      sortable: false,
      format: (_, row) => rows.indexOf(row) + 1,
    },
    { id: 'idKaryawan', label: 'ID Karyawan', sortable: true },
    {
      id: 'pengguna',
      label: 'Pengguna',
      sortable: true,
      format: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${value}`}
            alt={value}
            className="h-8 w-8 rounded-full"
          />
          <span>{value}</span>
        </div>
      ),
    },
    { id: 'tanggalPengajuan', label: 'Tanggal Pengajuan', sortable: true },
    { id: 'posisi', label: 'Posisi', sortable: true },
    { id: 'departemen', label: 'Departemen', sortable: true },
    { id: 'tanggalMulaiPotongan', label: 'Tanggal Mulai Potongan', sortable: true },
    { id: 'tanggalPencairan', label: 'Tanggal Pencairan', sortable: true },
    { id: 'jenisKasbon', label: 'Jenis Kasbon', sortable: true },
    { id: 'nominalKasbon', label: 'Nominal Kasbon', align: 'right', sortable: true },
    { id: 'nominalCicilan', label: 'Nominal Cicilan', align: 'right', sortable: true },
    { id: 'sisaPeriodeCicilan', label: 'Sisa Periode Cicilan', sortable: true },
    { id: 'periodeCicilan', label: 'Periode Cicilan', sortable: true },
    {
      id: 'statusKasbon',
      label: 'Status Kasbon',
      sortable: true,
      format: (value: StatusKasbonRow['statusKasbon']) => {
        const color =
          value === 'Selesai' ? 'bg-success-100 text-success-700' :
          value === 'Menunggu Cicilan' ? 'bg-warning-100 text-warning-700' :
          'bg-error-100 text-error-700';
        return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{value}</span>;
      },
    },
    {
      id: 'detail',
      label: 'Detail',
      align: 'center',
      sortable: false,
      format: () => (
        <button className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.06]">
          <IconFileDetail />
        </button>
      ),
    },
  ];

  // Dokumentasi: contoh data statis untuk tampilan tabel
  const rows: StatusKasbonRow[] = useMemo(() => (
    [
      { idKaryawan: '1523409876', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', tanggalMulaiPotongan: '20/11/2025', tanggalPencairan: '—', jenisKasbon: 'Swari', nominalKasbon: '3.000.000', nominalCicilan: '300.000', sisaPeriodeCicilan: '3 bulan', periodeCicilan: '3 bulan', statusKasbon: 'New Cicilan' },
      { idKaryawan: '1523409877', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', tanggalMulaiPotongan: '20/11/2025', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '10.000.000', nominalCicilan: '1.000.000', sisaPeriodeCicilan: '6 bulan', periodeCicilan: '10 bulan', statusKasbon: 'Selesai' },
      { idKaryawan: '1523409878', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', tanggalMulaiPotongan: '20/11/2025', tanggalPencairan: '—', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', sisaPeriodeCicilan: '4 bulan', periodeCicilan: '13 bulan', statusKasbon: 'Selesai' },
      { idKaryawan: '1523409879', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', tanggalMulaiPotongan: '20/11/2025', tanggalPencairan: '—', jenisKasbon: 'Operasional', nominalKasbon: '7.000.000', nominalCicilan: '700.000', sisaPeriodeCicilan: '12 bulan', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Cicilan' },
      { idKaryawan: '1523409880', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'LND', departemen: 'HR', tanggalMulaiPotongan: '20/11/2025', tanggalPencairan: '—', jenisKasbon: 'Swari', nominalKasbon: '3.000.000', nominalCicilan: '300.000', sisaPeriodeCicilan: '3 bulan', periodeCicilan: '3 bulan', statusKasbon: 'New Cicilan' },
    ]
  ), []);

  return (
    <div className="p-4">
      {/* <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Status Kasbon</h1> */}
      <DataTable
        title="Status Kasbon"
        data={rows}
        columns={columns}
        searchable
        filterable
        // onExport={() => exportCSV('status-kasbon.csv', rows)}
      />
    </div>
  );
}

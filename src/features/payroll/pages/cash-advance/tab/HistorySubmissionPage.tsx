// Dokumentasi: Tabel "Riwayat Pengajuan Kasbon" & integrasi modal pengajuan
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type DataTableColumn } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import ShareLinkModal from '@/features/employee/components/modals/sharelink/ShareLink';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
// Dokumentasi: perbaikan casing import untuk menghindari error TS1261
// import PengajuanKasbonModal from '@/features/penggajian/components/modals/kasbon/PengajuanKasbonModal';
import PengajuanKasbonModal from '@/features/payroll/components/modals/cash-advance/CashAdvanceSubmissionModal';

type KasbonRiwayatRow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  avatar?: string;
  tanggalPengajuan: string;
  posisi: string;
  departemen: string;
  bulanMulaiPotongan: string;
  tanggalPencairan: string;
  jenisKasbon: string;
  nominalKasbon: string;
  nominalCicilan: string;
  periodeCicilan: string;
  statusKasbon: 'Menunggu Persetujuan HR' | 'Disetujui' | 'Ditolak';
  detail?: string;
};

export default function RiwayatPengajuanPage() {
  // Dokumentasi: inisialisasi navigate dan state modal
  const navigate = useNavigate();
  // Dokumentasi: util ekspor CSV sederhana
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

  // Dokumentasi: definisi kolom tabel sesuai kebutuhan UI
  const columns: DataTableColumn<KasbonRiwayatRow>[] = [
    {
      id: 'no',
      label: 'No.',
      align: 'center',
      sortable: false,
      format: (_, row) => rows.indexOf(row) + 1,
    },
    { id: 'idKaryawan', label: 'NIP', sortable: true },
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
    { id: 'bulanMulaiPotongan', label: 'Bulan Mulai Potongan', sortable: true },
    { id: 'tanggalPencairan', label: 'Tanggal Pencairan', sortable: true },
    { id: 'jenisKasbon', label: 'Jenis Kasbon', sortable: true },
    { id: 'nominalKasbon', label: 'Nominal Kasbon', align: 'right', sortable: true },
    { id: 'nominalCicilan', label: 'Nominal Cicilan', align: 'right', sortable: true },
    { id: 'periodeCicilan', label: 'Periode Cicilan', sortable: true },
    {
      id: 'statusKasbon',
      label: 'Status Kasbon',
      sortable: true,
      format: (value: KasbonRiwayatRow['statusKasbon']) => {
        const color =
          value === 'Disetujui' ? 'bg-success-100 text-success-700' :
          value === 'Ditolak' ? 'bg-error-100 text-error-700' :
          'bg-warning-100 text-warning-700';
        return <span className={`rounded-full p-[10px] flex justify-center items-center text-center text-xs font-semibold ${color}`}>{value}</span>;
      },
    },
    {
      id: 'detail',
      label: 'Detail',
      align: 'center',
      sortable: false,
      format: (_, row) => (
        <button 
          onClick={() => navigate(`/cash-advance/detail/${row.idKaryawan}`)}
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.06]"
        >
          <IconFileDetail />
        </button>
      ),
    },
  ];

  // Dokumentasi: contoh data statis untuk tampilan tabel
  const rows: KasbonRiwayatRow[] = useMemo(() => (
    [
      { idKaryawan: '1523409876', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409877', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', periodeCicilan: '13 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409878', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '1.200.000', nominalCicilan: '150.000', periodeCicilan: '8 bulan', statusKasbon: 'Ditolak' },
      { idKaryawan: '1523409879', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '5.000.000', nominalCicilan: '500.000', periodeCicilan: '10 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409880', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'LND', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '2.500.000', nominalCicilan: '250.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409876', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409877', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', periodeCicilan: '13 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409878', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '1.200.000', nominalCicilan: '150.000', periodeCicilan: '8 bulan', statusKasbon: 'Ditolak' },
      { idKaryawan: '1523409879', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '5.000.000', nominalCicilan: '500.000', periodeCicilan: '10 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409880', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'LND', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '2.500.000', nominalCicilan: '250.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409876', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409877', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', periodeCicilan: '13 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409878', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '1.200.000', nominalCicilan: '150.000', periodeCicilan: '8 bulan', statusKasbon: 'Ditolak' },
      { idKaryawan: '1523409879', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '5.000.000', nominalCicilan: '500.000', periodeCicilan: '10 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409880', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'LND', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '2.500.000', nominalCicilan: '250.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409876', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409877', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', periodeCicilan: '13 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409878', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '1.200.000', nominalCicilan: '150.000', periodeCicilan: '8 bulan', statusKasbon: 'Ditolak' },
      { idKaryawan: '1523409879', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '5.000.000', nominalCicilan: '500.000', periodeCicilan: '10 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409880', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'LND', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '2.500.000', nominalCicilan: '250.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409876', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409877', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', periodeCicilan: '13 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409878', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '1.200.000', nominalCicilan: '150.000', periodeCicilan: '8 bulan', statusKasbon: 'Ditolak' },
      { idKaryawan: '1523409879', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '5.000.000', nominalCicilan: '500.000', periodeCicilan: '10 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409880', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'LND', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '2.500.000', nominalCicilan: '250.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409876', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409877', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', periodeCicilan: '13 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409878', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '1.200.000', nominalCicilan: '150.000', periodeCicilan: '8 bulan', statusKasbon: 'Ditolak' },
      { idKaryawan: '1523409879', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '5.000.000', nominalCicilan: '500.000', periodeCicilan: '10 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409880', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'LND', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '2.500.000', nominalCicilan: '250.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409876', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409877', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', periodeCicilan: '13 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409878', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '1.200.000', nominalCicilan: '150.000', periodeCicilan: '8 bulan', statusKasbon: 'Ditolak' },
      { idKaryawan: '1523409879', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '5.000.000', nominalCicilan: '500.000', periodeCicilan: '10 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409880', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'LND', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '2.500.000', nominalCicilan: '250.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409876', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409877', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', periodeCicilan: '13 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409878', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '1.200.000', nominalCicilan: '150.000', periodeCicilan: '8 bulan', statusKasbon: 'Ditolak' },
      { idKaryawan: '1523409879', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '5.000.000', nominalCicilan: '500.000', periodeCicilan: '10 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409880', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'LND', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '2.500.000', nominalCicilan: '250.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409876', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409877', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', periodeCicilan: '13 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409878', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '1.200.000', nominalCicilan: '150.000', periodeCicilan: '8 bulan', statusKasbon: 'Ditolak' },
      { idKaryawan: '1523409879', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '5.000.000', nominalCicilan: '500.000', periodeCicilan: '10 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409880', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'LND', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '2.500.000', nominalCicilan: '250.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409876', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: '1523409877', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', periodeCicilan: '13 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409878', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '1.200.000', nominalCicilan: '150.000', periodeCicilan: '8 bulan', statusKasbon: 'Ditolak' },
      { idKaryawan: '1523409879', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'HEBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Pribadi', nominalKasbon: '5.000.000', nominalCicilan: '500.000', periodeCicilan: '10 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: '1523409880', pengguna: 'Lindsay Curtis', tanggalPengajuan: '20/10/2025', posisi: 'LND', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '20/12/2025', jenisKasbon: 'Operasional', nominalKasbon: '2.500.000', nominalCicilan: '250.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
    ]
  ), []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dokumentasi: URL share menuju form kasbon
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cash-advance/cash-advance-form` : '/cash-advance/cash-advance-form';

  // Dokumentasi: handler membuka modal ShareLink
  const handleOpenShare = () => {
    setIsShareOpen(true);
  };

  // Dokumentasi: handler navigasi ke halaman Form Kasbon
  const handleOpenFormKasbon = () => {
    setIsModalOpen(false);
    navigate('/cash-advance/cash-advance-form');
  };

  return (
    <div className="p-0">
      <DataTable
        title="Riwayat Pengajuan"
        data={rows}
        columns={columns}
        searchable
        filterable
        onExport={() => exportCSV('riwayat-pengajuan-kasbon.csv', rows)}
        onAdd={() => setIsModalOpen(true)}
        addButtonLabel="Form Pengajuan Kasbon"
        toolbarRightSlot={
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              Riwayat Pengajuan Kasbon
              <ChevronDown size={16} />
            </Button>
            <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
              <div className="p-2 w-64">
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/cash-advance/submission-history');
                  }}
                >
                  Riwayat Pengajuan Kasbon
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/cash-advance/approval');
                  }}
                >
                  Persetujuan Kasbon
                </button>
              </div>
            </Dropdown>
          </div>
        }
      />

      <PengajuanKasbonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShareLink={handleOpenShare}
        onFormKasbon={handleOpenFormKasbon}
      />

      <ShareLinkModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        link={shareUrl}
        message="Silakan isi form kasbon melalui tautan berikut"
      />
    </div>
  );
}

// Dokumentasi: Tab Non AE untuk Periode Penggajian menggunakan DataTable dengan kolom sesuai dokumen
// Dokumentasi: Tab Non AE - tambah navigasi ke halaman Detail Gaji saat klik Edit
import  { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
// Dokumentasi: Menggunakan toolbarRightSlotAtas untuk menempatkan tombol Import & Template di bar atas.
import DataTable, { DataTableColumn, DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import Button from '@/components/ui/button/Button';
import { Edit, Trash } from 'react-feather';
import { IconDownloadTemplate, IconImport } from '@/icons/components/icons';

type NonAERow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  tanggalPengajuan: string;
  totalGajiBersih: string;
  gajiPokokUangSaku: string;
  potongan: string;
  tunjanganTetap: string;
  tunjanganTidakTetap: string;
  kategori: string;
  perusahaan: string;
  statusPenggajian: string;
  approvalHrga: string;
  approvalFat: string;
  approvalDirekturKeuangan: string;
};

export default function NonAETab({ resetKey = 'non-ae' }: { resetKey?: string }) {
  // Dokumentasi: Navigasi ke halaman detail menggunakan react-router
  const navigate = useNavigate();
  const [rows] = useState<NonAERow[]>([
    { idKaryawan: '12345678', pengguna: 'Lindsey Curtis', tanggalPengajuan: '20/12/2025', totalGajiBersih: '7.000.000', gajiPokokUangSaku: '5.000.000', potongan: '250.000', tunjanganTetap: '1.000.000', tunjanganTidakTetap: '750.000', kategori: 'Staff', perusahaan: 'Dasaria', statusPenggajian: 'Draft', approvalHrga: 'Selesai', approvalFat: 'Pending', approvalDirekturKeuangan: 'Selesai' },
    { idKaryawan: '12345679', pengguna: 'Lindsey Curtis', tanggalPengajuan: '20/12/2025', totalGajiBersih: '7.000.000', gajiPokokUangSaku: '5.000.000', potongan: '250.000', tunjanganTetap: '1.000.000', tunjanganTidakTetap: '750.000', kategori: 'Staff', perusahaan: 'Dasaria', statusPenggajian: 'Pending Draft', approvalHrga: 'Selesai', approvalFat: 'Selesai', approvalDirekturKeuangan: 'Pending' },
  ]);

  const columns: DataTableColumn<NonAERow>[] = useMemo(() => [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'idKaryawan', label: 'ID Karyawan' },
    { id: 'pengguna', label: 'Pengguna' },
    { id: 'tanggalPengajuan', label: 'Tanggal Pengajuan' },
    { id: 'totalGajiBersih', label: 'Total Gaji Bersih', align: 'right' },
    { id: 'gajiPokokUangSaku', label: 'Gaji Pokok / Uang Saku', align: 'right' },
    { id: 'potongan', label: 'Potongan', align: 'right' },
    { id: 'tunjanganTetap', label: 'Tunjangan Tetap', align: 'right' },
    { id: 'tunjanganTidakTetap', label: 'Tunjangan Tidak Tetap', align: 'right' },
    { id: 'kategori', label: 'Kategori' },
    { id: 'perusahaan', label: 'Perusahaan' },
    { id: 'statusPenggajian', label: 'Status Penggajian', format: (v) => <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">{String(v)}</span> },
    { id: 'approvalHrga', label: 'Approval Direktur HRGA', format: (v) => <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-200">{String(v)}</span> },
    { id: 'approvalFat', label: 'Approval FAT', format: (v) => <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">{String(v)}</span> },
    { id: 'approvalDirekturKeuangan', label: 'Approval Direktur Keuangan', format: (v) => <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-200">{String(v)}</span> },
  ], []);

  const actions: DataTableAction<NonAERow>[] = [
    {
      label: '',
      icon: <Edit />,
      onClick: (row) => {
        // Dokumentasi: arahkan ke halaman detail dengan idKaryawan sebagai parameter
        navigate(`/periode-gajian/detail-non-ae/${row.idKaryawan}`);
      },
      variant: 'outline',
      className: 'border-0',
    },
    { label: '', icon: <Trash />, onClick: () => {}, variant: 'outline', className: 'border-0', color: 'error' },
  ];

  const toolbarRightSlot = (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" className="bg-success text-white dark:text-white">
        <IconImport size={16} /> Import</Button>
      <Button variant="custom" className='w-max bg-[#007BFF] text-white dark:text-white' size="sm">
        <IconDownloadTemplate size={16} />
        Template Import Data</Button>
    </div>
  );

  return (
    <DataTable
      title="Periode Gajian"
      data={rows}
      columns={columns}
      actions={actions}
      toolbarRightSlotAtas={toolbarRightSlot}
      resetKey={resetKey}
    />
  );
}

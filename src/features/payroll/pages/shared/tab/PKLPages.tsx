import  { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DataTableColumn } from '@/features/structure-and-organize/components/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';

type PKLRow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  tanggalPengajuan: string;
  jumlahHariKerja: string;
  uangSaku: string;
  kategori: string;
  perusahaan: string;
  statusPenggajian: string;
  approvalHrga: string;
  approvalFat: string;
  approvalDirekturKeuangan: string;
};

export default function PKLTab({ resetKey = 'pkl' }: { resetKey?: string }) {
  const location = useLocation();
  // Dokumentasi: Deteksi halaman Approval atau Distribusi untuk set judul
  const isApprovalPage = location.pathname.includes('/approval-periode-gajian');
  const isDistribusiPage = location.pathname.includes('/distribusi-gaji');
  const basePrefix = isApprovalPage ? '/approval-periode-gajian' : '/periode-gajian';
  // Dokumentasi: Gunakan prefix detail khusus distribusi saat di halaman Distribusi
  const detailPathPrefix = isDistribusiPage ? '/distribusi-gaji/detail-pkl' : `${basePrefix}/detail-pkl`;
  const title = isApprovalPage ? 'Approval Periode Gajian' : isDistribusiPage ? 'Distribusi Slip Gaji' : 'Periode Gajian';
  const [rows] = useState<PKLRow[]>([
    { idKaryawan: '22345678', pengguna: 'Lindsey Curtis', tanggalPengajuan: '20/12/2025', jumlahHariKerja: '20', uangSaku: '2.000.000', kategori: 'PKL', perusahaan: 'Dasaria', statusPenggajian: 'Draft', approvalHrga: 'Selesai', approvalFat: 'Pending', approvalDirekturKeuangan: 'Selesai' },
  ]);
  const baseColumns: DataTableColumn<PKLRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'idKaryawan', label: 'ID Karyawan' },
    { id: 'pengguna', label: 'Pengguna' },
    { id: 'tanggalPengajuan', label: 'Tanggal Pengajuan' },
    { id: 'jumlahHariKerja', label: 'Jumlah Hari Kerja' },
    { id: 'uangSaku', label: 'Uang Saku', align: 'right' },
    { id: 'kategori', label: 'Kategori' },
    { id: 'perusahaan', label: 'Perusahaan' },
    { id: 'statusPenggajian', label: 'Status Penggajian', format: (v) => <span className=" rounded-full bg-blue-100 p-[10px] flex justify-center text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">{String(v)}</span> },
    { id: 'approvalHrga', label: 'Approval Direktur HRGA', format: (v) => <span className=" rounded-full bg-green-100 p-[10px] flex justify-center text-xs text-green-700 dark:bg-green-900/30 dark:text-green-200">{String(v)}</span> },
    { id: 'approvalFat', label: 'Approval FAT', format: (v) => <span className=" rounded-full bg-yellow-100 p-[10px] flex justify-center text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">{String(v)}</span> },
    { id: 'approvalDirekturKeuangan', label: 'Approval Direktur Keuangan', format: (v) => <span className=" rounded-full bg-green-100 p-[10px] flex justify-center text-xs text-green-700 dark:bg-green-900/30 dark:text-green-200">{String(v)}</span> },
  ];
  return (
    <PenggajianTabBase
      resetKey={resetKey}
      rows={rows}
      baseColumns={baseColumns}
      detailPathPrefix={detailPathPrefix}
      title={title}
    />
  );
}

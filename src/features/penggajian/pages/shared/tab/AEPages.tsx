import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DataTableColumn } from '@/features/structure-and-organize/components/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PenggajianTabBase';

type AERow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  tanggalPengajuan: string;
  jumlahHariKerja: string;
  totalGajiBersih: string;
  uangTransportasi: string;
  potongan: string;
  tunjanganTidakTetap: string;
  kategori: string;
  perusahaan: string;
  statusPenggajian: string;
  approvalHrga: string;
  approvalFat: string;
  approvalDirekturKeuangan: string;
};

export default function AETab({ resetKey = 'ae' }: { resetKey?: string }) {
  const location = useLocation();
  // Dokumentasi: Deteksi halaman Approval atau Distribusi untuk set judul
  const isApprovalPage = location.pathname.includes('/approval-periode-gajian');
  const isDistribusiPage = location.pathname.includes('/distribusi-gaji');
  const basePrefix = isApprovalPage ? '/approval-periode-gajian' : '/periode-gajian';
  // Dokumentasi: Gunakan prefix detail khusus distribusi saat di halaman Distribusi
  const detailPathPrefix = isDistribusiPage ? '/distribusi-gaji/detail-ae' : `${basePrefix}/detail-ae`;
  const title = isApprovalPage ? 'Approval Periode Gajian' : isDistribusiPage ? 'Distribusi Slip Gaji' : 'Periode Gajian';
  const [rows] = useState<AERow[]>([
    { idKaryawan: '12345681', pengguna: 'Lindsey Curtis', tanggalPengajuan: '20/12/2025', jumlahHariKerja: '20', totalGajiBersih: '7.250.000', uangTransportasi: '500.000', potongan: '250.000', tunjanganTidakTetap: '750.000', kategori: 'Sales', perusahaan: 'Dasaria', statusPenggajian: 'Draft', approvalHrga: 'Selesai', approvalFat: 'Pending', approvalDirekturKeuangan: 'Selesai' },
  ]);
  const baseColumns: DataTableColumn<AERow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'idKaryawan', label: 'ID Karyawan' },
    { id: 'pengguna', label: 'Pengguna' },
    { id: 'tanggalPengajuan', label: 'Tanggal Pengajuan' },
    { id: 'jumlahHariKerja', label: 'Jumlah Hari Kerja' },
    { id: 'totalGajiBersih', label: 'Total Gaji Bersih', align: 'right' },
    { id: 'uangTransportasi', label: 'Uang Transportasi', align: 'right' },
    { id: 'potongan', label: 'Potongan', align: 'right' },
    { id: 'tunjanganTidakTetap', label: 'Tunjangan Tidak Tetap', align: 'right' },
    { id: 'kategori', label: 'Kategori' },
    { id: 'perusahaan', label: 'Perusahaan' },
    { id: 'statusPenggajian', label: 'Status Penggajian', format: (v) => <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">{String(v)}</span> },
    { id: 'approvalHrga', label: 'Approval Direktur HRGA', format: (v) => <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-200">{String(v)}</span> },
    { id: 'approvalFat', label: 'Approval FAT', format: (v) => <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">{String(v)}</span> },
    { id: 'approvalDirekturKeuangan', label: 'Approval Direktur Keuangan', format: (v) => <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-200">{String(v)}</span> },
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

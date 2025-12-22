import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';

type NonAERow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  tanggalPengajuan: string;
  jumlahHariKerja: string;
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
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<string>('Persetujuan oleh FAT');
  // Dokumentasi: Deteksi halaman Approval atau Distribusi untuk set judul
  const isApprovalPage = location.pathname.includes('/payroll-period-approval');
  const isDistribusiPage = location.pathname.includes('/salary-distribution');
  const basePrefix = isApprovalPage ? '/payroll-period-approval' : '/payroll-period';
  // Dokumentasi: Gunakan prefix detail khusus distribusi saat di halaman Distribusi
  const detailPathPrefix = isDistribusiPage ? '/salary-distribution/detail-non-ae' : `${basePrefix}/detail-non-ae`;
  const title = isApprovalPage ? 'Approval Periode Gajian' : isDistribusiPage ? 'Distribusi Slip Gaji' : 'Periode Gajian';

  // Dokumentasi: Fungsi untuk navigasi detail dengan approval type sebagai query parameter
  const handleDetailNavigation = (id: string) => {
    navigate(`${detailPathPrefix}/${id}?approvalType=${encodeURIComponent(approvalType)}`);
  };
  const [rows] = useState<NonAERow[]>([
    { idKaryawan: '12345678', pengguna: 'Lindsey Curtis', tanggalPengajuan: '20/12/2025', jumlahHariKerja: '20', totalGajiBersih: '7.000.000', gajiPokokUangSaku: '5.000.000', potongan: '250.000', tunjanganTetap: '1.000.000', tunjanganTidakTetap: '750.000', kategori: 'Staff', perusahaan: 'Dasaria', statusPenggajian: 'Draft', approvalHrga: 'Selesai', approvalFat: 'Pending', approvalDirekturKeuangan: 'Selesai' },
    { idKaryawan: '12345679', pengguna: 'Lindsey Curtis', tanggalPengajuan: '20/12/2025', jumlahHariKerja: '20', totalGajiBersih: '7.000.000', gajiPokokUangSaku: '5.000.000', potongan: '250.000', tunjanganTetap: '1.000.000', tunjanganTidakTetap: '750.000', kategori: 'Staff', perusahaan: 'Dasaria', statusPenggajian: 'Pending Draft', approvalHrga: 'Selesai', approvalFat: 'Selesai', approvalDirekturKeuangan: 'Pending' },
  ]);
  const baseColumns: DataTableColumn<NonAERow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'idKaryawan', label: 'NIP' },
    { id: 'pengguna', label: 'Pengguna' },
    { id: 'tanggalPengajuan', label: 'Tanggal Pengajuan' },
    { id: 'jumlahHariKerja', label: 'Jumlah Hari Kerja' },
    { id: 'totalGajiBersih', label: 'Total Gaji Bersih', align: 'right' },
    { id: 'gajiPokokUangSaku', label: 'Gaji Pokok / Uang Saku', align: 'right' },
    { id: 'potongan', label: 'Potongan', align: 'right' },
    { id: 'tunjanganTetap', label: 'Tunjangan Tetap', align: 'right' },
    { id: 'tunjanganTidakTetap', label: 'Tunjangan Tidak Tetap', align: 'right' },
    { id: 'kategori', label: 'Kategori' },
    { id: 'perusahaan', label: 'Perusahaan' },
    { id: 'statusPenggajian', label: 'Status Penggajian', format: (v) => <span className="rounded-full bg-blue-100 p-[10px] flex justify-center text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">{String(v)}</span> },
    { id: 'approvalHrga', label: 'Approval Direktur HRGA', format: (v) => <span className="rounded-full bg-green-100 p-[10px] flex justify-center text-xs text-green-700 dark:bg-green-900/30 dark:text-green-200">{String(v)}</span> },
    { id: 'approvalFat', label: 'Approval FAT', format: (v) => <span className="rounded-full bg-yellow-100 p-[10px] flex justify-center text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">{String(v)}</span> },
    { id: 'approvalDirekturKeuangan', label: 'Approval Direktur Keuangan', format: (v) => <span className="rounded-full bg-green-100 p-[10px] flex justify-center text-xs text-green-700 dark:bg-green-900/30 dark:text-green-200">{String(v)}</span> },
  ];
  return (
    <PenggajianTabBase
      resetKey={resetKey}
      rows={rows}
      baseColumns={baseColumns}
      detailPathPrefix={detailPathPrefix}
      title={title}
      onDetailNavigation={handleDetailNavigation}
      toolbarRightSlot={
       isApprovalPage && <div className="relative">
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 dropdown-toggle"
          >
            {approvalType}
            <ChevronDown size={16} />
          </Button>
          <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
            <div className="p-2 w-64">
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  setApprovalType('Persetujuan oleh FAT');
                  setIsDropdownOpen(false);
                }}
              >
                Persetujuan oleh FAT
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  setApprovalType('Persetujuan oleh Direktur HRGA');
                  setIsDropdownOpen(false);
                }}
              >
                Persetujuan oleh Direktur HRGA
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  setApprovalType('Persetujuan oleh BOD');
                  setIsDropdownOpen(false);
                }}
              >
                Persetujuan oleh BOD
              </button>
            </div>
          </Dropdown>
        </div>
      }
    />
  );
}

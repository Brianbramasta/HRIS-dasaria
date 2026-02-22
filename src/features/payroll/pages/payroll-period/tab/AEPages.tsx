import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import { formatDateToIndonesian } from '@/utils/formatDate';

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
};

export default function AETab({ resetKey = 'ae' }: { resetKey?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<string>('Persetujuan oleh FAT');
  // Dokumentasi: Deteksi halaman Approval atau Distribusi untuk set judul
  const isApprovalPage = location.pathname.includes('/payroll-period-approval');
  const isDistribusiPage = location.pathname.includes('/salary-distribution');
  const basePrefix = isApprovalPage ? '/payroll-period-approval' : '/payroll-period';
  // Dokumentasi: Gunakan prefix detail khusus distribusi saat di halaman Distribusi
  const detailPathPrefix = isDistribusiPage ? '/salary-distribution/detail-ae' : `${basePrefix}/detail-ae`;
  const title = isApprovalPage ? 'Approval Periode Gajian' : isDistribusiPage ? 'Distribusi Slip Gaji' : 'Periode Gajian';

  // Dokumentasi: Fungsi untuk navigasi detail dengan approval type sebagai query parameter
  const handleDetailNavigation = (id: string) => {
    navigate(`${detailPathPrefix}/${id}?approvalType=${encodeURIComponent(approvalType)}`);
  };
  const [rows] = useState<AERow[]>([
    {
      idKaryawan: '12345681',
      pengguna: 'Lindsey Curtis',
      tanggalPengajuan: '2025-12-20',
      jumlahHariKerja: '20',
      totalGajiBersih: '7.250.000',
      uangTransportasi: '500.000',
      potongan: '250.000',
      tunjanganTidakTetap: '750.000',
      kategori: 'Sales',
      perusahaan: 'Dasaria',
      statusPenggajian: 'Menunggu Maker',
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});

  const filteredRows = useMemo(() => {
    let result = [...rows];

    Object.entries(columnFilters).forEach(([columnId, values]) => {
      if (!values || values.length === 0) return;
      result = result.filter((row) => values.includes(String((row as any)[columnId] ?? '')));
    });

    Object.entries(dateRangeFilters).forEach(([columnId, { startDate, endDate }]) => {
      if (!startDate) return;
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : null;

      result = result.filter((row) => {
        const value = (row as any)[columnId] as string | undefined;
        if (!value) return false;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return false;
        if (date < start) return false;
        if (end && date > end) return false;
        return true;
      });
    });

    return result;
  }, [rows, columnFilters, dateRangeFilters]);
  const baseColumns: DataTableColumn<AERow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'idKaryawan', label: 'NIP' },
    { id: 'pengguna', label: 'Pengguna' },
    {
      id: 'tanggalPengajuan',
      label: 'Tanggal Pengajuan',
      dateRangeFilter: true,
      format: (v) => formatDateToIndonesian(String(v)),
    },
    // { id: 'jumlahHariKerja', label: 'Jumlah Hari Kerja' },
    { id: 'totalGajiBersih', label: 'Total Gaji Bersih', align: 'right' },
    { id: 'uangTransportasi', label: 'Uang Transportasi', align: 'right' },
    { id: 'potongan', label: 'Potongan', align: 'right' },
    { id: 'tunjanganTidakTetap', label: 'Tunjangan Tidak Tetap', align: 'right' },
    { id: 'kategori', label: 'Kategori' },
    { id: 'perusahaan', label: 'Perusahaan' },
    {
      id: 'statusPenggajian',
      label: 'Status Penggajian',
      filterOptions: [
        { label: 'Menunggu Maker', value: 'Menunggu Maker' },
        { label: 'Menunggu Checker', value: 'Menunggu Checker' },
        { label: 'Menunggu Approver', value: 'Menunggu Approver' },
        { label: 'Distribusi', value: 'Distribusi' },
        { label: 'Selesai', value: 'Selesai' },
      ],
      format: (v) => {
        const value = String(v ?? '');
        const lowered = value.toLowerCase();

        const badgeClass = lowered.includes('menunggu')
          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200'
          : lowered.includes('selesai')
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
          : lowered.includes('distribusi')
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200';

        return (
          <span className={`rounded-full p-[10px] flex justify-center text-center text-xs status-styling ${badgeClass}`}>
            {value}
          </span>
        );
      },
    },
  ];
  return (
    <PenggajianTabBase
      resetKey={resetKey}
      rows={filteredRows}
      baseColumns={baseColumns}
      detailPathPrefix={detailPathPrefix}
      title={title}
      onDetailNavigation={handleDetailNavigation}
      onColumnFilterChange={(columnId, values) => {
        setColumnFilters((prev) => ({
          ...prev,
          [columnId]: values,
        }));
      }}
      columnFilters={columnFilters}
      onDateRangeFilterChange={(columnId, startDate, endDate) => {
        setDateRangeFilters((prev) => {
          if (!startDate) {
            const next = { ...prev };
            delete next[columnId];
            return next;
          }
          return {
            ...prev,
            [columnId]: { startDate, endDate },
          };
        });
      }}
      dateRangeFilters={dateRangeFilters}
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

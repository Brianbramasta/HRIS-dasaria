import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import { formatDateToIndonesian } from '@/utils/formatDate';

type THRRow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  tanggalPengajuan: string;
  totalTHR: string;
  lamaKerja: string;
  perusahaan: string;
  jabatan: string;
  statusPersetujuan: string;
};

export default function THRTab({ }: { resetKey?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<string>('Persetujuan oleh Direktur HRGA');
  // Dokumentasi: Deteksi halaman Approval atau Distribusi untuk set judul
  const isApprovalPage = location.pathname.includes('/payroll-period-approval');
  const isDistribusiPage = location.pathname.includes('/salary-distribution');
  const basePrefix = isApprovalPage ? '/payroll-period-approval' : '/payroll-period';
  // Dokumentasi: Gunakan prefix detail khusus distribusi saat di halaman Distribusi
  const detailPathPrefix = isDistribusiPage ? '/salary-distribution/detail-thr' : `${basePrefix}/detail-thr`;
  const title = isApprovalPage ? 'Approval Periode Gajian' : isDistribusiPage ? 'Distribusi Slip Gaji' : 'Periode Gajian';

  // Dokumentasi: Fungsi untuk navigasi detail dengan approval type sebagai query parameter
  const handleDetailNavigation = (id: string) => {
    navigate(`${detailPathPrefix}/${id}?approvalType=${encodeURIComponent(approvalType)}`);
  };
  const [rows] = useState<THRRow[]>([
    { idKaryawan: '32345678', pengguna: 'Lindsey Curtis', tanggalPengajuan: '20/12/2025', totalTHR: '5.000.000', lamaKerja: '2 tahun', jabatan: 'Direktur', perusahaan: 'Dasaria', statusPersetujuan: 'Menunggu diproses' },
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

  const baseColumns: DataTableColumn<THRRow>[] = [
    { id: 'idKaryawan', label: 'NIP' },
    { id: 'pengguna', label: 'Pengguna' },
    {
      id: 'tanggalPengajuan',
      label: 'Tanggal Pengajuan',
      dateRangeFilter: true,
      format: (v) => formatDateToIndonesian(String(v)),
    },
    { id: 'totalTHR', label: 'Total THR', align: 'right' },
    { id: 'lamaKerja', label: 'Lama Kerja' },
    { id: 'jabatan', label: 'Jabatan' },
    { id: 'perusahaan', label: 'Perusahaan' },
    {
      id: 'statusPersetujuan',
      label: 'Status Persetujuan',
      filterOptions: [
        { label: 'Menunggu Maker', value: 'Menunggu Maker' },
        { label: 'Menunggu Checker', value: 'Menunggu Checker' },
        { label: 'Menunggu Approver', value: 'Menunggu Approver' },
        { label: 'Distribusi', value: 'Distribusi' },
        { label: 'Selesai', value: 'Selesai' },
      ],
      format: (v) => (
        <span className="rounded-full bg-orange-100 p-[10px] flex justify-center text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-200">
          {String(v)}
        </span>
      ),
    },
  ];
  return (
    <PenggajianTabBase
      resetKey="payroll-approval-thr"
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
                  setApprovalType('Persetujuan oleh Direktur HRGA');
                  setIsDropdownOpen(false);
                }}
              >
                Persetujuan oleh Direktur HRGA
              </button>
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

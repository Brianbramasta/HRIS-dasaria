import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import { useApiPayrollPeriodDirectorHr } from '@/features/payroll/hooks/api/useApiPayrollPeriodDirectorHr';

const toDirectorHrSortKey = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employeeId',
    pengguna: 'fullName',
    tanggalPengajuan: 'periode',
    totalGajiBersih: 'netSalary',
    statusPersetujuan: 'hrDirectorApprovalStatus',
  };
  return map[columnId] || columnId;
};

const toDirectorHrFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employee_id',
    pengguna: 'full_name',
    tanggalPengajuan: 'periode',
    totalGajiBersih: 'net_salary',
    statusPersetujuan: 'hr_director_approval_status',
  };
  return map[columnId] || columnId;
};

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
  statusPersetujuan: string;
  payrollId?: string;
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

  const isDirectorHrga = approvalType === 'Persetujuan oleh Direktur HRGA';

  const {
    payrollPeriods: directorRows,
    loading: directorLoading,
    total: directorTotal,
    page: directorPage,
    pageSize: directorPageSize,
    columnFilters: directorColumnFilters,
    dateRangeFilters: directorDateRangeFilters,
    fetchPayrollPeriods: fetchDirectorRows,
    setPage: setDirectorPage,
    setPageSize: setDirectorPageSize,
    setSearch: setDirectorSearch,
    setSort: setDirectorSort,
    setColumnFilters: setDirectorColumnFilters,
    setDateRangeFilters: setDirectorDateRangeFilters,
  } = useApiPayrollPeriodDirectorHr();

  useEffect(() => {
    if (!isApprovalPage) return;
    if (!isDirectorHrga) return;
    fetchDirectorRows({ page: 1, pageSize: directorPageSize });
  }, [isApprovalPage, isDirectorHrga, directorPageSize, fetchDirectorRows]);

  const fallbackRows: NonAERow[] = useMemo(
    () => [
      {
        idKaryawan: '12345678',
        pengguna: 'Lindsey Curtis',
        tanggalPengajuan: '20/12/2025',
        jumlahHariKerja: '20',
        totalGajiBersih: '7.000.000',
        gajiPokokUangSaku: '5.000.000',
        potongan: '250.000',
        tunjanganTetap: '1.000.000',
        tunjanganTidakTetap: '750.000',
        kategori: 'Staff',
        perusahaan: 'Dasaria',
        statusPersetujuan: 'Menunggu diproses',
      },
      {
        idKaryawan: '12345679',
        pengguna: 'Lindsey Curtis',
        tanggalPengajuan: '20/12/2025',
        jumlahHariKerja: '20',
        totalGajiBersih: '7.000.000',
        gajiPokokUangSaku: '5.000.000',
        potongan: '250.000',
        tunjanganTetap: '1.000.000',
        tunjanganTidakTetap: '750.000',
        kategori: 'Staff',
        perusahaan: 'Dasaria',
        statusPersetujuan: 'Selesai',
      },
    ],
    []
  );

  const rows: NonAERow[] = useMemo(() => {
    if (!isDirectorHrga) return fallbackRows;
    return (directorRows || []).map((r, idx) => ({
      no: idx + 1 + (directorPage - 1) * directorPageSize,
      idKaryawan: r.employeeId,
      pengguna: r.fullName,
      tanggalPengajuan: r.periode,
      jumlahHariKerja: String(r.workingDays),
      totalGajiBersih: r.netSalary,
      gajiPokokUangSaku: String(r.basicSalary),
      potongan: String(r.deductionTotal),
      tunjanganTetap: String(r.allowanceTotal),
      tunjanganTidakTetap: String(r.nonFixedAllowanceTotal),
      kategori: r.employeeCategoryName,
      perusahaan: r.companyName,
      statusPersetujuan: r.hrDirectorApprovalStatus,
      payrollId: r.payrollId,
    }));
  }, [isDirectorHrga, directorRows, directorPage, directorPageSize, fallbackRows]);

  const baseColumns: DataTableColumn<NonAERow>[] = [
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
    {
      id: 'statusPersetujuan',
      label: 'Status Persetujuan',
      format: (v) => (
        <span className="rounded-full bg-orange-100 p-[10px] flex justify-center text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-200">
          {String(v)}
        </span>
      ),
    },
  ];
  return (
    <PenggajianTabBase
      resetKey={resetKey}
      rows={rows}
      baseColumns={baseColumns}
      detailPathPrefix={detailPathPrefix}
      title={title}
      onDetailNavigation={handleDetailNavigation}
      loading={isDirectorHrga ? directorLoading : false}
      useExternalPagination={isDirectorHrga}
      externalPage={isDirectorHrga ? directorPage : undefined}
      externalTotal={isDirectorHrga ? directorTotal : undefined}
      pageSize={isDirectorHrga ? directorPageSize : undefined}
      onSearchChange={isDirectorHrga ? (s) => { setDirectorSearch(s); fetchDirectorRows({ page: 1, search: s }); } : undefined}
      onSortChange={isDirectorHrga ? (columnId, order) => {
        const sortKey = toDirectorHrSortKey(columnId);
        setDirectorSort(sortKey, order);
        fetchDirectorRows({ page: 1, sortBy: sortKey, sortOrder: order as any });
      } : undefined}
      onPageChangeExternal={isDirectorHrga ? (p) => { setDirectorPage(p); fetchDirectorRows({ page: p }); } : undefined}
      onRowsPerPageChangeExternal={isDirectorHrga ? (rpp) => { setDirectorPageSize(rpp); setDirectorPage(1); fetchDirectorRows({ page: 1, pageSize: rpp }); } : undefined}
      onColumnFilterChange={
        isDirectorHrga
          ? (columnId, values) => {
              const apiColumnId = toDirectorHrFilterColumnId(columnId);
              const next = { ...(directorColumnFilters || {}) };
              next[apiColumnId] = values;
              setDirectorColumnFilters(next);
              fetchDirectorRows({ page: 1, columnFilters: next } as any);
            }
          : undefined
      }
      columnFilters={isDirectorHrga ? directorColumnFilters : undefined}
      onDateRangeFilterChange={
        isDirectorHrga
          ? (columnId, startDate, endDate) => {
              const apiColumnId = toDirectorHrFilterColumnId(columnId);
              const next = { ...(directorDateRangeFilters || {}) };
              next[apiColumnId] = { startDate, endDate };
              setDirectorDateRangeFilters(next);
              fetchDirectorRows({ page: 1, dateRangeFilters: next } as any);
            }
          : undefined
      }
      dateRangeFilters={isDirectorHrga ? directorDateRangeFilters : undefined}
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

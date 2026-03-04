import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { useApiPayrollPeriodBod } from '../../../hooks/api/useApiPayrollPeriodBod';
import { useApiPayrollPeriodDirectorHr } from '../../../hooks/api/useApiPayrollPeriodDirectorHr';
import { useApiPayrollPeriodFat } from '../../../hooks/api/useApiPayrollPeriodFat';

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
  
  // API hooks based on approval type
  const bodApi = useApiPayrollPeriodBod();
  const directorHrApi = useApiPayrollPeriodDirectorHr();
  const fatApi = useApiPayrollPeriodFat();
  
  // Select appropriate API based on approval type
  const currentApi = approvalType.includes('BOD') ? bodApi : 
                     approvalType.includes('Direktur HRGA') ? directorHrApi : fatApi;
  
  const {
    payrollPeriods,
    loading,
    total,
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    columnFilters,
    dateRangeFilters,
    fetchPayrollPeriods,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    setColumnFilters,
    setDateRangeFilters,
    setType
  } = currentApi;

  // Set type to 'Thr' when component mounts or approval type changes
  useEffect(() => {
    setType('Thr');
  }, [setType, approvalType]);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    fetchPayrollPeriods({
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      type: 'Thr'
    });
  }, [fetchPayrollPeriods, page, pageSize, search, sortBy, sortOrder]);
  
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
  
  const filteredRows = useMemo(() => {
    console.log('payrollPeriods data:', payrollPeriods);
    return payrollPeriods.map((item: any) => ({
      idKaryawan: item.payroll_id || item.employee_id || '',
      pengguna: item.full_name || '',
      tanggalPengajuan: item.periode || '24 Februari 2026', // Use default date if periode is missing
      totalTHR: formatCurrency(item.basic_salary || 0),
      lamaKerja: '2 tahun', // Will be populated from API response
      perusahaan: item.company_name || '',
      jabatan: item.job_title_name || 'Direktur',
      statusPersetujuan: item.payroll_status_name || 'Menunggu diproses',
    }));
  }, [payrollPeriods]);

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
      loading={loading}
      useExternalPagination={true}
      externalPage={page}
      externalTotal={total}
      pageSize={pageSize}
      onPageChangeExternal={setPage}
      onRowsPerPageChangeExternal={setPageSize}
      onSearchChange={setSearch}
      onSortChange={setSort}
      onColumnFilterChange={(columnId, values) => {
        const newFilters = { ...columnFilters };
        newFilters[columnId] = values;
        setColumnFilters(newFilters);
      }}
      columnFilters={columnFilters}
      onDateRangeFilterChange={(columnId, startDate, endDate) => {
        const newFilters = { ...dateRangeFilters };
        if (!startDate) {
          delete newFilters[columnId];
        } else {
          newFilters[columnId] = { startDate, endDate };
        }
        setDateRangeFilters(newFilters);
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

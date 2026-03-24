import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import { useApiPayrollPeriod } from '../../api/useApiPayrollPeriod';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateToIndonesian } from '@/utils/formatDate';

const toPayrollPeriodFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    tanggalPengajuan: 'periode',
    statusTHR: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

export type THRRow = {
  payrollId: string;
  idKaryawan: string;
  pengguna: string;
  tanggalPengajuan: string;
  totalTHR: string;
  lamaKerja: string;
  jabatan: string;
  perusahaan: string;
  statusTHR: string;
  alasanDitolak: string;
};

// Mapping helper from API response to THRRow
const mapPayrollPeriodToTHRRow = (item: any): THRRow => ({
  payrollId: item.payrollId,
  idKaryawan: item.employeeId,
  pengguna: item.fullName,
  tanggalPengajuan: item.periode || '-',
  totalTHR: formatCurrency(item.basicSalary || 0),
  lamaKerja: '-', // No work duration field in API response
  jabatan: item.jobTitleName || '-',
  perusahaan: item.companyName || '-',
  statusTHR: item.payrollStatusName || '-',
  alasanDitolak: '-', // No rejection reason field in API response
});

export interface UseTHRPagesOptions {
  resetKey?: string;
}

export function useTHRPages(_options: UseTHRPagesOptions = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<string>('Persetujuan oleh FAT');

  
  // Dokumentasi: Deteksi halaman Approval atau Distribusi untuk set judul
  const isApprovalPage = location.pathname.includes('/payroll-period-approval');
  const isDistribusiPage = location.pathname.includes('/salary-distribution');
  const basePrefix = isApprovalPage ? '/payroll-period-approval' : '/payroll-period';
  // Dokumentasi: Gunakan prefix detail khusus distribusi saat di halaman Distribusi
  const detailPathPrefix = isDistribusiPage ? '/salary-distribution/detail-thr' : `${basePrefix}/detail-thr`;
  const title = isApprovalPage ? 'Approval Periode Gajian' : isDistribusiPage ? 'Distribusi Slip Gaji' : 'Periode Gajian';
  
  // Hook untuk fetch data payroll period
  const {
    payrollPeriods,
    fetchPayrollPeriods,
    approvalHr,
    loading,
    total,
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    columnFilters,
    dateRangeFilters,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    setColumnFilters,
    setDateRangeFilters,
    setType,
  } = useApiPayrollPeriod();

  // Set type to 'Thr' when component mounts
  useEffect(() => {
    setType('Thr');
  }, [setType]);


  // Dokumentasi: Fungsi untuk navigasi detail dengan approval type sebagai query parameter
  const handleDetailNavigation = (payrollId: string) => {
    navigate(`${detailPathPrefix}/${payrollId}?approvalType=${encodeURIComponent(approvalType)}`);
  };

  // Dokumentasi: Fetch data saat component mount
  useEffect(() => {
    setPage(1);
    setPageSize(10);
    setSearch('');
    setSort('', 'asc');
    setColumnFilters({});
    setDateRangeFilters({});
  }, [setPage, setPageSize, setSearch, setSort, setColumnFilters, setDateRangeFilters]);

  useEffect(() => {
    fetchPayrollPeriods({ page, pageSize, search, sortBy, sortOrder, type: 'Thr' });
  }, [page, pageSize, search, sortBy, sortOrder, columnFilters, dateRangeFilters, fetchPayrollPeriods]);

  // Map API response to THRRow
  const rows: THRRow[] = payrollPeriods.map((item) => mapPayrollPeriodToTHRRow(item));

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
    { id: 'lamaKerja', label: 'Lama Kerja', align: 'right' },
    { id: 'jabatan', label: 'Jabatan' },
    { id: 'perusahaan', label: 'Perusahaan' },
    {
      id: 'statusTHR',
      label: 'Status THR',
      filterOptions: [
        { label: 'Menunggu Maker', value: 'Menunggu Maker' },
        { label: 'Menunggu Checker', value: 'Menunggu Checker' },
        { label: 'Menunggu Approver', value: 'Menunggu Approver' },
        { label: 'Distribusi', value: 'Distribusi' },
        { label: 'Selesai', value: 'Selesai' },
      ],
    },
    { id: 'alasanDitolak', label: 'Alasan Ditolak' },
  ];

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

  const handleSortChange = (columnId: string, order: 'asc' | 'desc') => {
    setSort(columnId, order);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setPageSize(newRowsPerPage);
  };

  const handleColumnFilterChange = (columnId: string, values: string[]) => {
    const apiColumnId = toPayrollPeriodFilterColumnId(columnId);
    setColumnFilters({
      ...columnFilters,
      [apiColumnId]: values,
    });
  };

  const handleDateRangeFilterChange = (columnId: string, startDate: string, endDate: string | null) => {
    const apiColumnId = toPayrollPeriodFilterColumnId(columnId);
    setDateRangeFilters({
      ...dateRangeFilters,
      [apiColumnId]: { startDate, endDate },
    });
  };

  const handleFinalize = async (selectedRows: THRRow[]) => {
    const isSelectAll = (selectedRows?.length ?? 0) > 0 && (selectedRows?.length ?? 0) === rows.length;
    if (isSelectAll) {
      const ok = await approvalHr({ payrollIds: [], all: true, type: 'Thr' });
      if (ok) {
        await fetchPayrollPeriods({ page, pageSize });
      }
      return ok;
    }

    const payrollIds = Array.from(
      new Set(
        (selectedRows || [])
          .map((r) => r.payrollId)
          .filter((id): id is string => Boolean(id))
      )
    );

    if (!payrollIds.length) return false;

    const ok = await approvalHr({ payrollIds, type: 'Thr' });
    if (ok) {
      await fetchPayrollPeriods({ page, pageSize });
    }
    return ok;
  };

  const handleApprovalTypeChange = (type: string) => {
    setApprovalType(type);
    setIsDropdownOpen(false);
  };

  return {
    // Data and state
    rows,
    baseColumns,
    loading,
    pageSize,
    page,
    total,
    columnFilters,
    dateRangeFilters,
    
    // Navigation and UI state
    title,
    detailPathPrefix,
    isApprovalPage,
    isDropdownOpen,
    approvalType,
    
    // Handlers
    handleDetailNavigation,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleFinalize,
    
    // Dropdown handlers
    setIsDropdownOpen,
    handleApprovalTypeChange,
    
    // Selection logic - for THR, allow selection based on status
    isRowSelectable: (row: THRRow) => {
      const selectableStatuses = ['Menunggu Maker', 'Menunggu Checker', 'Menunggu Approver'];
      return selectableStatuses.includes(row.statusTHR);
    },
    canEditDelete: (row: THRRow) => {
      const editableStatuses = ['Menunggu Maker'];
      return editableStatuses.includes(row.statusTHR);
    },
  };
}

export default useTHRPages;

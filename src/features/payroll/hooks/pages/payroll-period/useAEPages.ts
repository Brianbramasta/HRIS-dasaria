import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import { useApiPayrollPeriod } from '../../api/useApiPayrollPeriod';
import { usePayrollApprovalStore } from '../../../store/usePayrollApprovalStore';
import { PayrollPeriodListItem } from '../../../types/dto/PayrollPeriodType';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateToIndonesian } from '@/utils/formatDate';

const toPayrollPeriodFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    tanggalPengajuan: 'periode',
    statusPenggajian: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

export type AERow = {
  no?: number;
  payrollId: string;
  idKaryawan: string;
  pengguna: string;
  tanggalPengajuan: string;
  jumlahHariKerja: string;
  totalGajiBersih: string;
  fee: string;
  potongan: string;
  tunjanganTidakTetap: string;
  kategori: string;
  perusahaan: string;
  statusPenggajian: string;
};

// Mapping helper from PayrollPeriodListItem to AERow
const mapPayrollPeriodToAERow = (item: PayrollPeriodListItem, index: number): AERow => ({
  no: index + 1,
  payrollId: item.payrollId,
  idKaryawan: item.employeeId,
  pengguna: item.fullName,
  tanggalPengajuan: item.periode,
  jumlahHariKerja: item.workingDays ? String(item.workingDays) : '-',
  totalGajiBersih: item.netSalary,
  fee: item.netSalary,
  potongan: String(item.deductionTotal),
  tunjanganTidakTetap: String(item.nonFixedAllowanceTotal),
  kategori: item.employeeCategoryName,
  perusahaan: item.companyName,
  statusPenggajian: item.payrollStatusName,
});

export interface UseAEPagesOptions {
  resetKey?: string;
}

export function useAEPages(_options: UseAEPagesOptions = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<string>('Persetujuan oleh FAT');
  const [approvalStatusFetched, setApprovalStatusFetched] = useState(false);
  
  const approvalStore = usePayrollApprovalStore();

  // Hook untuk fetch data payroll period
  const {
    payrollPeriods,
    fetchPayrollPeriods,
    approvalHr,
    fetchImportApprovalStatus,
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

  // Set type to 'Mitra' when component mounts
  useEffect(() => {
    setType('Mitra');
  }, [setType]);

  // Dokumentasi: Deteksi halaman Approval atau Distribusi untuk set judul
  const isApprovalPage = location.pathname.includes('/payroll-period-approval');
  const isDistribusiPage = location.pathname.includes('/salary-distribution');
  const basePrefix = isApprovalPage ? '/payroll-period-approval' : '/payroll-period';
  // Dokumentasi: Gunakan prefix detail khusus distribusi saat di halaman Distribusi
  const detailPathPrefix = isDistribusiPage ? '/salary-distribution/detail-ae' : `${basePrefix}/detail-ae`;
  const title = isApprovalPage ? 'Approval Periode Gajian' : isDistribusiPage ? 'Distribusi Slip Gaji' : 'Periode Gajian';

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
    if (!approvalStatusFetched) {
      const fetchStatus = async () => {
        const status = await fetchImportApprovalStatus();
        if (status) {
          approvalStore.setApprovalStatus(status);
        }
        setApprovalStatusFetched(true);
      };
      fetchStatus();
    }
  }, [fetchImportApprovalStatus, approvalStatusFetched]);

  useEffect(() => {
    fetchPayrollPeriods({ page, pageSize, search, sortBy, sortOrder, type: 'Mitra' });
  }, [page, pageSize, search, sortBy, sortOrder, columnFilters, dateRangeFilters, fetchPayrollPeriods]);

  // Map PayrollPeriodListItem to AERow
  const rows: AERow[] = payrollPeriods.map((item, index) => mapPayrollPeriodToAERow(item, index));

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
    { id: 'jumlahHariKerja', label: 'Jumlah Hari Kerja' },
    { id: 'totalGajiBersih', label: 'Total Gaji Bersih', align: 'right', format: (v) => formatCurrency(Number(v)) },
    { id: 'fee', label: 'Fee', align: 'right', format: (v) => formatCurrency(Number(v)) },
    { id: 'potongan', label: 'Potongan', align: 'right', format: (v) => formatCurrency(Number(v)) },
    { id: 'tunjanganTidakTetap', label: 'Tunjangan Tidak Tetap', align: 'right', format: (v) => formatCurrency(Number(v)) },
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
    },
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

  const handleFinalize = async (selectedRows: AERow[]) => {
    const isSelectAll = (selectedRows?.length ?? 0) > 0 && (selectedRows?.length ?? 0) === rows.length;
    if (isSelectAll) {
      const ok = await approvalHr({ payrollIds: [], all: true });
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

    const ok = await approvalHr({ payrollIds });
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
    
    // Store
    approvalStore,
    
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
    
    // Selection logic - for mitra, allow selection based on status
    isRowSelectable: (row: AERow) => {
      const selectableStatuses = ['Menunggu Maker', 'Menunggu Checker', 'Menunggu Approver'];
      return selectableStatuses.includes(row.statusPenggajian);
    },
    canEditDelete: (row: AERow) => {
      const editableStatuses = ['Menunggu Maker', 'Menunggu Checker'];
      return editableStatuses.includes(row.statusPenggajian);
    },
  };
}

export default useAEPages;

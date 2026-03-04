import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { useApiPayrollPeriod } from '../../api/useApiPayrollPeriod';
import { PayrollPeriodListItem } from '../../../types/dto/PayrollPeriodType';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { usePayrollApprovalStore } from '../../../store/usePayrollApprovalStore';
import { IconFileDetail } from '@/icons/components/icons';
import React from 'react';

const toPayrollPeriodFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    tanggalPengajuan: 'periode',
    statusPenggajian: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

export type NonAERow = {
  no?: number;
  payrollId: string;
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
};

// Mapping helper from PayrollPeriodListItem to NonAERow
const mapPayrollPeriodToNonAERow = (item: PayrollPeriodListItem, index: number): NonAERow => ({
  no: index + 1,
  payrollId: item.payrollId,
  idKaryawan: item.employeeId,
  pengguna: item.fullName,
  tanggalPengajuan: item.periode,
  jumlahHariKerja: String(item.workingDays),
  totalGajiBersih: item.netSalary,
  gajiPokokUangSaku: String(item.basicSalary),
  potongan: String(item.deductionTotal),
  tunjanganTetap: String(item.allowanceTotal),
  tunjanganTidakTetap: String(item.nonFixedAllowanceTotal),
  kategori: item.employeeCategoryName,
  perusahaan: item.companyName,
  statusPenggajian: item.payrollStatusName,
});

export interface UseNonAEPagesOptions {
  resetKey?: string;
}

export function useNonAEPages(_options: UseNonAEPagesOptions = {}) {
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

  // Dokumentasi: Deteksi halaman Approval atau Distribusi untuk set judul
  const isApprovalPage = location.pathname.includes('/payroll-period-approval');
  const isDistribusiPage = location.pathname.includes('/salary-distribution');
  const basePrefix = isApprovalPage ? '/payroll-period-approval' : '/payroll-period';
  // Dokumentasi: Gunakan prefix detail khusus distribusi saat di halaman Distribusi
  const detailPathPrefix = isDistribusiPage ? '/salary-distribution/detail-non-ae' : `${basePrefix}/detail-non-ae`;
  const title = isApprovalPage ? 'Approval Periode Gajian' : isDistribusiPage ? 'Distribusi Slip Gaji' : 'Periode Gajian';

  // Dokumentasi: Fungsi untuk navigasi detail dengan approval type sebagai query parameter
  const handleDetailNavigation = (payrollId: string) => {
    navigate(`${detailPathPrefix}/${payrollId}?approvalType=${encodeURIComponent(approvalType)}`);
  };

  // Set type to 'staff' when component mounts
  useEffect(() => {
    setType('Staff');
    setPage(1);
    setPageSize(10);
    setSearch('');
    setSort('', 'asc');
    setColumnFilters({});
    setDateRangeFilters({});
  }, [setType, setPage, setPageSize, setSearch, setSort, setColumnFilters, setDateRangeFilters]);

  useEffect(() => {
    fetchPayrollPeriods({ page, pageSize, search, sortBy, sortOrder, type: 'Staff' });
  }, [page, pageSize, search, sortBy, sortOrder, columnFilters, dateRangeFilters, fetchPayrollPeriods]);

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

  // Map PayrollPeriodListItem to NonAERow
  const rows: NonAERow[] = payrollPeriods.map((item, index) => mapPayrollPeriodToNonAERow(item, index));

  const baseColumns: DataTableColumn<NonAERow>[] = [
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
    { id: 'gajiPokokUangSaku', label: 'Gaji Pokok / Uang Saku', align: 'right', format: (v) => formatCurrency(Number(v)) },
    { id: 'potongan', label: 'Potongan', align: 'right', format: (v) => formatCurrency(Number(v)) },
    { id: 'tunjanganTetap', label: 'Tunjangan Tetap', align: 'right', format: (v) => formatCurrency(Number(v)) },
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

  const handleFinalize = async (selectedRows: NonAERow[]) => {
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

  const actions: DataTableAction<NonAERow>[] = useMemo(
    () => [
      {
        icon: React.createElement(IconFileDetail),
        onClick: (row) => {
          navigate(`${detailPathPrefix}/${row.payrollId}?approvalType=${encodeURIComponent(approvalType)}`);
        },
        variant: 'outline',
        color: 'info',
      },
    ],
    [navigate, detailPathPrefix, approvalType]
  );

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
    
    // Actions
    customActions: actions,
    
    // Selection logic
    isRowSelectable: (row: NonAERow) => String(row.statusPenggajian ?? '').toLowerCase().trim() === 'menunggu maker',
    canEditDelete: (row: NonAERow) => String(row.statusPenggajian ?? '').toLowerCase().trim() === 'menunggu maker',
  };
}

export default useNonAEPages;

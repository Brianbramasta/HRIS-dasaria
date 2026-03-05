import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import { useApiPayrollPeriodDirectorHrTHR } from '../../api/useApiPayrollPeriodDirectorHrTHR';
import { useApiPayrollPeriodFatTHR } from '../../api/useApiPayrollPeriodFatTHR';
import { useApiPayrollPeriodBodTHR } from '../../api/useApiPayrollPeriodBodTHR';
import { formatCurrencyValue } from '@/utils/formatCurrency';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { usePayrollApprovalStore } from '../../../store/usePayrollApprovalStore';
import { useApiPayrollPeriod } from '../../api/useApiPayrollPeriod';

const toDirectorHrSortKey = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employeeId',
    pengguna: 'fullName',
    tanggalPengajuan: 'periode',
    totalTHR: 'basicSalary',
    statusPersetujuan: 'payrollStatusName',
  };
  return map[columnId] || columnId;
};

const toDirectorHrFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employee_id',
    pengguna: 'full_name',
    tanggalPengajuan: 'periode',
    totalTHR: 'basic_salary',
    statusPersetujuan: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

const toFatSortKey = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employeeId',
    pengguna: 'fullName',
    tanggalPengajuan: 'periode',
    totalTHR: 'basicSalary',
    statusPersetujuan: 'payrollStatusName',
  };
  return map[columnId] || columnId;
};

const toFatFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employee_id',
    pengguna: 'full_name',
    tanggalPengajuan: 'periode',
    totalTHR: 'basic_salary',
    statusPersetujuan: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

const toBodSortKey = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employeeId',
    pengguna: 'fullName',
    tanggalPengajuan: 'periode',
    totalTHR: 'basicSalary',
    statusPersetujuan: 'payrollStatusName',
  };
  return map[columnId] || columnId;
};

const toBodFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employee_id',
    pengguna: 'full_name',
    tanggalPengajuan: 'periode',
    totalTHR: 'basic_salary',
    statusPersetujuan: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

const toNumber = (value: any): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const cleaned = String(value).replace(/[^0-9-]/g, '');
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

export type THRRow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  tanggalPengajuan: string;
  totalTHR: string;
  lamaKerja: string;
  perusahaan: string;
  jabatan: string;
  statusPersetujuan: string;
  payrollId?: string;
};

export interface UseTHRPagesOptions {
  resetKey?: string;
}

export function useTHRPages(_options: UseTHRPagesOptions = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<string>('Persetujuan oleh Direktur HRGA');
  const [approvalStatusFetched, setApprovalStatusFetched] = useState(false);
  
  const approvalStore = usePayrollApprovalStore();
  const { fetchImportApprovalStatus } = useApiPayrollPeriod();
  
  // Ambil approvalType dari URL parameter saat component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlApprovalType = searchParams.get("approvalType");
    if (urlApprovalType) {
      setApprovalType(urlApprovalType);
    }
  }, [location.search]);

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

  const isPendingForApprovalType = (status: string): boolean => {
    const normalize = (s: string) => s.trim().toLowerCase();

    const pendingMap: Record<string, string> = {
      'Persetujuan oleh Direktur HRGA': 'menunggu diproses direktur hrga',
      'Persetujuan oleh FAT': 'menunggu diproses fat',
      'Persetujuan oleh BOD': 'menunggu diproses bod',
    };

    const expectedPending = pendingMap[approvalType];
    if (!expectedPending) return true;

    const value = normalize(status);
    return value === expectedPending;
  };

  const isDirectorHrga = approvalType === 'Persetujuan oleh Direktur HRGA';
  const isFat = approvalType === 'Persetujuan oleh FAT';
  const isBod = approvalType === 'Persetujuan oleh BOD';

  const {
    payrollPeriods: directorRows,
    loading: directorLoading,
    total: directorTotal,
    page: directorPage,
    pageSize: directorPageSize,
    columnFilters: directorColumnFilters,
    dateRangeFilters: directorDateRangeFilters,
    fetchPayrollPeriods: fetchDirectorRows,
    approvalDirectorHr,
    setPage: setDirectorPage,
    setPageSize: setDirectorPageSize,
    setSearch: setDirectorSearch,
    setSort: setDirectorSort,
    setColumnFilters: setDirectorColumnFilters,
    setDateRangeFilters: setDirectorDateRangeFilters,
    setType: setDirectorType,
  } = useApiPayrollPeriodDirectorHrTHR();

  const {
    payrollPeriods: fatRows,
    loading: fatLoading,
    total: fatTotal,
    page: fatPage,
    pageSize: fatPageSize,
    columnFilters: fatColumnFilters,
    dateRangeFilters: fatDateRangeFilters,
    fetchPayrollPeriods: fetchFatRows,
    approvalFat,
    setPage: setFatPage,
    setPageSize: setFatPageSize,
    setSearch: setFatSearch,
    setSort: setFatSort,
    setColumnFilters: setFatColumnFilters,
    setDateRangeFilters: setFatDateRangeFilters,
    setType: setFatType,
  } = useApiPayrollPeriodFatTHR();

  const {
    payrollPeriods: bodRows,
    loading: bodLoading,
    total: bodTotal,
    page: bodPage,
    pageSize: bodPageSize,
    columnFilters: bodColumnFilters,
    dateRangeFilters: bodDateRangeFilters,
    fetchPayrollPeriods: fetchBodRows,
    approvalBod,
    setPage: setBodPage,
    setPageSize: setBodPageSize,
    setSearch: setBodSearch,
    setSort: setBodSort,
    setColumnFilters: setBodColumnFilters,
    setDateRangeFilters: setBodDateRangeFilters,
    setType: setBodType,
  } = useApiPayrollPeriodBodTHR();

  useEffect(() => {
    if (!isApprovalPage) return;
    
    if (isDirectorHrga) {
      setDirectorType('Thr');
      fetchDirectorRows({ page: 1, pageSize: directorPageSize, type: 'Thr' });
    } else if (isFat) {
      setFatType('Thr');
      fetchFatRows({ page: 1, pageSize: fatPageSize, type: 'Thr' });
    } else if (isBod) {
      setBodType('Thr');
      fetchBodRows({ page: 1, pageSize: bodPageSize, type: 'Thr' });
    }
  }, [isApprovalPage, isDirectorHrga, isFat, isBod, directorPageSize, fatPageSize, bodPageSize, fetchDirectorRows, fetchFatRows, fetchBodRows, setDirectorType, setFatType, setBodType]);

  // Fetch approval status for the store
  // useEffect(() => {
  //   if (!approvalStatusFetched) {
  //     const fetchStatus = async () => {
  //       const status = await fetchImportApprovalStatus();
  //       if (status) {
  //         approvalStore.setApprovalStatus(status);
  //       }
  //       setApprovalStatusFetched(true);
  //     };
  //     fetchStatus();
  //   }
  // }, [fetchImportApprovalStatus, approvalStatusFetched]);

  const rows: THRRow[] = useMemo(() => {
    if (isDirectorHrga) {
      return (directorRows || []).map((r, idx) => ({
        no: idx + 1 + (directorPage - 1) * directorPageSize,
        idKaryawan: r.employeeId,
        pengguna: r.fullName,
        tanggalPengajuan: r.periode,
        totalTHR: formatCurrencyValue(toNumber(r.basicSalary)),
        lamaKerja: '2 tahun', // Will be populated from API response
        perusahaan: r.companyName,
        jabatan: 'Direktur',
        statusPersetujuan: r.payrollStatusName,
        payrollId: r.payrollId,
      }));
    }

    if (isFat) {
      return (fatRows || []).map((r, idx) => ({
        no: idx + 1 + (fatPage - 1) * fatPageSize,
        idKaryawan: r.employeeId,
        pengguna: r.fullName,
        tanggalPengajuan: r.periode,
        totalTHR: formatCurrencyValue(toNumber(r.basicSalary)),
        lamaKerja: '2 tahun', // Will be populated from API response
        perusahaan: r.companyName,
        jabatan: 'Direktur',
        statusPersetujuan: r.payrollStatusName,
        payrollId: r.payrollId,
      }));
    }

    if (isBod) {
      return (bodRows || []).map((r, idx) => ({
        no: idx + 1 + (bodPage - 1) * bodPageSize,
        idKaryawan: r.employeeId,
        pengguna: r.fullName,
        tanggalPengajuan: r.periode,
        totalTHR: formatCurrencyValue(toNumber(r.basicSalary)),
        lamaKerja: '2 tahun', // Will be populated from API response
        perusahaan: r.companyName,
        jabatan: 'Direktur',
        statusPersetujuan: r.payrollStatusName,
        payrollId: r.payrollId,
      }));
    }

    return [];
  }, [
    isDirectorHrga,
    isFat,
    isBod,
    directorRows,
    directorPage,
    directorPageSize,
    fatRows,
    fatPage,
    fatPageSize,
    bodRows,
    bodPage,
    bodPageSize,
  ]);

  const statusFilterOptions = useMemo(() => {
    const unique = Array.from(new Set((rows || []).map((r) => String(r.statusPersetujuan ?? '')).filter(Boolean)));
    return unique.map((v) => ({ label: v, value: v }));
  }, [rows]);

  const baseColumns: DataTableColumn<THRRow>[] = useMemo(
    () => [
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
        filterOptions: statusFilterOptions,
      },
    ],
    [statusFilterOptions, approvalType]
  );

  const handleApprovalTypeChange = (type: string) => {
    setApprovalType(type);
    setIsDropdownOpen(false);
  };

  // Approval handlers
  const handleApprovalWithModal = useCallback(
    async (selectedRows: THRRow[]) => {
      if (!isApprovalPage) return false;

      const isSelectAll = (selectedRows?.length ?? 0) > 0 && (selectedRows?.length ?? 0) === rows.length;
      let payrollIds: string[] = [];

      if (!isSelectAll) {
        payrollIds = Array.from(
          new Set((selectedRows || []).map((r) => r.payrollId).filter((id): id is string => Boolean(id)))
        );
        if (payrollIds.length === 0) return false;
      }

      // Return selected rows for modal handling
      return { selectedRows, isSelectAll, payrollIds };
    },
    [isApprovalPage, rows.length]
  );

  const handleApprovalConfirm = async (_selectedRows: THRRow[], isSelectAll: boolean, payrollIds: string[]) => {
    try {
      let result = false;

      if (isSelectAll) {
        if (isDirectorHrga) {
          result = await approvalDirectorHr({ payrollIds: [], all: true }, 'Thr');
          if (result) await fetchDirectorRows({ page: 1, pageSize: directorPageSize, type: 'Thr' });
        } else if (isFat) {
          result = await approvalFat({ payrollIds: [], all: true }, 'Thr');
          if (result) await fetchFatRows({ page: 1, pageSize: fatPageSize, type: 'Thr' });
        } else if (isBod) {
          result = await approvalBod({ payrollIds: [], all: true }, 'Thr');
          if (result) await fetchBodRows({ page: 1, pageSize: bodPageSize, type: 'Thr' });
        }
      } else {
        if (isDirectorHrga) {
          result = await approvalDirectorHr({ payrollIds }, 'Thr');
          if (result) await fetchDirectorRows({ page: directorPage, pageSize: directorPageSize, type: 'Thr' });
        } else if (isFat) {
          result = await approvalFat({ payrollIds }, 'Thr');
          if (result) await fetchFatRows({ page: fatPage, pageSize: fatPageSize, type: 'Thr' });
        } else if (isBod) {
          result = await approvalBod({ payrollIds }, 'Thr');
          if (result) await fetchBodRows({ page: bodPage, pageSize: bodPageSize, type: 'Thr' });
        }
      }

      return result;
    } catch (error) {
      console.error('Approval failed:', error);
      return false;
    }
  };

  // Event handlers
  const handleSearchChange = isDirectorHrga
    ? (s: string) => {
        setDirectorSearch(s);
        fetchDirectorRows({ page: 1, search: s });
      }
    : isFat
      ? (s: string) => {
          setFatSearch(s);
          fetchFatRows({ page: 1, search: s });
        }
      : isBod
        ? (s: string) => {
            setBodSearch(s);
            fetchBodRows({ page: 1, search: s });
          }
        : undefined;

  const handleSortChange = isDirectorHrga
    ? (columnId: string, order: 'asc' | 'desc') => {
        const sortKey = toDirectorHrSortKey(columnId);
        setDirectorSort(sortKey, order);
        fetchDirectorRows({ page: 1, sortBy: sortKey, sortOrder: order as any });
      }
    : isFat
      ? (columnId: string, order: 'asc' | 'desc') => {
          const sortKey = toFatSortKey(columnId);
          setFatSort(sortKey, order);
          fetchFatRows({ page: 1, sortBy: sortKey, sortOrder: order as any });
        }
      : isBod
        ? (columnId: string, order: 'asc' | 'desc') => {
            const sortKey = toBodSortKey(columnId);
            setBodSort(sortKey, order);
            fetchBodRows({ page: 1, sortBy: sortKey, sortOrder: order as any });
          }
        : undefined;

  const handlePageChange = isDirectorHrga
    ? (p: number) => {
        setDirectorPage(p);
        fetchDirectorRows({ page: p });
      }
    : isFat
      ? (p: number) => {
          setFatPage(p);
          fetchFatRows({ page: p });
        }
      : isBod
        ? (p: number) => {
          setBodPage(p);
          fetchBodRows({ page: p });
        }
        : undefined;

  const handleRowsPerPageChange = isDirectorHrga
    ? (rpp: number) => {
        setDirectorPageSize(rpp);
        setDirectorPage(1);
        fetchDirectorRows({ page: 1, pageSize: rpp });
      }
    : isFat
      ? (rpp: number) => {
          setFatPageSize(rpp);
          setFatPage(1);
          fetchFatRows({ page: 1, pageSize: rpp });
        }
      : isBod
        ? (rpp: number) => {
            setBodPageSize(rpp);
            setBodPage(1);
            fetchBodRows({ page: 1, pageSize: rpp });
          }
        : undefined;

  const handleColumnFilterChange = isDirectorHrga
    ? (columnId: string, values: string[]) => {
        const apiColumnId = toDirectorHrFilterColumnId(columnId);
        const next = { ...(directorColumnFilters || {}) };
        next[apiColumnId] = values;
        setDirectorColumnFilters(next);
        fetchDirectorRows({ page: 1, columnFilters: next } as any);
      }
    : isFat
      ? (columnId: string, values: string[]) => {
          const apiColumnId = toFatFilterColumnId(columnId);
          const next = { ...(fatColumnFilters || {}) };
          next[apiColumnId] = values;
          setFatColumnFilters(next);
          fetchFatRows({ page: 1, columnFilters: next } as any);
        }
      : isBod
        ? (columnId: string, values: string[]) => {
          const apiColumnId = toBodFilterColumnId(columnId);
          const next = { ...(bodColumnFilters || {}) };
          next[apiColumnId] = values;
          setBodColumnFilters(next);
          fetchBodRows({ page: 1, columnFilters: next } as any);
        }
        : undefined;

  const handleDateRangeFilterChange = isDirectorHrga
    ? (columnId: string, startDate: string, endDate: string | null) => {
        const apiColumnId = toDirectorHrFilterColumnId(columnId);
        const next = { ...(directorDateRangeFilters || {}) };
        next[apiColumnId] = { startDate, endDate };
        setDirectorDateRangeFilters(next);
        fetchDirectorRows({ page: 1, dateRangeFilters: next } as any);
      }
    : isFat
      ? (columnId: string, startDate: string, endDate: string | null) => {
          const apiColumnId = toFatFilterColumnId(columnId);
          const next = { ...(fatDateRangeFilters || {}) };
          next[apiColumnId] = { startDate, endDate };
          setFatDateRangeFilters(next);
          fetchFatRows({ page: 1, dateRangeFilters: next } as any);
        }
      : isBod
        ? (columnId: string, startDate: string, endDate: string | null) => {
          const apiColumnId = toBodFilterColumnId(columnId);
          const next = { ...(bodDateRangeFilters || {}) };
          next[apiColumnId] = { startDate, endDate };
          setBodDateRangeFilters(next);
          fetchBodRows({ page: 1, dateRangeFilters: next } as any);
        }
        : undefined;

  return {
    // Data and state
    rows,
    baseColumns,
    loading: isApprovalPage ? (isDirectorHrga ? directorLoading : isFat ? fatLoading : isBod ? bodLoading : false) : false,
    page: isApprovalPage ? (isDirectorHrga ? directorPage : isFat ? fatPage : isBod ? bodPage : undefined) : undefined,
    total: isApprovalPage ? (isDirectorHrga ? directorTotal : isFat ? fatTotal : isBod ? bodTotal : undefined) : undefined,
    pageSize: isApprovalPage ? (isDirectorHrga ? directorPageSize : isFat ? fatPageSize : isBod ? bodPageSize : undefined) : undefined,
    columnFilters: isDirectorHrga ? directorColumnFilters : isFat ? fatColumnFilters : isBod ? bodColumnFilters : undefined,
    dateRangeFilters: isDirectorHrga ? directorDateRangeFilters : isFat ? fatDateRangeFilters : isBod ? bodDateRangeFilters : undefined,
    
    // Navigation and UI state
    title,
    detailPathPrefix,
    isApprovalPage,
    isDropdownOpen,
    approvalType,
    
    // Store
    approvalStore,
    
    // Approval type checks
    isDirectorHrga,
    isFat,
    isBod,
    
    // Handlers
    handleDetailNavigation,
    handleApprovalWithModal,
    handleApprovalConfirm,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleApprovalTypeChange,
    
    // Modal handlers
    setIsDropdownOpen,
    
    // Selection logic
    isPendingForApprovalType,
  };
}

export default useTHRPages;

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import { useApiPayrollPeriodDirectorHr } from '../../api/useApiPayrollPeriodDirectorHr';
import { useApiPayrollPeriodFat } from '../../api/useApiPayrollPeriodFat';
import { useApiPayrollPeriodBod } from '../../api/useApiPayrollPeriodBod';
import { formatCurrencyValue } from '@/utils/formatCurrency';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { usePayrollApprovalStore } from '../../../store/usePayrollApprovalStore';
import { useApiPayrollPeriod } from '../../api/useApiPayrollPeriod';

const toDirectorHrSortKey = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employeeId',
    pengguna: 'fullName',
    tanggalPengajuan: 'periode',
    totalGajiBersih: 'netSalary',
    statusPersetujuan: 'payrollStatusName',
  };
  return map[columnId] || columnId;
};

const toDirectorHrFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employee_id',
    pengguna: 'full_name',
    tanggalPengajuan: 'periode',
    totalGajiBersih: 'net_salary',
    statusPersetujuan: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

const toFatSortKey = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employeeId',
    pengguna: 'fullName',
    tanggalPengajuan: 'periode',
    totalGajiBersih: 'netSalary',
    statusPersetujuan: 'payrollStatusName',
  };
  return map[columnId] || columnId;
};

const toFatFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employee_id',
    pengguna: 'full_name',
    tanggalPengajuan: 'periode',
    totalGajiBersih: 'net_salary',
    statusPersetujuan: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

const toBodSortKey = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employeeId',
    pengguna: 'fullName',
    tanggalPengajuan: 'periode',
    totalGajiBersih: 'netSalary',
    statusPersetujuan: 'payrollStatusName',
  };
  return map[columnId] || columnId;
};

const toBodFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    idKaryawan: 'employee_id',
    pengguna: 'full_name',
    tanggalPengajuan: 'periode',
    totalGajiBersih: 'net_salary',
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

export type AERow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  tanggalPengajuan: string;
  jumlahHariKerja: string;
  totalGajiBersih: string;
  fee: string;
  tunjanganTidakTetap: string;
  kategori: string;
  perusahaan: string;
  statusPersetujuan: string;
  payrollId?: string;
};

export interface UseAEPagesOptions {
  resetKey?: string;
}

export function useAEPages(_options: UseAEPagesOptions = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEmployeeTypeDropdownOpen, setIsEmployeeTypeDropdownOpen] = useState(false);
  const [isApprovalTypeDropdownOpen, setIsApprovalTypeDropdownOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<string>('Persetujuan oleh Direktur HRGA');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRowsForApproval, setSelectedRowsForApproval] = useState<AERow[]>([]);
  const [approvalStatusFetched, setApprovalStatusFetched] = useState(false);
  const [employeeType, setEmployeeType] = useState<'Mitra' | 'Staff' | 'Thr'>('Mitra');
  
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
  const detailPathPrefix = isDistribusiPage ? '/salary-distribution/detail-ae' : `${basePrefix}/detail-ae`;
  const title = isApprovalPage ? 'Approval Periode Gajian' : isDistribusiPage ? 'Distribusi Slip Gaji' : 'Periode Gajian';

  // Dokumentasi: Fungsi untuk navigasi detail dengan approval type sebagai query parameter
  const handleDetailNavigation = (id: string) => {
    navigate(`${detailPathPrefix}/${id}?approvalType=${encodeURIComponent(approvalType)}`);
  };

  const isDirectorHrga = approvalType === 'Persetujuan oleh Direktur HRGA';
  const isFat = approvalType === 'Persetujuan oleh FAT';
  const isBod = approvalType === 'Persetujuan oleh BOD';

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
  } = useApiPayrollPeriodDirectorHr();

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
  } = useApiPayrollPeriodFat();

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
  } = useApiPayrollPeriodBod();

  useEffect(() => {
    if (!isApprovalPage) return;
    if (!isDirectorHrga) return;
    setDirectorType(employeeType);
    fetchDirectorRows({ page: 1, pageSize: directorPageSize });
  }, [isApprovalPage, isDirectorHrga, directorPageSize, fetchDirectorRows, employeeType, setDirectorType]);

  useEffect(() => {
    if (!isApprovalPage) return;
    if (!isFat) return;
    setFatType(employeeType);
    fetchFatRows({ page: 1, pageSize: fatPageSize });
  }, [isApprovalPage, isFat, fatPageSize, fetchFatRows, employeeType, setFatType]);

  useEffect(() => {
    if (!isApprovalPage) return;
    if (!isBod) return;
    setBodType(employeeType);
    fetchBodRows({ page: 1, pageSize: bodPageSize });
  }, [isApprovalPage, isBod, bodPageSize, fetchBodRows, employeeType, setBodType]);

  // Fetch approval status for the store
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

  const fallbackRows: AERow[] = useMemo(
    () => [
      {
        idKaryawan: '12345681',
        pengguna: 'Lindsey Curtis',
        tanggalPengajuan: '20/12/2025',
        jumlahHariKerja: '20',
        totalGajiBersih: '7.250.000',
        fee: '500.000',
        tunjanganTidakTetap: '750.000',
        kategori: 'Sales',
        perusahaan: 'Dasaria',
        statusPersetujuan: 'Menunggu diproses',
      },
    ],
    []
  );

  const rows: AERow[] = useMemo(() => {
    if (isDirectorHrga) {
      return (directorRows || []).map((r, idx) => ({
        no: idx + 1 + (directorPage - 1) * directorPageSize,
        idKaryawan: r.employeeId,
        pengguna: r.fullName,
        tanggalPengajuan: r.periode,
        jumlahHariKerja: String(r.workingDays),
        totalGajiBersih: formatCurrencyValue(toNumber(r.netSalary)),
        fee: formatCurrencyValue(toNumber(r.basicSalary)),
        tunjanganTidakTetap: formatCurrencyValue(toNumber(r.nonFixedAllowanceTotal)),
        kategori: r.employeeCategoryName,
        perusahaan: r.companyName,
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
        jumlahHariKerja: String(r.workingDays),
        totalGajiBersih: formatCurrencyValue(toNumber(r.netSalary)),
        fee: formatCurrencyValue(toNumber(r.basicSalary)),
        tunjanganTidakTetap: formatCurrencyValue(toNumber(r.nonFixedAllowanceTotal)),
        kategori: r.employeeCategoryName,
        perusahaan: r.companyName,
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
        jumlahHariKerja: String(r.workingDays),
        totalGajiBersih: formatCurrencyValue(toNumber(r.netSalary)),
        fee: formatCurrencyValue(toNumber(r.basicSalary)),
        tunjanganTidakTetap: formatCurrencyValue(toNumber(r.nonFixedAllowanceTotal)),
        kategori: r.employeeCategoryName,
        perusahaan: r.companyName,
        statusPersetujuan: r.payrollStatusName,
        payrollId: r.payrollId,
      }));
    }

    return fallbackRows;
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
    fallbackRows,
  ]);

  const statusFilterOptions = useMemo(() => {
    const unique = Array.from(new Set((rows || []).map((r) => String(r.statusPersetujuan ?? '')).filter(Boolean)));
    return unique.map((v) => ({ label: v, value: v }));
  }, [rows]);

  const baseColumns: DataTableColumn<AERow>[] = useMemo(
    () => [
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
      { id: 'fee', label: 'FEE', align: 'right' },
      { id: 'tunjanganTidakTetap', label: 'Tunjangan Tidak Tetap', align: 'right' },
      { id: 'kategori', label: 'Kategori' },
      { id: 'perusahaan', label: 'Perusahaan' },
      {
        id: 'statusPersetujuan',
        label: 'Status Persetujuan',
        filterOptions: statusFilterOptions,
      },
    ],
    [statusFilterOptions]
  );

  // Dokumentasi: Fungsi untuk menangani approval dengan modal konfirmasi
  const handleApprovalWithModal = useCallback(
    async (selectedRows: AERow[]) => {
      if (!isApprovalPage) return false;

      const isSelectAll = (selectedRows?.length ?? 0) > 0 && (selectedRows?.length ?? 0) === rows.length;
      let payrollIds: string[] = [];

      if (!isSelectAll) {
        payrollIds = Array.from(
          new Set((selectedRows || []).map((r) => r.payrollId).filter((id): id is string => Boolean(id)))
        );
        if (payrollIds.length === 0) return false;
      }

      // Simpan selected rows untuk digunakan di modal
      setSelectedRowsForApproval(selectedRows);
      
      // Tampilkan modal konfirmasi
      setIsApprovalModalOpen(true);
      return true; // Return true untuk menandakan modal akan ditampilkan
    },
    [isApprovalPage, rows.length]
  );

  const handleApprovalConfirm = async () => {
    setIsSubmitting(true);
    try {
      let result = false;
      const currentSelectedRows = selectedRowsForApproval;
      const isSelectAll = currentSelectedRows.length > 0 && currentSelectedRows.length === rows.length;

      if (isSelectAll) {
        if (isDirectorHrga) {
          result = await approvalDirectorHr({ payrollIds: [], all: true });
          if (result) await fetchDirectorRows({ page: 1, pageSize: directorPageSize });
        } else if (isFat) {
          result = await approvalFat({ payrollIds: [], all: true });
          if (result) await fetchFatRows({ page: 1, pageSize: fatPageSize });
        } else if (isBod) {
          result = await approvalBod({ payrollIds: [], all: true });
          if (result) await fetchBodRows({ page: 1, pageSize: bodPageSize });
        }
      } else {
        const payrollIds = Array.from(
          new Set(currentSelectedRows.map((r: AERow) => r.payrollId).filter((id): id is string => Boolean(id)))
        );

        if (isDirectorHrga) {
          result = await approvalDirectorHr({ payrollIds });
          if (result) await fetchDirectorRows({ page: directorPage, pageSize: directorPageSize });
        } else if (isFat) {
          result = await approvalFat({ payrollIds });
          if (result) await fetchFatRows({ page: fatPage, pageSize: fatPageSize });
        } else if (isBod) {
          result = await approvalBod({ payrollIds });
          if (result) await fetchBodRows({ page: bodPage, pageSize: bodPageSize });
        }
      }

      if (result) {
        setIsApprovalModalOpen(false);
        setSelectedRowsForApproval([]);
        // Clear selection after successful approval
        clearSelection();
      }
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk clear selection (simulasi karena tidak ada akses ke DataTable)
  const clearSelection = () => {
    // Ini akan ditangani oleh DataTable component secara internal
    //console.log('Selection cleared');
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

  const handleApprovalTypeChange = (type: string) => {
    setApprovalType(type);
    setIsApprovalTypeDropdownOpen(false);
  };

  const handleEmployeeTypeChange = (type: 'Mitra' | 'Staff' | 'Thr') => {
    setEmployeeType(type);
    setIsEmployeeTypeDropdownOpen(false);
  };

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
    isEmployeeTypeDropdownOpen,
    isApprovalTypeDropdownOpen,
    approvalType,
    isApprovalModalOpen,
    isSubmitting,
    selectedRowsForApproval,
    employeeType,
    
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
    handleEmployeeTypeChange,
    
    // Modal handlers
    setIsEmployeeTypeDropdownOpen,
    setIsApprovalTypeDropdownOpen,
    setIsApprovalModalOpen,
    setSelectedRowsForApproval,
    
    // Selection logic
    isPendingForApprovalType,
    clearSelection,
  };
}

export default useAEPages;

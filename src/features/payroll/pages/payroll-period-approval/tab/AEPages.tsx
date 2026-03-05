import { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import PayrollApprovalModal from '../../../components/modals/payroll-period-approval/PayrollApprovalModal';
import { useApiPayrollPeriodDirectorHr } from '../../../hooks/api/useApiPayrollPeriodDirectorHr';
import { useApiPayrollPeriodFat } from '../../../hooks/api/useApiPayrollPeriodFat';
import { useApiPayrollPeriodBod } from '../../../hooks/api/useApiPayrollPeriodBod';
import { formatCurrencyValue } from '@/utils/formatCurrency';
import { formatDateToIndonesian } from '@/utils/formatDate';

type AERow = {
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

export default function AETab({ }: { resetKey?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isApprovalTypeDropdownOpen, setIsApprovalTypeDropdownOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<string>('Persetujuan oleh Direktur HRGA');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRowsForApproval, setSelectedRowsForApproval] = useState<AERow[]>([]);
  const [employeeType, setEmployeeType] = useState<'Mitra' | 'Staff' | 'Thr'>('Mitra');
  const [initialDataFetched, setInitialDataFetched] = useState(false);
    
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

  const toNumber = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    const cleaned = String(value).replace(/[^0-9-]/g, '');
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  };

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

  // API Hooks Integration
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
  } = useApiPayrollPeriodDirectorHr({ initialType: 'Mitra' });

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

  // Fetch data on component mount - only once
  useEffect(() => {
    if (!isApprovalPage || initialDataFetched) return;
    
    if (isDirectorHrga) {
      setDirectorType('Mitra');
      fetchDirectorRows({ page: 1, pageSize: 10, type: 'Mitra' });
    } else if (isFat) {
      setFatType('Mitra');
      fetchFatRows({ page: 1, pageSize: 10, type: 'Mitra' });
    } else if (isBod) {
      setBodType('Mitra');
      fetchBodRows({ page: 1, pageSize: 10, type: 'Mitra' });
    }
    
    setInitialDataFetched(true);
  }, [isApprovalPage, isDirectorHrga, isFat, isBod, fetchDirectorRows, fetchFatRows, fetchBodRows, setDirectorType, setFatType, setBodType, initialDataFetched]);

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

  // Auto-set employee type to Mitra on component mount
  useEffect(() => {
    if (employeeType !== 'Mitra') {
      handleEmployeeTypeChange('Mitra');
    }
  }, []);

  // Data processing
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

    // Fallback data
    return [
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
    ];
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
        format: (v: any) => {
          const statusText = String(v);
          const normalize = (s: string) => s.trim().toLowerCase();

          const pendingMap: Record<string, string> = {
            'Persetujuan oleh Direktur HRGA': 'menunggu diproses direktur hrga',
            'Persetujuan oleh FAT': 'menunggu diproses fat',
            'Persetujuan oleh BOD': 'menunggu diproses bod',
          };

          const expectedPending = pendingMap[approvalType];
          const isPending = expectedPending ? normalize(statusText) === expectedPending : true;

          const badgeClass = isPending
            ? 'status-styling text-center rounded-full bg-orange-100 p-[10px] flex justify-center text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-200'
            : 'status-styling text-center rounded-full bg-blue-100 p-[10px] flex justify-center text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-200';

          return <span className={badgeClass}>{statusText}</span>;
        },
      },
    ],
    [statusFilterOptions, approvalType]
  );

  // Event handlers
  const handleSearchChange = isDirectorHrga
    ? (s: string) => {
        setDirectorSearch(s);
        fetchDirectorRows({ page: 1, search: s, type: employeeType });
      }
    : isFat
      ? (s: string) => {
          setFatSearch(s);
          fetchFatRows({ page: 1, search: s, type: employeeType });
        }
      : isBod
        ? (s: string) => {
            setBodSearch(s);
            fetchBodRows({ page: 1, search: s, type: employeeType });
          }
        : undefined;

  const handleSortChange = isDirectorHrga
    ? (columnId: string, order: 'asc' | 'desc') => {
        const sortKey = toDirectorHrSortKey(columnId);
        setDirectorSort(sortKey, order);
        fetchDirectorRows({ page: 1, sortBy: sortKey, sortOrder: order as any, type: employeeType });
      }
    : isFat
      ? (columnId: string, order: 'asc' | 'desc') => {
          const sortKey = toFatSortKey(columnId);
          setFatSort(sortKey, order);
          fetchFatRows({ page: 1, sortBy: sortKey, sortOrder: order as any, type: employeeType });
        }
      : isBod
        ? (columnId: string, order: 'asc' | 'desc') => {
            const sortKey = toBodSortKey(columnId);
            setBodSort(sortKey, order);
            fetchBodRows({ page: 1, sortBy: sortKey, sortOrder: order as any, type: employeeType });
          }
        : undefined;

  const handlePageChange = isDirectorHrga
    ? (p: number) => {
        setDirectorPage(p);
        fetchDirectorRows({ page: p, type: employeeType });
      }
    : isFat
      ? (p: number) => {
          setFatPage(p);
          fetchFatRows({ page: p, type: employeeType });
        }
      : isBod
        ? (p: number) => {
            setBodPage(p);
            fetchBodRows({ page: p, type: employeeType });
          }
        : undefined;

  const handleRowsPerPageChange = isDirectorHrga
    ? (rpp: number) => {
        setDirectorPageSize(rpp);
        setDirectorPage(1);
        fetchDirectorRows({ page: 1, pageSize: rpp, type: employeeType });
      }
    : isFat
      ? (rpp: number) => {
          setFatPageSize(rpp);
          setFatPage(1);
          fetchFatRows({ page: 1, pageSize: rpp, type: employeeType });
        }
      : isBod
        ? (rpp: number) => {
          setBodPageSize(rpp);
          setBodPage(1);
          fetchBodRows({ page: 1, pageSize: rpp, type: employeeType });
        }
        : undefined;

  const handleColumnFilterChange = isDirectorHrga
    ? (columnId: string, values: string[]) => {
        const apiColumnId = toDirectorHrFilterColumnId(columnId);
        const next = { ...(directorColumnFilters || {}) };
        next[apiColumnId] = values;
        setDirectorColumnFilters(next);
        fetchDirectorRows({ page: 1, columnFilters: next, type: employeeType } as any);
      }
    : isFat
      ? (columnId: string, values: string[]) => {
          const apiColumnId = toFatFilterColumnId(columnId);
          const next = { ...(fatColumnFilters || {}) };
          next[apiColumnId] = values;
          setFatColumnFilters(next);
          fetchFatRows({ page: 1, columnFilters: next, type: employeeType } as any);
        }
      : isBod
        ? (columnId: string, values: string[]) => {
            const apiColumnId = toBodFilterColumnId(columnId);
            const next = { ...(bodColumnFilters || {}) };
            next[apiColumnId] = values;
            setBodColumnFilters(next);
            fetchBodRows({ page: 1, columnFilters: next, type: employeeType } as any);
          }
        : undefined;

  const handleDateRangeFilterChange = isDirectorHrga
    ? (columnId: string, startDate: string, endDate: string | null) => {
        const apiColumnId = toDirectorHrFilterColumnId(columnId);
        const next = { ...(directorDateRangeFilters || {}) };
        next[apiColumnId] = { startDate, endDate };
        setDirectorDateRangeFilters(next);
        fetchDirectorRows({ page: 1, dateRangeFilters: next, type: employeeType } as any);
      }
    : isFat
      ? (columnId: string, startDate: string, endDate: string | null) => {
          const apiColumnId = toFatFilterColumnId(columnId);
          const next = { ...(fatDateRangeFilters || {}) };
          next[apiColumnId] = { startDate, endDate };
          setFatDateRangeFilters(next);
          fetchFatRows({ page: 1, dateRangeFilters: next, type: employeeType } as any);
        }
      : isBod
        ? (columnId: string, startDate: string, endDate: string | null) => {
            const apiColumnId = toBodFilterColumnId(columnId);
            const next = { ...(bodDateRangeFilters || {}) };
            next[apiColumnId] = { startDate, endDate };
            setBodDateRangeFilters(next);
            fetchBodRows({ page: 1, dateRangeFilters: next, type: employeeType } as any);
          }
        : undefined;

  // Approval handlers
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

      setSelectedRowsForApproval(selectedRows);
      setIsApprovalModalOpen(true);
      return true;
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
          result = await approvalDirectorHr({ payrollIds: [], all: true }, employeeType);
          if (result) await fetchDirectorRows({ page: 1, pageSize: 10, type: employeeType });
        } else if (isFat) {
          result = await approvalFat({ payrollIds: [], all: true }, employeeType);
          if (result) await fetchFatRows({ page: 1, pageSize: 10, type: employeeType });
        } else if (isBod) {
          result = await approvalBod({ payrollIds: [], all: true }, employeeType);
          if (result) await fetchBodRows({ page: 1, pageSize: 10, type: employeeType });
        }
      } else {
        const payrollIds = Array.from(
          new Set(currentSelectedRows.map((r: AERow) => r.payrollId).filter((id): id is string => Boolean(id)))
        );

        if (isDirectorHrga) {
          result = await approvalDirectorHr({ payrollIds }, employeeType);
          if (result) await fetchDirectorRows({ page: directorPage, pageSize: 10, type: employeeType });
        } else if (isFat) {
          result = await approvalFat({ payrollIds }, employeeType);
          if (result) await fetchFatRows({ page: fatPage, pageSize: 10, type: employeeType });
        } else if (isBod) {
          result = await approvalBod({ payrollIds }, employeeType);
          if (result) await fetchBodRows({ page: bodPage, pageSize: 10, type: employeeType });
        }
      }

      if (result) {
        setIsApprovalModalOpen(false);
        setSelectedRowsForApproval([]);
        clearSelection();
      }
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSelection = () => {
    console.log('Selection cleared');
  };

  const handleApprovalTypeChange = (type: string) => {
    setApprovalType(type);
    setIsApprovalTypeDropdownOpen(false);
    
    // Fetch data with new approval type using Mitra type
    if (isDirectorHrga) {
      setDirectorType('Mitra');
      fetchDirectorRows({ page: 1, pageSize: 10, type: 'Mitra' });
    } else if (isFat) {
      setFatType('Mitra');
      fetchFatRows({ page: 1, pageSize: 10, type: 'Mitra' });
    } else if (isBod) {
      setBodType('Mitra');
      fetchBodRows({ page: 1, pageSize: 10, type: 'Mitra' });
    }
  };

  const handleEmployeeTypeChange = (type: 'Mitra' | 'Staff' | 'Thr') => {
    setEmployeeType(type);
  };

  return (
    <>
      <PenggajianTabBase
        resetKey="payroll-approval-ae"
        rows={rows}
        baseColumns={baseColumns}
        detailPathPrefix={detailPathPrefix}
        title={title}
        onDetailNavigation={handleDetailNavigation}
        onFinalize={handleApprovalWithModal}
        approvalType={approvalType}
        disableSelection={false}
        isRowSelectable={(row) => isPendingForApprovalType(String(row.statusPersetujuan))}
        loading={isApprovalPage ? (isDirectorHrga ? directorLoading : isFat ? fatLoading : isBod ? bodLoading : false) : false}
        useExternalPagination={isApprovalPage && (isDirectorHrga || isFat || isBod)}
        externalPage={isApprovalPage ? (isDirectorHrga ? directorPage : isFat ? fatPage : isBod ? bodPage : undefined) : undefined}
        externalTotal={isApprovalPage ? (isDirectorHrga ? directorTotal : isFat ? fatTotal : isBod ? bodTotal : undefined) : undefined}
        pageSize={isApprovalPage ? (isDirectorHrga ? directorPageSize : isFat ? fatPageSize : isBod ? bodPageSize : undefined) : undefined}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={isApprovalPage ? (isDirectorHrga ? directorColumnFilters : isFat ? fatColumnFilters : isBod ? bodColumnFilters : undefined) : undefined}
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={isApprovalPage ? (isDirectorHrga ? directorDateRangeFilters : isFat ? fatDateRangeFilters : isBod ? bodDateRangeFilters : undefined) : undefined}
        toolbarRightSlot={
          isApprovalPage && <div className="flex gap-2">
            {/* Approval Type Dropdown */}
            <div className="relative">
              <Button
                onClick={() => setIsApprovalTypeDropdownOpen(!isApprovalTypeDropdownOpen)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 dropdown-toggle"
              >
                {approvalType}
                <ChevronDown size={16} />
              </Button>
              <Dropdown isOpen={isApprovalTypeDropdownOpen} onClose={() => setIsApprovalTypeDropdownOpen(false)}>
                <div className="p-2 w-64">
                  <button
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleApprovalTypeChange('Persetujuan oleh Direktur HRGA')}
                  >
                    Persetujuan oleh Direktur HRGA
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleApprovalTypeChange('Persetujuan oleh FAT')}
                  >
                    Persetujuan oleh FAT
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleApprovalTypeChange('Persetujuan oleh BOD')}
                  >
                    Persetujuan oleh BOD
                  </button>
                </div>
              </Dropdown>
            </div>
          </div>
        }
      />
      
      <PayrollApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false);
          setSelectedRowsForApproval([]);
        }}
        onConfirm={handleApprovalConfirm}
        submitting={isSubmitting}
        statusPersetujuan={selectedRowsForApproval.length > 0 ? selectedRowsForApproval[0].statusPersetujuan : ''}
        periodDate={selectedRowsForApproval.length > 0 ? selectedRowsForApproval[0].tanggalPengajuan : ''}
        approvalType={approvalType}
      />
    </>
  );
}

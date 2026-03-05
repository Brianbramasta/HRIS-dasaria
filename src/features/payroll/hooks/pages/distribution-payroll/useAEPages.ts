import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { useApiPayrollPeriodDistribution } from '../../api/useApiPayrollPeriodDistribution';
import { usePayrollApprovalStore } from '../../../store/usePayrollApprovalStore';
import { useApiPayrollPeriod } from '../../api/useApiPayrollPeriod';
import React from 'react';

const toPayrollDistributionFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    tanggalPengajuan: 'periode',
    statusPersetujuan: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

export interface SalaryDistributionData {
  idKaryawan: string;
  payrollId: string;
  pengguna: string;
  nip: string;
  tanggalPengajuan: string;
  email: string;
  jenisBank: string;
  noRekening: string;
  totalGajiBersih: number;
  kategori: string;
  perusahaan: string;
  statusPersetujuan: string;
}

export interface UseAEPagesOptions {
  resetKey?: string;
}

export function useAEPages(_options: UseAEPagesOptions = {}) {
  const navigate = useNavigate();
  const [approvalStatusFetched, setApprovalStatusFetched] = useState(false);
  
  const approvalStore = usePayrollApprovalStore();
  const { fetchImportApprovalStatus } = useApiPayrollPeriod();
  
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
    sendSlipSalary,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    setType,
    setColumnFilters,
    setDateRangeFilters,
  } = useApiPayrollPeriodDistribution();

  // Set type to 'Mitra' on mount
  useEffect(() => {
    setType('Mitra');
  }, [setType]);

  useEffect(() => {
    fetchPayrollPeriods({
      page,
      pageSize,
      search,
      sortBy,
      sortOrder: sortOrder ?? undefined,
      type: 'Mitra',
      columnFilters,
      dateRangeFilters,
    } as any);
  }, [fetchPayrollPeriods, page, pageSize, search, sortBy, sortOrder, columnFilters, dateRangeFilters]);

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

  const rows: SalaryDistributionData[] = useMemo(() => {
    const toNumber = (val: unknown): number => {
      if (val === null || val === undefined) return 0;
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const cleaned = val.replace(/[^0-9.-]/g, '');
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      return 0;
    };

    return (payrollPeriods || []).map((item) => ({
      idKaryawan: item.payrollId,
      payrollId: item.payrollId,
      pengguna: item.fullName,
      nip: item.employeeId,
      tanggalPengajuan: item.periode,
      email: item.email,
      jenisBank: item.bankName,
      noRekening: String(item.bankAccountNumber ?? '-'),
      totalGajiBersih: toNumber(item.netSalary),
      kategori: item.employeeCategoryName,
      perusahaan: item.companyName,
      statusPersetujuan: item.payrollStatusName,
    }));
  }, [payrollPeriods]);

  const statusFilterOptions = useMemo(() => {
    const unique = Array.from(new Set((rows || []).map((r) => String(r.statusPersetujuan ?? '')).filter(Boolean)));
    return unique.map((v) => ({ label: v, value: v }));
  }, [rows]);

  const baseColumns: DataTableColumn<SalaryDistributionData>[] = useMemo(
    () => [
      {
        id: 'nip',
        label: 'NIP',
        minWidth: 100,
        align: 'left',
      },
      {
        id: 'pengguna',
        label: 'Pengguna',
        minWidth: 150,
        align: 'left',
      },
      {
        id: 'tanggalPengajuan',
        label: 'Tanggal Pengajuan',
        minWidth: 140,
        align: 'left',
        dateRangeFilter: true,
        format: (v) => formatDateToIndonesian(String(v)),
      },
      {
        id: 'email',
        label: 'Email',
        minWidth: 180,
        align: 'left',
      },
      {
        id: 'jenisBank',
        label: 'Jenis Bank',
        minWidth: 120,
        align: 'left',
      },
      {
        id: 'noRekening',
        label: 'No. Rekening',
        minWidth: 130,
        align: 'left',
      },
      {
        id: 'totalGajiBersih',
        label: 'Total Gaji Bersih',
        minWidth: 140,
        align: 'right',
        format: (value) => formatCurrency(value),
      },
      {
        id: 'kategori',
        label: 'Kategori',
        minWidth: 110,
        align: 'left',
      },
      {
        id: 'perusahaan',
        label: 'Perusahaan',
        minWidth: 120,
        align: 'left',
      },
      {
        id: 'statusPersetujuan',
        label: 'Status Persetujuan',
        minWidth: 140,
        align: 'center',
        filterOptions: statusFilterOptions,
        format: (value: any) => {
          const statusLower = String(value ?? '').trim().toLowerCase();
          const status = statusLower.includes('selesai')
            ? { text: value, className: 'status-styling bg-green-100 text-green-800' }
            : statusLower.includes('proses')
            ? { text: value, className: 'status-styling bg-yellow-100 text-yellow-800' }
            : { text: value, className: 'status-styling bg-gray-100 text-gray-800' };
          return React.createElement(
            'span',
            { className: `inline-block px-3 py-1 rounded-full text-sm font-medium ${status.className}` },
            status.text
          );
        },
      },
    ],
    [statusFilterOptions]
  );

  const isRowSelectable = (row: SalaryDistributionData) => {
    const value = String(row.statusPersetujuan ?? '')
      .trim()
      .toLowerCase();
    return value === 'proses distribusi';
  };

  const actions: DataTableAction<SalaryDistributionData>[] = useMemo(
    () => [
      {
        icon: React.createElement(IconFileDetail),
        onClick: (row) => {
          // Navigate to SlipPayroll page with payrollId parameter
          navigate(`/distribution-payroll/slip/${row.payrollId}`, {
            state: {
              data: {
                idKaryawan: row.idKaryawan,
                nip: row.nip,
                pengguna: row.pengguna,
                golongan: row.kategori,
                divisi: row.kategori,
                jabatan: 'AE',
                departemen: row.perusahaan,
                jenisBank: row.jenisBank,
                noRekening: row.noRekening,
                namaPenerima: row.pengguna,
                penerimaan: {
                  gajiPokok: row.totalGajiBersih,
                  tunjanganTetap: row.totalGajiBersih * 0.1,
                  transport: row.totalGajiBersih * 0.05,
                  lamaKerja: row.totalGajiBersih * 0.03,
                  bpjsKesehatan: row.totalGajiBersih * 0.02,
                  bpjsPensiun: row.totalGajiBersih * 0.01,
                  bpjsHariTua: row.totalGajiBersih * 0.02,
                  bpjsKematian: row.totalGajiBersih * 0.02,
                  bpjsKecelakaan: row.totalGajiBersih * 0.02,
                  pernikahan: 0,
                  tunjanganTidakTetap: row.totalGajiBersih * 0.05,
                  tunjanganPph21: row.totalGajiBersih * 0.02,
                  insentif: row.totalGajiBersih * 0.02,
                  performa: row.totalGajiBersih * 0.01,
                  komisiSales: row.totalGajiBersih * 0.15,
                  komisiSurveySales: row.totalGajiBersih * 0.1,
                  growthReward: row.totalGajiBersih * 0.08,
                },
                potongan: {
                  potonganTetap: row.totalGajiBersih * 0.08,
                  kasbon: row.totalGajiBersih * 0.02,
                  bpjsPensiun: row.totalGajiBersih * 0.01,
                  bpjsKesehatan: row.totalGajiBersih * 0.02,
                  bpjsHariTua: row.totalGajiBersih * 0.02,
                  potonganTidakTetap: row.totalGajiBersih * 0.03,
                  pph21: row.totalGajiBersih * 0.05,
                },
                takeHomePay: row.totalGajiBersih,
                catatan: 'Mohon tidak menyebarkan slip gaji karena bersifat rahasia.',
              },
              title: 'Slip Gaji AE',
              takeHomePayLabel: 'Take Home Pay',
            },
          });
        },
        variant: 'outline',
        color: 'info',
      },
    ],
    [navigate]
  );

  const handleDistribusiSlipGaji = async (selectedRows: SalaryDistributionData[]) => {
    const payrollIds = Array.from(
      new Set(
        (selectedRows || [])
          .map((r) => r.payrollId || r.idKaryawan)
          .filter(Boolean)
          .map(String)
      )
    );

    if (payrollIds.length === 0) return false;

    const ok = await sendSlipSalary({ 
      payrollIds,
      type: 'Mitra'
    });
    if (ok) {
      await fetchPayrollPeriods({
        page,
        pageSize,
        search,
        sortBy,
        sortOrder: sortOrder ?? undefined,
        type: 'Mitra',
        columnFilters,
        dateRangeFilters,
      } as any);
    }

    return ok;
  };

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
    setPage(1);
  };

  const handleColumnFilterChange = (columnId: string, values: string[]) => {
    const apiColumnId = toPayrollDistributionFilterColumnId(columnId);
    setColumnFilters({
      ...columnFilters,
      [apiColumnId]: values,
    });
    setPage(1);
  };

  const handleDateRangeFilterChange = (columnId: string, startDate: string, endDate: string | null) => {
    const apiColumnId = toPayrollDistributionFilterColumnId(columnId);
    setDateRangeFilters({
      ...dateRangeFilters,
      [apiColumnId]: { startDate, endDate },
    });
    setPage(1);
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
    
    // Constants
    title: 'Distribusi Gaji AE',
    detailPathPrefix: '/salary-distribution/detail-ae',
    
    // Store
    approvalStore,
    
    // Actions
    customActions: actions,
    
    // Handlers
    handleDistribusiSlipGaji,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    
    // Selection logic
    isRowSelectable,
  };
}

export default useAEPages;

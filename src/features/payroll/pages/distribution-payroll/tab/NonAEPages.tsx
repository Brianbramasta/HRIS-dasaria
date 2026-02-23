import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import PayrollTabBase from '@/features/payroll/components/tabs/PayrollTabBase';
import { IconFileDetail } from '@/icons/components/icons';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { useApiPayrollPeriodDistribution } from '@/features/payroll/hooks/api/useApiPayrollPeriodDistribution';

const toPayrollDistributionFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    tanggalPengajuan: 'periode',
    statusPersetujuan: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

interface SalaryDistributionData {
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

export default function NonAEPages() {
  const navigate = useNavigate();
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
    setColumnFilters,
    setDateRangeFilters,
  } = useApiPayrollPeriodDistribution();

  useEffect(() => {
    fetchPayrollPeriods({
      page,
      pageSize,
      search,
      sortBy,
      sortOrder: sortOrder ?? undefined,
      columnFilters,
      dateRangeFilters,
    } as any);
  }, [fetchPayrollPeriods, page, pageSize, search, sortBy, sortOrder, columnFilters, dateRangeFilters]);

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
        format: (value) => {
          const statusLower = String(value ?? '').trim().toLowerCase();
          const status = statusLower.includes('selesai')
            ? { text: value, className: 'status-styling bg-green-100 text-green-800' }
            : statusLower.includes('proses')
            ? { text: value, className: 'status-styling bg-yellow-100 text-yellow-800' }
            : { text: value, className: 'status-styling bg-gray-100 text-gray-800' };
          return (
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
              {status.text}
            </span>
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
        icon: <IconFileDetail />,
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
                jabatan: '',
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
              title: 'Slip Gaji Non-AE',
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

    const ok = await sendSlipSalary({ payrollIds });
    if (ok) {
      await fetchPayrollPeriods({
        page,
        pageSize,
        search,
        sortBy,
        sortOrder: sortOrder ?? undefined,
        columnFilters,
        dateRangeFilters,
      } as any);
    }

    return ok;
  };

  return (
    <>
      <PayrollTabBase<SalaryDistributionData>
        resetKey="non-ae"
        rows={rows}
        baseColumns={baseColumns}
        detailPathPrefix="/salary-distribution/detail-non-ae"
        title="Distribusi Gaji Non-AE"
        customActions={actions}
        onFinalize={handleDistribusiSlipGaji}
        isRowSelectable={isRowSelectable}

        loading={loading}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        pageSize={pageSize}
        onSearchChange={(v) => setSearch(v)}
        onSortChange={(columnId, order) => setSort(columnId, order)}
        onPageChangeExternal={(nextPage) => setPage(nextPage)}
        onRowsPerPageChangeExternal={(nextPageSize) => {
          setPageSize(nextPageSize);
          setPage(1);
        }}
        onColumnFilterChange={(columnId, values) => {
          const apiColumnId = toPayrollDistributionFilterColumnId(columnId);
          setColumnFilters({
            ...columnFilters,
            [apiColumnId]: values,
          });
          setPage(1);
        }}
        columnFilters={columnFilters}
        onDateRangeFilterChange={(columnId, startDate, endDate) => {
          const apiColumnId = toPayrollDistributionFilterColumnId(columnId);
          setDateRangeFilters({
            ...dateRangeFilters,
            [apiColumnId]: { startDate, endDate },
          });
          setPage(1);
        }}
        dateRangeFilters={dateRangeFilters}
      />
    </>
  );
}

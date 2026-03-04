import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import PayrollTabBase from '@/features/payroll/components/tabs/PayrollTabBase';
import { IconFileDetail } from '@/icons/components/icons';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { useApiPayrollPeriodDistribution } from '../../../hooks/api/useApiPayrollPeriodDistribution';

interface SalaryDistributionData {
  idKaryawan: string;
  pengguna: string;
  nip: string;
  tanggalPengajuan: string;
  email: string;
  jenisBank: string;
  noRekening: string;
  totalGajiBersih: number;
  kategori: string;
  perusahaan: string;
  statusPersetujuan: 'menunggu' | 'disetujui' | 'ditolak' | 'Selesai';
  // Detail components for THR
  detail?: {
    gajiPokok: number;
    tunjanganTetap: number; // This might be a sum or a header placeholder
    transport: number;
    lamaKerja: number;
    jabatan: number;
    pernikahan: number;
  };
}


export default function THRPages() {
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
    getSlipGajiUrl,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    setColumnFilters,
    setDateRangeFilters,
    setType
  } = useApiPayrollPeriodDistribution();

  // Set type to 'Thr' when component mounts
  useEffect(() => {
    setType('Thr');
  }, [setType]);

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

  const filteredRows = useMemo(() => {
    return payrollPeriods.map((item: any) => ({
      idKaryawan: item.payroll_id,
      pengguna: item.full_name,
      nip: item.employee_id,
      tanggalPengajuan: item.periode || '-',
      email: item.email || '',
      jenisBank: item.bank_name || '',
      noRekening: item.bank_account_number || '',
      totalGajiBersih: item.basic_salary || 0,
      kategori: item.employee_category_name || '',
      perusahaan: item.company_name || '',
      statusPersetujuan: item.payroll_status_name || 'menunggu',
      detail: {
        gajiPokok: item.basic_salary || 0,
        tunjanganTetap: 0,
        transport: 0,
        lamaKerja: 0,
        jabatan: 0,
        pernikahan: 0,
      },
    }));
  }, [payrollPeriods]);


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
        label: 'Total THR',
        minWidth: 140,
        align: 'right',
        format: (value) => formatCurrency(value),
      },
      {
        id: 'lamaKerja',
        label: 'Lama Kerja',
        minWidth: 120,
        align: 'right',
        format: (_value, row) => formatCurrency(row.detail?.lamaKerja ?? 0),
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
        filterOptions: [
          { label: 'Disetujui', value: 'disetujui' },
          { label: 'Menunggu', value: 'menunggu' },
          { label: 'Ditolak', value: 'ditolak' },
          { label: 'Selesai', value: 'Selesai' },
        ],
        format: (value) => {
          const statusMap = {
            disetujui: { text: 'Disetujui', className: 'status-styling bg-green-100 text-green-800' },
            menunggu: { text: 'Menunggu', className: 'status-styling bg-yellow-100 text-yellow-800' },
            ditolak: { text: 'Ditolak', className: 'status-styling bg-red-100 text-red-800' },
            Selesai: { text: 'Selesai', className: 'status-styling bg-blue-100 text-blue-800' },
          };
          const status = statusMap[value as keyof typeof statusMap] || {
            text: value,
            className: 'status-styling bg-gray-100 text-gray-800',
          };
          return (
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
              {status.text}
            </span>
          );
        },
      },
    ],
    []
  );

  const actions: DataTableAction<SalaryDistributionData>[] = useMemo(
    () => [
      {
        icon: <IconFileDetail />,
        onClick: (row) => {
          // Navigate to SlipPayroll page with payrollId parameter
          const slipUrl = getSlipGajiUrl(row.idKaryawan, 'Thr');
          window.open(slipUrl, '_blank');
        },
        variant: 'outline',
        color: 'info',
      },
    ],
    [navigate]
  );


  return (
    <>
      <PayrollTabBase<SalaryDistributionData>
        resetKey="distribution-thr"
        rows={filteredRows}
        baseColumns={baseColumns}
        detailPathPrefix="/salary-distribution/detail-THR"
        title="Distribusi Gaji THR"
        customActions={actions}
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
      />

    </>
  );
}

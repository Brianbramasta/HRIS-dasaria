// Dokumentasi: Tabel "Status Kasbon" menggunakan DataTable
import { DataTable, type DataTableColumn } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { formatCurrencyValue, parseCurrency } from '@/utils/formatCurrency';
import { useStatusCashAdvance } from '@/features/payroll/hooks/cash-advance/useStatusCashAdvance';

type StatusKasbonRow = {
  no?: number;
  idKaryawan: string;
  loanId: string;
  pengguna: string;
  avatar?: string;
  tanggalPengajuan: string;
  posisi: string;
  departemen: string;
  tanggalMulaiPotongan: string;
  tanggalPencairan: string;
  jenisKasbon: string;
  nominalKasbon: string;
  nominalCicilan: string;
  sisaPeriodeCicilan: string;
  periodeCicilan: string;
  statusKasbon: 'Menunggu Cicilan' | 'Selesai' | 'New Cicilan' | 'Masa Cicilan';
  detail?: string;
};

export default function StatusKasbonPage() {
  const {
    rows,
    loading,
    total,
    page,
    pageSize,
    dateRangeFilters,
    columnFilters,
    handleDateRangeFilterChange,
    handleColumnFilterChange,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    navigate,
  } = useStatusCashAdvance();

  // Dokumentasi: definisi kolom tabel sesuai kebutuhan UI
  const columns: DataTableColumn<StatusKasbonRow>[] = [
    {
      id: 'no',
      label: 'No.',
      align: 'center',
      sortable: false,
    },
    { id: 'idKaryawan', label: 'NIP', sortable: true },
    {
      id: 'pengguna',
      label: 'Pengguna',
      sortable: true,
      format: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${value}`}
            alt={value}
            className="h-8 w-8 rounded-full"
          />
          <span>{value}</span>
        </div>
      ),
    },
    { id: 'posisi', label: 'Posisi', sortable: true },
    { id: 'departemen', label: 'Departemen', sortable: true },
    {
      id: 'tanggalMulaiPotongan',
      label: 'Bulan Mulai Potongan',
      sortable: true,
      dateRangeFilter: true,
      format: (val) => formatDateToIndonesian(val) || val
    },
    {
      id: 'tanggalPencairan',
      label: 'Bulan Selesai Potongan',
      sortable: true,
      dateRangeFilter: true,
      format: (val) => formatDateToIndonesian(val) || val
    },
    {
      id: 'nominalCicilan',
      label: 'Sisa Nominal Cicilan',
      align: 'right',
      sortable: true,
      format: (val) => formatCurrencyValue(parseCurrency(val))
    },
    { id: 'sisaPeriodeCicilan', label: 'Sisa Periode Cicilan', sortable: true },
    {
      id: 'statusKasbon',
      label: 'Status Kasbon',
      sortable: true,
      filterOptions: [
        { label: 'Masa Cicilan', value: 'Masa Cicilan' },
        { label: 'Menunggu Cicilan', value: 'Menunggu Cicilan' },
        { label: 'Selesai', value: 'Selesai' },
        { label: 'New Cicilan', value: 'New Cicilan' },
      ],
      format: (value: StatusKasbonRow['statusKasbon']) => {
        const color =
          value === 'Selesai' ? 'bg-success-100 text-success-700' :
            value === 'Menunggu Cicilan' ? 'bg-warning-100 text-warning-700' :
              value === 'Masa Cicilan' ? 'bg-blue-100 text-blue-700' :
                'bg-error-100 text-error-700';
        return <span className={`status-styling inline-flex rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{value}</span>;
      },
    },
    {
      id: 'detail',
      label: 'Detail',
      align: 'center',
      sortable: false,
      format: (_, row) => (
        <button
          onClick={() => navigate(`/cash-advance/detail-status/${row.loanId}`)}
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.06]"
        >
          <IconFileDetail />
        </button>
      ),
    },
  ];

  return (
    <div className="p-0">
      <DataTable
        title="Status Kasbon"
        data={rows}
        columns={columns}
        searchable
        filterable
        loading={loading}
        pageSize={pageSize}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        onSearchChange={setSearch}
        onSortChange={setSort}
        onPageChangeExternal={setPage}
        onRowsPerPageChangeExternal={setPageSize}
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
      />
    </div>
  );
}

// Dokumentasi: Tabel "Status Kasbon" menggunakan DataTable
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type DataTableColumn } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { formatCurrencyValue, parseCurrency } from '@/utils/formatCurrency';

type StatusKasbonRow = {
  no?: number;
  idKaryawan: string;
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
  statusKasbon: 'Menunggu Cicilan' | 'Selesai' | 'New Cicilan';
  detail?: string;
};

type DateRangeFilter = {
  startDate: string;
  endDate: string | null;
};

export default function StatusKasbonPage() {
  const navigate = useNavigate();

  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, DateRangeFilter>>({});
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});

  const handleDateRangeFilterChange = (columnId: string, startDate: string, endDate: string | null) => {
    setDateRangeFilters((prev) => ({
      ...prev,
      [columnId]: { startDate, endDate },
    }));
  };

  const handleColumnFilterChange = (columnId: string, values: string[]) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: values,
    }));
  };

  // Dokumentasi: definisi kolom tabel sesuai kebutuhan UI
  const columns: DataTableColumn<StatusKasbonRow>[] = [
    {
      id: 'no',
      label: 'No.',
      align: 'center',
      sortable: false,
      format: (_, row) => rows.indexOf(row) + 1,
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
    {
      id: 'tanggalPengajuan',
      label: 'Tanggal Pengajuan',
      sortable: true,
      dateRangeFilter: true,
      format: (val) => formatDateToIndonesian(val) || val
    },
    { id: 'posisi', label: 'Posisi', sortable: true },
    { id: 'departemen', label: 'Departemen', sortable: true },
    {
      id: 'tanggalMulaiPotongan',
      label: 'Tanggal Mulai Potongan',
      sortable: true,
      dateRangeFilter: true,
      format: (val) => formatDateToIndonesian(val) || val
    },
    {
      id: 'tanggalPencairan',
      label: 'Tanggal Pencairan',
      sortable: true,
      dateRangeFilter: true,
      format: (val) => formatDateToIndonesian(val) || val
    },
    { id: 'jenisKasbon', label: 'Jenis Kasbon', sortable: true },
    {
      id: 'nominalKasbon',
      label: 'Nominal Kasbon',
      align: 'right',
      sortable: true,
      format: (val) => formatCurrencyValue(parseCurrency(val))
    },
    {
      id: 'nominalCicilan',
      label: 'Nominal Cicilan',
      align: 'right',
      sortable: true,
      format: (val) => formatCurrencyValue(parseCurrency(val))
    },
    { id: 'sisaPeriodeCicilan', label: 'Sisa Periode Cicilan', sortable: true },
    { id: 'periodeCicilan', label: 'Periode Cicilan', sortable: true },
    {
      id: 'statusKasbon',
      label: 'Status Kasbon',
      sortable: true,
      filterOptions: [
        { label: 'Menunggu Cicilan', value: 'Menunggu Cicilan' },
        { label: 'Selesai', value: 'Selesai' },
        { label: 'New Cicilan', value: 'New Cicilan' },
      ],
      format: (value: StatusKasbonRow['statusKasbon']) => {
        const color =
          value === 'Selesai' ? 'bg-success-100 text-success-700' :
            value === 'Menunggu Cicilan' ? 'bg-warning-100 text-warning-700' :
              'bg-error-100 text-error-700';
        return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{value}</span>;
      },
    },
    {
      id: 'detail',
      label: 'Detail',
      align: 'center',
      sortable: false,
      format: (_, row) => (
        <button
          onClick={() => navigate(`/cash-advance/detail/${row.idKaryawan}`)}
          className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.06]"
        >
          <IconFileDetail />
        </button>
      ),
    },
  ];

  // Dokumentasi: contoh data statis untuk tampilan tabel
  const rows: StatusKasbonRow[] = useMemo(() => {
    let filteredData: StatusKasbonRow[] = [
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'TA', departemen: 'HR', tanggalMulaiPotongan: '2023-01-28', tanggalPencairan: '2023-01-28', jenisKasbon: 'Swari', nominalKasbon: '3.000.000', nominalCicilan: '300.000', sisaPeriodeCicilan: '3 bulan', periodeCicilan: '3 bulan', statusKasbon: 'New Cicilan' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'TA', departemen: 'HR', tanggalMulaiPotongan: '2023-01-28', tanggalPencairan: '2023-01-28', jenisKasbon: 'Operasional', nominalKasbon: '10.000.000', nominalCicilan: '1.000.000', sisaPeriodeCicilan: '6 bulan', periodeCicilan: '10 bulan', statusKasbon: 'Selesai' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'HEBP', departemen: 'HR', tanggalMulaiPotongan: '2023-01-28', tanggalPencairan: '2023-01-28', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', sisaPeriodeCicilan: '4 bulan', periodeCicilan: '13 bulan', statusKasbon: 'Selesai' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'HEBP', departemen: 'HR', tanggalMulaiPotongan: '—', tanggalPencairan: '2023-01-28', jenisKasbon: 'Operasional', nominalKasbon: '7.000.000', nominalCicilan: '700.000', sisaPeriodeCicilan: '12 bulan', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Cicilan' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'LND', departemen: 'HR', tanggalMulaiPotongan: '2023-01-28', tanggalPencairan: '2023-01-28', jenisKasbon: 'Swari', nominalKasbon: '3.000.000', nominalCicilan: '300.000', sisaPeriodeCicilan: '3 bulan', periodeCicilan: '3 bulan', statusKasbon: 'New Cicilan' },
    ];

    // Apply date range filters
    Object.entries(dateRangeFilters).forEach(([columnId, range]) => {
      if (range.startDate) {
        const start = new Date(range.startDate);
        const end = range.endDate ? new Date(range.endDate) : null;

        filteredData = filteredData.filter((row: StatusKasbonRow) => {
          const cellValue = row[columnId as keyof StatusKasbonRow];
          if (!cellValue || typeof cellValue !== 'string') return true;

          const cellDate = new Date(cellValue);
          if (isNaN(cellDate.getTime())) return true;

          if (end) {
            return cellDate >= start && cellDate <= end;
          }
          return cellDate >= start;
        });
      }
    });

    // Apply column filters
    Object.entries(columnFilters).forEach(([columnId, values]) => {
      if (values && values.length > 0) {
        filteredData = filteredData.filter((row: StatusKasbonRow) => {
          const cellValue = row[columnId as keyof StatusKasbonRow];
          if (cellValue === undefined || cellValue === null) return false;
          return values.includes(cellValue.toString());
        });
      }
    });

    return filteredData;
  }, [dateRangeFilters, columnFilters]);

  return (
    <div className="p-0">
      <DataTable
        title="Status Kasbon"
        data={rows}
        columns={columns}
        searchable
        filterable
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
      />
    </div>
  );
}

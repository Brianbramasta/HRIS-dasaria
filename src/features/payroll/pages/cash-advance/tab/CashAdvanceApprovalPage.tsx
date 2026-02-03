// Dokumentasi: Tabel "Persetujuan Kasbon" dengan kolom aksi tambahan
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import { CheckCircle, XCircle } from 'react-feather';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import SearchScheduleAndDiscountModal from '@/features/payroll/components/modals/cash-advance/SearchScheduleAndDiscountModal';
import RejectCashAdvanceConfirmationModal from '@/features/payroll/components/modals/cash-advance/RejectCashAdvanceConfirmationModal';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { formatCurrencyValue, parseCurrency } from '@/utils/formatCurrency';

type KasbonApprovalRow = {
  no?: number;
  idKaryawan: string;
  pengguna: string;
  avatar?: string;
  tanggalPengajuan: string;
  posisi: string;
  departemen: string;
  bulanMulaiPotongan: string;
  tanggalPencairan: string;
  jenisKasbon: string;
  nominalKasbon: string;
  nominalCicilan: string;
  periodeCicilan: string;
  statusKasbon: 'Menunggu Persetujuan HR' | 'Disetujui' | 'Ditolak';
  detail?: string;
};

type DateRangeFilter = {
  startDate: string;
  endDate: string | null;
};

export default function CashAdvanceApprovalPage() {
  // Dokumentasi: inisialisasi navigate dan state dropdown
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<KasbonApprovalRow | null>(null);

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
  const columns: DataTableColumn<KasbonApprovalRow>[] = [
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
      id: 'bulanMulaiPotongan',
      label: 'Bulan Mulai Potongan',
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
    { id: 'periodeCicilan', label: 'Periode Cicilan', sortable: true },
    {
      id: 'statusKasbon',
      label: 'Status Kasbon',
      sortable: true,
      filterOptions: [
        { label: 'Menunggu Persetujuan HR', value: 'Menunggu Persetujuan HR' },
        { label: 'Disetujui', value: 'Disetujui' },
        { label: 'Ditolak', value: 'Ditolak' },
      ],
      format: (value: KasbonApprovalRow['statusKasbon']) => {
        const color =
          value === 'Disetujui' ? 'bg-success-100 text-success-700' :
            value === 'Ditolak' ? 'bg-error-100 text-error-700' :
              'bg-warning-100 text-warning-700';
        return <span className={`rounded-full p-[10px] flex justify-center items-center text-center text-xs font-semibold ${color}`}>{value}</span>;
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
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.06]"
        >
          <IconFileDetail />
        </button>
      ),
    },
  ];

  // Dokumentasi: contoh data statis untuk tampilan tabel
  const rows: KasbonApprovalRow[] = useMemo(() => {
    let filteredData: KasbonApprovalRow[] = [
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '2023-01-28', tanggalPencairan: '2023-01-28', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '2023-01-28', tanggalPencairan: '2023-01-28', jenisKasbon: 'Pribadi', nominalKasbon: '8.000.000', nominalCicilan: '600.000', periodeCicilan: '13 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'TA', departemen: 'HR', bulanMulaiPotongan: '2023-01-28', tanggalPencairan: '2023-01-28', jenisKasbon: 'Operasional', nominalKasbon: '1.200.000', nominalCicilan: '150.000', periodeCicilan: '8 bulan', statusKasbon: 'Ditolak' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'HRBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '2023-01-28', jenisKasbon: 'Pribadi', nominalKasbon: '5.000.000', nominalCicilan: '500.000', periodeCicilan: '10 bulan', statusKasbon: 'Disetujui' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'HRBP', departemen: 'HR', bulanMulaiPotongan: '2023-01-28', tanggalPencairan: '2023-01-28', jenisKasbon: 'Operasional', nominalKasbon: '2.500.000', nominalCicilan: '250.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'HRBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '2023-01-28', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'HRBP', departemen: 'HR', bulanMulaiPotongan: '2023-01-28', tanggalPencairan: '2023-01-28', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'HRBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '2023-01-28', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'HRBP', departemen: 'HR', bulanMulaiPotongan: '2023-01-28', tanggalPencairan: '2023-01-28', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
      { idKaryawan: 'DSR999', pengguna: 'Lindsey Curtis', tanggalPengajuan: '2023-01-28', posisi: 'HRBP', departemen: 'HR', bulanMulaiPotongan: '—', tanggalPencairan: '2023-01-28', jenisKasbon: 'Operasional', nominalKasbon: '3.000.000', nominalCicilan: '300.000', periodeCicilan: '10 bulan', statusKasbon: 'Menunggu Persetujuan HR' },
    ];

    // Apply date range filters
    Object.entries(dateRangeFilters).forEach(([columnId, range]) => {
      if (range.startDate) {
        const start = new Date(range.startDate);
        const end = range.endDate ? new Date(range.endDate) : null;

        filteredData = filteredData.filter((row: KasbonApprovalRow) => {
          const cellValue = row[columnId as keyof KasbonApprovalRow];
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
        filteredData = filteredData.filter((row: KasbonApprovalRow) => {
          const cellValue = row[columnId as keyof KasbonApprovalRow];
          if (cellValue === undefined || cellValue === null) return false;
          return values.includes(cellValue.toString());
        });
      }
    });

    return filteredData;
  }, [dateRangeFilters, columnFilters]);

  // Dokumentasi: definisi aksi untuk approve/reject
  const actions: DataTableAction<KasbonApprovalRow>[] = [
    {
      icon: <CheckCircle size={18} />,
      className: 'text-success-600 hover:text-success-700',
      onClick: (row) => {
        console.log('Approve kasbon:', row);
        setSelectedRow(row);
        setIsSearchModalOpen(true);
      },
    },
    {
      icon: <XCircle size={18} />,
      className: 'text-error-600 hover:text-error-700',
      onClick: (row) => {
        console.log('Reject kasbon:', row);
        setSelectedRow(row);
        setIsRejectModalOpen(true);
      },
    },
  ];

  return (
    <div className="p-0">
      <DataTable
        title="Persetujuan Kasbon"
        data={rows}
        columns={columns}
        actions={actions}
        searchable
        filterable
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
        // onExport={() => exportCSV('persetujuan-kasbon.csv', rows)}
        toolbarRightSlot={
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              Persetujuan Kasbon
              <ChevronDown size={16} />
            </Button>
            <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
              <div className="p-2 w-64">
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/cash-advance/submission-history');
                  }}
                >
                  Riwayat Pengajuan Kasbon
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/cash-advance/approval');
                  }}
                >
                  Persetujuan Kasbon
                </button>
              </div>
            </Dropdown>
          </div>
        }
      />

      {isSearchModalOpen && (
        <SearchScheduleAndDiscountModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          data={selectedRow ? {
            nip: selectedRow.idKaryawan,
            namaLengkap: selectedRow.pengguna,
            bulanMulaiPotongan: selectedRow.bulanMulaiPotongan,
            tanggalPencairan: selectedRow.tanggalPencairan
          } : undefined}
          onSave={(data) => {
            console.log('Saving schedule and discount:', data);
            // Implementasikan logic simpan di sini (misal: panggil API)
            setIsSearchModalOpen(false);
          }}
        />
      )}

      {isRejectModalOpen && (
        <RejectCashAdvanceConfirmationModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          data={selectedRow ? {
            nip: selectedRow.idKaryawan,
            nama: selectedRow.pengguna,
            bulanMulaiPotongan: selectedRow.bulanMulaiPotongan,
            tanggalPencairan: selectedRow.tanggalPencairan
          } : undefined}
          onConfirm={(alasan) => {
            console.log('Rejecting kasbon with reason:', alasan);
            // Implementasikan logic reject di sini (misal: panggil API)
            setIsRejectModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

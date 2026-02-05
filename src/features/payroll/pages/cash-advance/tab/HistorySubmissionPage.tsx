// Dokumentasi: Tabel "Riwayat Pengajuan Kasbon" & integrasi modal pengajuan
import { DataTable, type DataTableColumn } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import ShareLinkModal from '@/features/employee/components/modals/sharelink/ShareLinkModal';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
// Dokumentasi: perbaikan casing import untuk menghindari error TS1261
import PengajuanKasbonModal from '@/features/payroll/components/modals/cash-advance/CashAdvanceSubmissionModal';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { formatCurrencyValue, parseCurrency } from '@/utils/formatCurrency';
import { useCashAdvanceHistory } from '@/features/payroll/hooks/cash-advance/useCashAdvanceHistory';

type KasbonRiwayatRow = {
  no?: number;
  idKaryawan: string;
  loanId: string;
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

export default function RiwayatPengajuanPage() {
  const {
    rows,
    loading,
    total,
    page,
    pageSize,
    setSearch,
    setPage,
    setPageSize,
    setSort,

    // Actions & Modals
    isDropdownOpen,
    setIsDropdownOpen,
    submissionModal,
    shareModal,
    handleOpenShare,
    handleOpenFormKasbon,

    // Filters
    dateRangeFilters,
    columnFilters,
    handleDateRangeFilterChange,
    handleColumnFilterChange,

    navigate,
  } = useCashAdvanceHistory();

  // Dokumentasi: definisi kolom tabel sesuai kebutuhan UI
  const columns: DataTableColumn<KasbonRiwayatRow>[] = [
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
      format: (value: KasbonRiwayatRow['statusKasbon']) => {
        const color =
          value === 'Disetujui' ? 'bg-success-100 text-success-700' :
            value === 'Ditolak' ? 'bg-error-100 text-error-700' :
              'bg-warning-100 text-warning-700';
        return <span className={`rounded-full p-[10px] flex justify-center items-center text-center text-xs font-semibold ${color}`}>{value}</span>;
      },
    },
    {
      id: 'rejectionReason',
      label: 'Alasan Penolakkan',
      sortable: true,
      format: (val) => val || '—'
    },
    {
      id: 'detail',
      label: 'Detail',
      align: 'center',
      sortable: false,
      format: (_, row) => (
        <button
          onClick={() => navigate(`/cash-advance/detail/${row.loanId}`)}
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.06]"
        >
          <IconFileDetail />
        </button>
      ),
    },
  ];

  // Dokumentasi: URL share menuju form kasbon
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cash-advance/cash-advance-form` : '/cash-advance/cash-advance-form';

  return (
    <div className="p-0">
      <DataTable
        title="Riwayat Pengajuan"
        data={rows as any}
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
        // onExport={() => exportCSV('riwayat-pengajuan-kasbon.csv', rows)}
        // onAdd={() => submissionModal.openModal()}
        addButtonLabel="Form Pengajuan Kasbon"
        toolbarRightSlot={
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              Riwayat Pengajuan Kasbon
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

      <PengajuanKasbonModal
        isOpen={submissionModal.isOpen}
        onClose={() => submissionModal.closeModal()}
        onShareLink={handleOpenShare}
        onFormKasbon={handleOpenFormKasbon}
      />

      <ShareLinkModal
        isOpen={shareModal.isOpen}
        onClose={() => shareModal.closeModal()}
        link={shareUrl}
        message="Silakan isi form kasbon melalui tautan berikut"
      />
    </div>
  );
}

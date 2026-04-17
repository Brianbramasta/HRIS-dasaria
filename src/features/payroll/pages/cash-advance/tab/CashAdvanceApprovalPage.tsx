import { useMemo } from 'react';
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
import { useCashAdvanceApproval } from '@/features/payroll/hooks/cash-advance/useCashAdvanceApproval';

type KasbonApprovalRow = {
  no?: number;
  employee_id: string;
  loan_id: string;
  full_name: string;
  avatar?: string;
  application_date: string;
  position_name: string;
  department_name: string;
  deduction_start_period: string;
  disbursed_at: string;
  loan_type_name: string;
  nominal_loan: string;
  nominal_installment: string;
  loan_period: string;
  loan_status_name: 'Menunggu Persetujuan FAT' | 'Disetujui' | 'Ditolak';
  rejection_reason?: string;
  detail?: string;
};

export default function CashAdvanceApprovalPage() {
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
    searchModal,
    rejectModal,
    selected,
    handleApproveOpen,
    handleRejectOpen,
    handleClose,
    fetchCashAdvances,

    // Filters
    dateRangeFilters,
    columnFilters,
    handleDateRangeFilterChange,
    handleColumnFilterChange,

    navigate,
  } = useCashAdvanceApproval();

  // Dokumentasi: definisi kolom tabel sesuai kebutuhan UI
  const columns: DataTableColumn<KasbonApprovalRow>[] = [
    {
      id: 'no',
      label: 'No.',
      align: 'center',
      sortable: false,
    },
    { id: 'employee_id', label: 'NIP', sortable: true },
    {
      id: 'full_name',
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
      id: 'application_date',
      label: 'Tanggal Pengajuan',
      sortable: true,
      dateRangeFilter: true,
      format: (val) => formatDateToIndonesian(val) || val
    },
    { id: 'position_name', label: 'Posisi', sortable: true },
    { id: 'department_name', label: 'Departemen', sortable: true },
    {
      id: 'deduction_start_period',
      label: 'Bulan Mulai Potongan',
      sortable: true,
      dateRangeFilter: true,
      format: (val) => formatDateToIndonesian(val) || val
    },
    {
      id: 'disbursed_at',
      label: 'Tanggal Pencairan',
      sortable: true,
      dateRangeFilter: true,
      format: (val) => formatDateToIndonesian(val) || val
    },
    { id: 'loan_type_name', label: 'Jenis Kasbon', sortable: true },
    {
      id: 'nominal_loan',
      label: 'Nominal Kasbon',
      align: 'right',
      sortable: true,
      format: (val) => formatCurrencyValue(parseCurrency(val))
    },
    {
      id: 'nominal_installment',
      label: 'Nominal Cicilan',
      align: 'right',
      sortable: true,
      format: (val) => formatCurrencyValue(parseCurrency(val))
    },
    { id: 'loan_period', label: 'Periode Cicilan', sortable: true },
    {
      id: 'loan_status_name',
      label: 'Status Kasbon',
      sortable: true,
      filterOptions: [
        { label: 'Menunggu Persetujuan HR', value: 'Menunggu Persetujuan HR' },
        { label: 'Disetujui', value: 'Disetujui' },
        { label: 'Ditolak', value: 'Ditolak' },
      ],
      format: (value: KasbonApprovalRow['loan_status_name']) => {
        const color =
          value === 'Disetujui' ? 'bg-success-100 text-success-700' :
            value === 'Ditolak' ? 'bg-error-100 text-error-700' :
              'bg-warning-100 text-warning-700';
        return <span className={`rounded-full p-[10px] flex justify-center items-center text-center text-xs font-semibold ${color}`}>{value}</span>;
      },
    },
    {
      id: 'rejection_reason',
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
          onClick={() => navigate(`/cash-advance/detail/${row.loan_id}`)}
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.06]"
        >
          <IconFileDetail />
        </button>
      ),
    },
  ];

  // Dokumentasi: definisi aksi untuk approve/reject
  const actions: DataTableAction<KasbonApprovalRow>[] = [
    {
      icon: <XCircle size={18} />,
      className: 'text-error-600 hover:text-error-700',
      onClick: (row) => handleRejectOpen((row as any).raw),
      condition: (row) => row.loan_status_name === 'Menunggu Persetujuan FAT',
    },
    {
      icon: <CheckCircle size={18} />,
      className: 'text-success-600 hover:text-success-700',
      onClick: (row) => handleApproveOpen((row as any).raw),
      condition: (row) => row.loan_status_name === 'Menunggu Persetujuan FAT',
    },
    {
      label: 'Disetujui',
      icon: <CheckCircle size={18} />,
      variant: 'custom',
      className: 'text-success-600 font-bold flex items-center gap-2 cursor-default pointer-events-none p-0',
      onClick: () => { },
      condition: (row) => row.loan_status_name === 'Disetujui',
    },
    {
      label: 'Ditolak',
      icon: <XCircle size={18} />,
      variant: 'custom',
      className: 'text-error-600 font-bold flex items-center gap-2 cursor-default pointer-events-none p-0',
      onClick: () => { },
      condition: (row) => row.loan_status_name === 'Ditolak',
    },
  ];

  // Dokumentasi: Stabilkan referensi data modal agar tidak memicu reset pada hook modal
  const modalData = useMemo(() => {
    if (!selected) return undefined;
    return {
      loanId: selected.loanId,
      nip: selected.employeeId,
      namaLengkap: selected.fullName,
      nama: selected.fullName, // Untuk Reject modal yang menggunakan key 'nama'
      bulanMulaiPotongan: '', // Gunakan string kosong agar bisa diproses DatePicker
      tanggalPencairan: selected.disbursedAt || ''
    };
  }, [selected]);

  return (
    <div className="p-0">
      <DataTable
        title="Persetujuan Kasbon"
        data={rows as any}
        columns={columns}
        actions={actions}
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

      {searchModal.isOpen && (
        <SearchScheduleAndDiscountModal
          isOpen={searchModal.isOpen}
          onClose={handleClose}
          data={modalData as any}
          onSuccess={() => fetchCashAdvances()}
        />
      )}

      {rejectModal.isOpen && (
        <RejectCashAdvanceConfirmationModal
          isOpen={rejectModal.isOpen}
          onClose={handleClose}
          data={modalData as any}
          onSuccess={() => fetchCashAdvances()}
        />
      )}
    </div>
  );
}

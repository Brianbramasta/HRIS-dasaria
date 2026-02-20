import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import { useApiPayrollPeriod } from '../../../hooks/api/useApiPayrollPeriod';
import { PayrollPeriodListItem } from '../../../types/dto/PayrollPeriodType';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateToIndonesian } from '@/utils/formatDate';

const toPayrollPeriodFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    tanggalPengajuan: 'periode',
    statusPenggajian: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

type NonAERow = {
  no?: number;
  payrollId: string;
  idKaryawan: string;
  pengguna: string;
  tanggalPengajuan: string;
  jumlahHariKerja: string;
  totalGajiBersih: string;
  gajiPokokUangSaku: string;
  potongan: string;
  tunjanganTetap: string;
  tunjanganTidakTetap: string;
  kategori: string;
  perusahaan: string;
  statusPenggajian: string;
};

// Mapping helper from PayrollPeriodListItem to NonAERow
const mapPayrollPeriodToNonAERow = (item: PayrollPeriodListItem, index: number): NonAERow => ({
  no: index + 1,
  payrollId: item.payrollId,
  idKaryawan: item.employeeId,
  pengguna: item.fullName,
  tanggalPengajuan: item.periode,
  jumlahHariKerja: String(item.workingDays),
  totalGajiBersih: item.netSalary,
  gajiPokokUangSaku: String(item.basicSalary),
  potongan: String(item.deductionTotal),
  tunjanganTetap: String(item.allowanceTotal),
  tunjanganTidakTetap: String(item.nonFixedAllowanceTotal),
  kategori: item.employeeCategoryName,
  perusahaan: item.companyName,
  statusPenggajian: item.payrollStatusName,
});

export default function NonAETab({ resetKey = 'non-ae' }: { resetKey?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<string>('Persetujuan oleh FAT');

  // Hook untuk fetch data payroll period
  const {
    payrollPeriods,
    fetchPayrollPeriods,
    approvalHr,
    importApprovalStatus,
    fetchImportApprovalStatus,
    loading,
    total,
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    columnFilters,
    dateRangeFilters,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    setColumnFilters,
    setDateRangeFilters,
  } = useApiPayrollPeriod();

  // Dokumentasi: Deteksi halaman Approval atau Distribusi untuk set judul
  const isApprovalPage = location.pathname.includes('/payroll-period-approval');
  const isDistribusiPage = location.pathname.includes('/salary-distribution');
  const basePrefix = isApprovalPage ? '/payroll-period-approval' : '/payroll-period';
  // Dokumentasi: Gunakan prefix detail khusus distribusi saat di halaman Distribusi
  const detailPathPrefix = isDistribusiPage ? '/salary-distribution/detail-non-ae' : `${basePrefix}/detail-non-ae`;
  const title = isApprovalPage ? 'Approval Periode Gajian' : isDistribusiPage ? 'Distribusi Slip Gaji' : 'Periode Gajian';

  // Dokumentasi: Fungsi untuk navigasi detail dengan approval type sebagai query parameter
  const handleDetailNavigation = (payrollId: string) => {
    navigate(`${detailPathPrefix}/${payrollId}?approvalType=${encodeURIComponent(approvalType)}`);
  };

  // Dokumentasi: Fetch data saat component mount dan reset key berubah
  useEffect(() => {
    setPage(1);
    setPageSize(10);
    setSearch('');
    setSort('', 'asc');
    setColumnFilters({});
    setDateRangeFilters({});
  }, [resetKey, setPage, setPageSize, setSearch, setSort, setColumnFilters, setDateRangeFilters]);

  useEffect(() => {
    fetchPayrollPeriods({ page, pageSize, search, sortBy, sortOrder });
  }, [page, pageSize, search, sortBy, sortOrder, columnFilters, dateRangeFilters, fetchPayrollPeriods]);

  useEffect(() => {
    fetchImportApprovalStatus();
  }, [fetchImportApprovalStatus]);

  // Map PayrollPeriodListItem to NonAERow
  const rows: NonAERow[] = payrollPeriods.map((item, index) => mapPayrollPeriodToNonAERow(item, index));

  const baseColumns: DataTableColumn<NonAERow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'idKaryawan', label: 'NIP' },
    { id: 'pengguna', label: 'Pengguna' },
    {
      id: 'tanggalPengajuan',
      label: 'Tanggal Pengajuan',
      dateRangeFilter: true,
      format: (v) => formatDateToIndonesian(String(v)),
    },
    { id: 'jumlahHariKerja', label: 'Jumlah Hari Kerja' },
    { id: 'totalGajiBersih', label: 'Total Gaji Bersih', align: 'right', format: (v) => formatCurrency(Number(v)) },
    { id: 'gajiPokokUangSaku', label: 'Gaji Pokok / Uang Saku', align: 'right', format: (v) => formatCurrency(Number(v)) },
    { id: 'potongan', label: 'Potongan', align: 'right', format: (v) => formatCurrency(Number(v)) },
    { id: 'tunjanganTetap', label: 'Tunjangan Tetap', align: 'right', format: (v) => formatCurrency(Number(v)) },
    { id: 'tunjanganTidakTetap', label: 'Tunjangan Tidak Tetap', align: 'right', format: (v) => formatCurrency(Number(v)) },
    { id: 'kategori', label: 'Kategori' },
    { id: 'perusahaan', label: 'Perusahaan' },
    {
      id: 'statusPenggajian',
      label: 'Status Penggajian',
      filterOptions: [
        { label: 'Menunggu Maker', value: 'Menunggu Maker' },
        { label: 'Menunggu Checker', value: 'Menunggu Checker' },
        { label: 'Menunggu Approver', value: 'Menunggu Approver' },
        { label: 'Distribusi', value: 'Distribusi' },
        { label: 'Selesai', value: 'Selesai' },
      ],
      format: (v) => {
        const value = String(v ?? '');
        const lowered = value.toLowerCase();

        const badgeClass = lowered.includes('menunggu')
          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200'
          : lowered.includes('selesai')
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
          : lowered.includes('distribusi')
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200';

        return (
          <span className={`rounded-full p-[10px] flex justify-center text-center text-xs status-styling ${badgeClass}`}>
            {value}
          </span>
        );
      },
    },
  ];

  return (
    <PenggajianTabBase
      resetKey={resetKey}
      rows={rows}
      baseColumns={baseColumns}
      detailPathPrefix={detailPathPrefix}
      title={title}
      onDetailNavigation={handleDetailNavigation}
      isRowSelectable={(row) => String(row.statusPenggajian ?? '').toLowerCase().trim() === 'menunggu maker'}
      canEditDelete={(row) => String(row.statusPenggajian ?? '').toLowerCase().trim() === 'menunggu maker'}
      disableImportButton={!!importApprovalStatus?.is_import_pending}
      disableFinalizeButton={!!importApprovalStatus?.is_approval_hr_pending}
      disableSelection={!!importApprovalStatus?.is_approval_hr_pending}
      loading={loading}
      pageSize={pageSize}
      useExternalPagination={true}
      externalPage={page}
      externalTotal={total}
      onSearchChange={(search) => {
        setSearch(search);
      }}
      onSortChange={(columnId, order) => {
        setSort(columnId, order);
      }}
      onPageChangeExternal={(newPage) => {
        setPage(newPage);
      }}
      onRowsPerPageChangeExternal={(newRowsPerPage) => {
        setPageSize(newRowsPerPage);
      }}
      onColumnFilterChange={(columnId, values) => {
        const apiColumnId = toPayrollPeriodFilterColumnId(columnId);
        setColumnFilters({
          ...columnFilters,
          [apiColumnId]: values,
        });
      }}
      columnFilters={columnFilters}
      onDateRangeFilterChange={(columnId, startDate, endDate) => {
        const apiColumnId = toPayrollPeriodFilterColumnId(columnId);
        setDateRangeFilters({
          ...dateRangeFilters,
          [apiColumnId]: { startDate, endDate },
        });
      }}
      dateRangeFilters={dateRangeFilters}
      onFinalize={async (selectedRows) => {
        const isSelectAll = (selectedRows?.length ?? 0) > 0 && (selectedRows?.length ?? 0) === rows.length;
        if (isSelectAll) {
          const ok = await approvalHr({ payrollIds: [], all: true });
          if (ok) {
            await fetchPayrollPeriods({ page, pageSize });
          }
          return ok;
        }

        const payrollIds = Array.from(
          new Set(
            (selectedRows || [])
              .map((r) => r.payrollId)
              .filter((id): id is string => Boolean(id))
          )
        );

        if (!payrollIds.length) return false;

        const ok = await approvalHr({ payrollIds });
        if (ok) {
          await fetchPayrollPeriods({ page, pageSize });
        }
        return ok;
      }}
      toolbarRightSlot={
        isApprovalPage && (
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              {approvalType}
              <ChevronDown size={16} />
            </Button>
            <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
              <div className="p-2 w-64">
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setApprovalType('Persetujuan oleh FAT');
                    setIsDropdownOpen(false);
                  }}
                >
                  Persetujuan oleh FAT
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setApprovalType('Persetujuan oleh Direktur HRGA');
                    setIsDropdownOpen(false);
                  }}
                >
                  Persetujuan oleh Direktur HRGA
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setApprovalType('Persetujuan oleh BOD');
                    setIsDropdownOpen(false);
                  }}
                >
                  Persetujuan oleh BOD
                </button>
              </div>
            </Dropdown>
          </div>
        )
      }
    />
  );
}

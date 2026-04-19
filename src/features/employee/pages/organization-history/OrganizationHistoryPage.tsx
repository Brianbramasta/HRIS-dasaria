import { DataTable, DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { OrganizationChangeListItem } from '@/features/employee/types/dto/OrganizationChangeType';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconFileDetail } from '@/icons/components/icons';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { formatImage } from '@/utils/formatImage';
import { useOrganizationHistoryLogic } from '@/features/employee/hooks/organization-history/useOrganizationHistoryLogic';

type OrgHistoryListRow = OrganizationChangeListItem & { statusPerubahan: string };

export default function OrganizationHistoryPage() {
  const navigate = useNavigate();
  
  const {
    isDropdownOpen,
    data,
    loading,
    pagination,
    rowsWithStatus,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleDropdownToggle,
    handleDropdownClose,
    handleNavigateToHR,
    handleNavigateToAtasan,
    columnFilters,
    dateRangeFilters,
  } = useOrganizationHistoryLogic();

  // Define columns
  const columns: DataTableColumn<OrgHistoryListRow>[] = useMemo(
    () => [
      { id: 'no', label: 'No.', align: 'center', format: (_v, row) => Array.isArray(data) ? data.findIndex((r) => r.id === row.id) + 1 : 1 },
      { id: 'employee_id', label: 'NIP' },
      {
        id: 'employee_name',
        label: 'Pengguna',
        format: (_v, row) => (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full overflow-hidden">
              {formatImage(null, row.employee_name || 'User')}
            </div>
            <span>{row.employee_name || '-'}</span>
          </div>
        ),
      },
      { id: 'change_type_name', label: 'Jenis Perubahan' },
      { id: 'effective_date', label: 'Tanggal Efektif', dateRangeFilter: true, format: (v: string) => formatDateToIndonesian(v || '') },
      {
        id: 'statusPerubahan',
        label: 'Status Perubahan',
        align: 'center',
        filterOptions: [
          { label: 'Rekomendasi', value: 'Rekomendasi' },
          { label: 'Upload Dokumen', value: 'Upload Dokumen' },
          { label: 'Selesai', value: 'Selesai' },
        ],
        format: (v: string) => {
          const val = (v as string) || '-';
          // Basic styling for different statuses
          let cls = 'bg-gray-100 text-gray-600';
          if (val.toLowerCase().includes('approv') || val.toLowerCase() === 'selesai') cls = 'bg-green-100 text-green-600';
          else if (val.toLowerCase().includes('reject')) cls = 'bg-red-100 text-red-600';
          else if (val.toLowerCase().includes('rekom') || val.toLowerCase().includes('pending')) cls = 'bg-orange-100 text-orange-600';
          
          const base = ' rounded-full p-[10px] flex justify-center text-xs font-medium';
          return <span className={`${base} ${cls}`}>{val}</span>;
        },
      },
    ],
    [data]
  );

  // Define actions
  const actions: DataTableAction<OrgHistoryListRow>[] = useMemo(
    () => [
      {
        icon: <IconFileDetail />,
        className: 'text-gray-700',
        // condition: (row) => Boolean((row as any)?.decree_file),
        onClick: (row) => {
          // //console.log(row);
          // return;
          // navigate(`/organization-history/preview?id=${row.id}`);
          navigate(`/organization-history/detail?id=${row.id}`);
        },
      },
      // {
      //   icon: <IconPencil />,
      //   className: 'text-gray-700',
      //   condition: (row) => !(row as any)?.decree_file,
      //   onClick: (row) => {
      //     handleEditOrganization(row);
      //   },
      // }
    ],
    [navigate]
  );

  return (
    <div className="p-4">
      <DataTable
        title="Perubahan Organisasi"
        resetKey='OrganizationHistory'
        data={rowsWithStatus}
        columns={columns}
        actions={actions}
        pageSize={pagination.perPage}
        loading={loading}
        filterable
        useExternalPagination
        externalPage={pagination.currentPage}
        externalTotal={pagination.total}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
        emptyMessage="Belum ada perubahan organisasi"
        addButtonLabel="Tambah Organisasi"
        onAdd={() => navigate('/organization-history/create')}
        searchPlaceholder="Cari berdasarkan kata kunci"
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        toolbarRightSlot={
          <div className="relative">
            <Button
              onClick={handleDropdownToggle}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              Riwayat Organisasi Karyawan (HR)
              <ChevronDown size={16} />
            </Button>
            <Dropdown isOpen={isDropdownOpen} onClose={handleDropdownClose}>
              <div className="p-2 w-64">
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleNavigateToHR}
                >
                  Riwayat Organisasi Karyawan (HR)
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleNavigateToAtasan}
                >
                  Riwayat Organisasi & Rekomendasi (Atasan)
                </button>
              </div>
            </Dropdown>
          </div>
        }
      />
    </div>
  );
}

import { useMemo } from 'react';
import { formatDateToIndonesian } from '@/utils/formatDate';
import type { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import { useOrganizationHistory, type OrgHistoryRow } from '@/features/employee/hooks/employee-data/detail/contract/useOrganizationHistory';
// import { formatUrlFile } from '@/utils/formatUrlFile';
import { handleViewFileByUrl } from '@/utils/viewFileHandle';

export function useOrganizationHistoryTab(employeeId?: string) {
  const {
    rows,
    loading,
    total,
    page,
    limit,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    columnFilters,
    dateRangeFilters,
  } = useOrganizationHistory(employeeId, {
    initialPage: 1,
    initialLimit: 10,
    autoFetch: true,
    resetKey: 'riwayat-organisasi',
  });

  const columns: DataTableColumn<OrgHistoryRow>[] = useMemo(
    () => [
      { 
        id: 'no', 
        label: 'No.', 
        align: 'center', 
        format: (_, row) => { 
          const index = rows.findIndex((r) => r.id === row.id) + 1 + (page - 1) * limit;
          return index;
        }, 
        sortable: false 
      },
      { 
        id: 'change_type_name', 
        label: 'Jenis Perubahan',
        sortable: true,
        filterOptions: [
          { label: 'Promosi', value: 'Promosi' },
          { label: 'Mutasi', value: 'Mutasi' },
          { label: 'Demosi', value: 'Demosi' },
          { label: 'Rotasi', value: 'Rotasi' },
        ],
      },
      { 
        id: 'effective_date', 
        label: 'Tanggal Efektif', 
        format: (_, row) => formatDateToIndonesian(row.new_position?.effective_date),
        sortable: true,
        dateRangeFilter: true,
      },
      { 
        id: 'old_company', 
        label: 'Perusahaan Lama', 
        format: (_, row) => row.previous_position?.company || '',
        sortable: true 
      },
      { 
        id: 'new_company', 
        label: 'Perusahaan Baru', 
        format: (_, row) => row.new_position?.company || '',
        sortable: true 
      },
      { 
        id: 'old_directorate', 
        label: 'Direktorat Lama', 
        format: (_, row) => row.previous_position?.directorate || '',
        sortable: true 
      },
      { 
        id: 'new_directorate', 
        label: 'Direktorat Baru', 
        format: (_, row) => row.new_position?.directorate || '',
        sortable: true 
      },
      { 
        id: 'old_rank_position', 
        label: 'Posisi Lama', 
        format: (_, row) => row.previous_position?.rank_position || '',
        sortable: true 
      },
      { 
        id: 'new_rank_position', 
        label: 'Posisi Baru', 
        format: (_, row) => row.new_position?.rank_position || '',
        sortable: true 
      },
      { 
        id: 'old_division', 
        label: 'Divisi Lama', 
        format: (_, row) => row.previous_position?.division || '',
        sortable: true 
      },
      { 
        id: 'new_division', 
        label: 'Divisi Baru', 
        format: (_, row) => row.new_position?.division || '',
        sortable: true 
      },
      { 
        id: 'old_department', 
        label: 'Departemen Lama', 
        format: (_, row) => row.previous_position?.department || '',
        sortable: true 
      },
      { 
        id: 'new_department', 
        label: 'Departemen Baru', 
        format: (_, row) => row.new_position?.department || '',
        sortable: true 
      },
      { 
        id: 'old_unit', 
        label: 'Unit Lama', 
        format: (_, row) => row.previous_position?.unit || '-',
        sortable: true 
      },
      { 
        id: 'new_unit', 
        label: 'Unit Baru', 
        format: (_, row) => row.new_position?.unit || '-',
        sortable: true 
      },
      { 
        id: 'old_structural_position', 
        label: 'Jabatan Struktural Lama', 
        format: (_, row) => row.previous_position?.structural_position || '',
        sortable: true 
      },
      { 
        id: 'new_structural_position', 
        label: 'Jabatan Struktural Baru', 
        format: (_, row) => row.new_position?.structural_position || '',
        sortable: true 
      },
      { 
        id: 'old_position_level', 
        label: 'Jenjang Jabatan Lama', 
        format: (_, row) => row.previous_position?.position_level || '',
        sortable: true 
      },
      { 
        id: 'new_position_level', 
        label: 'Jenjang Jabatan Baru', 
        format: (_, row) => row.new_position?.position_level || '',
        sortable: true 
      },
      { 
        id: 'old_employee_category', 
        label: 'Kategori Karyawan Lama', 
        format: (_, row) => row.previous_position?.employee_category || '',
        sortable: true 
      },
      { 
        id: 'new_employee_category', 
        label: 'Kategori Karyawan Baru', 
        format: (_, row) => row.new_position?.employee_category || '',
        sortable: true 
      },
      { 
        id: 'reason_change', 
        label: 'Alasan Perubahan', 
        sortable: true 
      },
      { 
        id: 'decree_file', 
        label: 'Detail SK', 
        sortable: false, 
        format: (v) => v!=null?<span onClick={() => handleViewFileByUrl(v)} className="cursor-pointer flex items-center justify-center"><IconFileDetail /></span> : null 
      },
      { 
        id: 'adendum_file', 
        label: 'Detail Adendum', 
        sortable: false, 
        format: (v) => v!=null?<span onClick={() => handleViewFileByUrl(v)} className="cursor-pointer flex items-center justify-center"><IconFileDetail /></span> : null 
      },
    ],
    [rows, page, limit],
  );

  const actions: DataTableAction<OrgHistoryRow>[] = [
    // {
    //   variant: 'outline',
    //   icon: <IconFileDetail />,
    //   condition: (row) => Boolean((row as any)?.decree_file),
    //   onClick: (row) => {
    //     window.open(formatUrlFile((row as any)?.decree_file) || '', '_blank');
    //   },
    // },
  ];

  return { 
    rows, 
    columns, 
    actions,
    loading,
    total,
    page,
    limit,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    columnFilters,
    dateRangeFilters,
  };
}


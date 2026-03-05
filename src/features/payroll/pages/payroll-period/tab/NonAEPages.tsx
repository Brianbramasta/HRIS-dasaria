import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';
import useNonAEPages from '../../../hooks/pages/payroll-period/useNonAEPages';
import { NonAERow } from '../../../hooks/pages/payroll-period/useNonAEPages';
import { IconFileDetail, IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import React from 'react';


export default function NonAETab({ }: { resetKey?: string }) {
  const navigate = useNavigate();
  const {
    rows,
    baseColumns: baseColumnsFromHook,
    loading,
    pageSize,
    page,
    total,
    columnFilters,
    dateRangeFilters,
    title,
    detailPathPrefix,
    approvalStore,
    handleDetailNavigation,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleFinalize,
    isRowSelectable,
    canEditDelete,
  } = useNonAEPages();

  // Add format function for status column
  const baseColumns: DataTableColumn<NonAERow>[] = baseColumnsFromHook.map(col => {
    if (col.id === 'statusPenggajian') {
      return {
        ...col,
        format: (v: any) => {
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
      };
    }
    return col;
  });

  const actions: DataTableAction<NonAERow>[] = useMemo(
    () => [
      {
        icon: React.createElement(IconFileDetail),
        onClick: (row) => {
          navigate(`${detailPathPrefix}/${row.payrollId}?approvalType=${encodeURIComponent('Persetujuan oleh Direktur HRGA')}`);
        },
        variant: 'outline',
        color: 'info',
        condition: (row) => !row.statusPenggajian.toLowerCase().includes('menunggu maker'),
      },
      {
        icon: <Edit />,
        onClick: (row) => {
          navigate(`${detailPathPrefix}/${row.payrollId}`);
        },
        condition: (row) => {
          const editableStatuses = ['Menunggu Maker'];
          return editableStatuses.includes(row.statusPenggajian);
        },
        variant: 'outline',
        className: 'border-0',
      },
      {
        icon: <Trash />,
        onClick: (row) => {
          // This would need to be handled by the parent component
          console.log('Delete action for:', row);
        },
        condition: (row) => {
          const editableStatuses = ['Menunggu Maker'];
          return editableStatuses.includes(row.statusPenggajian);
        },
        variant: 'outline',
        className: 'border-0',
        color: 'error',
      },
    ],
    [navigate, detailPathPrefix]
  );

  return (
    <PenggajianTabBase
      resetKey="payroll-period-non-ae"
      rows={rows}
      baseColumns={baseColumns}
      detailPathPrefix={detailPathPrefix}
      title={title}
      onDetailNavigation={handleDetailNavigation}
      customActions={actions}
      isRowSelectable={isRowSelectable}
      canEditDelete={canEditDelete}
      disableImportButton={approvalStore.isImportDisabled()}
      disableFinalizeButton={approvalStore.isFinalizeDisabled()}
      disableSelection={approvalStore.isSelectionDisabled()}
      loading={loading}
      pageSize={pageSize}
      useExternalPagination={true}
      externalPage={page}
      externalTotal={total}
      onSearchChange={handleSearchChange}
      onSortChange={handleSortChange}
      onPageChangeExternal={handlePageChange}
      onRowsPerPageChangeExternal={handleRowsPerPageChange}
      onColumnFilterChange={handleColumnFilterChange}
      columnFilters={columnFilters}
      onDateRangeFilterChange={handleDateRangeFilterChange}
      dateRangeFilters={dateRangeFilters}
      onFinalize={handleFinalize}
      templateType="Staff"
    />
  );
}

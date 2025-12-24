// Dokumentasi: Menambahkan dukungan slot toolbar atas (toolbarRightSlotAtas) untuk kustomisasi tombol Import/Download Template,
// fallback ke tombol default (Ekspor & Tambah) menggunakan onExport dan onAdd bila slot tidak disediakan.
// Dokumentasi: Menambahkan toolbarLeftSlotAtas agar layout atas bisa menempatkan input di kiri
// Dokumentasi: Menambahkan column filter support dengan filterOptions untuk menampilkan icon filter di header kolom tertentu
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../ui/table';
import PaginationWithIcon from '../../tables/DataTables/TableOne/PaginationWithIcon';
import Button from '../../ui/button/Button';
import { Plus } from 'react-feather';
import { FilterLineIcon } from '../../../icons/index';
import { IconExport, IconColumnFilter, IconCalendarFilter } from '@/icons/components/icons';
import { useFilterModal } from '../../../hooks/datatable/useFilterModal';
import { useExportModal } from '../../../hooks/datatable/useExportModal';
import { useDatatable } from '../../../hooks/datatable/useDatatable';
import { FilterModal } from '../../../features/structure-and-organize/components/modals/FilterModal';
import { ExportModal } from '../../../features/structure-and-organize/components/modals/ExportModal'
import { ColumnFilterPopup, ColumnFilterOption } from './filter-column/ColumnFilterPopup';
import { DateRangeFilterPopup } from './filter-column/DateRangeFilterPopup';

// Dokumentasi: Menambahkan headerFormat untuk custom header cell (contoh: checkbox check-all)
// Dokumentasi: Menambahkan filterOptions untuk kolom yang mendukung filter dropdown
export interface DataTableColumn<T = any> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any, row: T) => React.ReactNode;
  headerFormat?: () => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  isAction?: boolean;
  filterOptions?: ColumnFilterOption[];
  dateRangeFilter?: boolean;
}

export interface DataTableAction<T = any> {
  label?: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  variant?: 'text' | 'outline' | 'primary';
  condition?: (row: T) => boolean;
  className?: string;
}

interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  secondaryActions?: DataTableAction<T>[];
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  onAdd?: () => void;
  addButtonLabel?: string;
  addButtonIcon?: React.ReactNode;
  onExport?: () => void;
  exportButtonLabel?: string;
  filterable?: boolean;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  // External callbacks to trigger refetches or synchronize state
  onSearchChange?: (search: string) => void;
  onSortChange?: (columnId: string, order: 'asc' | 'desc') => void;
  onPageChangeExternal?: (page: number) => void;
  onRowsPerPageChangeExternal?: (rowsPerPage: number) => void;
  onColumnVisibilityChange?: (visibleColumnIds: string[]) => void;
  // Use resetKey to force resetting internal filters when parent context changes (e.g., tab switch)
  resetKey?: string;
  onFilter?: (filter: string) => void;
  toolbarRightSlot?: React.ReactNode;
  // Dokumentasi: Slot toolbar kanan di bagian atas (sejajar judul). Jika tidak ada, tampilkan default onExport & onAdd.
  toolbarRightSlotAtas?: React.ReactNode;
  // Dokumentasi: Slot toolbar kiri di bagian atas (di kiri sejajar tombol kanan)
  toolbarLeftSlotAtas?: React.ReactNode;
  // Dokumentasi: Mode render tombol default (Ekspor/Tambah) bersama slot atas kustom.
  // Jika true, tampilkan tombol default dan konten slot berdampingan.
  appendDefaultToolbarRightAtas?: boolean;
  // External pagination support (server-side)
  useExternalPagination?: boolean;
  externalPage?: number;
  externalTotal?: number;
  isNewLine?: boolean;
  // Column filter callbacks
  onColumnFilterChange?: (columnId: string, values: string[]) => void;
  columnFilters?: Record<string, string[]>;
  // Date range filter callbacks
  onDateRangeFilterChange?: (columnId: string, startDate: string, endDate: string | null) => void;
  dateRangeFilters?: Record<string, { startDate: string; endDate: string | null }>;
}

export function DataTable<T = any>({
  data,
  columns,
  actions,
  secondaryActions,
  title,
  // searchable = true,
  searchPlaceholder = 'Cari berdasarkan kata kunci',
  pageSize = 10,
  pageSizeOptions = [2, 5, 10, 25, 50],
  onAdd,
  addButtonLabel,
  addButtonIcon,
  onExport,
  exportButtonLabel = 'Ekspor',
  filterable = true,
  className = '',
  loading = false,
  emptyMessage = 'No data available',
  onSearchChange,
  onSortChange,
  onPageChangeExternal,
  onRowsPerPageChangeExternal,
  onColumnVisibilityChange,
  resetKey,
  toolbarRightSlot,
  toolbarRightSlotAtas,
  toolbarLeftSlotAtas,
  appendDefaultToolbarRightAtas = false,
  useExternalPagination = false,
  externalPage,
  externalTotal,
  isNewLine = false,// Jika true, judul akan ditampilkan di baris baru
  onColumnFilterChange,
  columnFilters = {},
  onDateRangeFilterChange,
  dateRangeFilters = {},
}: DataTableProps<T>) {
  
  // Use custom hook for all business logic
  const {
    page,
    rowsPerPage,
    searchTerm,
    visibleColumns,
    sortedData,
    paginatedData,
    displayColumns,
    totalPages,
    paginationInfo,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearchChange,
    handleSearchSubmit,
    getSortIcon,
    setVisibleColumns,
    activeFilterColumn,
     filterIconRefs,
    dateRangeIconRefs,
    filterAnchorEl,
    handleFilterIconClick,
    handleColumnFilterApply,
    handleColumnFilterReset,
    handleFilterPopupClose,
    activeDateRangeColumn,
    dateRangeAnchorEl,
    handleDateRangeIconClick,
    handleDateRangeFilterApply,
    handleDateRangeFilterReset,
    handleDateRangePopupClose,
  } = useDatatable({
    data,
    columns,
    pageSize,
    resetKey,
    onSearchChange,
    onSortChange,
    onPageChangeExternal,
    onRowsPerPageChangeExternal,
    onColumnVisibilityChange,
    useExternalPagination,
    externalPage,
    externalTotal,
    onColumnFilterChange,
    columnFilters,
    onDateRangeFilterChange,
    dateRangeFilters

  });

  // Filter Modal Hook
  const filterModalHook = useFilterModal({
    columns,
    title,
    resetKey,
    visibleColumns,
    onColumnVisibilityChange,
  });

  // Export Modal Hook (must be after sortedData is defined)
  const exportModalHook = useExportModal({
    columns,
    sortedData,
    title,
  });

  

  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className=" border-gray-200 p-6 dark:border-gray-800">
        {isNewLine && title && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
        )}
        {/* Dokumentasi: Bar atas dengan layout kiri (input/Select) dan kanan (tombol) */}
        <div className="flex flex-col items-start gap-1 md:items-center md:justify-between md:gap-3 md:flex-row mb-4 ">
          {!isNewLine && title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
          )}
          <div className="flex-1 min-w-0">
            {toolbarLeftSlotAtas}
          </div>
          <div className="flex items-center gap-3">
            {!toolbarRightSlotAtas && (
              <>
                {onExport && (
                  <Button className='bg-success text-white dark:text-white' onClick={() => exportModalHook.setExportModalOpen(true)} variant="outline" size="sm">
                    <IconExport size={16}  />
                    {exportButtonLabel}
                  </Button>
                )}
                {onAdd && (
                  <Button onClick={onAdd} variant="primary" size="sm" className="w-max">
                    {addButtonIcon ? <span className="mr-2">{addButtonIcon}</span> : <Plus size={16} className="mr-2" />}
                    {addButtonLabel || ('Tambah ' + (title ?? ''))}
                  </Button>
                )}
              </>
            )}
            {toolbarRightSlotAtas && (
              <>
                {appendDefaultToolbarRightAtas && (
                  <>
                    {onExport && (
                      <Button className='bg-success text-white dark:text-white' onClick={() => exportModalHook.setExportModalOpen(true)} variant="outline" size="sm">
                        <IconExport size={16}  />
                        {exportButtonLabel}
                      </Button>
                    )}
                    {onAdd && (
                      <Button onClick={onAdd} variant="primary" size="sm" className="w-max">
                        {addButtonIcon ? <span className="mr-2">{addButtonIcon}</span> : <Plus size={16} className="mr-2" />}
                        {addButtonLabel || ('Tambah ' + (title ?? ''))}
                      </Button>
                    )}
                  </>
                )}
                {toolbarRightSlotAtas}
              </>
            )}
          </div>
        </div>
        

        <div className="flex items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-400"
          />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        <div className="flex items-center gap-3">
            
            {filterable && (
              <Button onClick={() => filterModalHook.setFilterModalOpen(true)} variant="outline" size="sm">
                <FilterLineIcon />
                Filter
              </Button>
            )}
            {toolbarRightSlot}
          </div>
        </div>
      </div>

      <div className="overflow-auto max-h-[500px] mx-6 border rounded-sm">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="border-b border-gray-200 bg-[#004969] dark:border-gray-700 dark:bg-gray-800">
              {displayColumns.map((column) => (
                <TableCell
                  isHeader={true}
                  key={column.id}
                  className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ${
                    column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                  } ${column.sortable !== false ? 'cursor-pointer hover:text-gray-200' : ''}`}
                  onClick={() => column.sortable !== false && handleSort(column.id)}
                >
                  <div className={`min-w-max flex items-center gap-1 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    {column.headerFormat ? column.headerFormat() : column.label}
                    {column.sortable !== false && <span className="text-white">{getSortIcon(column.id)}</span>}
                    {column.filterOptions && column.filterOptions.length > 0 && (
                      <span
                        ref={(el) => {
                          filterIconRefs.current[column.id] = el;
                        }}
                        className="ml-1 cursor-pointer hover:opacity-80"
                        onClick={(e) => handleFilterIconClick(column.id, e)}
                      >
                        <IconColumnFilter size={20} color={columnFilters[column.id]?.length > 0 ? '#3B82F6' : '#FFFFFF'} />
                      </span>
                    )}
                    {column.dateRangeFilter && (
                      <span
                        ref={(el) => {
                          dateRangeIconRefs.current[column.id] = el;
                        }}
                        className="ml-1 cursor-pointer hover:opacity-80"
                        onClick={(e) => handleDateRangeIconClick(column.id, e)}
                      >
                        <IconCalendarFilter 
                          size={20} 
                          color={(dateRangeFilters[column.id]?.startDate) ? '#3B82F6' : '#FFFFFF'} 
                        />
                      </span>
                    )}
                  </div>
                </TableCell>
              ))}
              {actions && actions.length > 0 && (
                <TableCell isHeader={true} className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</TableCell>
              )}
              {secondaryActions && secondaryActions.length > 0 && (
                <TableCell isHeader={true} className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</TableCell>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={displayColumns.length + (actions ? 1 : 0) + (secondaryActions ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">Loading...</TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={displayColumns.length + (actions ? 1 : 0) + (secondaryActions ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">{emptyMessage}</TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                  {displayColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${
                        column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {column.id === 'no'
                        ? (index + 1)
                        : column.format
                          ? column.format(row[column.id as keyof T], row)
                          : (row[column.id as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {actions && actions.length > 0 && (
                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {actions
                          .filter((action) => !action.condition || action.condition(row))
                          .map((action, actionIndex) =>
                            action.label ? (
                              <Button
                                className={action.className}
                                key={actionIndex}
                                onClick={() => action.onClick(row)}
                                variant={action.variant as 'primary' | 'outline' || 'outline'}
                                size="sm"
                              >
                                {action.icon && <span className="mr-1">{action.icon}</span>}
                                {action.label}
                              </Button>
                            ) : (
                              <button
                                key={actionIndex}
                                onClick={() => action.onClick(row)}
                                className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${action.className}`}
                              >
                                {action.icon}
                              </button>
                            )
                          )}
                      </div>
                    </TableCell>
                  )}
                  {secondaryActions && secondaryActions.length > 0 && (
                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {secondaryActions
                          .filter((action) => !action.condition || action.condition(row))
                          .map((action, actionIndex) =>
                            action.label ? (
                              <Button
                                className={action.className}
                                key={actionIndex}
                                onClick={() => action.onClick(row)}
                                variant={action.variant as 'primary' | 'outline' || 'outline'}
                                size="sm"
                              >
                                {action.icon && <span className="mr-1">{action.icon}</span>}
                                {action.label}
                              </Button>
                            ) : (
                              <button
                                key={actionIndex}
                                onClick={() => action.onClick(row)}
                                className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${action.className}`}
                              >
                                {action.icon}
                              </button>
                            )
                          )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between  border-gray-200 px-6 py-4 dark:border-gray-800 gap-2">
        <div className="flex items-center gap-2 text-sm dark:text-white">
          <span>Menampilkan</span>
          <select
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>{paginationInfo}</span>
        </div>
        <PaginationWithIcon
          initialPage={page + 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          // showInfo={true}
          // infoText={`${sortedData.length === 0 ? 0 : page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, sortedData.length)} of ${sortedData.length}`}
        />
      </div>
      
      <FilterModal
        isOpen={filterModalHook.isFilterModalOpen}
        onClose={filterModalHook.handleCloseModal}
        columns={columns}
        tempVisibleColumns={filterModalHook.tempVisibleColumns}
        modalFilterTerm={filterModalHook.modalFilterTerm}
        setModalFilterTerm={filterModalHook.setModalFilterTerm}
        modalFilterItems={filterModalHook.modalFilterItems}
        onColumnVisibilityChange={filterModalHook.handleColumnVisibilityChange}
        onSelectAllColumns={filterModalHook.handleSelectAllColumns}
        onAddFilterItem={filterModalHook.handleAddFilterItem}
        onRemoveFilterItem={filterModalHook.handleRemoveFilterItem}
        onApplyFilter={() => filterModalHook.handleApplyFilter(setVisibleColumns)}
      />

      <ExportModal
        isOpen={exportModalHook.isExportModalOpen}
        onClose={exportModalHook.handleCloseModal}
        columns={columns}
        tempExportVisibleColumns={exportModalHook.tempExportVisibleColumns}
        onToggleExportColumn={exportModalHook.handleToggleExportColumn}
        onSelectAllExportColumns={exportModalHook.handleSelectAllExportColumns}
        onExportPreview={exportModalHook.handleExportPreview}
      />

      {/* Column Filter Popup */}
      {activeFilterColumn && (
        <ColumnFilterPopup
          isOpen={true}
          onClose={handleFilterPopupClose}
          options={columns.find((col) => col.id === activeFilterColumn)?.filterOptions || []}
          selectedValues={columnFilters[activeFilterColumn] || []}
          onApply={(values) => handleColumnFilterApply(activeFilterColumn, values)}
          onReset={() => handleColumnFilterReset(activeFilterColumn)}
          anchorEl={filterAnchorEl}
        />
      )}

      {/* Date Range Filter Popup */}
      {activeDateRangeColumn && (
        <DateRangeFilterPopup
          isOpen={true}
          onClose={handleDateRangePopupClose}
          startDate={dateRangeFilters[activeDateRangeColumn]?.startDate}
          endDate={dateRangeFilters[activeDateRangeColumn]?.endDate}
          onApply={(startDate, endDate) => handleDateRangeFilterApply(activeDateRangeColumn, startDate, endDate)}
          onReset={() => handleDateRangeFilterReset(activeDateRangeColumn)}
          anchorEl={dateRangeAnchorEl}
        />
      )}
    </div>
  );
}

export default DataTable;

// Dokumentasi: Menambahkan dukungan slot toolbar atas (toolbarRightSlotAtas) untuk kustomisasi tombol Import/Download Template,
// fallback ke tombol default (Ekspor & Tambah) menggunakan onExport dan onAdd bila slot tidak disediakan.
// Dokumentasi: Menambahkan toolbarLeftSlotAtas agar layout atas bisa menempatkan input di kiri
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../../components/ui/table';
import PaginationWithIcon from '../../../../components/tables/DataTables/TableOne/PaginationWithIcon';
import Button from '../../../../components/ui/button/Button';
import {Modal} from '../../../../components/ui/modal/index';
import { Plus } from 'react-feather';
import { FilterLineIcon } from '../../../../icons/index';
import { setFilterFor, getFilterFor, loadPageFilters, persistPageFilters } from '../../../../stores/filterStore';
import Checkbox from '../../../../components/form/input/Checkbox';
import {IconExport} from '@/icons/components/icons'

// Dokumentasi: Menambahkan headerFormat untuk custom header cell (contoh: checkbox check-all)
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
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
    columns.filter((c) => !c.isAction).map((c) => c.id)
  );
  const [exportVisibleColumns, setExportVisibleColumns] = useState<string[]>(() =>
    columns.filter((c) => c.id !== 'no' && !c.isAction).map((c) => c.id)
  );
  const [tempVisibleColumns, setTempVisibleColumns] = useState<string[]>(() =>
    columns.filter((c) => !c.isAction).map((c) => c.id)
  );
  const [tempExportVisibleColumns, setTempExportVisibleColumns] = useState<string[]>(() =>
    columns.filter((c) => c.id !== 'no' && !c.isAction).map((c) => c.id)
  );
  const [exportSearchTerm, /*setExportSearchTerm*/] = useState('');
  const [modalFilterTerm, setModalFilterTerm] = useState('');
  const [modalFilterItems, setModalFilterItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pageKey = resetKey ?? location.pathname;
    const valid = columns.filter((c) => !c.isAction).map((c) => c.id);
    const { columns: savedCols } = loadPageFilters(pageKey);
    const next = (savedCols ?? valid).filter((id) => valid.includes(id));
    setVisibleColumns(next.length ? next : valid);
  }, [resetKey, columns, location.pathname]);
  useEffect(() => {
    const validExport = columns.filter((c) => c.id !== 'no' && !c.isAction).map((c) => c.id);
    setExportVisibleColumns(validExport);
  }, [resetKey, columns]);

  useEffect(() => {
    if (isFilterModalOpen) {
      setTempVisibleColumns(visibleColumns);
      const pageKey = resetKey ?? location.pathname;
      const { terms } = loadPageFilters(pageKey);
      const existing = terms.length ? terms : (getFilterFor(title ?? 'global') || '').split(',').map((v) => v.trim()).filter((v) => v.length > 0);
      const items = existing;
      setModalFilterItems(items);
    }
  }, [isFilterModalOpen, resetKey, location.pathname]);

  useEffect(() => {
    if (isExportModalOpen) {
      setTempExportVisibleColumns(exportVisibleColumns);
    }
  }, [isExportModalOpen]);

  // Keep internal page in sync with external page when using server-side pagination
  useEffect(() => {
    if (useExternalPagination && typeof externalPage === 'number') {
      setPage(Math.max(0, externalPage - 1));
    }
  }, [useExternalPagination, externalPage]);

  useEffect(() => {
    if (useExternalPagination) {
      setRowsPerPage(pageSize);
    }
  }, [useExternalPagination, pageSize]);

  useEffect(() => {
    const pageKey = resetKey ?? location.pathname;
    const { terms } = loadPageFilters(pageKey);
    if (terms.length) {
      setModalFilterItems(terms);
    } else {
      const existing = getFilterFor(title ?? 'global');
      if (existing) {
        const items = existing.split(',').map((v) => v.trim()).filter((v) => v.length > 0);
        setModalFilterItems(items);
      }
    }
  }, [resetKey, location.pathname]);

  const handleSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
    // Notify parent for refetch on sort changes
    onSortChange?.(columnId, isAsc ? 'desc' : 'asc');
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      columns.some((column) => {
        if (!visibleColumns.includes(column.id)) return false;
        const value = row[column.id as keyof T];
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns, visibleColumns]);

  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy as keyof T] as any;
      const bValue = b[orderBy as keyof T] as any;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return order === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }, [filteredData, orderBy, order]);

  const paginatedData = useMemo(() => {
    if (useExternalPagination) {
      return sortedData;
    }
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage, useExternalPagination]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1);
    onPageChangeExternal?.(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    // Notify parent for refetch on page size changes
    onRowsPerPageChangeExternal?.(newRowsPerPage);
  };

  const handleColumnVisibilityChange = (columnId: string) => {
    if (columnId === 'no') return;
    const col = columns.find((c) => c.id === columnId);
    if (col?.isAction) return;
    setTempVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  useEffect(() => {
    onColumnVisibilityChange?.(visibleColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns]);
  // };
  
  const handleSelectAllColumns = (checked: boolean) => {
    const nonNoIds = columns.filter((c) => c.id !== 'no' && !c.isAction).map((c) => c.id);
    const next = checked ? [...nonNoIds, 'no'] : ['no'];
    setTempVisibleColumns(next);
  };

  const getSortIcon = (columnId: string) => {
    if (orderBy !== columnId) return '↑↓';
    return order === 'asc' ? '↑' : '↓';
  };
  
  const displayColumns = useMemo(() => {
    return columns.filter((c) => c.isAction || visibleColumns.includes(c.id));
  }, [columns, visibleColumns]);

  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className=" border-gray-200 p-6 dark:border-gray-800">
        {isNewLine && title && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
        )}
        {/* Dokumentasi: Bar atas dengan layout kiri (input/Select) dan kanan (tombol) */}
        <div className="flex items-center justify-between gap-3 mb-4">
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
                  <Button className='bg-success text-white dark:text-white' onClick={() => setExportModalOpen(true)} variant="outline" size="sm">
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
                      <Button className='bg-success text-white dark:text-white' onClick={() => setExportModalOpen(true)} variant="outline" size="sm">
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearchChange?.(searchTerm);
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
              <Button onClick={() => setFilterModalOpen(true)} variant="outline" size="sm">
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
          <span>
            {useExternalPagination
              ? `1 - ${Math.min((page + 1) * rowsPerPage, externalTotal ?? sortedData.length)} dari ${externalTotal ?? sortedData.length}`
              : `1 - ${Math.min((page + 1) * rowsPerPage, sortedData.length)} dari ${sortedData.length}`}
          </span>
        </div>
        <PaginationWithIcon
          initialPage={page + 1}
          totalPages={useExternalPagination
            ? (Math.ceil(((externalTotal ?? sortedData.length) || 0) / rowsPerPage) || 1)
            : (Math.ceil(sortedData.length / rowsPerPage) || 1)}
          onPageChange={handlePageChange}
          // showInfo={true}
          // infoText={`${sortedData.length === 0 ? 0 : page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, sortedData.length)} of ${sortedData.length}`}
        />
      </div>
      
      <Modal className="max-w-md dark:bg-gray-800 dark:text-white" isOpen={isFilterModalOpen} onClose={() => { setFilterModalOpen(false); setModalFilterTerm(''); }} >
        <div className="p-6">
          <div className="mb-4">
            <div className='text-center'>
              <h1 className='text-2xl font-bold mb-2'>Filter</h1>
            </div>
            <div className="flex justify-between items-center mb-2 ">
              <h4 className="font-semibold">Kolom</h4>
              <Checkbox
                label="Pilih Semua"
                checked={tempVisibleColumns.filter((id) => id !== 'no').length === columns.filter((c) => c.id !== 'no' && !c.isAction).length}
                onChange={(checked) => handleSelectAllColumns(checked)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-x-auto max-h-[200px]">
              {columns.filter((c) => c.id !== 'no' && !c.isAction).map((col) => (
                <div key={col.id} className='border border-gray-300 rounded-md p-2'>
                  <Checkbox
                    label={col.label}
                    checked={tempVisibleColumns.includes(col.id)}
                    onChange={() => handleColumnVisibilityChange(col.id)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold">Data</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan kata kunci"
                value={modalFilterTerm}
                onChange={(e) => {
                  setModalFilterTerm(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const v = modalFilterTerm.trim();
                    if (v.length > 0 && !modalFilterItems.includes(v)) {
                      setModalFilterItems((prev) => [...prev, v]);
                    }
                    setModalFilterTerm('');
                    e.preventDefault();
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
            <div className="mt-3 flex flex-wrap gap-2">
              {modalFilterItems.map((item, idx) => (
                <span key={`${item}_${idx}`} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {item}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-600"
                    onClick={() => {
                      setModalFilterItems((prev) => prev.filter((x) => x !== item));
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setFilterModalOpen(false); setModalFilterTerm(''); }}>Tutup</Button>
              <Button
                variant="primary"
                onClick={() => {
                const pageKey = resetKey ?? location.pathname;
                const terms = modalFilterItems.length > 0 ? modalFilterItems : (modalFilterTerm.trim() ? [modalFilterTerm.trim()] : []);
                const value = terms.join(',');
                setFilterFor(title ?? 'global', value);
                persistPageFilters(pageKey, terms, tempVisibleColumns);
                setVisibleColumns(tempVisibleColumns);
                onColumnVisibilityChange?.(tempVisibleColumns);
                setFilterModalOpen(false);
                setModalFilterTerm('');
              }}
            >
              Cari
            </Button>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal className="max-w-md  dark:bg-gray-800 dark:text-white" isOpen={isExportModalOpen} onClose={() => setExportModalOpen(false)}>
        <div className="p-6">
          <div className="mb-4">
            <div className='text-center'>
              <h1 className='text-2xl font-bold mb-2'>Expor</h1>
            </div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Kolom</h4>
              <Checkbox
                label="Pilih Semua"
                checked={tempExportVisibleColumns.length === columns.filter((c) => c.id !== 'no' && !c.isAction).length}
                onChange={(checked) => setTempExportVisibleColumns(checked ? columns.filter((c) => c.id !== 'no' && !c.isAction).map((c) => c.id) : [])}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-x-auto max-h-[200px]">
              {columns.filter((c) => c.id !== 'no' && !c.isAction).map((col) => (
                <div key={col.id} className='border border-gray-300 rounded-md p-2'>
                  <Checkbox
                    label={col.label}
                    checked={tempExportVisibleColumns.includes(col.id)}
                    onChange={() =>
                      setTempExportVisibleColumns((prev) =>
                        prev.includes(col.id)
                          ? prev.filter((id) => id !== col.id)
                          : [...prev, col.id]
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          {/* <div className="mb-4">
            <h4 className="font-semibold mb-2">Data</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan kata kunci"
                value={exportSearchTerm}
                onChange={(e) => setExportSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-400"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div> */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>Tutup</Button>
            <Button
              variant="primary"
              onClick={() => {
                const selectedColumns = columns.filter((c) => tempExportVisibleColumns.includes(c.id));
                // const hasNo = selectedColumns.some((c) => c.id === 'no' || c.label.toLowerCase() === 'no.' || c.label.toLowerCase() === 'no');
                const selectedWithoutNo = selectedColumns.filter((c) => c.id !== 'no');

                const dataSource = sortedData.filter((row) => {
                  if (!exportSearchTerm) return true;
                  return selectedWithoutNo.some((column) => {
                    const value = row[column.id as keyof T];
                    if (value === null || value === undefined) return false;
                    return value.toString().toLowerCase().includes(exportSearchTerm.toLowerCase());
                  });
                });

                const exportRows = dataSource.map((row, idx) => {
                  const record: Record<string, any> = {};
                  // tambahkan nomor (selalu dihitung agar konsisten)
                  record['No.'] = idx + 1;
                  selectedWithoutNo.forEach((c) => {
                    const value = row[c.id as keyof T];
                    record[c.label] = value as any;
                  });
                  return record;
                });

                setExportVisibleColumns(tempExportVisibleColumns);
                navigate('/export', {
                  state: {
                    title: title || 'Struktur Organisasi',
                    columns: ['No.', ...selectedColumns.map((c) => c.label)],
                    rows: exportRows,
                  },
                });
                setExportModalOpen(false);
              }}
            >
              Pratinjau
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DataTable;

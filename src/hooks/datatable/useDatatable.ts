import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { loadPageFilters } from '../../stores/filterStore';
import { DataTableColumn } from '../../components/shared/datatable/DataTable';

interface UseDatatableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  pageSize?: number;
  resetKey?: string;
  onSearchChange?: (search: string) => void;
  onSortChange?: (columnId: string, order: 'asc' | 'desc') => void;
  onPageChangeExternal?: (page: number) => void;
  onRowsPerPageChangeExternal?: (rowsPerPage: number) => void;
  onColumnVisibilityChange?: (visibleColumnIds: string[]) => void;
  useExternalPagination?: boolean;
  externalPage?: number;
  externalTotal?: number;
  onColumnFilterChange?: (columnId: string, values: string[]) => void;
  columnFilters?: Record<string, string[]>;
  onDateRangeFilterChange?: (columnId: string, startDate: string, endDate: string | null) => void;
  dateRangeFilters?: Record<string, { startDate: string; endDate: string | null }>;
}

export function useDatatable<T = any>({
  data,
  columns,
  pageSize = 10,
  resetKey,
  onSearchChange,
  onSortChange,
  onPageChangeExternal,
  onRowsPerPageChangeExternal,
  onColumnVisibilityChange,
  useExternalPagination = false,
  externalPage,
  externalTotal,
  onColumnFilterChange,
  onDateRangeFilterChange,
}: UseDatatableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
    columns.filter((c) => !c.isAction).map((c) => c.id)
  );
  const location = useLocation();

  // Initialize visible columns from saved filters or defaults
  useEffect(() => {
    const pageKey = resetKey ?? location.pathname;
    const valid = columns.filter((c) => !c.isAction).map((c) => c.id);
    const { columns: savedCols } = loadPageFilters(pageKey);
    const next = (savedCols ?? valid).filter((id) => valid.includes(id));
    setVisibleColumns(next.length ? next : valid);
  }, [resetKey, columns, location.pathname]);

  // Keep internal page in sync with external page when using server-side pagination
  useEffect(() => {
    if (useExternalPagination && typeof externalPage === 'number') {
      setPage(Math.max(0, externalPage - 1));
    }
  }, [useExternalPagination, externalPage]);

  // Sync rowsPerPage with pageSize
  useEffect(() => {
    if (useExternalPagination) {
      setRowsPerPage(pageSize);
    }
  }, [useExternalPagination, pageSize]);

  // Notify parent when visible columns change
  useEffect(() => {
    onColumnVisibilityChange?.(visibleColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns]);

  // Handle sorting logic
  const handleSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(columnId);
    onSortChange?.(columnId, newOrder);
    console.log('handleSort',columnId, newOrder);
  };

  // Filter data based on search term
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

  // Sort filtered data
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

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    if (useExternalPagination) {
      return sortedData;
    }
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage, useExternalPagination]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1);
    onPageChangeExternal?.(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    onRowsPerPageChangeExternal?.(newRowsPerPage);
  };

  // Handle search term change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  // Handle search submit (Enter key)
  const handleSearchSubmit = () => {
    onSearchChange?.(searchTerm);
  };

  // Get sort icon for column
  const getSortIcon = (columnId: string) => {
    if (orderBy !== columnId) return '↑↓';
    return order === 'asc' ? '↑' : '↓';
  };

  // Get display columns (visible + action columns)
  const displayColumns = useMemo(() => {
    return columns.filter((c) => c.isAction || visibleColumns.includes(c.id));
  }, [columns, visibleColumns]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (useExternalPagination) {
      return Math.ceil(((externalTotal ?? sortedData.length) || 0) / rowsPerPage) || 1;
    }
    return Math.ceil(sortedData.length / rowsPerPage) || 1;
  }, [useExternalPagination, externalTotal, sortedData.length, rowsPerPage]);

  // Calculate pagination info text
  const paginationInfo = useMemo(() => {
    if (useExternalPagination) {
      return `1 - ${Math.min((page + 1) * rowsPerPage, externalTotal ?? sortedData.length)} dari ${externalTotal ?? sortedData.length}`;
    }
    return `1 - ${Math.min((page + 1) * rowsPerPage, sortedData.length)} dari ${sortedData.length}`;
  }, [useExternalPagination, page, rowsPerPage, externalTotal, sortedData.length]);



  // Column filter state
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const filterIconRefs = useRef<Record<string, HTMLElement | null>>({});
  
  // Date range filter state
  const [activeDateRangeColumn, setActiveDateRangeColumn] = useState<string | null>(null);
  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<HTMLElement | null>(null);
  const dateRangeIconRefs = useRef<Record<string, HTMLElement | null>>({});

  // Column filter handlers
  const handleFilterIconClick = (columnId: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setActiveFilterColumn(activeFilterColumn === columnId ? null : columnId);
    setFilterAnchorEl(filterIconRefs.current[columnId]);
  };

  const handleColumnFilterApply = (columnId: string, values: string[]) => {
    if (onColumnFilterChange) {
      onColumnFilterChange(columnId, values);
    }
  };

  const handleColumnFilterReset = (columnId: string) => {
    if (onColumnFilterChange) {
      onColumnFilterChange(columnId, []);
    }
  };

  const handleFilterPopupClose = () => {
    setActiveFilterColumn(null);
    setFilterAnchorEl(null);
  };

  // Date range filter handlers
  const handleDateRangeIconClick = (columnId: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setActiveDateRangeColumn(activeDateRangeColumn === columnId ? null : columnId);
    setDateRangeAnchorEl(dateRangeIconRefs.current[columnId]);
  };

  const handleDateRangeFilterApply = (columnId: string, startDate: string, endDate: string | null) => {
    if (onDateRangeFilterChange) {
      onDateRangeFilterChange(columnId, startDate, endDate);
    }
  };

  const handleDateRangeFilterReset = (columnId: string) => {
    if (onDateRangeFilterChange) {
      onDateRangeFilterChange(columnId, '', null);
    }
  };

  const handleDateRangePopupClose = () => {
    setActiveDateRangeColumn(null);
    setDateRangeAnchorEl(null);
  };
  return {
    // State
    page,
    rowsPerPage,
    searchTerm,
    orderBy,
    order,
    visibleColumns,
    
    // Computed data
    filteredData,
    sortedData,
    paginatedData,
    displayColumns,
    totalPages,
    paginationInfo,
    
    // Handlers
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearchChange,
    handleSearchSubmit,
    getSortIcon,
    setVisibleColumns,
    filterIconRefs,
    dateRangeIconRefs,
    activeFilterColumn,
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
  };
}

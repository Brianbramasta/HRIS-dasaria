import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
import { IconFileDetail as Edit } from '@/icons/components/icons';
import { ContractRenewalListItem, ContractRenewalFilterParams } from '../../types/ContractRenewal';
import { useNotificationStore } from '@/stores/notificationStore';
import { useContractRenewalStore } from '../../stores/useContractRenewalStore';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { useApiContractExtension } from '../api/useApiContractExtension';
import { ContractExtensionListItem } from '../../types/dto/ContractExtensionType';
import { formatImage } from '@/utils/formatImage';
import useFilterStore from '@/stores/filterStore';
import { formatFilterValue } from '@/utils/formatFilterValue';

interface UseContractRenewalReturn {
  data: ContractRenewalListItem[];
  isLoading: boolean;
  isDropdownOpen: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  columns: DataTableColumn<ContractRenewalListItem>[];
  actions: DataTableAction<ContractRenewalListItem>[];
  columnFilters: Record<string, string[]>;
  dateRangeFilters: Record<string, { startDate: string; endDate: string | null }>;
  handleColumnFilterChange: (columnId: string, values: string[]) => void;
  handleDateRangeFilterChange: (columnId: string, startDate: string, endDate: string | null) => void;
  handleSearchChange: (search: string) => void;
  handleSortChange: (columnId: string, order: 'asc' | 'desc') => void;
  setIsDropdownOpen: (value: boolean) => void;
  handleNavigateToApproval: () => void;
  handleNavigateToExtension: () => void;
  handleEdit: (row: ContractRenewalListItem) => void;
  fetchContractRenewals: (params?: ContractRenewalFilterParams) => Promise<void>;
  getStatusColor: (status: string) => string;
  handlePageChange: (page: number) => void;
  handleRowsPerPageChange: (perPage: number) => void;
}

export function useContractRenewal(): UseContractRenewalReturn {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const { setChangeTypeName } = useContractRenewalStore();
  const filterValue = formatFilterValue(useFilterStore((s) => s.filters[s.resetKey]));
  
  // Integration with API Hook
  const { 
    loading: apiLoading, 
    error: apiError, 
    contractExtensions, 
    pagination, 
    fetchContractExtensions 
  } = useApiContractExtension();

  const [data, setData] = useState<ContractRenewalListItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Filter states
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});

  const getStatusColor = useCallback((status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    switch (status.toLowerCase()) {
      case 'diperpanjang tetap':
      case 'diperpanjang berubah':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'sedang di proses':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'menunggu diproses':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'ditolak':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  }, []);

  // Map API data to UI data
  useEffect(() => {
    if (contractExtensions) {
      const mappedData: ContractRenewalListItem[] = contractExtensions.map((item: ContractExtensionListItem) => ({
        id: item.id,
        // Use extension ID as employee_id for navigation if that's what detail expects, 
        // or keep it as empty if we don't have real employee_id but navigation uses row.id
        employee_id: item.id, 
        nip: item.nip,
        employee_name: item.employee_name,
        position_name: '-', // Not available in API list response
        department_name: item.department_name,
        current_contract_start: item.current_contract_start,
        current_contract_end: item.current_contract_end,
        remaining_month: item.remaining_month,
        renewal_status: 0 as any, // Default/Placeholder
        extension_status_name: item.extension_status_name,
        supervisor_approval_status: 0 as any, // Default/Placeholder
        supervisor_approval_status_name: '-',
        contract_submission_detail: null,
        negotiation_date: null,
        notes: item.extension_note,
        employee_status: 0 as any, // Default/Placeholder
        employee_status_name: '-',
        avatar: item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.employee_name}`,
      }));
      setData(mappedData);
    }
  }, [contractExtensions]);

  // Show error notification
  useEffect(() => {
    if (apiError) {
      addNotification({
        title: 'Error',
        description: apiError,
        variant: 'error',
        hideDuration: 5000,
      });
    }
  }, [apiError, addNotification]);

  const handleFetchContractRenewals = useCallback(async (params?: ContractRenewalFilterParams) => {
    // Build query params following the API specification
    const queryParams: any = {
      page: currentPage,
      per_page: perPage,
    };

    if (params?.search) queryParams.search = params.search;
    if (params?.column) queryParams.column = params.column;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.page) queryParams.page = params.page;
    if (params?.per_page) queryParams.per_page = params.per_page;

    if (params?.filter) queryParams.filter = Array.isArray(params.filter) ? params.filter : [params.filter];
    else if (filterValue) queryParams.filter = filterValue;

    // Add column filters - format: filter_column[column_name][in][]=value
    Object.entries(columnFilters).forEach(([columnId, values]) => {
      if (values && values.length > 0) {
        values.forEach((value) => {
          const key = `filter_column[${columnId}][in][]`;
          if (!queryParams[key]) {
            queryParams[key] = [];
          }
          queryParams[key].push(value);
        });
      }
    });

    // Add date range filters - format: filter_column[column_name][range][]=start_date & filter_column[column_name][range][]=end_date
    Object.entries(dateRangeFilters).forEach(([columnId, dateRange]) => {
      if (dateRange && dateRange.startDate) {
        const key = `filter_column[${columnId}][range][]`;
        if (!queryParams[key]) {
          queryParams[key] = [];
        }
        queryParams[key].push(dateRange.startDate);
        if (dateRange.endDate) {
          queryParams[key].push(dateRange.endDate);
        }
      }
    });

    await fetchContractExtensions(queryParams);
  }, [currentPage, perPage, columnFilters, dateRangeFilters, fetchContractExtensions, setCurrentPage, setPerPage, filterValue]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    handleFetchContractRenewals({ page });
  }, [handleFetchContractRenewals]);

  const handleRowsPerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
    handleFetchContractRenewals({ per_page: newPerPage, page: 1 });
  }, [handleFetchContractRenewals]);

  const handleNavigateToApproval = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/contract-extension/persetujuan');
  }, [navigate]);

  const handleNavigateToExtension = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/contract-extension');
  }, [navigate]);

  const handleEdit = useCallback((row: ContractRenewalListItem) => {
    // Dispatch renewal status to store based on status perpanjangan
    setChangeTypeName(row.extension_status_name);
    // Use row.id (Extension ID) for navigation
    navigate(`/contract-extension/detail/${row.id}`);
  }, [navigate, setChangeTypeName]);
  
  const handleColumnFilterChange = (columnId: string, values: string[]) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: values,
    }));
    // Trigger fetch with new filters - will be handled by handleFetchContractRenewals
    handleFetchContractRenewals();
  };

  const handleDateRangeFilterChange = (columnId: string, startDate: string, endDate: string | null) => {
    setDateRangeFilters((prev) => ({
      ...prev,
      [columnId]: { startDate, endDate },
    }));
    
    // Trigger fetch with date range - will be handled by handleFetchContractRenewals
    if (startDate) {
      handleFetchContractRenewals();
    }
  };

  const handleSearchChange = useCallback((search: string) => {
    handleFetchContractRenewals({ search });
  }, [handleFetchContractRenewals]);

  const handleSortChange = useCallback((columnId: string, order: 'asc' | 'desc') => {
    handleFetchContractRenewals({ column: columnId, sort: order });
  }, [handleFetchContractRenewals]);

  const columns: DataTableColumn<ContractRenewalListItem>[] = [
    {
      id: 'no',
      label: 'No.',
      minWidth: 50,
      align: 'center',
      sortable: false,
    },
    { id: 'nip', label: 'NIP', minWidth: 120, sortable: true },
    {
      id: 'employee_name',
      label: 'Pengguna',
      minWidth: 180,
      sortable: true,
      format: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full overflow-hidden">
          {formatImage(null, value || 'User')}
          </div>
          <div>
            <div className="text-sm font-medium min-w-max">{value}</div>
            <div className="text-[11px] text-gray-500 min-w-max">{row.position_name || '-'}</div>
          </div>
        </div>
      ),
    },
    { id: 'department_name', label: 'Departemen', minWidth: 180, sortable: true },
    { 
      id: 'current_contract_start', 
      label: 'Mulai Kontrak', 
      minWidth: 140, 
      sortable: true,
      dateRangeFilter: true,
      format: (value) => (
        <div className="flex items-center gap-2">
          <div>{formatDateToIndonesian(value)}</div>
        </div>
      ),
    },
    { 
      id: 'current_contract_end', 
      label: 'Berakhir Kontrak', 
      minWidth: 150, 
      sortable: true,
      dateRangeFilter: true,
      format: (value) => (
        <div className="flex items-center gap-2">
          <div>{formatDateToIndonesian(value)}</div>
        </div>
      ),
    },
    { id: 'remaining_month', label: 'Sisa Kontrak', minWidth: 120, sortable: true },
    { id: 'notes', label: 'Catatan', minWidth: 150, sortable: true },
    {
      id: 'extension_status_name',
      label: 'Status Perpanjangan',
      minWidth: 180,
      sortable: true,
      format: (value) => (
        <span className={`status-styling rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
      filterOptions: [
        { label: 'Diperpanjang Tetap', value: 'Diperpanjang Tetap' },
        { label: 'Diperpanjang Berubah', value: 'Diperpanjang Berubah' },
        { label: 'Sedang di Proses', value: 'Sedang di Proses' },
        { label: 'Menunggu diproses', value: 'Menunggu diproses' },
        { label: 'Ditolak', value: 'Ditolak' },
      ],
    },
  ];

  const actions: DataTableAction<ContractRenewalListItem>[] = [
    {
      label: '',
      icon: <Edit />,
      onClick: handleEdit,
      variant: 'outline',
    },
  ];

  // Initial fetch
  useEffect(() => {
    handleFetchContractRenewals();
  }, [handleFetchContractRenewals]);

  // Fetch when filterValue changes
  useEffect(() => {
    handleFetchContractRenewals();
  }, [filterValue]);

  return {
    data,
    isLoading: apiLoading,
    isDropdownOpen,
    currentPage,
    totalPages: Math.ceil(pagination.total / pagination.perPage) || 1,
    totalItems: pagination.total,
    perPage,
    columns,
    actions,
    columnFilters,
    dateRangeFilters,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleSearchChange,
    handleSortChange,
    setIsDropdownOpen,
    handleNavigateToApproval,
    handleNavigateToExtension,
    handleEdit,
    fetchContractRenewals: handleFetchContractRenewals,
    getStatusColor,
    handlePageChange,
    handleRowsPerPageChange,
  };
}

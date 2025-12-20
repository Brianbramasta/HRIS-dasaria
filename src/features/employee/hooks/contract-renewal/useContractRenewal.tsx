import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '../../../structure-and-organize/components/datatable/DataTable';
import { FileText } from 'react-feather';
import { IconPencil as Edit } from '@/icons/components/icons';
import contractRenewalService from '../../services/ContractRenewalService';
import { ContractRenewalListItem, ContractRenewalFilterParams } from '../../types/ContractRenewal';
import { useNotificationStore } from '@/stores/notificationStore';

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
  setIsDropdownOpen: (value: boolean) => void;
  handleNavigateToApproval: () => void;
  handleNavigateToExtension: () => void;
  handleEdit: (row: ContractRenewalListItem) => void;
  fetchContractRenewals: (params?: ContractRenewalFilterParams) => Promise<void>;
  getStatusColor: (status: string) => string;
}

export function useContractRenewal(): UseContractRenewalReturn {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const [data, setData] = useState<ContractRenewalListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'disetujui':
      case 'diperpanjang':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'ditolak':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'negoisasi':
      case 'menunggu jadwal negoisasi':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  }, []);

  const fetchContractRenewals = useCallback(async (params?: ContractRenewalFilterParams) => {
    setIsLoading(true);
    try {
      const response = await contractRenewalService.getContractRenewals(params);
      if (response.success && response.data) {
        setData(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
        setTotalItems(response.data.total);
        setPerPage(response.data.per_page);
      }
    } catch (error: any) {
      addNotification({
        title: 'Error',
        description: error?.message || 'Failed to fetch contract renewals',
        variant: 'error',
        hideDuration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const handleNavigateToApproval = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/contract-extension/persetujuan');
  }, [navigate]);

  const handleNavigateToExtension = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/contract-extension');
  }, [navigate]);

  const handleEdit = useCallback((row: ContractRenewalListItem) => {
    navigate(`/contract-extension/detail/${row.employee_id}`);
  }, [navigate]);

  const columns: DataTableColumn<ContractRenewalListItem>[] = [
    {
      id: 'no',
      label: 'No.',
      minWidth: 50,
      align: 'center',
      sortable: false,
    },
    { id: 'employee_code', label: 'NIP', minWidth: 120, sortable: true },
    {
      id: 'employee_name',
      label: 'Pengguna',
      minWidth: 180,
      sortable: true,
      format: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${value}`}
            alt={value}
            className="h-8 w-8 rounded-full"
          />
          <div>
            <div className="text-sm font-medium">{value}</div>
            <div className="text-[11px] text-gray-500">{row.position_name || 'Employee'}</div>
          </div>
        </div>
      ),
    },
    { id: 'department_name', label: 'Departemen', minWidth: 180, sortable: true },
    { id: 'start_date', label: 'Tanggal Masuk', minWidth: 140, sortable: true },
    { id: 'end_date', label: 'Tanggal Berakhir', minWidth: 150, sortable: true },
    { id: 'remaining_contract', label: 'Sisa Kontrak', minWidth: 120, sortable: true },
    {
      id: 'renewal_status_name',
      label: 'Status Perpanjangan',
      minWidth: 180,
      sortable: true,
      format: (value) => (
        <span className={`p-[10px] flex justify-center rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      id: 'supervisor_approval_status_name',
      label: 'Status Atasan',
      minWidth: 140,
      sortable: true,
      format: (value) => (
        <span className={`p-[10px] flex justify-center rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      id: 'contract_submission_detail',
      label: 'Detail Kontrak Pengajuan',
      minWidth: 180,
      sortable: false,
      align: 'center',
      format: (value) => value === '-' ? value : (
        <FileText size={16} className="inline text-gray-500" />
      ),
    },
    { id: 'negotiation_date', label: 'Tanggal Negoisasi', minWidth: 160, sortable: true },
    { id: 'notes', label: 'Catatan', minWidth: 150, sortable: false },
    {
      id: 'employee_status_name',
      label: 'Status Karyawan',
      minWidth: 140,
      sortable: true,
      format: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
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

  useEffect(() => {
    fetchContractRenewals();
  }, [fetchContractRenewals]);

  return {
    data,
    isLoading,
    isDropdownOpen,
    currentPage,
    totalPages,
    totalItems,
    perPage,
    columns,
    actions,
    setIsDropdownOpen,
    handleNavigateToApproval,
    handleNavigateToExtension,
    handleEdit,
    fetchContractRenewals,
    getStatusColor,
  };
}

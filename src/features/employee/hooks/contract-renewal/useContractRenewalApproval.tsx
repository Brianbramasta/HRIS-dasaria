import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '../../../structure-and-organize/components/datatable/DataTable';
import { X, Check, FileText } from 'react-feather';
import contractRenewalService from '../../services/ContractRenewalService';
import { ContractRenewalApprovalListItem, ContractRenewalFilterParams } from '../../types/ContractRenewal';
import { useNotificationStore } from '@/stores/notificationStore';

interface UseContractRenewalApprovalReturn {
  data: ContractRenewalApprovalListItem[];
  isLoading: boolean;
  isDropdownOpen: boolean;
  isModalOpen: boolean;
  isRejectModalOpen: boolean;
  selectedKontrak: ContractRenewalApprovalListItem | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  columns: DataTableColumn<ContractRenewalApprovalListItem>[];
  actions: DataTableAction<ContractRenewalApprovalListItem>[];
  setIsDropdownOpen: (value: boolean) => void;
  handleViewDetail: (row: ContractRenewalApprovalListItem) => void;
  handleModalClose: () => void;
  handleRejectClick: (row: ContractRenewalApprovalListItem) => void;
  handleRejectModalClose: () => void;
  handleRejectSubmit: (alasanPenolakan: string) => Promise<void>;
  handleApprove: (row: ContractRenewalApprovalListItem) => Promise<void>;
  handleNavigateToApproval: () => void;
  handleNavigateToExtension: () => void;
  fetchContractRenewalApprovals: (params?: ContractRenewalFilterParams) => Promise<void>;
  getStatusColor: (status: string) => string;
}

export function useContractRenewalApproval(): UseContractRenewalApprovalReturn {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const [data, setData] = useState<ContractRenewalApprovalListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedKontrak, setSelectedKontrak] = useState<ContractRenewalApprovalListItem | null>(null);
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
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  }, []);

  const fetchContractRenewalApprovals = useCallback(async (params?: ContractRenewalFilterParams) => {
    setIsLoading(true);
    try {
      const response = await contractRenewalService.getContractRenewalApprovals(params);
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
        description: error?.message || 'Failed to fetch contract renewal approvals',
        variant: 'error',
        hideDuration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const handleViewDetail = useCallback((row: ContractRenewalApprovalListItem) => {
    setSelectedKontrak(row);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedKontrak(null);
  }, []);

  const handleRejectClick = useCallback((row: ContractRenewalApprovalListItem) => {
    setSelectedKontrak(row);
    setIsRejectModalOpen(true);
  }, []);

  const handleRejectModalClose = useCallback(() => {
    setIsRejectModalOpen(false);
    setSelectedKontrak(null);
  }, []);

  const handleRejectSubmit = useCallback(async (alasanPenolakan: string) => {
    if (!selectedKontrak) return;

    try {
      await contractRenewalService.rejectContractRenewal(selectedKontrak.id, {
        notes: alasanPenolakan,
      });
      addNotification({
        title: 'Success',
        description: 'Contract renewal rejected successfully',
        variant: 'success',
        hideDuration: 5000,
      });
      handleRejectModalClose();
      await fetchContractRenewalApprovals();
    } catch (error: any) {
      addNotification({
        title: 'Error',
        description: error?.message || 'Failed to reject contract renewal',
        variant: 'error',
        hideDuration: 5000,
      });
    }
  }, [selectedKontrak, addNotification, fetchContractRenewalApprovals]);

  const handleApprove = useCallback(async (row: ContractRenewalApprovalListItem) => {
    try {
      await contractRenewalService.approveContractRenewal(row.id);
      addNotification({
        title: 'Success',
        description: 'Contract renewal approved successfully',
        variant: 'success',
        hideDuration: 5000,
      });
      await fetchContractRenewalApprovals();
    } catch (error: any) {
      addNotification({
        title: 'Error',
        description: error?.message || 'Failed to approve contract renewal',
        variant: 'error',
        hideDuration: 5000,
      });
    }
  }, [addNotification, fetchContractRenewalApprovals]);

  const handleNavigateToApproval = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/contract-extension/persetujuan');
  }, [navigate]);

  const handleNavigateToExtension = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/contract-extension');
  }, [navigate]);

  const columns: DataTableColumn<ContractRenewalApprovalListItem>[] = [
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
      id: 'approval_status_name',
      label: 'Status',
      minWidth: 140,
      sortable: true,
      format: (value) => (
        <span className={`p-[10px] flex justify-center rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      id: 'extension_detail',
      label: 'Detail Perpanjangan',
      minWidth: 160,
      sortable: false,
      align: 'center',
      format: (value) => value === '-' ? value : (
        <FileText size={16} className="inline text-gray-500" />
      ),
    },
    { id: 'notes', label: 'Catatan', minWidth: 150, sortable: false },
  ];

  const actions: DataTableAction<ContractRenewalApprovalListItem>[] = [
    {
      label: '',
      icon: <X size={16} className="text-red-600" />,
      onClick: handleRejectClick,
      variant: 'outline',
      className: 'border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20',
    },
    {
      label: '',
      icon: <Check size={16} className="text-green-600" />,
      onClick: (row) => {
        handleViewDetail(row);
      },
      variant: 'outline',
      className: 'border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20',
    },
  ];

  useEffect(() => {
    fetchContractRenewalApprovals();
  }, [fetchContractRenewalApprovals]);

  return {
    data,
    isLoading,
    isDropdownOpen,
    isModalOpen,
    isRejectModalOpen,
    selectedKontrak,
    currentPage,
    totalPages,
    totalItems,
    perPage,
    columns,
    actions,
    setIsDropdownOpen,
    handleViewDetail,
    handleModalClose,
    handleRejectClick,
    handleRejectModalClose,
    handleRejectSubmit,
    handleApprove,
    handleNavigateToApproval,
    handleNavigateToExtension,
    fetchContractRenewalApprovals,
    getStatusColor,
  };
}

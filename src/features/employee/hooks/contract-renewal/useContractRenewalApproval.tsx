import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
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
  columnFilters: Record<string, string[]>;
  dateRangeFilters: Record<string, { startDate: string; endDate: string | null }>;
  handleColumnFilterChange: (columnId: string, values: string[]) => void;
  handleDateRangeFilterChange: (columnId: string, startDate: string, endDate: string | null) => void;
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
    switch (status?.toLowerCase()) {
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
      console.log('Fetching contract renewals with params:', params);
      // Dummy data for testing
      const dummyData: ContractRenewalApprovalListItem[] = [
        {
          id: '1',
          employee_id: 'emp001',
          nip: 'NIP001',
          full_name: 'Ahmad Fauzi',
          position_name: 'Senior Developer',
          department_name: 'IT Development',
          join_date: '2022-01-15',
          end_date: '2024-01-15',
          remaining_contract: '2 bulan',
          status: 1,
          status_name: 'Pending',
          renewal_detail: 'Detail perpanjangan tersedia',
          notes: 'Menunggu persetujuan',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
        },
        {
          id: '2',
          employee_id: 'emp002',
          nip: 'NIP002',
          full_name: 'Siti Nurhaliza',
          position_name: 'UI/UX Designer',
          department_name: 'Design',
          join_date: '2022-03-20',
          end_date: '2024-03-20',
          remaining_contract: '4 bulan',
          status: 2,
          status_name: 'Diperpanjang',
          renewal_detail: 'Detail perpanjangan tersedia',
          notes: 'Perpanjangan kontrak 1 tahun disetujui',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
        },
        {
          id: '3',
          employee_id: 'emp003',
          nip: 'NIP003',
          full_name: 'Budi Santoso',
          position_name: 'Project Manager',
          department_name: 'Project Management',
          join_date: '2021-06-10',
          end_date: '2023-12-31',
          remaining_contract: 'Expired',
          status: 1,
          status_name: 'Pending',
          renewal_detail: 'Detail perpanjangan tersedia',
          notes: 'Menunggu keputusan manajemen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
        },
        {
          id: '4',
          employee_id: 'emp004',
          nip: 'NIP004',
          full_name: 'Dewi Lestari',
          position_name: 'HR Specialist',
          department_name: 'Human Resources',
          join_date: '2022-08-01',
          end_date: '2024-08-01',
          remaining_contract: '8 bulan',
          status: 1,
          status_name: 'Pending',
          renewal_detail: null,
          notes: null,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi',
        },
        {
          id: '5',
          employee_id: 'emp005',
          nip: 'NIP005',
          full_name: 'Rizky Pratama',
          position_name: 'Backend Developer',
          department_name: 'IT Development',
          join_date: '2021-11-15',
          end_date: '2024-02-15',
          remaining_contract: '3 bulan',
          status: 2,
          status_name: 'Diperpanjang',
          renewal_detail: 'Detail perpanjangan tersedia',
          notes: 'Disetujui dengan kenaikan posisi',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rizky',
        },
        {
          id: '6',
          employee_id: 'emp006',
          nip: 'NIP006',
          full_name: 'Maya Anggraini',
          position_name: 'Marketing Manager',
          department_name: 'Marketing',
          join_date: '2022-04-10',
          end_date: '2024-04-10',
          remaining_contract: '5 bulan',
          status: 3,
          status_name: 'Ditolak',
          renewal_detail: 'Detail perpanjangan tersedia',
          notes: 'Tidak memenuhi target kinerja',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
        },
        {
          id: '7',
          employee_id: 'emp007',
          nip: 'NIP007',
          full_name: 'Andi Wijaya',
          position_name: 'QA Engineer',
          department_name: 'Quality Assurance',
          join_date: '2021-09-05',
          end_date: '2024-05-05',
          remaining_contract: '6 bulan',
          status: 2,
          status_name: 'Diperpanjang',
          renewal_detail: 'Detail perpanjangan tersedia',
          notes: 'Perpanjangan 2 tahun disetujui',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi',
        },
        {
          id: '8',
          employee_id: 'emp008',
          nip: 'NIP008',
          full_name: 'Linda Susanti',
          position_name: 'Finance Analyst',
          department_name: 'Finance',
          join_date: '2022-02-28',
          end_date: '2024-02-28',
          remaining_contract: '3 bulan',
          status: 1,
          status_name: 'Pending',
          renewal_detail: 'Detail perpanjangan tersedia',
          notes: 'Menunggu review kinerja',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda',
        },
        {
          id: '9',
          employee_id: 'emp009',
          nip: 'NIP009',
          full_name: 'Hendra Gunawan',
          position_name: 'DevOps Engineer',
          department_name: 'IT Infrastructure',
          join_date: '2021-12-01',
          end_date: '2024-06-01',
          remaining_contract: '7 bulan',
          status: 1,
          status_name: 'Pending',
          renewal_detail: 'Detail perpanjangan tersedia',
          notes: 'Sedang dalam proses evaluasi',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra',
        },
        {
          id: '10',
          employee_id: 'emp010',
          nip: 'NIP010',
          full_name: 'Ratna Sari',
          position_name: 'Content Writer',
          department_name: 'Content & Media',
          join_date: '2022-07-20',
          end_date: '2024-07-20',
          remaining_contract: '8 bulan',
          status: 2,
          status_name: 'Diperpanjang',
          renewal_detail: 'Detail perpanjangan tersedia',
          notes: 'Perpanjangan dengan kenaikan gaji disetujui',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ratna',
        },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use dummy data instead of API call
      setData(dummyData);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(dummyData.length);
      setPerPage(10);

      // Uncomment below to use real API
      // const response = await contractRenewalService.getContractRenewalApprovals(params);
      // if (response.success && response.data) {
      //   setData(response.data.data);
      //   setCurrentPage(response.data.current_page);
      //   setTotalPages(response.data.last_page);
      //   setTotalItems(response.data.total);
      //   setPerPage(response.data.per_page);
      // }
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
        reason: alasanPenolakan,
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
  }, [selectedKontrak, addNotification, fetchContractRenewalApprovals, handleRejectModalClose]);

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
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});
  
  const handleColumnFilterChange = (columnId: string, values: string[]) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: values,
    }));
    // TODO: Implement API call with filter parameters when backend is ready
    console.log('Column filter changed:', columnId, values);
  };

  const handleDateRangeFilterChange = (columnId: string, startDate: string, endDate: string | null) => {
    setDateRangeFilters((prev) => ({
      ...prev,
      [columnId]: { startDate, endDate },
    }));
    // Build filter parameters for API
    const filterParams: any = {};
    if (startDate) {
      filterParams[`filter_column[${columnId}][range][]`] = [startDate];
      if (endDate) {
        filterParams[`filter_column[${columnId}][range][]`].push(endDate);
      }
    }
    // TODO: Implement API call with filter parameters when backend is ready
    console.log('Date range filter changed:', columnId, { startDate, endDate });
    console.log('Filter params for API:', filterParams);
  };

  const columns: DataTableColumn<ContractRenewalApprovalListItem>[] = [
    {
      id: 'no',
      label: 'No.',
      minWidth: 50,
      align: 'center',
      sortable: false,
    },
    { id: 'nip', label: 'NIP', minWidth: 120, sortable: true },
    {
      id: 'full_name',
      label: 'Pengguna',
      minWidth: 180,
      sortable: true,
      format: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${value}`}
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
    { 
      id: 'join_date', 
      label: 'Tanggal Masuk', 
      minWidth: 140, 
      sortable: true,
      dateRangeFilter: true,
    },
    { 
      id: 'end_date', 
      label: 'Tanggal Berakhir', 
      minWidth: 150, 
      sortable: true,
      dateRangeFilter: true,
    },
    { id: 'remaining_contract', label: 'Sisa Kontrak', minWidth: 120, sortable: true },
    {
      id: 'status_name',
      label: 'Status',
      minWidth: 140,
      sortable: true,
      format: (value) => (
        <span className={`status-styling rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
      filterOptions: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Diperpanjang', value: 'Diperpanjang' },
        { label: 'Ditolak', value: 'Ditolak' },
      ],
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
    columnFilters,
    dateRangeFilters,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
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

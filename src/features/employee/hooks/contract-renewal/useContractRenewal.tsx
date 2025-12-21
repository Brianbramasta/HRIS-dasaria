import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '../../../structure-and-organize/components/datatable/DataTable';
import { FileText } from 'react-feather';
import { IconPencil as Edit } from '@/icons/components/icons';
// import contractRenewalService from '../../services/ContractRenewalService';
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
      console.log('Fetching contract renewals with params:', params);
      // Dummy data for testing
      const dummyData: ContractRenewalListItem[] = [
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
          renewal_status: 1,
          renewal_status_name: 'Pending',
          supervisor_approval_status: 1,
          supervisor_approval_status_name: 'Pending',
          contract_submission_detail: 'Detail pengajuan tersedia',
          negotiation_date: null,
          notes: 'Menunggu persetujuan atasan',
          employee_status: 1,
          employee_status_name: 'Pending',
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
          renewal_status: 2,
          renewal_status_name: 'Diperpanjang',
          supervisor_approval_status: 2,
          supervisor_approval_status_name: 'Disetujui',
          contract_submission_detail: 'Detail pengajuan tersedia',
          negotiation_date: '2024-01-10',
          notes: 'Kontrak diperpanjang 1 tahun',
          employee_status: 2,
          employee_status_name: 'Disetujui',
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
          renewal_status: 4,
          renewal_status_name: 'Menunggu Jadwal Negoisasi',
          supervisor_approval_status: 2,
          supervisor_approval_status_name: 'Disetujui',
          contract_submission_detail: 'Detail pengajuan tersedia',
          negotiation_date: '2024-01-25',
          notes: 'Jadwal negoisasi sudah ditentukan',
          employee_status: 3,
          employee_status_name: 'Negoisasi',
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
          renewal_status: 1,
          renewal_status_name: 'Pending',
          supervisor_approval_status: 1,
          supervisor_approval_status_name: 'Pending',
          contract_submission_detail: '-',
          negotiation_date: null,
          notes: null,
          employee_status: 1,
          employee_status_name: 'Pending',
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
          renewal_status: 5,
          renewal_status_name: 'Negoisasi',
          supervisor_approval_status: 2,
          supervisor_approval_status_name: 'Disetujui',
          contract_submission_detail: 'Detail pengajuan tersedia',
          negotiation_date: '2024-01-20',
          notes: 'Sedang dalam proses negoisasi gaji',
          employee_status: 3,
          employee_status_name: 'Negoisasi',
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
          renewal_status: 3,
          renewal_status_name: 'Ditolak',
          supervisor_approval_status: 3,
          supervisor_approval_status_name: 'Ditolak',
          contract_submission_detail: 'Detail pengajuan tersedia',
          negotiation_date: null,
          notes: 'Tidak memenuhi syarat perpanjangan',
          employee_status: 5,
          employee_status_name: 'Ditolak',
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
          renewal_status: 2,
          renewal_status_name: 'Diperpanjang',
          supervisor_approval_status: 2,
          supervisor_approval_status_name: 'Disetujui',
          contract_submission_detail: 'Detail pengajuan tersedia',
          negotiation_date: '2024-01-05',
          notes: 'Kontrak diperpanjang 2 tahun',
          employee_status: 2,
          employee_status_name: 'Disetujui',
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
          renewal_status: 1,
          renewal_status_name: 'Pending',
          supervisor_approval_status: 1,
          supervisor_approval_status_name: 'Pending',
          contract_submission_detail: 'Detail pengajuan tersedia',
          negotiation_date: null,
          notes: 'Sedang direview',
          employee_status: 4,
          employee_status_name: 'Info',
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
          renewal_status: 4,
          renewal_status_name: 'Menunggu Jadwal Negoisasi',
          supervisor_approval_status: 2,
          supervisor_approval_status_name: 'Disetujui',
          contract_submission_detail: 'Detail pengajuan tersedia',
          negotiation_date: '2024-02-01',
          notes: 'Menunggu jadwal negoisasi dengan HR',
          employee_status: 3,
          employee_status_name: 'Negoisasi',
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
          renewal_status: 2,
          renewal_status_name: 'Diperpanjang',
          supervisor_approval_status: 2,
          supervisor_approval_status_name: 'Disetujui',
          contract_submission_detail: 'Detail pengajuan tersedia',
          negotiation_date: '2024-01-12',
          notes: 'Kontrak diperpanjang dengan kenaikan gaji',
          employee_status: 2,
          employee_status_name: 'Disetujui',
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
      // const response = await contractRenewalService.getContractRenewals(params);
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
    { id: 'nip', label: 'NIP', minWidth: 120, sortable: true },
    {
      id: 'employee_name',
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
    { id: 'join_date', label: 'Tanggal Masuk', minWidth: 140, sortable: true },
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

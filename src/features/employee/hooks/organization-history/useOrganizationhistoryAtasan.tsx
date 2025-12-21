import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import organizationHistoryService, {
  OrganizationHistoryItem,
  OrganizationHistoryFilterParams,
} from '../../services/OrganizationHistoryService';
import useFilterStore from '../../../../stores/filterStore';
import type { DataTableColumn, DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';

type OrgHistoryListRow = OrganizationHistoryItem & { statusPerubahan: 'Rekomendasi' | 'Selesai' };

// Dummy data for Atasan view
const DUMMY_DATA_ATASAN: OrganizationHistoryItem[] = [
  {
    id: '1',
    idKaryawan: 'NIP101',
    user: {
      name: 'Andi Wijaya',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi',
    },
    jenisPerubahan: 'Promosi',
    tanggalEfektif: '2024-06-15T00:00:00.000Z',
    posisiLama: 'Junior Analyst',
    posisiBaru: 'Analyst',
    divisiLama: 'Business Intelligence',
    divisiBaru: 'Business Intelligence',
    direktoratLama: 'Strategy',
    direktoratBaru: 'Strategy',
    alasanPerubahan: 'Rekomendasi dari atasan langsung',
  },
  {
    id: '2',
    idKaryawan: 'NIP102',
    user: {
      name: 'Maya Sari',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    },
    jenisPerubahan: 'Rotasi',
    tanggalEfektif: '2024-07-01T00:00:00.000Z',
    posisiLama: 'Designer',
    posisiBaru: 'UI/UX Designer',
    divisiLama: 'Creative',
    divisiBaru: 'Product Design',
    direktoratLama: 'Marketing',
    direktoratBaru: 'Product',
    alasanPerubahan: 'Pengembangan skill dan karir',
  },
  {
    id: '3',
    idKaryawan: 'NIP103',
    user: {
      name: 'Rudi Hermawan',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rudi',
    },
    jenisPerubahan: 'Mutasi',
    tanggalEfektif: '2024-08-10T00:00:00.000Z',
    posisiLama: 'Customer Service',
    posisiBaru: 'Customer Service',
    divisiLama: 'CS Jakarta',
    divisiBaru: 'CS Bandung',
    direktoratLama: 'Operations',
    direktoratBaru: 'Operations',
    alasanPerubahan: 'Kebutuhan ekspansi regional',
  },
  {
    id: '4',
    idKaryawan: 'NIP104',
    user: {
      name: 'Linda Kusuma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda',
    },
    jenisPerubahan: 'Promosi',
    tanggalEfektif: '2024-09-20T00:00:00.000Z',
    posisiLama: 'Staff Accounting',
    posisiBaru: 'Supervisor Accounting',
    divisiLama: 'Accounting',
    divisiBaru: 'Accounting',
    direktoratLama: 'Finance',
    direktoratBaru: 'Finance',
    alasanPerubahan: 'Prestasi kerja memuaskan',
  },
];

export interface UseOrganizationHistoryAtasanOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useOrganizationHistoryAtasan(options: UseOrganizationHistoryAtasanOptions = {}) {
  const { initialPage = 1, initialLimit = 10, autoFetch = true } = options;
  const navigate = useNavigate();

  const [data, setData] = useState<OrganizationHistoryItem[]>(DUMMY_DATA_ATASAN); // Using dummy data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(DUMMY_DATA_ATASAN.length);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filterValue = useFilterStore((s) => s.filters['Organization History Atasan'] ?? '');

  const fetchOrganizationHistory = useCallback(
    async (params?: OrganizationHistoryFilterParams) => {
      try {
        setLoading(true);
        setError(null);

        // Using dummy data for now - comment out API call
        // const response = await organizationHistoryService.list({
        //   page,
        //   limit,
        //   filter: params?.filter ?? filterValue,
        //   ...params,
        // });
        // const payload = response.data as any;
        // const items = Array.isArray(payload) ? payload : payload.items || payload.data || [];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let items = [...DUMMY_DATA_ATASAN];
        
        // Apply search filter if exists
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          items = items.filter(item => 
            item.idKaryawan?.toLowerCase().includes(searchLower) ||
            item.user?.name?.toLowerCase().includes(searchLower) ||
            item.jenisPerubahan?.toLowerCase().includes(searchLower)
          );
        }
        
        setData(items);
        setTotal(items.length);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, filterValue]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchOrganizationHistory();
    }
  }, [fetchOrganizationHistory, autoFetch, filterValue]);

  const createOrganizationHistory = useCallback(
    async (payload: Omit<OrganizationHistoryItem, 'id'>) => {
      try {
        setLoading(true);
        setError(null);
        const response = await organizationHistoryService.create(payload);
        await fetchOrganizationHistory();
        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat data';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchOrganizationHistory]
  );

  const updateOrganizationHistory = useCallback(
    async (id: string, payload: Partial<OrganizationHistoryItem>) => {
      try {
        setLoading(true);
        setError(null);
        const response = await organizationHistoryService.update(id, payload);
        await fetchOrganizationHistory();
        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui data';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchOrganizationHistory]
  );

  const deleteOrganizationHistory = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await organizationHistoryService.remove(id);
        await fetchOrganizationHistory();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus data';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchOrganizationHistory]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      setPage(1);
      fetchOrganizationHistory({ search });
    },
    [fetchOrganizationHistory]
  );

  const handleSortChange = useCallback(
    (columnId: string, order: 'asc' | 'desc') => {
      setPage(1);
      fetchOrganizationHistory({ sortBy: columnId, order });
    },
    [fetchOrganizationHistory]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);
    },
    []
  );

  // Format date helper
  const formatDate = useCallback((iso: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    return fmt.format(d);
  }, []);

  // Add status to rows
  const rowsWithStatus: OrgHistoryListRow[] = useMemo(
    () => (data || []).map((r, idx) => ({ ...r, statusPerubahan: idx % 2 === 0 ? 'Rekomendasi' : 'Selesai' })),
    [data]
  );

  // Define columns
  const columns: DataTableColumn<OrgHistoryListRow>[] = useMemo(
    () => [
      { id: 'no', label: 'No.', align: 'center', format: (_v, row) => data.findIndex((r) => r.id === row.id) + 1 },
      { id: 'idKaryawan', label: 'NIP' },
      {
        id: 'user',
        label: 'User',
        format: (_v, row) => (
          <div className="flex items-center gap-2">
            <img
              src={(row.user?.avatar as string) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.user?.name || 'User'}`}
              alt={row.user?.name || 'User'}
              className="h-6 w-6 rounded-full"
            />
            <span>{row.user?.name || '-'}</span>
          </div>
        ),
      },
      { id: 'jenisPerubahan', label: 'Jenis Perubahan' },
      { id: 'tanggalEfektif', label: 'Tanggal Efektif', format: (v) => formatDate(v as string) },
      { id: 'posisiLama', label: 'Posisi Lama' },
      { id: 'posisiBaru', label: 'Posisi Baru' },
      { id: 'divisiLama', label: 'Divisi Lama' },
      { id: 'divisiBaru', label: 'Divisi Baru' },
      { id: 'direktoratLama', label: 'Direktorat Lama' },
      { id: 'direktoratBaru', label: 'Direktorat Baru' },
      { id: 'alasanPerubahan', label: 'Alasan Perubahan' },
      {
        id: 'statusPerubahan',
        label: 'Status Perubahan',
        align: 'center',
        format: (v: string) => {
          const val = (v as string) || '-';
          const isRekom = val === 'Rekomendasi';
          const base = 'inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium';
          const cls = isRekom ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600';
          return <span className={`${base} ${cls}`}>{val}</span>;
        },
      },
    ],
    [data, formatDate]
  );

  // Define actions (Atasan only has view action)
  const actions: DataTableAction<OrgHistoryListRow>[] = useMemo(
    () => [
      {
        icon: <IconFileDetail />,
        className: 'text-gray-700',
        onClick: (row) => {
          navigate(`/organization-history/preview?id=${row.id}`);
        },
      },
    ],
    [navigate]
  );

  // Handle modal open for add
  const handleAddOrganization = useCallback(() => {
    setIsEditOrgOpen(true);
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setIsEditOrgOpen(false);
  }, []);

  // Handle modal submit
  const handleSubmitModal = useCallback(() => {
    setIsEditOrgOpen(false);
  }, []);

  // Handle dropdown toggle
  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(!isDropdownOpen);
  }, [isDropdownOpen]);

  // Handle dropdown close
  const handleDropdownClose = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  // Handle navigation to HR page
  const handleNavigateToHR = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/organization-history');
  }, [navigate]);

  // Handle navigation to Atasan page
  const handleNavigateToAtasan = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/organization-history/atasan');
  }, [navigate]);

  return {
    // Data states
    data,
    loading,
    error,
    total,
    page,
    limit,
    rowsWithStatus,
    
    // Modal states
    isEditOrgOpen,
    isDropdownOpen,
    
    // Table configuration
    columns,
    actions,
    
    // API operations
    fetchOrganizationHistory,
    createOrganizationHistory,
    updateOrganizationHistory,
    deleteOrganizationHistory,
    
    // Event handlers
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleAddOrganization,
    handleCloseModal,
    handleSubmitModal,
    handleDropdownToggle,
    handleDropdownClose,
    handleNavigateToHR,
    handleNavigateToAtasan,
  };
}

export default useOrganizationHistoryAtasan;

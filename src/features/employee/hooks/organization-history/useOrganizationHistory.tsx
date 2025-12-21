import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import organizationHistoryService, {
  OrganizationHistoryItem,
  OrganizationHistoryFilterParams,
} from '../../services/OrganizationHistoryService';
import useFilterStore from '../../../../stores/filterStore';
import type { DataTableColumn, DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import { IconPencil, IconFileDetail } from '@/icons/components/icons';

type OrgHistoryListRow = OrganizationHistoryItem & { statusPerubahan: 'Rekomendasi' | 'Selesai' };

// Dummy data for temporary use
const DUMMY_DATA: OrganizationHistoryItem[] = [
  {
    id: '1',
    idKaryawan: 'NIP001',
    user: {
      name: 'Ahmad Fauzi',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    },
    jenisPerubahan: 'Promosi',
    tanggalEfektif: '2024-01-15T00:00:00.000Z',
    posisiLama: 'Staff Developer',
    posisiBaru: 'Senior Developer',
    divisiLama: 'IT Development',
    divisiBaru: 'IT Development',
    direktoratLama: 'Teknologi',
    direktoratBaru: 'Teknologi',
    alasanPerubahan: 'Kinerja yang baik dan konsisten',
  },
  {
    id: '2',
    idKaryawan: 'NIP002',
    user: {
      name: 'Siti Nurhaliza',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    },
    jenisPerubahan: 'Mutasi',
    tanggalEfektif: '2024-02-20T00:00:00.000Z',
    posisiLama: 'HR Staff',
    posisiBaru: 'HR Staff',
    divisiLama: 'HR Operations',
    divisiBaru: 'HR Recruitment',
    direktoratLama: 'Human Resources',
    direktoratBaru: 'Human Resources',
    alasanPerubahan: 'Kebutuhan operasional',
  },
  {
    id: '3',
    idKaryawan: 'NIP003',
    user: {
      name: 'Budi Santoso',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    },
    jenisPerubahan: 'Rotasi',
    tanggalEfektif: '2024-03-10T00:00:00.000Z',
    posisiLama: 'Marketing Executive',
    posisiBaru: 'Sales Executive',
    divisiLama: 'Marketing',
    divisiBaru: 'Sales',
    direktoratLama: 'Commercial',
    direktoratBaru: 'Commercial',
    alasanPerubahan: 'Pengembangan karir',
  },
  {
    id: '4',
    idKaryawan: 'NIP004',
    user: {
      name: 'Dewi Lestari',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi',
    },
    jenisPerubahan: 'Promosi',
    tanggalEfektif: '2024-04-05T00:00:00.000Z',
    posisiLama: 'Analyst',
    posisiBaru: 'Senior Analyst',
    divisiLama: 'Finance',
    divisiBaru: 'Finance',
    direktoratLama: 'Finance & Accounting',
    direktoratBaru: 'Finance & Accounting',
    alasanPerubahan: 'Prestasi kerja yang outstanding',
  },
  {
    id: '5',
    idKaryawan: 'NIP005',
    user: {
      name: 'Rizky Pratama',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rizky',
    },
    jenisPerubahan: 'Mutasi',
    tanggalEfektif: '2024-05-12T00:00:00.000Z',
    posisiLama: 'Product Manager',
    posisiBaru: 'Product Manager',
    divisiLama: 'Product Division A',
    divisiBaru: 'Product Division B',
    direktoratLama: 'Product',
    direktoratBaru: 'Product',
    alasanPerubahan: 'Ekspansi tim produk baru',
  },
];

export interface UseOrganizationHistoryOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useOrganizationHistory(options: UseOrganizationHistoryOptions = {}) {
  const { initialPage = 1, initialLimit = 10, autoFetch = true } = options;
  const navigate = useNavigate();

  const [data, setData] = useState<OrganizationHistoryItem[]>(DUMMY_DATA); // Using dummy data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(DUMMY_DATA.length);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<OrgHistoryListRow | null>(null);
  const filterValue = useFilterStore((s) => s.filters['Organization History'] ?? '');

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
        
        let items = [...DUMMY_DATA];
        
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
          const base = ' rounded-full p-[10px] flex justify-center text-xs font-medium';
          const cls = isRekom ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600';
          return <span className={`${base} ${cls}`}>{val}</span>;
        },
      },
    ],
    [data, formatDate]
  );

  // Define actions
  const actions: DataTableAction<OrgHistoryListRow>[] = useMemo(
    () => [
      {
        icon: <IconFileDetail />,
        className: 'text-gray-700',
        onClick: (row) => {
          navigate(`/organization-history/preview?id=${row.id}`);
        },
      },
      {
        icon: <IconPencil />,
        className: 'text-gray-700',
        onClick: (row) => {
          setSelectedRow(row);
          setIsEditOrgOpen(true);
        },
      }
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
    setSelectedRow(null);
  }, []);

  // Handle modal submit
  const handleSubmitModal = useCallback(() => {
    setIsEditOrgOpen(false);
    setSelectedRow(null);
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
    selectedRow,
    
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

export default useOrganizationHistory;
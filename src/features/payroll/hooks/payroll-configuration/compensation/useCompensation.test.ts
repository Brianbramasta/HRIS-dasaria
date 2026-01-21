import { renderHook, act } from '@testing-library/react';
import { useCompensation } from './useCompensation';
import { useApiCompensation } from '../../api/useApiCompensation';
import { useModal } from '@/hooks/useModal';
import * as formatCurrencyUtils from '@/utils/formatCurrency';

// Mock api service globally to prevent import.meta error
jest.mock('@/services/api', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    buildQueryString: jest.fn(),
  },
}));

// Mock dependencies
jest.mock('../../api/useApiCompensation');
jest.mock('@/hooks/useModal');
jest.mock('@/utils/formatCurrency');

const mockUseApiCompensation = useApiCompensation as jest.Mock;
const mockUseModal = useModal as jest.Mock;

describe('useCompensation Hook', () => {
  const mockApi = {
    compensations: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pageSize: 10,
    fetchCompensations: jest.fn(),
    updateCompensation: jest.fn(),
    getCompensationDetail: jest.fn(),
    setPage: jest.fn(),
    setPageSize: jest.fn(),
    setSearch: jest.fn(),
    setSort: jest.fn(),
  };

  const mockModal = {
    isOpen: false,
    openModal: jest.fn(),
    closeModal: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApiCompensation.mockReturnValue(mockApi);
    mockUseModal.mockReturnValue(mockModal);
    (formatCurrencyUtils.formatCurrencyValue as jest.Mock).mockImplementation((val) => val ? `Rp ${val}` : '-');
    (formatCurrencyUtils.formatCurrency as jest.Mock).mockImplementation((val) => `Rp ${val}`);
    (formatCurrencyUtils.parseCurrency as jest.Mock).mockImplementation((val) => val === 'Rp 1000' ? 1000 : null);
  });

  it('harus menginisialisasi dan mengambil data kompensasi', () => {
    const { result } = renderHook(() => useCompensation());

    expect(result.current.loading).toBe(false);
    expect(mockApi.fetchCompensations).toHaveBeenCalled();
  });

  it('harus memetakan baris (rows) dengan benar', () => {
    const mockData = [
      {
        id: '1',
        jobTitleName: 'Manager',
        categoryCompensation: 'Gaji Pokok',
        amountGeneral: 1000000,
        amountJunior: null,
        amountMiddle: null,
        amountSenior: null,
      },
    ];
    mockUseApiCompensation.mockReturnValue({ ...mockApi, compensations: mockData });

    const { result } = renderHook(() => useCompensation());

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0]['level-jabatan']).toBe('Manager');
    expect(result.current.rows[0].general).toBe('Rp 1000000');
    expect(result.current.rows[0].junior).toBe('-');
  });

  it('harus menangani pembukaan modal edit dan mengambil detail', async () => {
    const mockItem = { id: '1', jobTitleName: 'Manager' };
    const mockDetail = {
      id: '1',
      jobTitle: { jobTitleName: 'Manager Updated', structuralJobs: [] },
      categoryCompensation: 'Uang Saku',
      amountGeneral: 2000000,
      amountJunior: null,
      amountMiddle: null,
      amountSenior: null,
    };
    
    mockApi.getCompensationDetail.mockResolvedValue(mockDetail);

    const { result } = renderHook(() => useCompensation());

    await act(async () => {
      await result.current.handleEditOpen(mockItem as any);
    });

    expect(result.current.selected).toEqual(expect.objectContaining({
      jobTitleName: 'Manager Updated',
      amountGeneral: 2000000,
    }));
    expect(mockModal.openModal).toHaveBeenCalled();
  });

  it('harus menangani submit edit dengan sukses', async () => {
    const mockItem = { id: '1', jobTitleName: 'Manager' };
    mockUseApiCompensation.mockReturnValue({ ...mockApi, error: null });
    
    const { result } = renderHook(() => useCompensation());

    // Setup selected state via simulation
    await act(async () => {
      await result.current.handleEditOpen(mockItem as any);
    });

    const formData = {
      kategori: 'Gaji Pokok',
      general: 'Rp 1000',
    };

    await act(async () => {
      await result.current.handleEditSubmit(formData as any);
    });

    expect(mockApi.updateCompensation).toHaveBeenCalledWith('1', expect.objectContaining({
      categoryCompensation: 'Gaji Pokok',
      amountGeneral: 1000,
    }));
    expect(mockModal.closeModal).toHaveBeenCalled();
    expect(mockApi.fetchCompensations).toHaveBeenCalledTimes(2); // 1 mount + 1 submit
  });

  it('harus memanggil fetchCompensations ulang ketika fungsi berubah (simulasi perubahan parameter)', () => {
    // Render awal
    const { rerender } = renderHook(() => useCompensation());
    expect(mockApi.fetchCompensations).toHaveBeenCalledTimes(1);

    // Simulasi perubahan referensi fetchCompensations (terjadi saat page/sort berubah di useApiCompensation)
    const newFetchCompensations = jest.fn();
    mockUseApiCompensation.mockReturnValue({
      ...mockApi,
      fetchCompensations: newFetchCompensations,
    });

    // Rerender hook untuk memicu effect
    rerender();

    expect(newFetchCompensations).toHaveBeenCalledTimes(1);
  });
});

import { renderHook, act } from '@testing-library/react';
import { useRefDeduction } from './useRefDeduction';
import { useApiRefDeduction } from '../../api/useApiRefDeduction';
import { useModal } from '@/hooks/useModal';
import { formatCurrencyValue } from '@/utils/formatCurrency';

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
jest.mock('../../api/useApiRefDeduction');
jest.mock('@/hooks/useModal');
jest.mock('@/utils/formatCurrency');

const mockUseApiRefDeduction = useApiRefDeduction as jest.Mock;
const mockUseModal = useModal as jest.Mock;

describe('useRefDeduction Hook', () => {
  const mockApi = {
    refDeductions: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pageSize: 10,
    fetchRefDeductions: jest.fn(),
    updateRefDeduction: jest.fn(),
    getRefDeductionDetail: jest.fn(),
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
    mockUseApiRefDeduction.mockReturnValue(mockApi);
    mockUseModal.mockReturnValue(mockModal);
    (formatCurrencyValue as jest.Mock).mockImplementation((val) => val ? `Rp ${val}` : '-');
  });

  it('harus menginisialisasi dan mengambil data ref deduction', () => {
    const { result } = renderHook(() => useRefDeduction());

    expect(result.current.loading).toBe(false);
    expect(mockApi.fetchRefDeductions).toHaveBeenCalled();
  });

  it('harus memetakan baris (rows) dengan benar', () => {
    const mockData = [
      {
        id: '1',
        referenceName: 'UMR',
        category: 'BPJS',
        nominalValue: 1000000,
        description: 'Keterangan',
      },
    ];
    mockUseApiRefDeduction.mockReturnValue({ ...mockApi, refDeductions: mockData });

    const { result } = renderHook(() => useRefDeduction());

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].acuanPotongan).toBe('UMR');
    expect(result.current.rows[0].nominal).toBe('Rp 1000000');
    expect(result.current.rows[0].keterangan).toBe('Keterangan');
  });

  it('harus menangani pembukaan modal edit', () => {
    const { result } = renderHook(() => useRefDeduction());
    const item = { id: '1' } as any;

    act(() => {
      result.current.handleEditOpen(item);
    });

    expect(result.current.selected).toBe(item);
    expect(mockModal.openModal).toHaveBeenCalled();
  });

  it('harus menangani penutupan modal edit', () => {
    const { result } = renderHook(() => useRefDeduction());

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.selected).toBeNull();
    expect(mockModal.closeModal).toHaveBeenCalled();
  });

  it('harus menangani success update', () => {
    const { result } = renderHook(() => useRefDeduction());

    act(() => {
      result.current.handleSuccess();
    });

    expect(mockApi.fetchRefDeductions).toHaveBeenCalled();
    expect(mockModal.closeModal).toHaveBeenCalled();
  });
});

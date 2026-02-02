import { renderHook, act } from '@testing-library/react';
import { useApiDeduction } from './useApiDeduction';
import { deductionServices } from '../../services/DeductionServices';
import useFilterStore from '../../../../stores/filterStore';

// Mock service
jest.mock('../../services/DeductionServices', () => ({
  deductionServices: {
    getDeductionList: jest.fn(),
    createDeduction: jest.fn(),
    updateDeduction: jest.fn(),
    deleteDeduction: jest.fn(),
    getDeductionDetail: jest.fn(),
  },
}));

// Mock store
jest.mock('../../../../stores/filterStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useApiDeduction', () => {
  const mockGetList = deductionServices.getDeductionList as jest.Mock;
  const mockCreate = deductionServices.createDeduction as jest.Mock;
  const mockUpdate = deductionServices.updateDeduction as jest.Mock;
  const mockDelete = deductionServices.deleteDeduction as jest.Mock;
  const mockGetDetail = deductionServices.getDeductionDetail as jest.Mock;
  const mockUseFilterStore = useFilterStore as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilterStore.mockImplementation((selector: any) => selector({ filters: {} }));
  });

  it('harus memiliki state awal yang benar', () => {
    const { result } = renderHook(() => useApiDeduction());

    expect(result.current.deductions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('harus mengambil daftar potongan dengan sukses', async () => {
    const mockResponse = {
      data: {
        data: [
          {
            id: '1',
            deduction_name: 'Potongan Telat',
            category: 'Absensi',
            description: 'Potongan jika terlambat',
          },
        ],
        total: 1,
        per_page: 10,
      },
    };

    mockGetList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useApiDeduction());

    await act(async () => {
      await result.current.fetchDeductions();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.deductions).toHaveLength(1);
    expect(result.current.deductions[0].deductionName).toBe('Potongan Telat');
    expect(mockGetList).toHaveBeenCalled();
  });

  it('harus menangani error saat gagal mengambil daftar', async () => {
    mockGetList.mockRejectedValue(new Error('Gagal ambil data'));

    const { result } = renderHook(() => useApiDeduction());

    await act(async () => {
      await result.current.fetchDeductions();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Gagal ambil data');
    expect(result.current.deductions).toEqual([]);
  });

  it('harus membuat potongan baru dengan sukses', async () => {
    mockCreate.mockResolvedValue({});

    const { result } = renderHook(() => useApiDeduction());

    const payload = {
      deductionName: 'Potongan Baru',
      category: 'Lainnya',
      description: 'Desc',
    };

    let success;
    await act(async () => {
      success = await result.current.createDeduction(payload);
    });

    expect(success).toBe(true);
    expect(mockCreate).toHaveBeenCalledWith(expect.any(FormData));
  });

  it('harus menangani error saat gagal membuat potongan', async () => {
    mockCreate.mockRejectedValue(new Error('Gagal buat'));

    const { result } = renderHook(() => useApiDeduction());

    const payload = {
      deductionName: 'Potongan Baru',
      category: 'Lainnya',
      description: 'Desc',
    };

    let success;
    await act(async () => {
      success = await result.current.createDeduction(payload);
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Gagal buat');
  });

  it('harus memperbarui potongan dengan sukses', async () => {
    mockUpdate.mockResolvedValue({});

    const { result } = renderHook(() => useApiDeduction());

    const payload = {
      deductionName: 'Update Potongan',
      category: 'Lainnya',
      description: 'Desc',
    };

    let success;
    await act(async () => {
      success = await result.current.updateDeduction('1', payload);
    });

    expect(success).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith('1', expect.any(FormData));
  });

  it('harus menghapus potongan dengan sukses', async () => {
    mockDelete.mockResolvedValue({});

    const { result } = renderHook(() => useApiDeduction());

    let success;
    await act(async () => {
      success = await result.current.deleteDeduction('1');
    });

    expect(success).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith('1', expect.any(FormData));
  });

  it('harus mengambil detail potongan dengan sukses', async () => {
    const mockDetail = {
      data: {
        id: '1',
        deduction_name: 'Potongan A',
        category: 'Umum',
        description: 'Desc',
        is_active: true,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
    };

    mockGetDetail.mockResolvedValue(mockDetail);

    const { result } = renderHook(() => useApiDeduction());

    let detail;
    await act(async () => {
      detail = await result.current.getDeductionDetail('1');
    });

    expect(detail).toEqual({
      id: '1',
      deductionName: 'Potongan A',
      category: 'Umum',
      description: 'Desc',
      isActive: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    });
  });

  it('harus mengubah parameter pagination, search, dan sort', () => {
    const { result } = renderHook(() => useApiDeduction());

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setPageSize(20);
    });
    expect(result.current.pageSize).toBe(20);

    act(() => {
      result.current.setSearch('cari');
    });
    expect(result.current.search).toBe('cari');

    act(() => {
      result.current.setSort('deductionName', 'asc');
    });
    expect(result.current.sortBy).toBe('deductionName');
    expect(result.current.sortOrder).toBe('asc');
  });

  it('harus menggunakan filter dari store', async () => {
    mockUseFilterStore.mockImplementation((selector: any) => selector({ filters: { Deduction: 'filtered' } }));
    mockGetList.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useApiDeduction());

    expect(result.current.filterValue).toBe('filtered');

    await act(async () => {
      await result.current.fetchDeductions();
    });

    expect(mockGetList).toHaveBeenCalledWith(expect.objectContaining({
      filter: 'filtered'
    }));
  });
});

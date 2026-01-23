import { renderHook, act } from '@testing-library/react';
import { useApiNonFixedAllowance } from './useApiNonFixedAllowance';
import { nonFixedAllowanceServices } from '../../../services/non-fixed-allowance/NonFixedAllowanceServices';
import useFilterStore from '../../../../../stores/filterStore';

// Mock service
jest.mock('../../../services/non-fixed-allowance/NonFixedAllowanceServices', () => ({
  nonFixedAllowanceServices: {
    getList: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getDetail: jest.fn(),
  },
}));

// Mock store
jest.mock('../../../../../stores/filterStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useApiNonFixedAllowance', () => {
  const mockGetList = nonFixedAllowanceServices.getList as jest.Mock;
  const mockCreate = nonFixedAllowanceServices.create as jest.Mock;
  const mockUpdate = nonFixedAllowanceServices.update as jest.Mock;
  const mockDelete = nonFixedAllowanceServices.delete as jest.Mock;
  const mockGetDetail = nonFixedAllowanceServices.getDetail as jest.Mock;
  const mockUseFilterStore = useFilterStore as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilterStore.mockImplementation((selector: any) => selector({ filters: {} }));
  });

  it('harus memiliki state awal yang benar', () => {
    const { result } = renderHook(() => useApiNonFixedAllowance());

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('harus mengambil daftar tunjangan tidak tetap dengan sukses', async () => {
    const mockResponse = {
      data: {
        data: [
          {
            id: '1',
            allowance_name: 'Makan',
            category_sub: 'Harian',
            description: 'Uang makan harian',
          },
        ],
        total: 1,
        per_page: 10,
      },
    };

    mockGetList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useApiNonFixedAllowance());

    await act(async () => {
      await result.current.fetchList();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].allowanceName).toBe('Makan');
    expect(mockGetList).toHaveBeenCalled();
  });

  it('harus menangani error saat gagal mengambil daftar', async () => {
    mockGetList.mockRejectedValue(new Error('Gagal mengambil data'));

    const { result } = renderHook(() => useApiNonFixedAllowance());

    await act(async () => {
      await result.current.fetchList();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Gagal mengambil data');
    expect(result.current.data).toEqual([]);
  });

  it('harus membuat data baru dengan sukses', async () => {
    const mockCreatedData = {
      id: '2',
      allowance_name: 'Transport',
      category_sub: 'Bulanan',
      description: 'Desc',
    };
    mockCreate.mockResolvedValue({ data: mockCreatedData });

    const { result } = renderHook(() => useApiNonFixedAllowance());

    const payload = {
      allowanceName: 'Transport',
      categorySub: 'Bulanan',
      description: 'Desc',
    };

    let newItem: any;
    await act(async () => {
      newItem = await result.current.createData(payload);
    });

    expect(mockCreate).toHaveBeenCalledWith(expect.any(FormData));
    expect(newItem?.allowanceName).toBe('Transport');
    expect(result.current.error).toBeNull();
  });

  it('harus menangani error saat gagal membuat data', async () => {
    mockCreate.mockRejectedValue(new Error('Gagal membuat'));

    const { result } = renderHook(() => useApiNonFixedAllowance());

    const payload = {
      allowanceName: 'Transport',
      categorySub: 'Bulanan',
      description: 'Desc',
    };

    let newItem;
    await act(async () => {
      newItem = await result.current.createData(payload);
    });

    expect(newItem).toBeNull();
    expect(result.current.error).toBe('Gagal membuat');
  });

  it('harus memperbarui data dengan sukses', async () => {
    mockUpdate.mockResolvedValue({});

    const { result } = renderHook(() => useApiNonFixedAllowance());

    const payload = {
      allowanceName: 'Makan Update',
      categorySub: 'Harian',
      description: 'Desc Update',
    };

    await act(async () => {
      await result.current.updateData('1', payload);
    });

    expect(mockUpdate).toHaveBeenCalledWith('1', expect.any(FormData));
    expect(result.current.error).toBeNull();
  });

  it('harus menghapus data dengan sukses', async () => {
    mockDelete.mockResolvedValue({});

    const { result } = renderHook(() => useApiNonFixedAllowance());

    let success;
    await act(async () => {
      success = await result.current.deleteData('1');
    });

    expect(success).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  it('harus mengambil detail data dengan sukses', async () => {
    const mockDetail = {
      data: {
        id: '1',
        allowance_name: 'Makan',
        category_sub: 'Harian',
        description: 'Desc',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
    };

    mockGetDetail.mockResolvedValue(mockDetail);

    const { result } = renderHook(() => useApiNonFixedAllowance());

    let detail;
    await act(async () => {
      detail = await result.current.getDetail('1');
    });

    expect(detail).toEqual({
      id: '1',
      allowanceName: 'Makan',
      categorySub: 'Harian',
      description: 'Desc',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    });
  });

  it('harus mengubah parameter pagination, search, dan sort', () => {
    const { result } = renderHook(() => useApiNonFixedAllowance());

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setPageSize(20);
    });
    expect(result.current.pageSize).toBe(20);
    expect(result.current.page).toBe(1);

    act(() => {
      result.current.setSearch('cari');
    });
    expect(result.current.search).toBe('cari');
    expect(result.current.page).toBe(1);

    act(() => {
      result.current.setSort('allowanceName', 'asc');
    });
    expect(result.current.sortBy).toBe('allowanceName');
    expect(result.current.sortOrder).toBe('asc');
  });

  it('harus menggunakan filter dari store', async () => {
    mockUseFilterStore.mockImplementation((selector: any) => selector({ filters: { NonFixedAllowance: 'filtered' } }));
    mockGetList.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useApiNonFixedAllowance());

    expect(result.current.filterValue).toBe('filtered');

    await act(async () => {
      await result.current.fetchList();
    });

    expect(mockGetList).toHaveBeenCalledWith(expect.objectContaining({
      filter: 'filtered'
    }));
  });
});

import { renderHook, act } from '@testing-library/react';
import { useApiLengthOfServiceAllowance } from './useApiLengthOfServiceAllowance';
import { lengthOfServiceAllowanceServices } from '../../../services/fixed-allowance/LengthOfServiceAllowanceServices';
import useFilterStore from '../../../../../stores/filterStore';

// Mock service
jest.mock('../../../services/fixed-allowance/LengthOfServiceAllowanceServices', () => ({
  lengthOfServiceAllowanceServices: {
    getList: jest.fn(),
    update: jest.fn(),
    getDetail: jest.fn(),
  },
}));

// Mock store
jest.mock('../../../../../stores/filterStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useApiLengthOfServiceAllowance', () => {
  const mockGetList = lengthOfServiceAllowanceServices.getList as jest.Mock;
  const mockUpdate = lengthOfServiceAllowanceServices.update as jest.Mock;
  const mockGetDetail = lengthOfServiceAllowanceServices.getDetail as jest.Mock;
  const mockUseFilterStore = useFilterStore as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilterStore.mockImplementation((selector: any) => selector({ filters: {} }));
  });

  it('harus memiliki state awal yang benar', () => {
    const { result } = renderHook(() => useApiLengthOfServiceAllowance());

    expect(result.current.items).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('harus mengambil daftar tunjangan masa kerja dengan sukses', async () => {
    const mockData = {
      data: {
        data: [
          {
            id: '1',
            length_of_service: '1 Tahun',
            nominal_value: 200000,
          },
        ],
        total: 1,
        per_page: 10,
      },
    };

    mockGetList.mockResolvedValue(mockData);

    const { result } = renderHook(() => useApiLengthOfServiceAllowance());

    await act(async () => {
      await result.current.fetchItems();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].lengthOfService).toBe('1 Tahun');
    expect(mockGetList).toHaveBeenCalled();
  });

  it('harus menangani error saat gagal mengambil daftar', async () => {
    mockGetList.mockRejectedValue(new Error('Fetch Error'));

    const { result } = renderHook(() => useApiLengthOfServiceAllowance());

    await act(async () => {
      await result.current.fetchItems();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Fetch Error');
    expect(result.current.items).toEqual([]);
  });

  it('harus memperbarui tunjangan masa kerja dengan sukses', async () => {
    mockUpdate.mockResolvedValue({});

    const { result } = renderHook(() => useApiLengthOfServiceAllowance());

    const payload = { nominalValue: 250000 };
    
    await act(async () => {
      await result.current.updateItem('1', payload);
    });

    expect(mockUpdate).toHaveBeenCalledWith('1', expect.any(FormData));
    expect(result.current.error).toBeNull();
  });

  it('harus menangani error saat update gagal', async () => {
    mockUpdate.mockRejectedValue(new Error('Update Error'));

    const { result } = renderHook(() => useApiLengthOfServiceAllowance());

    const payload = { nominalValue: 250000 };
    
    await act(async () => {
      await result.current.updateItem('1', payload);
    });

    expect(result.current.error).toBe('Update Error');
  });

  it('harus mengambil detail tunjangan masa kerja dengan sukses', async () => {
    const mockDetail = {
      data: {
        id: '1',
        length_of_service: '1 Tahun',
        nominal_value: 200000,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
    };

    mockGetDetail.mockResolvedValue(mockDetail);

    const { result } = renderHook(() => useApiLengthOfServiceAllowance());

    let detail;
    await act(async () => {
      detail = await result.current.getItemDetail('1');
    });

    expect(detail).toEqual({
      id: '1',
      lengthOfService: '1 Tahun',
      nominalValue: 200000,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    });
  });

  it('harus mengubah parameter pagination, search, dan sort', () => {
    const { result } = renderHook(() => useApiLengthOfServiceAllowance());

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setPageSize(20);
    });
    expect(result.current.pageSize).toBe(20);

    act(() => {
      result.current.setSearch('query');
    });
    expect(result.current.search).toBe('query');

    act(() => {
      result.current.setSort('nominalValue', 'desc');
    });
    expect(result.current.sortBy).toBe('nominalValue');
    expect(result.current.sortOrder).toBe('desc');
  });

  it('harus menangani filter dari store', async () => {
    mockUseFilterStore.mockImplementation((selector: any) => selector({ filters: { LengthOfServiceAllowance: 'active' } }));
    mockGetList.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useApiLengthOfServiceAllowance());

    expect(result.current.filterValue).toBe('active');

    await act(async () => {
      await result.current.fetchItems();
    });

    expect(mockGetList).toHaveBeenCalledWith(expect.objectContaining({
      filter: 'active'
    }));
  });
});

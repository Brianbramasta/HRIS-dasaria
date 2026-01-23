import { renderHook, act } from '@testing-library/react';
import { useApiTransportationAllowance } from './useApiTransportationAllowance';
import { transportationAllowanceServices } from '../../../services/fixed-allowance/TransportationAllowanceServices';
import useFilterStore from '../../../../../stores/filterStore';

// Mock service
jest.mock('../../../services/fixed-allowance/TransportationAllowanceServices', () => ({
  transportationAllowanceServices: {
    getTransportationAllowanceList: jest.fn(),
    updateTransportationAllowance: jest.fn(),
    getTransportationAllowanceDetail: jest.fn(),
  },
}));

// Mock store
jest.mock('../../../../../stores/filterStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useApiTransportationAllowance', () => {
  const mockGetList = transportationAllowanceServices.getTransportationAllowanceList as jest.Mock;
  const mockUpdate = transportationAllowanceServices.updateTransportationAllowance as jest.Mock;
  const mockGetDetail = transportationAllowanceServices.getTransportationAllowanceDetail as jest.Mock;
  const mockUseFilterStore = useFilterStore as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Default implementation for store
    mockUseFilterStore.mockImplementation((selector: any) => selector({ filters: {} }));
  });

  it('harus memiliki state awal yang benar', () => {
    const { result } = renderHook(() => useApiTransportationAllowance());

    expect(result.current.transportationAllowances).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('harus mengambil daftar tunjangan transportasi dengan sukses', async () => {
    const mockData = {
      data: {
        data: [
          {
            id: '1',
            name_transportation: 'Bus',
            category_id: 'cat1',
            category_name: 'Umum',
            nominal_value: 50000,
          },
        ],
        total: 1,
        per_page: 10,
      },
    };

    mockGetList.mockResolvedValue(mockData);

    const { result } = renderHook(() => useApiTransportationAllowance());

    await act(async () => {
      await result.current.fetchTransportationAllowances();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.transportationAllowances).toHaveLength(1);
    expect(result.current.transportationAllowances[0].nameTransportation).toBe('Bus');
    expect(result.current.total).toBe(1);
    expect(mockGetList).toHaveBeenCalled();
  });

  it('harus menangani error saat gagal mengambil daftar', async () => {
    mockGetList.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useApiTransportationAllowance());

    await act(async () => {
      await result.current.fetchTransportationAllowances();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('API Error');
    expect(result.current.transportationAllowances).toEqual([]);
  });

  it('harus memperbarui tunjangan transportasi dengan sukses', async () => {
    mockUpdate.mockResolvedValue({});
    
    const { result } = renderHook(() => useApiTransportationAllowance());

    const payload = { nominalValue: 75000 };
    let success;

    await act(async () => {
      success = await result.current.updateTransportationAllowance('1', payload);
    });

    expect(success).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith('1', expect.any(FormData));
    expect(result.current.error).toBeNull();
  });

  it('harus menangani error saat update gagal', async () => {
    mockUpdate.mockRejectedValue(new Error('Update Failed'));

    const { result } = renderHook(() => useApiTransportationAllowance());

    const payload = { nominalValue: 75000 };
    let success;

    await act(async () => {
      success = await result.current.updateTransportationAllowance('1', payload);
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Update Failed');
  });

  it('harus mengambil detail tunjangan transportasi dengan sukses', async () => {
    const mockDetail = {
      data: {
        id: '1',
        name_transportation: 'Bus',
        category_name: 'Umum',
        nominal_value: 50000,
      },
    };

    mockGetDetail.mockResolvedValue(mockDetail);

    const { result } = renderHook(() => useApiTransportationAllowance());

    let detail;
    await act(async () => {
      detail = await result.current.getTransportationAllowanceDetail('1');
    });

    expect(detail).toEqual({
      id: '1',
      nameTransportation: 'Bus',
      categoryName: 'Umum',
      nominalValue: 50000,
    });
  });

  it('harus mengubah halaman dan pageSize', () => {
    const { result } = renderHook(() => useApiTransportationAllowance());

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setPageSize(20);
    });
    expect(result.current.pageSize).toBe(20);
    // setPageSize harus reset page ke 1
    expect(result.current.page).toBe(1);
  });

  it('harus mengubah pencarian dan sorting', () => {
    const { result } = renderHook(() => useApiTransportationAllowance());

    act(() => {
      result.current.setSearch('test');
    });
    expect(result.current.search).toBe('test');
    expect(result.current.page).toBe(1); // Reset page

    act(() => {
      result.current.setSort('nameTransportation', 'asc');
    });
    expect(result.current.sortBy).toBe('nameTransportation');
    expect(result.current.sortOrder).toBe('asc');
  });

  it('harus menggunakan filter dari store jika ada', async () => {
    mockUseFilterStore.mockImplementation((selector: any) => selector({ filters: { TransportationAllowance: 'active' } }));
    mockGetList.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useApiTransportationAllowance());

    expect(result.current.filterValue).toBe('active');

    await act(async () => {
      await result.current.fetchTransportationAllowances();
    });

    expect(mockGetList).toHaveBeenCalledWith(expect.objectContaining({
      filter: 'active'
    }));
  });
});

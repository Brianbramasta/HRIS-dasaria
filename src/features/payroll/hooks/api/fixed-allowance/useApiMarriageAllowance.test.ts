import { renderHook, act } from '@testing-library/react';
import { useApiMarriageAllowance } from './useApiMarriageAllowance';
import { marriageAllowanceServices } from '../../../services/fixed-allowance/MarriageAllowanceServices';
import useFilterStore from '../../../../../stores/filterStore';

// Mock service
jest.mock('../../../services/fixed-allowance/MarriageAllowanceServices', () => ({
  marriageAllowanceServices: {
    getMarriageAllowanceList: jest.fn(),
    updateMarriageAllowance: jest.fn(),
    getMarriageAllowanceDetail: jest.fn(),
  },
}));

// Mock store
jest.mock('../../../../../stores/filterStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useApiMarriageAllowance', () => {
  const mockGetList = marriageAllowanceServices.getMarriageAllowanceList as jest.Mock;
  const mockUpdate = marriageAllowanceServices.updateMarriageAllowance as jest.Mock;
  const mockGetDetail = marriageAllowanceServices.getMarriageAllowanceDetail as jest.Mock;
  const mockUseFilterStore = useFilterStore as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilterStore.mockImplementation((selector: any) => selector({ filters: {} }));
  });

  it('harus memiliki state awal yang benar', () => {
    const { result } = renderHook(() => useApiMarriageAllowance());

    expect(result.current.marriageAllowances).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('harus mengambil daftar tunjangan pernikahan dengan sukses', async () => {
    const mockData = {
      data: {
        data: [
          {
            id: '1',
            code: 'M001',
            category: 'Menikah',
            dependents: 1,
            nominal_value: 100000,
          },
        ],
        total: 1,
        per_page: 10,
      },
    };

    mockGetList.mockResolvedValue(mockData);

    const { result } = renderHook(() => useApiMarriageAllowance());

    await act(async () => {
      await result.current.fetchMarriageAllowances();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.marriageAllowances).toHaveLength(1);
    expect(result.current.marriageAllowances[0].code).toBe('M001');
    expect(mockGetList).toHaveBeenCalled();
  });

  it('harus menangani error saat gagal mengambil daftar', async () => {
    mockGetList.mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useApiMarriageAllowance());

    await act(async () => {
      await result.current.fetchMarriageAllowances();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network Error');
    expect(result.current.marriageAllowances).toEqual([]);
  });

  it('harus memperbarui tunjangan pernikahan dengan sukses', async () => {
    mockUpdate.mockResolvedValue({}); // Response doesn't matter much as it returns null in hook logic currently

    const { result } = renderHook(() => useApiMarriageAllowance());

    const payload = { nominalValue: 150000 };
    
    await act(async () => {
      await result.current.updateMarriageAllowance('1', payload);
    });

    expect(mockUpdate).toHaveBeenCalledWith('1', expect.any(FormData));
    expect(result.current.error).toBeNull();
  });

  it('harus menangani error saat update gagal', async () => {
    mockUpdate.mockRejectedValue(new Error('Update Failed'));

    const { result } = renderHook(() => useApiMarriageAllowance());

    const payload = { nominalValue: 150000 };
    
    await act(async () => {
      await result.current.updateMarriageAllowance('1', payload);
    });

    expect(result.current.error).toBe('Update Failed');
  });

  it('harus mengambil detail tunjangan pernikahan dengan sukses', async () => {
    const mockDetail = {
      data: {
        id: '1',
        code: 'M001',
        category: 'Menikah',
        dependents: 1,
        nominal_value: 100000,
      },
    };

    mockGetDetail.mockResolvedValue(mockDetail);

    const { result } = renderHook(() => useApiMarriageAllowance());

    let detail;
    await act(async () => {
      detail = await result.current.getMarriageAllowanceDetail('1');
    });

    expect(detail).toEqual({
      id: '1',
      code: 'M001',
      category: 'Menikah',
      dependents: 1,
      nominalValue: 100000,
    });
  });

  it('harus mengubah parameter pagination dan search', () => {
    const { result } = renderHook(() => useApiMarriageAllowance());

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);

    act(() => {
      result.current.setSearch('query');
    });
    expect(result.current.search).toBe('query');
    expect(result.current.page).toBe(1); // Should reset to 1
  });

  it('harus menangani filter dari store', async () => {
    mockUseFilterStore.mockImplementation((selector: any) => selector({ filters: { MarriageAllowance: 'filtered' } }));
    mockGetList.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useApiMarriageAllowance());

    expect(result.current.filterValue).toBe('filtered');

    await act(async () => {
      await result.current.fetchMarriageAllowances();
    });

    expect(mockGetList).toHaveBeenCalledWith(expect.objectContaining({
      filter: 'filtered'
    }));
  });
});

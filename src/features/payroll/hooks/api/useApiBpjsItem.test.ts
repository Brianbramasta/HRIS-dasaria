import { renderHook, act } from '@testing-library/react';
import { useApiBpjsItem } from './useApiBpjsItem';
import { bpjsItemServices } from '../../services/BpjsItemServices';
import useFilterStore from '../../../../stores/filterStore';
import type { BpjsItemListItem, BpjsItemDetailResponse } from '../../types/dto/BpjsItemType';

// Mock api service to prevent import.meta error
jest.mock('@/services/api', () => ({
  apiService: {},
}));

// Mock services
jest.mock('../../services/BpjsItemServices');
// Mock store
jest.mock('../../../../stores/filterStore');

describe('useApiBpjsItem', () => {
  const mockBpjsItems = [
    {
      id: 1,
      detail_name: 'BPJS Kesehatan',
      category: 'Kesehatan',
      type: 'Potongan',
      company_percentage: 4,
    },
    {
      id: 2,
      detail_name: 'Jaminan Hari Tua',
      category: 'Ketenagakerjaan',
      type: 'Tunjangan',
      company_percentage: 3.7,
    },
  ];

  const mockResponse = {
    data: {
      data: mockBpjsItems,
      total: 2,
      per_page: 10,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFilterStore as unknown as jest.Mock).mockReturnValue('');
  });

  it('seharusnya mengambil item BPJS dengan sukses', async () => {
    (bpjsItemServices.getBpjsItems as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useApiBpjsItem());

    await act(async () => {
      await result.current.fetchBpjsItems();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.bpjsItems).toHaveLength(2);
    expect(result.current.total).toBe(2);
    expect(result.current.bpjsItems[0].detailName).toBe('BPJS Kesehatan');
  });

  it('seharusnya menangani error saat pengambilan data', async () => {
    const errorMessage = 'Network Error';
    (bpjsItemServices.getBpjsItems as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useApiBpjsItem());

    await act(async () => {
      await result.current.fetchBpjsItems();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.bpjsItems).toEqual([]);
  });

  it('seharusnya memperbarui item BPJS dengan sukses', async () => {
    const updatePayload = { companyPercentage: 5 };
    const mockUpdatedItem = { ...mockBpjsItems[0], company_percentage: 5 };
    
    (bpjsItemServices.updateBpjsItem as jest.Mock).mockResolvedValue({
      data: mockUpdatedItem,
    });

    const { result } = renderHook(() => useApiBpjsItem());

    let updatedItem: BpjsItemListItem | null = null;
    await act(async () => {
      const res = await result.current.updateBpjsItem('1', updatePayload);
      updatedItem = res;
    });

    expect(result.current.loading).toBe(false);
    expect((updatedItem as BpjsItemListItem | null)?.companyPercentage).toBe(5);
    expect(bpjsItemServices.updateBpjsItem).toHaveBeenCalledWith(
      '1',
      expect.any(FormData)
    );
  });

  it('seharusnya mengambil detail item BPJS dengan sukses', async () => {
    (bpjsItemServices.getBpjsItemDetail as jest.Mock).mockResolvedValue({
      data: mockBpjsItems[0],
    });

    const { result } = renderHook(() => useApiBpjsItem());

    let detail: BpjsItemDetailResponse | null = null;
    await act(async () => {
      const res = await result.current.getBpjsItemDetail('1');
      detail = res;
    });

    expect(result.current.loading).toBe(false);
    expect((detail as BpjsItemDetailResponse | null)?.detailName).toBe('BPJS Kesehatan');
    expect(bpjsItemServices.getBpjsItemDetail).toHaveBeenCalledWith('1');
  });

  it('seharusnya menangani perubahan pagination', () => {
    const { result } = renderHook(() => useApiBpjsItem());

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setPageSize(20);
    });
    expect(result.current.pageSize).toBe(20);
    // Changing page size should reset page to 1
    expect(result.current.page).toBe(1);
  });

  it('seharusnya menangani perubahan pencarian', () => {
    const { result } = renderHook(() => useApiBpjsItem());

    act(() => {
      result.current.setSearch('test');
    });
    expect(result.current.search).toBe('test');
    // Changing search should reset page to 1
    expect(result.current.page).toBe(1);
  });
});

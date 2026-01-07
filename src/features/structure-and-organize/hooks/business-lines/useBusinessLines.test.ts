import { renderHook, act, waitFor } from '@testing-library/react';
import { useBusinessLines } from './useBusinessLines';
import { businessLinesService } from '../../services/request/BusinessLinesService';
import useFilterStore from '../../../../stores/filterStore';
import type { BusinessLineListItem, BusinessLineDetailResponse } from '../../types/OrganizationApiTypes';

// Mock dependencies
jest.mock('../../../../services/api', () => ({
  apiService: {},
}));
jest.mock('../../services/request/BusinessLinesService');
jest.mock('../../../../stores/filterStore');

const mockBusinessLinesService = businessLinesService as jest.Mocked<typeof businessLinesService>;
const mockUseFilterStore = useFilterStore as unknown as jest.Mock;

describe('useBusinessLines Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation for useFilterStore
    // Assuming useFilterStore((s) => s.filters['Lini Bisnis']) usage
    mockUseFilterStore.mockImplementation((selector) => {
      const state = { filters: { 'Lini Bisnis': '' } };
      return selector(state);
    });
  });

  it('harus menginisialisasi dengan state default yang benar', () => {
    const { result } = renderHook(() => useBusinessLines({ autoFetch: false }));

    expect(result.current.businessLines).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalPages).toBe(0);
  });

  it('harus mengambil data (fetch) secara otomatis saat mount jika autoFetch true', async () => {
    const mockData = {
      data: {
        data: [
          { id: '1', bl_name: 'Line A', bl_description: 'Desc A' }
        ],
        total: 1,
        per_page: 10
      }
    };
    mockBusinessLinesService.getList.mockResolvedValue(mockData);

    const { result } = renderHook(() => useBusinessLines());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockBusinessLinesService.getList).toHaveBeenCalled();
    expect(result.current.businessLines).toHaveLength(1);
    expect(result.current.businessLines[0].name).toBe('Line A');
  });

  it('harus menangani error saat mengambil data gagal', async () => {
    mockBusinessLinesService.getList.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useBusinessLines());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('API Error');
  });

  it('harus memperbarui pagination state', () => {
    const { result } = renderHook(() => useBusinessLines({ autoFetch: false }));

    act(() => {
      result.current.setPage(2);
      result.current.setPageSize(20);
    });

    expect(result.current.page).toBe(2);
    expect(result.current.pageSize).toBe(20);
  });

  it('harus melakukan pencarian dan memperbarui state search', async () => {
    mockBusinessLinesService.getList.mockResolvedValue({ data: { data: [] } });
    // Use autoFetch: true to allow useEffect to trigger fetch on search change
    const { result } = renderHook(() => useBusinessLines({ autoFetch: true }));

    // Initial fetch happens here
    await waitFor(() => {
        expect(mockBusinessLinesService.getList).toHaveBeenCalledTimes(1);
    });
    
    mockBusinessLinesService.getList.mockClear();

    await act(async () => {
      result.current.setSearch('query test');
    });

    // Wait for the effect to trigger fetch
    await waitFor(() => {
      expect(mockBusinessLinesService.getList).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'query test' })
      );
    });
  });

  it('harus membuat business line baru dengan sukses', async () => {
    const newLine = { name: 'New Line', description: 'New Desc', memoNumber: '123', skFileId: 'file1' };
    const mockResponse = {
      data: {
        id: '123',
        bl_name: newLine.name,
        bl_description: newLine.description,
        bl_decree_number: newLine.memoNumber,
        bl_decree_file: 'http://file.com/file.pdf' // Changed from object to string to match toFileSummary expectation
      }
    };
    
    // Ensure mocks are setup correctly
    mockBusinessLinesService.create.mockReturnValue(Promise.resolve(mockResponse));
    mockBusinessLinesService.getList.mockReturnValue(Promise.resolve({ data: { data: [] } }));

    const { result } = renderHook(() => useBusinessLines({ autoFetch: false }));

    let createdItem: BusinessLineListItem | null = null;
    await act(async () => {
       createdItem = await result.current.createBusinessLine(newLine);
    });

    expect(mockBusinessLinesService.create).toHaveBeenCalledWith(newLine);
    expect(createdItem).not.toBeNull();
    if (createdItem) {
        const ci = createdItem as BusinessLineListItem;
        expect(ci.name).toBe(newLine.name);
    }
    expect(mockBusinessLinesService.getList).toHaveBeenCalled();
  });

  it('harus menangani error saat pembuatan gagal', async () => {
    mockBusinessLinesService.create.mockRejectedValue(new Error('Create Failed'));
    const { result } = renderHook(() => useBusinessLines({ autoFetch: false }));

    await act(async () => {
      const res = await result.current.createBusinessLine({ name: 'Fail', memoNumber: '1', skFileId: '1' });
      expect(res).toBeNull();
    });

    expect(result.current.error).toBe('Create Failed');
  });

  it('harus memperbarui business line dengan sukses', async () => {
    const updatePayload = { name: 'Updated', memoNumber: '123', skFileId: 'file1' };
    const mockResponse = {
      data: {
        id: '1',
        bl_name: 'Updated',
        bl_decree_number: '123'
      }
    };
    mockBusinessLinesService.update.mockResolvedValue(mockResponse);
    mockBusinessLinesService.getList.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useBusinessLines({ autoFetch: false }));

    let updatedItem: BusinessLineListItem | null = null;
    await act(async () => {
      updatedItem = await result.current.updateBusinessLine('1', updatePayload);
    });

    expect(mockBusinessLinesService.update).toHaveBeenCalledWith('1', updatePayload);
    {
      const ui = updatedItem as BusinessLineListItem | null;
      expect(ui?.name).toBe('Updated');
    }
    expect(mockBusinessLinesService.getList).toHaveBeenCalled();
  });

  it('harus menghapus business line dengan sukses', async () => {
    const deletePayload = { memoNumber: '123', skFileId: 'file1' };
    mockBusinessLinesService.delete.mockResolvedValue({ data: { success: true } });
    mockBusinessLinesService.getList.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useBusinessLines({ autoFetch: false }));

    let success;
    await act(async () => {
      success = await result.current.deleteBusinessLine('1', deletePayload);
    });

    expect(mockBusinessLinesService.delete).toHaveBeenCalledWith('1', deletePayload);
    expect(success).toBe(true);
    expect(mockBusinessLinesService.getList).toHaveBeenCalled();
  });

  it('harus mendapatkan detail business line', async () => {
    const mockDetail = {
      data: {
        id: '1',
        bl_name: 'Detail Name',
        bl_description: 'Detail Desc',
        bl_decree_number: 'Memo 1',
        companies: []
      }
    };
    mockBusinessLinesService.getDetail.mockResolvedValue(mockDetail);

    const { result } = renderHook(() => useBusinessLines({ autoFetch: false }));

    let detail: BusinessLineDetailResponse | null = null;
    await act(async () => {
      detail = await result.current.getDetail('1');
    });

    expect(mockBusinessLinesService.getDetail).toHaveBeenCalledWith('1');
    expect(detail).not.toBeNull();
    {
      const d = detail as BusinessLineDetailResponse | null;
      expect(d?.businessLine.name).toBe('Detail Name');
    }
  });

  it('harus mendapatkan dropdown business line', async () => {
    const mockDropdown = {
      data: [
        { id: '1', bl_name: 'Drop 1' },
        { id: '2', bl_name: 'Drop 2' }
      ]
    };
    businessLinesService.getDropdown = jest.fn().mockResolvedValue(mockDropdown);

    const { result } = renderHook(() => useBusinessLines({ autoFetch: false }));

    let dropdownItems: BusinessLineListItem[] = [];
    await act(async () => {
      dropdownItems = await result.current.getDropdown();
    });

    expect(businessLinesService.getDropdown).toHaveBeenCalled();
    expect(dropdownItems).toHaveLength(2);
    expect(dropdownItems?.[0].name).toBe('Drop 1');
  });

  it('harus mendapatkan data berdasarkan ID (getById)', async () => {
    const mockItem = {
      data: {
        id: '1',
        bl_name: 'Single Item'
      }
    };
    mockBusinessLinesService.getById.mockResolvedValue(mockItem);

    const { result } = renderHook(() => useBusinessLines({ autoFetch: false }));

    let item: BusinessLineListItem | null = null;
    await act(async () => {
      item = await result.current.getById('1');
    });

    expect(mockBusinessLinesService.getById).toHaveBeenCalledWith('1');
    {
      const it = item as BusinessLineListItem | null;
      expect(it?.name).toBe('Single Item');
    }
  });
});

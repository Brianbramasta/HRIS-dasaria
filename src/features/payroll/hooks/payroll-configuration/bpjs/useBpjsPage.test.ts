import { renderHook, act } from '@testing-library/react';
import { useBpjsPage } from './useBpjsPage';
import { useApiBpjsItem } from '@/features/payroll/hooks/api/useApiBpjsItem';
import { useModal } from '@/hooks/useModal';

// Mock api service to prevent import.meta error
jest.mock('@/services/api', () => ({
  apiService: {},
}));

// Mock dependencies
jest.mock('@/features/payroll/hooks/api/useApiBpjsItem');
jest.mock('@/hooks/useModal');

describe('useBpjsPage', () => {
  const mockFetchBpjsItems = jest.fn();
  const mockOpenModal = jest.fn();
  const mockCloseModal = jest.fn();

  const mockBpjsItems = [
    {
      id: '1',
      detailName: 'Test Item',
      category: 'Category A',
      type: 'Type A',
      companyPercentage: 2.0,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useApiBpjsItem as jest.Mock).mockReturnValue({
      bpjsItems: mockBpjsItems,
      fetchBpjsItems: mockFetchBpjsItems,
      page: 1,
      pageSize: 10,
      loading: false,
      total: 1,
    });

    (useModal as jest.Mock).mockReturnValue({
      isOpen: false,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    });
  });

  it('seharusnya mengambil item BPJS saat mount', () => {
    renderHook(() => useBpjsPage());
    expect(mockFetchBpjsItems).toHaveBeenCalledTimes(1);
  });

  it('seharusnya memformat baris dengan benar', () => {
    const { result } = renderHook(() => useBpjsPage());

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0]).toEqual({
      no: 1,
      id: '1',
      detailBpjs: 'Test Item',
      kategoriBpjs: 'Category A',
      jenis: 'Type A',
      percent: '2%',
      original: mockBpjsItems[0],
    });
  });

  it('seharusnya menangani pembukaan modal edit', () => {
    const { result } = renderHook(() => useBpjsPage());

    act(() => {
      result.current.handleEditOpen(mockBpjsItems[0]);
    });

    expect(result.current.selected).toBe(mockBpjsItems[0]);
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('seharusnya menangani penutupan modal edit', () => {
    const { result } = renderHook(() => useBpjsPage());

    // First open
    act(() => {
      result.current.handleEditOpen(mockBpjsItems[0]);
    });

    // Then close
    act(() => {
      result.current.handleClose();
    });

    expect(result.current.selected).toBeNull();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('seharusnya menangani aksi sukses', () => {
    const { result } = renderHook(() => useBpjsPage());

    act(() => {
      result.current.handleSuccess();
    });

    expect(mockFetchBpjsItems).toHaveBeenCalled(); // Should re-fetch
    expect(mockCloseModal).toHaveBeenCalled(); // Should close modal
  });
});

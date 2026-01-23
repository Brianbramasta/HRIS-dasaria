import { renderHook, act } from '@testing-library/react';
import { useLengthOfServiceAllowance } from './useLengthOfServiceAllowance';
import { useApiLengthOfServiceAllowance } from '../../api/fixed-allowance/useApiLengthOfServiceAllowance';
import { useModal } from '@/hooks/useModal';

// Mock dependencies
jest.mock('../../api/fixed-allowance/useApiLengthOfServiceAllowance');
jest.mock('@/hooks/useModal');

describe('useLengthOfServiceAllowance', () => {
  const mockFetchItems = jest.fn();
  const mockUpdateItem = jest.fn();
  const mockGetItemDetail = jest.fn();
  const mockOpenModal = jest.fn();
  const mockCloseModal = jest.fn();

  const mockApiData = {
    items: [
      { id: '1', lengthOfService: '1 Tahun', nominalValue: 100000 },
      { id: '2', lengthOfService: '2 Tahun', nominalValue: 200000 },
    ],
    fetchItems: mockFetchItems,
    updateItem: mockUpdateItem,
    getItemDetail: mockGetItemDetail,
    error: null,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useApiLengthOfServiceAllowance as jest.Mock).mockReturnValue(mockApiData);

    (useModal as jest.Mock).mockReturnValue({
      isOpen: false,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    });
  });

  it('seharusnya melakukan fetch data saat inisialisasi jika autoFetch true', () => {
    renderHook(() => useLengthOfServiceAllowance());
    expect(mockFetchItems).toHaveBeenCalledTimes(1);
  });

  it('seharusnya tidak melakukan fetch data saat inisialisasi jika autoFetch false', () => {
    renderHook(() => useLengthOfServiceAllowance({ autoFetch: false }));
    expect(mockFetchItems).not.toHaveBeenCalled();
  });

  it('seharusnya memetakan data items ke format baris tabel (lengthOfServiceRows)', () => {
    const { result } = renderHook(() => useLengthOfServiceAllowance());
    
    expect(result.current.lengthOfServiceRows).toEqual([
      { id: '1', lengthOfService: '1 Tahun', nominalValue: 100000, lamaKerja: '1 Tahun', nominal: 100000 },
      { id: '2', lengthOfService: '2 Tahun', nominalValue: 200000, lamaKerja: '2 Tahun', nominal: 200000 },
    ]);
  });

  it('seharusnya membuka modal edit dan mengambil detail item', async () => {
    const mockDetail = { id: '1', lengthOfService: '1 Tahun', nominalValue: 100000, description: 'Detail' };
    mockGetItemDetail.mockResolvedValue(mockDetail);

    const { result } = renderHook(() => useLengthOfServiceAllowance());
    const itemToEdit = { id: '1', lengthOfService: '1 Tahun', nominalValue: 100000 };

    await act(async () => {
      await result.current.handleEditOpen(itemToEdit);
    });

    expect(mockGetItemDetail).toHaveBeenCalledWith('1');
    expect(result.current.selected).toEqual(mockDetail);
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('seharusnya menggunakan item list sebagai fallback jika gagal mengambil detail', async () => {
    mockGetItemDetail.mockResolvedValue(null);

    const { result } = renderHook(() => useLengthOfServiceAllowance());
    const itemToEdit = { id: '1', lengthOfService: '1 Tahun', nominalValue: 100000 };

    await act(async () => {
      await result.current.handleEditOpen(itemToEdit);
    });

    expect(mockGetItemDetail).toHaveBeenCalledWith('1');
    expect(result.current.selected).toEqual(itemToEdit);
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('seharusnya menutup modal dan mereset state saat handleClose dipanggil', () => {
    const { result } = renderHook(() => useLengthOfServiceAllowance());

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.selected).toBeNull();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('seharusnya melakukan refresh data dan menutup modal saat handleSuccess dipanggil', () => {
    const { result } = renderHook(() => useLengthOfServiceAllowance());

    act(() => {
      result.current.handleSuccess();
    });

    expect(mockFetchItems).toHaveBeenCalled(); // Called again (initial + success)
    expect(mockCloseModal).toHaveBeenCalled();
    expect(result.current.selected).toBeNull();
  });

  it('seharusnya melakukan update item dan memanggil handleSuccess jika berhasil', async () => {
    const { result } = renderHook(() => useLengthOfServiceAllowance());
    
    // Set selected item first (simulating open edit)
    const itemToEdit = { id: '1', lengthOfService: '1 Tahun', nominalValue: 100000 };
    await act(async () => {
        // Manually set selected for the test context since handleEditOpen is async/complex
        // But better to use the public API
        mockGetItemDetail.mockResolvedValue(itemToEdit);
        await result.current.handleEditOpen(itemToEdit);
    });

    const updatePayload = { nominalValue: 300000 };
    
    await act(async () => {
      await result.current.handleUpdate(updatePayload);
    });

    expect(mockUpdateItem).toHaveBeenCalledWith('1', updatePayload);
    expect(mockFetchItems).toHaveBeenCalledTimes(2); // Initial + Success
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('seharusnya tidak melakukan update jika tidak ada item yang dipilih', async () => {
    const { result } = renderHook(() => useLengthOfServiceAllowance());
    
    await act(async () => {
      await result.current.handleUpdate({ nominalValue: 100 });
    });

    expect(mockUpdateItem).not.toHaveBeenCalled();
  });
});

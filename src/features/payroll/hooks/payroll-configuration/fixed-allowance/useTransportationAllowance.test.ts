import { renderHook, act } from '@testing-library/react';
import { useTransportationAllowance } from './useTransportationAllowance';
import { useApiTransportationAllowance } from '../../api/fixed-allowance/useApiTransportationAllowance';
import { useModal } from '@/hooks/useModal';

// Mock dependencies
jest.mock('../../api/fixed-allowance/useApiTransportationAllowance');
jest.mock('@/hooks/useModal');

describe('useTransportationAllowance', () => {
  const mockFetchTransportationAllowances = jest.fn();
  const mockUpdateTransportationAllowance = jest.fn();
  const mockGetTransportationAllowanceDetail = jest.fn();
  const mockOpenModal = jest.fn();
  const mockCloseModal = jest.fn();

  const mockApiData = {
    transportationAllowances: [
      { id: '1', nameTransportation: 'Motor', categoryName: 'Roda 2', nominalValue: 50000 },
      { id: '2', nameTransportation: 'Mobil', categoryName: 'Roda 4', nominalValue: 100000 },
    ],
    fetchTransportationAllowances: mockFetchTransportationAllowances,
    updateTransportationAllowance: mockUpdateTransportationAllowance,
    getTransportationAllowanceDetail: mockGetTransportationAllowanceDetail,
    error: null,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useApiTransportationAllowance as jest.Mock).mockReturnValue(mockApiData);

    (useModal as jest.Mock).mockReturnValue({
      isOpen: false,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    });
  });

  it('seharusnya melakukan fetch data saat inisialisasi jika autoFetch true', () => {
    renderHook(() => useTransportationAllowance());
    expect(mockFetchTransportationAllowances).toHaveBeenCalledTimes(1);
  });

  it('seharusnya tidak melakukan fetch data saat inisialisasi jika autoFetch false', () => {
    renderHook(() => useTransportationAllowance({ autoFetch: false }));
    expect(mockFetchTransportationAllowances).not.toHaveBeenCalled();
  });

  it('seharusnya memetakan data items ke format baris tabel (transportationAllowanceRows)', () => {
    const { result } = renderHook(() => useTransportationAllowance());
    
    expect(result.current.transportationAllowanceRows).toEqual([
      { 
        id: '1', nameTransportation: 'Motor', categoryName: 'Roda 2', nominalValue: 50000,
        transportasi: 'Motor', kategori: 'Roda 2', nominal: 50000
      },
      { 
        id: '2', nameTransportation: 'Mobil', categoryName: 'Roda 4', nominalValue: 100000,
        transportasi: 'Mobil', kategori: 'Roda 4', nominal: 100000
      },
    ]);
  });

  it('seharusnya membuka modal edit dan mengambil detail item', async () => {
    const mockDetail = { id: '1', nameTransportation: 'Motor', categoryName: 'Roda 2', nominalValue: 50000, description: 'Detail' };
    mockGetTransportationAllowanceDetail.mockResolvedValue(mockDetail);

    const { result } = renderHook(() => useTransportationAllowance());
    const itemToEdit = { id: '1', nameTransportation: 'Motor', categoryName: 'Roda 2', categoryId: 'cat1', nominalValue: 50000 };

    await act(async () => {
      await result.current.handleEditOpen(itemToEdit);
    });

    expect(result.current.selectedId).toBe('1');
    expect(mockGetTransportationAllowanceDetail).toHaveBeenCalledWith('1');
    expect(result.current.selected).toEqual(mockDetail);
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('seharusnya tidak membuka modal jika detail gagal diambil (detail null)', async () => {
    mockGetTransportationAllowanceDetail.mockResolvedValue(null);

    const { result } = renderHook(() => useTransportationAllowance());
    const itemToEdit = { id: '1', nameTransportation: 'Motor', categoryName: 'Roda 2', categoryId: 'cat1', nominalValue: 50000 };

    await act(async () => {
      await result.current.handleEditOpen(itemToEdit);
    });

    expect(result.current.selectedId).toBe('1');
    expect(mockGetTransportationAllowanceDetail).toHaveBeenCalledWith('1');
    expect(result.current.selected).toBeNull();
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  it('seharusnya menutup modal dan mereset state saat handleClose dipanggil', () => {
    const { result } = renderHook(() => useTransportationAllowance());

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.selected).toBeNull();
    expect(result.current.selectedId).toBeNull();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('seharusnya melakukan refresh data dan menutup modal saat handleSuccess dipanggil', () => {
    const { result } = renderHook(() => useTransportationAllowance());

    act(() => {
      result.current.handleSuccess();
    });

    expect(mockFetchTransportationAllowances).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
    expect(result.current.selected).toBeNull();
  });

  it('seharusnya melakukan update item dan memanggil handleSuccess jika berhasil', async () => {
    const { result } = renderHook(() => useTransportationAllowance());
    mockUpdateTransportationAllowance.mockResolvedValue(true); // Simulate success

    // Simulate selecting an item first (to set selectedId)
    const itemToEdit = { id: '1', nameTransportation: 'Motor', categoryName: 'Roda 2', categoryId: 'cat1', nominalValue: 50000 };
    mockGetTransportationAllowanceDetail.mockResolvedValue(itemToEdit);
    
    await act(async () => {
      await result.current.handleEditOpen(itemToEdit);
    });

    const updatePayload = { nominalValue: 60000 };
    
    await act(async () => {
      await result.current.handleUpdate(updatePayload);
    });

    expect(mockUpdateTransportationAllowance).toHaveBeenCalledWith('1', updatePayload);
    expect(mockFetchTransportationAllowances).toHaveBeenCalledTimes(2); // Initial + Success
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('seharusnya tidak melakukan update jika tidak ada item yang dipilih (selectedId null)', async () => {
    const { result } = renderHook(() => useTransportationAllowance());
    // Ensure selectedId is null
    act(() => {
        result.current.handleClose();
    });
    
    await act(async () => {
      await result.current.handleUpdate({ nominalValue: 100 });
    });

    expect(mockUpdateTransportationAllowance).not.toHaveBeenCalled();
  });
});

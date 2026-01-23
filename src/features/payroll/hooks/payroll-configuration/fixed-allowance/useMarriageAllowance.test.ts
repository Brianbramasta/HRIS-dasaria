import { renderHook, act } from '@testing-library/react';
import { useMarriageAllowance } from './useMarriageAllowance';
import { useApiMarriageAllowance } from '../../api/fixed-allowance/useApiMarriageAllowance';
import { useModal } from '@/hooks/useModal';

// Mock dependencies
jest.mock('../../api/fixed-allowance/useApiMarriageAllowance');
jest.mock('@/hooks/useModal');

describe('useMarriageAllowance', () => {
  const mockFetchMarriageAllowances = jest.fn();
  const mockUpdateMarriageAllowance = jest.fn();
  const mockOpenModal = jest.fn();
  const mockCloseModal = jest.fn();

  const mockApiData = {
    marriageAllowances: [
      { id: '1', code: 'K0', category: 'Menikah', dependents: 0, nominalValue: 100000 },
      { id: '2', code: 'K1', category: 'Menikah', dependents: 1, nominalValue: 200000 },
    ],
    fetchMarriageAllowances: mockFetchMarriageAllowances,
    updateMarriageAllowance: mockUpdateMarriageAllowance,
    error: null,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useApiMarriageAllowance as jest.Mock).mockReturnValue(mockApiData);

    (useModal as jest.Mock).mockReturnValue({
      isOpen: false,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    });
  });

  it('seharusnya melakukan fetch data saat inisialisasi jika autoFetch true', () => {
    renderHook(() => useMarriageAllowance());
    expect(mockFetchMarriageAllowances).toHaveBeenCalledTimes(1);
  });

  it('seharusnya tidak melakukan fetch data saat inisialisasi jika autoFetch false', () => {
    renderHook(() => useMarriageAllowance({ autoFetch: false }));
    expect(mockFetchMarriageAllowances).not.toHaveBeenCalled();
  });

  it('seharusnya memetakan data items ke format baris tabel (marriageAllowanceRows)', () => {
    const { result } = renderHook(() => useMarriageAllowance());
    
    expect(result.current.marriageAllowanceRows).toEqual([
      { 
        id: '1', code: 'K0', category: 'Menikah', dependents: 0, nominalValue: 100000,
        statusPernikahan: 'K0', status: 'Menikah', tanggungan: 0, nominal: 100000
      },
      { 
        id: '2', code: 'K1', category: 'Menikah', dependents: 1, nominalValue: 200000,
        statusPernikahan: 'K1', status: 'Menikah', tanggungan: 1, nominal: 200000
      },
    ]);
  });

  it('seharusnya membuka modal edit dan set item yang dipilih', () => {
    const { result } = renderHook(() => useMarriageAllowance());
    const itemToEdit = mockApiData.marriageAllowances[0];

    act(() => {
      result.current.handleEditOpen(itemToEdit);
    });

    expect(result.current.selected).toEqual(itemToEdit);
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('seharusnya menutup modal dan mereset selected saat handleClose dipanggil', () => {
    const { result } = renderHook(() => useMarriageAllowance());

    // Set selected first
    act(() => {
      result.current.handleEditOpen(mockApiData.marriageAllowances[0]);
    });

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.selected).toBeNull();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('seharusnya melakukan refresh data dan menutup modal saat handleSuccess dipanggil', () => {
    const { result } = renderHook(() => useMarriageAllowance());

    act(() => {
      result.current.handleSuccess();
    });

    expect(mockFetchMarriageAllowances).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
    expect(result.current.selected).toBeNull();
  });

  it('seharusnya melakukan update item dan memanggil handleSuccess jika berhasil', async () => {
    const { result } = renderHook(() => useMarriageAllowance());
    mockUpdateMarriageAllowance.mockResolvedValue(true); // Simulate success

    // Set selected item first
    const itemToEdit = mockApiData.marriageAllowances[0];
    act(() => {
      result.current.handleEditOpen(itemToEdit);
    });

    const updatePayload = { nominalValue: 150000 };
    
    await act(async () => {
      await result.current.handleUpdate(updatePayload);
    });

    expect(mockUpdateMarriageAllowance).toHaveBeenCalledWith('1', updatePayload);
    expect(mockFetchMarriageAllowances).toHaveBeenCalledTimes(2); // Initial + Success
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('seharusnya tidak melakukan update jika tidak ada item yang dipilih', async () => {
    const { result } = renderHook(() => useMarriageAllowance());
    
    await act(async () => {
      await result.current.handleUpdate({ nominalValue: 100 });
    });

    expect(mockUpdateMarriageAllowance).not.toHaveBeenCalled();
  });
});

import { renderHook, act } from '@testing-library/react';
import { usePositionAllowance } from './usePositionAllowance';
import { useApiPositionAllowance } from '../../api/fixed-allowance/useApiPositionAllowance';
import { useModal } from '@/hooks/useModal';

// Mock dependencies
jest.mock('../../api/fixed-allowance/useApiPositionAllowance', () => ({
  useApiPositionAllowance: jest.fn(),
}));
jest.mock('@/hooks/useModal', () => ({
  useModal: jest.fn(),
}));

describe('usePositionAllowance', () => {
  const mockFetchPositionAllowances = jest.fn();
  const mockUpdatePositionAllowance = jest.fn();
  const mockGetPositionAllowanceDetail = jest.fn();
  const mockOpenModal = jest.fn();
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useApiPositionAllowance as jest.Mock).mockReturnValue({
      positionAllowances: [],
      fetchPositionAllowances: mockFetchPositionAllowances,
      updatePositionAllowance: mockUpdatePositionAllowance,
      getPositionAllowanceDetail: mockGetPositionAllowanceDetail,
    });

    (useModal as jest.Mock).mockReturnValue({
      isOpen: false,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    });
  });

  it('seharusnya memanggil fetchPositionAllowances saat mount jika autoFetch true', () => {
    renderHook(() => usePositionAllowance({ autoFetch: true }));
    expect(mockFetchPositionAllowances).toHaveBeenCalled();
  });

  it('seharusnya tidak memanggil fetchPositionAllowances saat mount jika autoFetch false', () => {
    renderHook(() => usePositionAllowance({ autoFetch: false }));
    expect(mockFetchPositionAllowances).not.toHaveBeenCalled();
  });

  it('seharusnya membuka modal edit dan mengambil detail saat handleEditOpen dipanggil', async () => {
    const mockDetail = { id: '1', fixed_allowance: {} };
    mockGetPositionAllowanceDetail.mockResolvedValue(mockDetail);

    const { result } = renderHook(() => usePositionAllowance());

    const item = { id: '1', jobTitleName: 'Manager', percentageValue: 10, nominalValue: null };
    await act(async () => {
      await result.current.handleEditOpen(item);
    });

    expect(result.current.selectedId).toBe('1');
    expect(mockGetPositionAllowanceDetail).toHaveBeenCalledWith('1');
    expect(result.current.selected).toEqual(mockDetail);
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('seharusnya menutup modal dan mereset state saat handleClose dipanggil', () => {
    const { result } = renderHook(() => usePositionAllowance());

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.selected).toBeNull();
    expect(result.current.selectedId).toBeNull();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('seharusnya melakukan update dan refresh data saat handleUpdate dipanggil', async () => {
    mockUpdatePositionAllowance.mockResolvedValue(true);
    const { result } = renderHook(() => usePositionAllowance());

    // Set selectedId manually to simulate editing state
    await act(async () => {
        // @ts-ignore - simulating internal state setting via handleEditOpen logic part
        // but we can't set state directly. We rely on handleEditOpen to set it.
        // Or we can just mock handleUpdate logic since we test logic inside usePositionAllowance.
        // Actually handleUpdate uses selectedId from state.
        
        // Let's trigger state change via handleEditOpen first
        mockGetPositionAllowanceDetail.mockResolvedValue({});
        await result.current.handleEditOpen({ id: '1' } as any);
    });

    await act(async () => {
      await result.current.handleUpdate({} as any);
    });

    expect(mockUpdatePositionAllowance).toHaveBeenCalledWith('1', expect.any(Object));
    expect(mockFetchPositionAllowances).toHaveBeenCalled(); // via handleSuccess
    expect(mockCloseModal).toHaveBeenCalled(); // via handleSuccess -> handleClose
  });
});

import { renderHook, act } from '@testing-library/react';
import { useNonFixedAllowance } from './useNonFixedAllowance';
import { useApiNonFixedAllowance } from '../../../api/non-fixed-allowance/useApiNonFixedAllowance';
import { useModal } from '@/hooks/useModal';
import { NonFixedAllowanceListItem } from '../../../../types/dto/non-fixed-allowance/NonFixedAllowanceType';

// Mock dependencies
jest.mock('../../../api/non-fixed-allowance/useApiNonFixedAllowance', () => ({
  useApiNonFixedAllowance: jest.fn(),
}));
jest.mock('@/hooks/useModal', () => ({
  useModal: jest.fn(),
}));

describe('useNonFixedAllowance', () => {
  const mockFetchList = jest.fn();
  const mockGetDetail = jest.fn();
  const mockOpenModal = jest.fn();
  const mockCloseModal = jest.fn();

  // Helper for mock return value
  const setupMockApi = (overrides = {}) => {
    (useApiNonFixedAllowance as jest.Mock).mockReturnValue({
      data: [],
      page: 1,
      pageSize: 10,
      fetchList: mockFetchList,
      getDetail: mockGetDetail,
      ...overrides,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    setupMockApi();

    (useModal as jest.Mock).mockReturnValue({
      isOpen: false,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    });
  });

  it('seharusnya memanggil fetchList saat mount jika autoFetch true', () => {
    renderHook(() => useNonFixedAllowance({ autoFetch: true }));
    expect(mockFetchList).toHaveBeenCalled();
  });

  it('seharusnya tidak memanggil fetchList saat mount jika autoFetch false', () => {
    renderHook(() => useNonFixedAllowance({ autoFetch: false }));
    expect(mockFetchList).not.toHaveBeenCalled();
  });

  it('seharusnya menghasilkan data rows yang terformat dengan benar', () => {
    const mockData: NonFixedAllowanceListItem[] = [
      {
        id: '1',
        allowanceName: 'Tunjangan Makan',
        categorySub: 'Harian',
        description: 'Uang makan harian',
      },
    ];

    setupMockApi({ data: mockData, page: 2, pageSize: 10 });

    const { result } = renderHook(() => useNonFixedAllowance({ autoFetch: false }));

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0]).toEqual({
      id: '1',
      no: 11, // (2-1)*10 + 0 + 1
      'Nama Tunjangan': 'Tunjangan Makan',
      'Sub Kategori': 'Harian',
      'Deksripsi Umum': 'Uang makan harian',
      raw: mockData[0],
    });
  });

  it('seharusnya membuka modal add dan mereset selected saat handleAddOpen dipanggil', () => {
    const { result } = renderHook(() => useNonFixedAllowance({ autoFetch: false }));

    act(() => {
      result.current.handleAddOpen();
    });

    expect(result.current.selected).toBeNull();
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('seharusnya membuka modal edit dan mengisi selected saat handleEditOpen dipanggil (dengan detail fetch)', async () => {
    const item = { id: '1', allowanceName: 'Test', categorySub: 'Test', description: 'Test' };
    const detail = { id: '1', allowanceName: 'Detail', categorySub: 'Detail', description: 'Desc' };
    mockGetDetail.mockResolvedValue(detail);

    const { result } = renderHook(() => useNonFixedAllowance({ autoFetch: false }));

    await act(async () => {
      await result.current.handleEditOpen(item);
    });

    expect(mockGetDetail).toHaveBeenCalledWith('1');
    expect(result.current.selected).toEqual(detail);
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('seharusnya membuka modal edit dan menggunakan item asli jika getDetail gagal/null', async () => {
    const item = { id: '1', allowanceName: 'Test', categorySub: 'Test', description: 'Test' };
    mockGetDetail.mockResolvedValue(null);

    const { result } = renderHook(() => useNonFixedAllowance({ autoFetch: false }));

    await act(async () => {
      await result.current.handleEditOpen(item);
    });

    expect(mockGetDetail).toHaveBeenCalledWith('1');
    expect(result.current.selected).toEqual(item);
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('seharusnya membuka modal delete dan mengisi selected saat handleDeleteOpen dipanggil', () => {
    const item = { id: '1', allowanceName: 'Test', categorySub: 'Test', description: 'Test' };
    const { result } = renderHook(() => useNonFixedAllowance({ autoFetch: false }));

    act(() => {
      result.current.handleDeleteOpen(item);
    });

    expect(result.current.selected).toEqual(item);
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('seharusnya menutup semua modal dan mereset selected saat handleClose dipanggil', () => {
    const { result } = renderHook(() => useNonFixedAllowance({ autoFetch: false }));

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.selected).toBeNull();
    // Since we mock useModal to return same object, checking mockCloseModal called 3 times (for 3 modals) or just called is fine.
    // In the hook: addModal.closeModal(), editModal.closeModal(), deleteModal.closeModal() are all called.
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('seharusnya memanggil fetchList dan menutup modal saat handleSuccess dipanggil', () => {
    const { result } = renderHook(() => useNonFixedAllowance({ autoFetch: false }));

    act(() => {
      result.current.handleSuccess();
    });

    expect(mockFetchList).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
  });
});

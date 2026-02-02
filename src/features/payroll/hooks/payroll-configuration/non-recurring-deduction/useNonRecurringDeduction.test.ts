import { renderHook, act } from '@testing-library/react';
import { useNonRecurringDeduction } from './useNonRecurringDeduction';
import { useApiDeduction } from '../../api/useApiDeduction';
import { useModal } from '@/hooks/useModal';

// Mock dependencies
jest.mock('../../api/useApiDeduction');
jest.mock('@/hooks/useModal');

describe('useNonRecurringDeduction', () => {
  const mockFetchDeductions = jest.fn();
  const mockGetDeductionDetail = jest.fn();
  const mockCreateDeduction = jest.fn();
  const mockUpdateDeduction = jest.fn();
  const mockDeleteDeduction = jest.fn();
  const mockSetPage = jest.fn();
  const mockSetPageSize = jest.fn();
  const mockSetSearch = jest.fn();
  const mockSetSort = jest.fn();

  const mockOpenModal = jest.fn();
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useApiDeduction as jest.Mock).mockReturnValue({
      fetchDeductions: mockFetchDeductions,
      getDeductionDetail: mockGetDeductionDetail,
      createDeduction: mockCreateDeduction,
      updateDeduction: mockUpdateDeduction,
      deleteDeduction: mockDeleteDeduction,
      deductions: [
        { id: '1', deductionName: 'Potongan 1', category: 'fixed', description: 'Desc 1' },
        { id: '2', deductionName: 'Potongan 2', category: 'notfixed', description: 'Desc 2' }
      ],
      loading: false,
      total: 2,
      page: 1,
      pageSize: 10,
      setPage: mockSetPage,
      setPageSize: mockSetPageSize,
      setSearch: mockSetSearch,
      setSort: mockSetSort,
    });

    (useModal as jest.Mock).mockReturnValue({
      isOpen: false,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    });
  });

  it('harus memuat data potongan tidak tetap saat pertama kali dijalankan', () => {
    renderHook(() => useNonRecurringDeduction());
    expect(mockFetchDeductions).toHaveBeenCalledWith({ filter: { category: 'notfixed' } });
  });

  it('harus mengembalikan daftar baris (rows) dengan format yang benar', () => {
    const { result } = renderHook(() => useNonRecurringDeduction());
    
    expect(result.current.rows).toHaveLength(2);
    expect(result.current.rows[0]).toEqual({
      id: '1',
      no: 1,
      deductionName: 'Potongan 1',
      category: 'Potongan tetap',
      description: 'Desc 1',
      original: expect.any(Object),
    });
    expect(result.current.rows[1].category).toBe('Potongan tidak tetap');
  });

  it('harus membuka modal tambah', () => {
    const { result } = renderHook(() => useNonRecurringDeduction());

    act(() => {
      result.current.handleAddOpen();
    });

    expect(result.current.detailValues).toBeNull();
    // Since we can't easily check internal state selectedId without it being exposed directly, 
    // we assume it's cleared based on logic.
    // However, the hook exposes addModal.
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('harus membuka modal edit dan mengisi nilai detail', async () => {
    const detailData = { 
        id: '1', 
        deductionName: 'Potongan 1', 
        category: 'fixed', 
        description: 'Desc 1' 
    };
    mockGetDeductionDetail.mockResolvedValue(detailData);

    const { result } = renderHook(() => useNonRecurringDeduction());

    await act(async () => {
      await result.current.handleEditOpen('1');
    });

    expect(mockGetDeductionDetail).toHaveBeenCalledWith('1');
    expect(result.current.detailValues).toEqual({
      namaPotongan: 'Potongan 1',
      kategori: 'Potongan tetap',
      deskripsiUmum: 'Desc 1',
    });
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('harus membuka modal hapus', () => {
    const { result } = renderHook(() => useNonRecurringDeduction());

    act(() => {
      result.current.handleDelete('1', 'Potongan 1');
    });

    expect(result.current.selectedName).toBe('Potongan 1');
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('harus menghapus data dan menyegarkan daftar', async () => {
    mockDeleteDeduction.mockResolvedValue(true);
    const { result } = renderHook(() => useNonRecurringDeduction());

    // First select item to delete
    act(() => {
      result.current.handleDelete('1', 'Potongan 1');
    });

    await act(async () => {
      await result.current.onDeleteConfirm();
    });

    expect(mockDeleteDeduction).toHaveBeenCalledWith('1');
    expect(mockFetchDeductions).toHaveBeenCalledTimes(2); // 1 initial + 1 refresh
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('harus menyimpan data baru (Create)', async () => {
    mockCreateDeduction.mockResolvedValue(true);
    const { result } = renderHook(() => useNonRecurringDeduction());

    // Ensure no selectedId
    act(() => {
      result.current.handleAddOpen();
    });

    const formValues = {
      namaPotongan: 'New Deduction',
      kategori: 'Potongan tidak tetap',
      deskripsiUmum: 'New Desc',
    };

    await act(async () => {
      await result.current.handleSave(formValues);
    });

    expect(mockCreateDeduction).toHaveBeenCalledWith({
      deductionName: 'New Deduction',
      category: 'notfixed',
      description: 'New Desc',
    });
    expect(mockFetchDeductions).toHaveBeenCalledTimes(2);
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('harus memperbarui data yang ada (Update)', async () => {
    mockUpdateDeduction.mockResolvedValue(true);
    mockGetDeductionDetail.mockResolvedValue({ 
        id: '1', deductionName: 'Old', category: 'fixed', description: 'Old' 
    });

    const { result } = renderHook(() => useNonRecurringDeduction());

    // Set selectedId via edit open
    await act(async () => {
      await result.current.handleEditOpen('1');
    });

    const formValues = {
      namaPotongan: 'Updated Deduction',
      kategori: 'Potongan tetap',
      deskripsiUmum: 'Updated Desc',
    };

    await act(async () => {
      await result.current.handleSave(formValues);
    });

    expect(mockUpdateDeduction).toHaveBeenCalledWith('1', {
      deductionName: 'Updated Deduction',
      category: 'fixed',
      description: 'Updated Desc',
    });
    expect(mockFetchDeductions).toHaveBeenCalledTimes(2);
    expect(mockCloseModal).toHaveBeenCalled();
  });
});

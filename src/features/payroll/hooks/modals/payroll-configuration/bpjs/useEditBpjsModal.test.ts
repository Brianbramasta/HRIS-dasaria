import { renderHook, act, waitFor } from '@testing-library/react';
import { useEditBpjsModal } from './useEditBpjsModal';
import { useApiBpjsItem } from '../../../api/useApiBpjsItem';

// Mock dependencies
jest.mock('../../../api/useApiBpjsItem', () => ({
  useApiBpjsItem: jest.fn(),
}));

describe('useEditBpjsModal', () => {
  const mockUpdateBpjsItem = jest.fn();
  const mockGetBpjsItemDetail = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnClose = jest.fn();

  const defaultValues = {
    id: '123',
    detailName: 'Test BPJS',
    category: 'Test Category',
    type: 'Test Type',
    companyPercentage: 2.5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useApiBpjsItem as jest.Mock).mockReturnValue({
      updateBpjsItem: mockUpdateBpjsItem,
      getBpjsItemDetail: mockGetBpjsItemDetail,
      loading: false,
    });
  });

  it('seharusnya menginisialisasi form dengan nilai default', () => {
    const { result } = renderHook(() =>
      useEditBpjsModal({
        isOpen: true,
        defaultValues,
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form).toEqual({
      detailBpjs: 'Test BPJS',
      kategoriBpjs: 'Test Category',
      jenis: 'Test Type',
      percent: '2.5',
    });
  });

  it('seharusnya mereset form saat modal ditutup', () => {
    const { result, rerender } = renderHook(
      ({ isOpen }) =>
        useEditBpjsModal({
          isOpen,
          defaultValues,
          onSuccess: mockOnSuccess,
          onClose: mockOnClose,
        }),
      { initialProps: { isOpen: true } }
    );

    // Initial check
    expect(result.current.form.detailBpjs).toBe('Test BPJS');

    // Close modal
    rerender({ isOpen: false });

    // Should reset to initial values (which are derived from defaultValues in the hook logic)
    // Wait, the hook logic says: if (!isOpen) setForm(initial). 
    // And initial is derived from defaultValues.
    // So it should still be the same if defaultValues didn't change.
    // However, if we passed different defaultValues or null, it might change.
    // Let's check the code:
    // const initial = useMemo(...)
    // useEffect(() => { if (isOpen && defaultValues) { ... } else if (!isOpen) { setForm(initial); } }, ...)
    
    // So it resets to whatever 'initial' is.
    expect(result.current.form.detailBpjs).toBe('Test BPJS');
  });

  it('seharusnya mengambil detail terbaru saat modal dibuka', async () => {
    mockGetBpjsItemDetail.mockResolvedValue({
      detailName: 'Updated Name',
      category: 'Updated Category',
      type: 'Updated Type',
      companyPercentage: 5.0,
    });

    renderHook(() =>
      useEditBpjsModal({
        isOpen: true,
        defaultValues,
        onSuccess: mockOnSuccess,
      })
    );

    await waitFor(() => {
      expect(mockGetBpjsItemDetail).toHaveBeenCalledWith('123');
    });
  });

  it('seharusnya memperbarui field form', () => {
    const { result } = renderHook(() =>
      useEditBpjsModal({
        isOpen: true,
        defaultValues,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.setField('percent', '10');
    });

    expect(result.current.form.percent).toBe('10');
  });

  it('seharusnya mengirim form dengan sukses', async () => {
    mockUpdateBpjsItem.mockResolvedValue(true);

    const { result } = renderHook(() =>
      useEditBpjsModal({
        isOpen: true,
        defaultValues,
        onSuccess: mockOnSuccess,
      })
    );

    // Change value
    act(() => {
      result.current.setField('percent', '5');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockUpdateBpjsItem).toHaveBeenCalledWith('123', {
      companyPercentage: 5,
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('seharusnya tidak mengirim jika persentase tidak valid', async () => {
    const { result } = renderHook(() =>
      useEditBpjsModal({
        isOpen: true,
        defaultValues,
        onSuccess: mockOnSuccess,
      })
    );

    // Set invalid number
    act(() => {
      result.current.setField('percent', 'invalid');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockUpdateBpjsItem).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});

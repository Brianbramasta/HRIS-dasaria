import { renderHook, act } from '@testing-library/react';
import { useEditNonRecurringAllowanceModal, NonRecurringAllowanceForm } from './useEditNonRecurringAllowanceModal';

describe('useEditNonRecurringAllowanceModal', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const defaultValues: NonRecurringAllowanceForm = {
    namaTunjangan: 'Tunjangan Project',
    kategori: 'khusus',
    deskripsiUmum: 'Untuk project X',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seharusnya menginisialisasi form dengan nilai default saat defaultValues null', () => {
    const { result } = renderHook(() =>
      useEditNonRecurringAllowanceModal({
        isOpen: true,
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.namaTunjangan).toBe('');
    expect(result.current.form.kategori).toBe('umum'); // Default value in hook
    expect(result.current.form.deskripsiUmum).toBe('');
  });

  it('seharusnya menginisialisasi form dengan defaultValues yang diberikan', () => {
    const { result } = renderHook(() =>
      useEditNonRecurringAllowanceModal({
        isOpen: true,
        defaultValues,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.namaTunjangan).toBe('Tunjangan Project');
    expect(result.current.form.kategori).toBe('khusus');
    expect(result.current.form.deskripsiUmum).toBe('Untuk project X');
  });

  it('seharusnya mengupdate field menggunakan setField', () => {
    const { result } = renderHook(() =>
      useEditNonRecurringAllowanceModal({
        isOpen: true,
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.setField('namaTunjangan', 'Bonus Tahunan');
      result.current.setField('kategori', 'bonus');
    });

    expect(result.current.form.namaTunjangan).toBe('Bonus Tahunan');
    expect(result.current.form.kategori).toBe('bonus');
  });

  it('seharusnya mereset form saat defaultValues berubah', () => {
    const { result, rerender } = renderHook(
      (props) => useEditNonRecurringAllowanceModal(props),
      {
        initialProps: {
          isOpen: true,
          defaultValues: null,
          onSave: mockOnSave,
          onClose: mockOnClose,
        } as any,
      }
    );

    expect(result.current.form.namaTunjangan).toBe('');

    // Rerender with new defaultValues
    rerender({
      isOpen: true,
      defaultValues: defaultValues,
      onSave: mockOnSave,
      onClose: mockOnClose,
    });

    expect(result.current.form.namaTunjangan).toBe('Tunjangan Project');
  });

  it('seharusnya memanggil onSave dan onClose saat submit', () => {
    const { result } = renderHook(() =>
      useEditNonRecurringAllowanceModal({
        isOpen: true,
        defaultValues,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.handleSubmit();
    });

    expect(mockOnSave).toHaveBeenCalledWith(defaultValues);
    expect(mockOnClose).toHaveBeenCalled();
  });
});

import { renderHook, act } from '@testing-library/react';
import { useNonRecurringDeductionModal, NonRecurringDeductionForm } from './useNonRecurringDeductionModal';

describe('useNonRecurringDeductionModal', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const defaultValues: NonRecurringDeductionForm = {
    namaPotongan: 'Potongan Koperasi',
    kategori: 'koperasi',
    deskripsiUmum: 'Iuran wajib',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seharusnya menginisialisasi form dengan nilai default saat defaultValues null', () => {
    const { result } = renderHook(() =>
      useNonRecurringDeductionModal({
        isOpen: true,
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.namaPotongan).toBe('');
    expect(result.current.form.kategori).toBe('');
    expect(result.current.form.deskripsiUmum).toBe('');
  });

  it('seharusnya menginisialisasi form dengan defaultValues yang diberikan', () => {
    const { result } = renderHook(() =>
      useNonRecurringDeductionModal({
        isOpen: true,
        defaultValues,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.namaPotongan).toBe('Potongan Koperasi');
    expect(result.current.form.kategori).toBe('koperasi');
    expect(result.current.form.deskripsiUmum).toBe('Iuran wajib');
  });

  it('seharusnya mengupdate field menggunakan setField', () => {
    const { result } = renderHook(() =>
      useNonRecurringDeductionModal({
        isOpen: true,
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.setField('namaPotongan', 'Denda Terlambat');
    });

    expect(result.current.form.namaPotongan).toBe('Denda Terlambat');
  });

  it('seharusnya memanggil onSave dan onClose saat submit', () => {
    const { result } = renderHook(() =>
      useNonRecurringDeductionModal({
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

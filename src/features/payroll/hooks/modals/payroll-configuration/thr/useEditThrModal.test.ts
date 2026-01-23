import { renderHook, act } from '@testing-library/react';
import { useEditThrModal, ThrFormValues } from './useEditThrModal';

describe('useEditThrModal', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const defaultValues: ThrFormValues = {
    lamaKerja: '12 Bulan',
    deskripsiUmum: 'THR Keagamaan',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seharusnya menginisialisasi form dengan nilai default saat defaultValues null', () => {
    const { result } = renderHook(() =>
      useEditThrModal({
        isOpen: true,
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.lamaKerja).toBe('');
    expect(result.current.form.deskripsiUmum).toBe('');
  });

  it('seharusnya menginisialisasi form dengan defaultValues yang diberikan', () => {
    const { result } = renderHook(() =>
      useEditThrModal({
        isOpen: true,
        defaultValues,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.lamaKerja).toBe('12 Bulan');
    expect(result.current.form.deskripsiUmum).toBe('THR Keagamaan');
  });

  it('seharusnya mengupdate field menggunakan setField', () => {
    const { result } = renderHook(() =>
      useEditThrModal({
        isOpen: true,
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.setField('lamaKerja', '6 Bulan');
      result.current.setField('deskripsiUmum', 'THR Proposional');
    });

    expect(result.current.form.lamaKerja).toBe('6 Bulan');
    expect(result.current.form.deskripsiUmum).toBe('THR Proposional');
  });

  it('seharusnya memanggil onSave saat submit (dan TIDAK memanggil onClose)', () => {
    const { result } = renderHook(() =>
      useEditThrModal({
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
    // Berdasarkan implementasi saat ini, onClose tidak dipanggil di handleSubmit
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});

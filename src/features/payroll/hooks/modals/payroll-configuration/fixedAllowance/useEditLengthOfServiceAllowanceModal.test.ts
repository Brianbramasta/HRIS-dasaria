import { renderHook, act } from '@testing-library/react';
import { useEditLengthOfServiceAllowanceModal } from './useEditLengthOfServiceAllowanceModal';

// Mock dependencies
jest.mock('@/utils/formatCurrency', () => ({
  formatCurrency: (val: number) => `Rp ${val}`,
  formatInputCurrency: (val: string) => `Rp ${val.replace(/[^0-9]/g, '')}`,
  parseCurrency: (val: string) => parseInt(val.replace(/[^0-9]/g, '') || '0', 10),
}));

describe('useEditLengthOfServiceAllowanceModal', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();
  const defaultValues = {
    id: '1',
    length_of_service: '2 Tahun',
    nominal_value: 500000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seharusnya menginisialisasi form dengan nilai default', () => {
    const { result } = renderHook(() =>
      useEditLengthOfServiceAllowanceModal({
        defaultValues: defaultValues as any,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.lamaKerja).toBe('2 Tahun');
    // Mock returns "Rp 500000"
    expect(result.current.form.nominal).toBe('Rp 500000');
  });

  it('seharusnya menangani defaultValues null', () => {
    const { result } = renderHook(() =>
      useEditLengthOfServiceAllowanceModal({
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.lamaKerja).toBe('');
    expect(result.current.form.nominal).toBe('');
  });

  it('seharusnya mengupdate field lamaKerja', () => {
    const { result } = renderHook(() =>
      useEditLengthOfServiceAllowanceModal({
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.setField('lamaKerja', '5 Tahun');
    });

    expect(result.current.form.lamaKerja).toBe('5 Tahun');
  });

  it('seharusnya mengupdate field nominal dengan formatting', () => {
    const { result } = renderHook(() =>
      useEditLengthOfServiceAllowanceModal({
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.setField('nominal', '1000000');
    });

    expect(result.current.form.nominal).toBe('Rp 1000000');
  });

  it('seharusnya mengirim data yang benar saat submit', () => {
    const { result } = renderHook(() =>
      useEditLengthOfServiceAllowanceModal({
        defaultValues: defaultValues as any,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    act(() => {
      // Simulate changing nominal to ensure it picks up current form state
      result.current.setField('nominal', '750000');
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(mockOnSave).toHaveBeenCalledWith({ nominalValue: 750000 });
    expect(mockOnClose).toHaveBeenCalled();
  });
});

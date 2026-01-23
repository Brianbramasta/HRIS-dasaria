import { renderHook, act } from '@testing-library/react';
import { useEditTransportationAllowanceModal } from './useEditTransportationAllowanceModal';
import { TransportationAllowanceDetailResponse } from '@/features/payroll/types/dto/fixed-allowance/TransportationAllowanceType';

describe('useEditTransportationAllowanceModal', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const defaultValues: TransportationAllowanceDetailResponse = {
    id: '1',
    nameTransportation: 'Bus Antar Jemput',
    categoryName: 'Staff',
    nominalValue: 50000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seharusnya menginisialisasi form dengan nilai default', () => {
    const { result } = renderHook(() =>
      useEditTransportationAllowanceModal({
        defaultValues,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.transportasi).toBe('Bus Antar Jemput');
    expect(result.current.form.kategori).toBe('Staff');
    // Format internal: 50000 -> 50.000
    expect(result.current.form.nominal).toBe('50.000');
  });

  it('seharusnya menangani defaultValues null', () => {
    const { result } = renderHook(() =>
      useEditTransportationAllowanceModal({
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.transportasi).toBe('');
    expect(result.current.form.nominal).toBe('');
  });

  it('seharusnya mengupdate field normal', () => {
    const { result } = renderHook(() =>
      useEditTransportationAllowanceModal({
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.setField('transportasi', 'Motor Pribadi');
    });

    expect(result.current.form.transportasi).toBe('Motor Pribadi');
  });

  it('seharusnya mengupdate nominal dengan format ribuan', () => {
    const { result } = renderHook(() =>
      useEditTransportationAllowanceModal({
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.setField('nominal', '75000');
    });

    expect(result.current.form.nominal).toBe('75.000');
  });

  it('seharusnya submit dengan payload yang benar', () => {
    const { result } = renderHook(() =>
      useEditTransportationAllowanceModal({
        defaultValues,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    // Initial 50.000 -> change to 100.000
    act(() => {
      result.current.setField('nominal', '100000');
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(mockOnSave).toHaveBeenCalledWith({ nominalValue: 100000 });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('tidak seharusnya memanggil onSave jika onSave tidak didefinisikan', () => {
    const { result } = renderHook(() =>
      useEditTransportationAllowanceModal({
        defaultValues,
        onClose: mockOnClose,
        // onSave undefined
      })
    );

    act(() => {
      result.current.handleSubmit();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});

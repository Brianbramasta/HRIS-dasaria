import { renderHook, act } from '@testing-library/react';
import { useEditMarriageAllowanceModal } from './useEditMarriageAllowanceModal';
import { MarriageAllowanceListItem } from '@/features/payroll/types/dto/fixed-allowance/MarriageAllowanceType';

describe('useEditMarriageAllowanceModal', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const defaultValues: MarriageAllowanceListItem = {
    id: '1',
    code: 'M',
    category: 'Menikah',
    dependents: 1,
    nominalValue: 150000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seharusnya menginisialisasi form dengan nilai default', () => {
    const { result } = renderHook(() =>
      useEditMarriageAllowanceModal({
        defaultValues,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.statusPernikahan).toBe('M');
    expect(result.current.form.status).toBe('Menikah');
    expect(result.current.form.tanggungan).toBe('1');
    // Format internal: 150000 -> 150.000
    expect(result.current.form.nominal).toBe('150.000');
  });

  it('seharusnya menangani defaultValues null/undefined', () => {
    const { result } = renderHook(() =>
      useEditMarriageAllowanceModal({
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    expect(result.current.form.statusPernikahan).toBe('');
    expect(result.current.form.nominal).toBe('');
  });

  it('seharusnya mengupdate field normal', () => {
    const { result } = renderHook(() =>
      useEditMarriageAllowanceModal({
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.setField('statusPernikahan', 'TK');
      result.current.setField('tanggungan', '0');
    });

    expect(result.current.form.statusPernikahan).toBe('TK');
    expect(result.current.form.tanggungan).toBe('0');
  });

  it('seharusnya mengupdate nominal dengan format ribuan', () => {
    const { result } = renderHook(() =>
      useEditMarriageAllowanceModal({
        defaultValues: null,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.setField('nominal', '2000000');
    });

    expect(result.current.form.nominal).toBe('2.000.000');

    act(() => {
      // Test input with dots already (simulation of typing)
      // The hook replaces non-digits first, so passing "2.000.000" works too
      result.current.setField('nominal', '2.000.000');
    });
    expect(result.current.form.nominal).toBe('2.000.000');
  });

  it('seharusnya submit dengan payload nominal yang bersih dari format', async () => {
    const { result } = renderHook(() =>
      useEditMarriageAllowanceModal({
        defaultValues,
        onSave: mockOnSave,
        onClose: mockOnClose,
      })
    );

    // Initial is 150.000
    // Change to 200.000
    act(() => {
      result.current.setField('nominal', '200000');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockOnSave).toHaveBeenCalledWith({ nominalValue: 200000 });
  });
});

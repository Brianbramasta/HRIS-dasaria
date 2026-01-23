import { renderHook, act } from '@testing-library/react';
import { useEditPositionAndBPJSAllowanceModal } from './useEditPositionAndBPJSAllowanceModal';
import { PositionAllowanceDetailResponse } from '@/features/payroll/types/dto/fixed-allowance/PositionAllowanceType';

// Mock data
const mockDefaultValues: PositionAllowanceDetailResponse = {
  fixed_allowance: {
    id: '1',
    job_title_id: 'job-1',
    job_title_name: 'Manager',
    percentage_value: 10,
    nominal_value: null,
  },
  bpjs_items: {
    'BPJS Ketenagakerjaan': [
      { id: 'bpjs-1', detailName: 'JHT', type: 'Tunjangan', isActive: 1 },
      { id: 'bpjs-2', detailName: 'JHT', type: 'Potongan', isActive: 1 },
    ],
    'BPJS Kesehatan': [],
  },
};

describe('useEditPositionAndBPJSAllowanceModal', () => {
  it('seharusnya menginisialisasi form dengan nilai default', () => {
    const { result } = renderHook(() =>
      useEditPositionAndBPJSAllowanceModal({
        defaultValues: mockDefaultValues,
        onClose: jest.fn(),
      })
    );

    expect(result.current.form.jabatan).toBe('Manager');
    expect(result.current.form.percent).toBe('10');
    expect(result.current.form.ketenagakerjaan).toHaveLength(1); // JHT grouped
    expect(result.current.form.ketenagakerjaan[0].tt).toBe(true);
    expect(result.current.form.ketenagakerjaan[0].pt).toBe(true);
  });

  it('seharusnya mengupdate field percent dan mereset nominal', () => {
    const { result } = renderHook(() =>
      useEditPositionAndBPJSAllowanceModal({ onClose: jest.fn() })
    );

    act(() => {
      result.current.setField('percent', '50');
    });

    expect(result.current.form.percent).toBe('50');
    expect(result.current.form.nominal).toBe('');
  });

  it('seharusnya mengupdate field nominal dan mereset percent', () => {
    const { result } = renderHook(() =>
      useEditPositionAndBPJSAllowanceModal({ onClose: jest.fn() })
    );

    act(() => {
      result.current.setField('nominal', '1000000');
    });

    // formatInputCurrency adds Rp and formatting. 
    // We can just check if it contains the number, or use a regex to be safe against space differences
    expect(result.current.form.nominal).toMatch(/Rp\s?1\.000\.000/);
    expect(result.current.form.percent).toBe('');
  });

  it('seharusnya mengupdate status BPJS (updateBpjs)', () => {
    const { result } = renderHook(() =>
      useEditPositionAndBPJSAllowanceModal({
        defaultValues: mockDefaultValues,
        onClose: jest.fn(),
      })
    );

    // Initial state: JHT is selected (tt=true, pt=true)
    const bpjsId = result.current.form.ketenagakerjaan[0].id;

    // Uncheck selected
    act(() => {
      result.current.updateBpjs('ketenagakerjaan', bpjsId, 'selected', false);
    });

    expect(result.current.form.ketenagakerjaan[0].selected).toBe(false);
    expect(result.current.form.ketenagakerjaan[0].tt).toBe(false);
    expect(result.current.form.ketenagakerjaan[0].pt).toBe(false);

    // Check tt only
    act(() => {
      result.current.updateBpjs('ketenagakerjaan', bpjsId, 'tt', true);
    });

    expect(result.current.form.ketenagakerjaan[0].tt).toBe(true);
    // selected should be false because pt is false and logic requires both if both IDs exist
    expect(result.current.form.ketenagakerjaan[0].selected).toBe(false);
  });

  it('seharusnya memanggil onSave dengan payload yang benar saat submit', () => {
    const onSave = jest.fn();
    const { result } = renderHook(() =>
      useEditPositionAndBPJSAllowanceModal({
        defaultValues: mockDefaultValues,
        onSave,
        onClose: jest.fn(),
      })
    );

    act(() => {
      result.current.handleSubmit();
    });

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      jobLevelId: 'job-1',
      percentage_value: 10,
      nominal_value: null,
      positionAllowanceBpjs: expect.any(Array),
    }));
  });

  it('seharusnya menampilkan error jika percent dan nominal kosong', () => {
    const { result } = renderHook(() =>
      useEditPositionAndBPJSAllowanceModal({ onClose: jest.fn() })
    );

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.errors.percent).toBeDefined();
    expect(result.current.errors.nominal).toBeDefined();
  });
});

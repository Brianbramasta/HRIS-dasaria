import { renderHook, act } from '@testing-library/react';
import { useEditCompensationModal } from './useEditCompensationModal';

// Mock dependencies
jest.mock('@/utils/formatCurrency', () => ({
  formatInputCurrency: jest.fn((val) => val.replace(/[^0-9]/g, '')), // Simple mock
}));

describe('useEditCompensationModal Hook', () => {
  const defaultParams = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('harus menginisialisasi dengan nilai default', () => {
    const { result } = renderHook(() => useEditCompensationModal(defaultParams));
    expect(result.current.form).toEqual({});
  });

  it('harus menginisialisasi dengan data yang diberikan', () => {
    const initialData = { general: '1000' };
    const { result } = renderHook(() => useEditCompensationModal({ ...defaultParams, initialData }));
    expect(result.current.form).toEqual(initialData);
  });

  it('harus menangani input general dan membersihkan input lain (eksklusif)', () => {
    const { result } = renderHook(() => useEditCompensationModal(defaultParams));

    act(() => {
      result.current.setNominal('junior', '500');
    });
    expect(result.current.form.junior).toBe('500');

    act(() => {
      result.current.setNominal('general', '1000');
    });

    expect(result.current.form.general).toBe('1000');
    expect(result.current.form.junior).toBe('');
    expect(result.current.form.middle).toBe('');
    expect(result.current.form.senior).toBe('');
  });

  it('harus menangani input level spesifik dan membersihkan general (eksklusif)', () => {
    const { result } = renderHook(() => useEditCompensationModal(defaultParams));

    act(() => {
      result.current.setNominal('general', '1000');
    });
    expect(result.current.form.general).toBe('1000');

    act(() => {
      result.current.setNominal('middle', '500');
    });

    expect(result.current.form.middle).toBe('500');
    expect(result.current.form.general).toBe('');
  });

  it('harus mengirimkan data form saat submit', () => {
    const { result } = renderHook(() => useEditCompensationModal(defaultParams));

    act(() => {
        result.current.handleInput('general', '1000');
    });
    
    act(() => {
      result.current.handleSubmit();
    });

    expect(defaultParams.onSubmit).toHaveBeenCalledWith(expect.objectContaining({ general: '1000' }));
  });
});

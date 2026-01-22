import { renderHook, act, waitFor } from '@testing-library/react';
import { useEditDeductionReferenceModal } from './useEditDeductionReferenceModal';
import { useApiRefDeduction } from '../../../api/useApiRefDeduction';
import { formatCurrency, formatInputCurrency, parseCurrency } from '@/utils/formatCurrency';

// Mock api service globally to prevent import.meta error
jest.mock('@/services/api', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    buildQueryString: jest.fn(),
  },
}));

// Mock dependencies
jest.mock('../../../api/useApiRefDeduction');
jest.mock('@/utils/formatCurrency');

const mockUseApiRefDeduction = useApiRefDeduction as jest.Mock;

describe('useEditDeductionReferenceModal Hook', () => {
  const mockApi = {
    updateRefDeduction: jest.fn(),
    getRefDeductionDetail: jest.fn(),
    loading: false,
  };

  const defaultParams = {
    isOpen: true,
    refDeductionData: { id: '1', referenceName: 'UMR', category: 'BPJS', nominalValue: 1000, description: 'Desc' } as any,
    onSuccess: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApiRefDeduction.mockReturnValue(mockApi);
    (formatCurrency as jest.Mock).mockImplementation((val) => `Rp ${val}`);
    (formatInputCurrency as jest.Mock).mockImplementation((val) => val);
    (parseCurrency as jest.Mock).mockImplementation((val) => parseFloat(val));
  });

  it('harus menginisialisasi form dengan data yang diberikan', () => {
    const { result } = renderHook(() => useEditDeductionReferenceModal(defaultParams));

    expect(result.current.form.acuanPotongan).toBe('UMR');
    expect(result.current.form.nominal).toBe('Rp 1000');
  });

  it('harus mengambil detail terbaru saat modal dibuka', async () => {
    const detailData = {
      referenceName: 'UMR Updated',
      category: 'BPJS',
      nominalValue: 2000,
      description: 'Desc Updated'
    };
    mockApi.getRefDeductionDetail.mockResolvedValue(detailData);

    renderHook(() => useEditDeductionReferenceModal(defaultParams));

    await waitFor(() => {
      expect(mockApi.getRefDeductionDetail).toHaveBeenCalledWith('1');
    });
  });

  it('harus update field form saat setField dipanggil', () => {
    const { result } = renderHook(() => useEditDeductionReferenceModal(defaultParams));

    act(() => {
      result.current.setField('keterangan', 'New Desc');
    });

    expect(result.current.form.keterangan).toBe('New Desc');
  });

  it('harus memanggil updateRefDeduction saat submit', async () => {
    const { result } = renderHook(() => useEditDeductionReferenceModal(defaultParams));

    act(() => {
      result.current.setField('keterangan', 'Updated Desc');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockApi.updateRefDeduction).toHaveBeenCalledWith('1', expect.objectContaining({
      description: 'Updated Desc'
    }));
    expect(defaultParams.onSuccess).toHaveBeenCalled();
    expect(defaultParams.onClose).toHaveBeenCalled();
  });
});

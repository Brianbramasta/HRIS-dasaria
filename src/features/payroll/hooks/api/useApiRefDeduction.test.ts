import { renderHook, act } from '@testing-library/react';
import { useApiRefDeduction } from './useApiRefDeduction';
import { refDeductionServices } from '../../services/RefDeductionServices';
import useFilterStore from '../../../../stores/filterStore';

// Mock Dependencies
jest.mock('../../services/RefDeductionServices', () => ({
  refDeductionServices: {
    getRefDeductionList: jest.fn(),
    updateRefDeduction: jest.fn(),
    getRefDeductionDetail: jest.fn(),
  },
}));

jest.mock('../../../../stores/filterStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Helper untuk mock store
const mockUseFilterStore = useFilterStore as unknown as jest.Mock;

describe('useApiRefDeduction Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock untuk filter store
    mockUseFilterStore.mockImplementation((selector: any) => selector({
        filters: { 'RefDeduction': '' }
    }));
  });

  it('harus memiliki initial state yang benar', () => {
    const { result } = renderHook(() => useApiRefDeduction());

    expect(result.current.refDeductions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.search).toBe('');
    expect(result.current.sortBy).toBe('');
  });

  describe('fetchRefDeductions', () => {
    it('harus berhasil mengambil data ref deduction', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: '1',
              reference_name: 'UMR',
              category: 'BPJS',
              nominal_value: 1000000,
              description: 'Deskripsi',
            },
          ],
          total: 1,
          per_page: 10,
        },
      };

      (refDeductionServices.getRefDeductionList as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useApiRefDeduction());

      await act(async () => {
        await result.current.fetchRefDeductions();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.refDeductions).toHaveLength(1);
      expect(result.current.refDeductions[0].referenceName).toBe('UMR');
      expect(result.current.total).toBe(1);
      expect(result.current.error).toBeNull();
    });

    it('harus menangani error saat fetch gagal', async () => {
        const errorMessage = 'Network Error';
        (refDeductionServices.getRefDeductionList as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useApiRefDeduction());

        await act(async () => {
            await result.current.fetchRefDeductions();
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.refDeductions).toEqual([]);
    });
    
    it('harus mengirimkan parameter filter yang benar', async () => {
        const { result } = renderHook(() => useApiRefDeduction());
        
        // Setup state awal
        act(() => {
            result.current.setSearch('test');
        });

        await act(async () => {
            await result.current.fetchRefDeductions();
        });

        expect(refDeductionServices.getRefDeductionList).toHaveBeenCalledWith(expect.objectContaining({
            search: 'test',
            page: 1,
            per_page: 10
        }));
    });
  });

  describe('updateRefDeduction', () => {
    it('harus berhasil update data', async () => {
      (refDeductionServices.updateRefDeduction as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() => useApiRefDeduction());

      await act(async () => {
        await result.current.updateRefDeduction('1', { nominalValue: 2000000, description: 'Updated' });
      });

      expect(refDeductionServices.updateRefDeduction).toHaveBeenCalledWith('1', expect.any(FormData));
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('getRefDeductionDetail', () => {
    it('harus berhasil mengambil detail data', async () => {
      const mockDetail = {
        data: {
          id: '1',
          reference_name: 'UMR',
          category: 'BPJS',
          nominal_value: 1000000,
          description: 'Deskripsi',
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
        }
      };

      (refDeductionServices.getRefDeductionDetail as jest.Mock).mockResolvedValue(mockDetail);

      const { result } = renderHook(() => useApiRefDeduction());

      let detail;
      await act(async () => {
        detail = await result.current.getRefDeductionDetail('1');
      });

      expect(detail).toEqual(expect.objectContaining({
          referenceName: 'UMR',
          nominalValue: 1000000
      }));
    });
  });
});

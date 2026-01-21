import { renderHook, act } from '@testing-library/react';
import { useApiCompensation } from './useApiCompensation';
import { payrollConfigurationServices } from '../../services/PayrollConfigurationServices';
import useFilterStore from '../../../../stores/filterStore';

// Mock Dependencies
jest.mock('../../services/PayrollConfigurationServices', () => ({
  payrollConfigurationServices: {
    getCompensationList: jest.fn(),
    updateCompensation: jest.fn(),
    getCompensationDetail: jest.fn(),
  },
}));

jest.mock('../../../../stores/filterStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Helper untuk mock store
const mockUseFilterStore = useFilterStore as unknown as jest.Mock;

describe('useApiCompensation Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock untuk filter store
    mockUseFilterStore.mockImplementation((selector: any) => selector({
        filters: { 'Compensation': '' }
    }));
  });

  it('harus memiliki initial state yang benar', () => {
    const { result } = renderHook(() => useApiCompensation());

    expect(result.current.compensations).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.search).toBe('');
    expect(result.current.sortBy).toBe('');
  });

  describe('fetchCompensations', () => {
    it('harus berhasil mengambil data compensation', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: '1',
              job_title_name: 'Manager',
              mt_structural_job_name: 'Struct Job',
              category_compensation: 'A',
              amount_general: 1000,
              amount_junior: null,
              amount_middle: null,
              amount_senior: null,
            },
          ],
          total: 1,
          per_page: 10,
        },
      };

      (payrollConfigurationServices.getCompensationList as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useApiCompensation());

      await act(async () => {
        await result.current.fetchCompensations();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.compensations).toHaveLength(1);
      expect(result.current.compensations[0].jobTitleName).toBe('Manager');
      expect(result.current.total).toBe(1);
      expect(result.current.error).toBeNull();
    });

    it('harus menangani error saat fetch gagal', async () => {
        const errorMessage = 'Network Error';
        (payrollConfigurationServices.getCompensationList as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useApiCompensation());

        await act(async () => {
            await result.current.fetchCompensations();
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.compensations).toEqual([]);
    });
    
    it('harus mengirimkan parameter filter yang benar', async () => {
        const { result } = renderHook(() => useApiCompensation());
        
        // Setup state awal
        act(() => {
            result.current.setSearch('test');
            result.current.setSort('jobTitleName', 'asc');
        });

        (payrollConfigurationServices.getCompensationList as jest.Mock).mockResolvedValue({ data: { data: [] } });

        await act(async () => {
            await result.current.fetchCompensations();
        });

        expect(payrollConfigurationServices.getCompensationList).toHaveBeenCalledWith(expect.objectContaining({
            search: 'test',
            column: 'job_title_name', // mapped from jobTitleName
            sort: 'asc'
        }));
    });
  });

  describe('updateCompensation', () => {
      it('harus berhasil melakukan update compensation', async () => {
          (payrollConfigurationServices.updateCompensation as jest.Mock).mockResolvedValue({ data: {} });
          
          const { result } = renderHook(() => useApiCompensation());
          
          await act(async () => {
              await result.current.updateCompensation('1', {
                  categoryCompensation: 'New Cat',
                  amountGeneral: 5000,
                  amountJunior: null,
                  amountMiddle: null,
                  amountSenior: null
              });
          });
          
          expect(payrollConfigurationServices.updateCompensation).toHaveBeenCalled();
          expect(result.current.loading).toBe(false);
          expect(result.current.error).toBeNull();
      });
  });

  describe('getCompensationDetail', () => {
      it('harus berhasil mengambil detail compensation dan melakukan mapping', async () => {
          const mockDetailResponse = {
              data: {
                  id: '1',
                  job_title: {
                      id: 'jt1',
                      job_title_name: 'CEO',
                      structural_jobs: [
                          { id: 's1', mt_structural_job_name: 'Director' }
                      ]
                  },
                  category_compensation: 'Executive',
                  amount_general: 10000000,
                  created_at: '2023-01-01',
                  updated_at: '2023-01-01'
              }
          };
          
          (payrollConfigurationServices.getCompensationDetail as jest.Mock).mockResolvedValue(mockDetailResponse);
          
          const { result } = renderHook(() => useApiCompensation());
          
          let detail: any = null;
          await act(async () => {
              detail = await result.current.getCompensationDetail('1');
          });
          
          expect(detail).not.toBeNull();

          if (detail) {
            expect(detail.jobTitle.jobTitleName).toBe('CEO');
            expect(detail.jobTitle.structuralJobs).toHaveLength(1);
            expect(detail.jobTitle.structuralJobs[0].structuralJobName).toBe('Director');
          }
      });
  });

  describe('State Setters', () => {
      it('setSearch harus mereset page ke 1', () => {
          const { result } = renderHook(() => useApiCompensation());
          
          act(() => {
              result.current.setPage(5);
          });
          
          act(() => {
              result.current.setSearch('new search');
          });
          
          expect(result.current.search).toBe('new search');
          expect(result.current.page).toBe(1);
      });

      it('setPageSize harus mereset page ke 1', () => {
          const { result } = renderHook(() => useApiCompensation());
          
          act(() => {
              result.current.setPage(5);
          });
          
          act(() => {
              result.current.setPageSize(20);
          });
          
          expect(result.current.pageSize).toBe(20);
          expect(result.current.page).toBe(1);
      });
  });
});

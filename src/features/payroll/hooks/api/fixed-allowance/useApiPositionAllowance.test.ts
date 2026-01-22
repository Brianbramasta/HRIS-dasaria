import { renderHook, act, waitFor } from '@testing-library/react';
import { useApiPositionAllowance } from './useApiPositionAllowance';
import { positionAllowanceServices } from '../../../services/fixed-allowance/PositionAllowanceServices';

// Mock service
jest.mock('../../../services/fixed-allowance/PositionAllowanceServices', () => ({
  positionAllowanceServices: {
    getPositionAllowanceList: jest.fn(),
    updatePositionAllowance: jest.fn(),
    getPositionAllowanceDetail: jest.fn(),
  },
}));

describe('useApiPositionAllowance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seharusnya mengambil daftar tunjangan jabatan dengan sukses', async () => {
    const mockData = {
      data: {
        data: [
          { id: '1', job_title_name: 'Manager', percentage_value: 10, nominal_value: null },
        ],
        total: 1,
        per_page: 10,
      },
    };
    (positionAllowanceServices.getPositionAllowanceList as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useApiPositionAllowance());

    await act(async () => {
      await result.current.fetchPositionAllowances();
    });

    expect(result.current.positionAllowances).toHaveLength(1);
    expect(result.current.positionAllowances[0].jobTitleName).toBe('Manager');
    expect(result.current.total).toBe(1);
    expect(result.current.loading).toBe(false);
  });

  it('seharusnya menangani error saat gagal mengambil data', async () => {
    (positionAllowanceServices.getPositionAllowanceList as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useApiPositionAllowance());

    await act(async () => {
      await result.current.fetchPositionAllowances();
    });

    expect(result.current.error).toBe('Network Error');
    expect(result.current.loading).toBe(false);
  });

  it('seharusnya mengupdate tunjangan jabatan dengan sukses', async () => {
    (positionAllowanceServices.updatePositionAllowance as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useApiPositionAllowance());

    const payload = {
      jobLevelId: '1',
      percentage_value: 10,
      nominal_value: null,
      positionAllowanceBpjs: [],
    };

    let success;
    await act(async () => {
      success = await result.current.updatePositionAllowance('1', payload);
    });

    expect(success).toBe(true);
    expect(positionAllowanceServices.updatePositionAllowance).toHaveBeenCalledWith('1', expect.any(FormData));
  });

  it('seharusnya mengambil detail tunjangan jabatan dengan sukses', async () => {
    const mockDetail = {
      data: {
        fixed_allowance: {
          id: '1',
          job_title_id: 'job-1',
          job_title_name: 'Manager',
          percentage_value: 10,
          nominal_value: null,
        },
        bpjs_items: {
            'BPJS Ketenagakerjaan': [],
        },
      },
    };
    (positionAllowanceServices.getPositionAllowanceDetail as jest.Mock).mockResolvedValue(mockDetail);

    const { result } = renderHook(() => useApiPositionAllowance());

    let detail;
    await act(async () => {
      detail = await result.current.getPositionAllowanceDetail('1');
    });

    expect(detail).toBeDefined();
    expect((detail as any)?.fixed_allowance.job_title_name).toBe('Manager');
  });

  it('seharusnya mengupdate pagination dan sorting', () => {
    const { result } = renderHook(() => useApiPositionAllowance());

    act(() => {
      result.current.setPage(2);
      result.current.setPageSize(20);
      result.current.setSearch('Manager');
      result.current.setSort('jobTitleName', 'desc');
    });

    expect(result.current.page).toBe(1); // setSearch resets page to 1
    expect(result.current.pageSize).toBe(20);
    expect(result.current.search).toBe('Manager');
    expect(result.current.sortBy).toBe('jobTitleName');
    expect(result.current.sortOrder).toBe('desc');
  });
});

import { renderHook, act } from '@testing-library/react';
import { useApiConfigurationTHR } from './useApiConfigurationTHR';
import { configurationTHRServices } from '../../services/ConfigurationTHRServices';

// Mock service
jest.mock('../../services/ConfigurationTHRServices', () => ({
  configurationTHRServices: {
    getConfigurationTHRList: jest.fn(),
    updateConfigurationTHR: jest.fn(),
    updateStatusConfigurationTHR: jest.fn(),
    getConfigurationTHRDetail: jest.fn(),
  },
}));

describe('useApiConfigurationTHR', () => {
  const mockGetList = configurationTHRServices.getConfigurationTHRList as jest.Mock;
  const mockUpdate = configurationTHRServices.updateConfigurationTHR as jest.Mock;
  const mockUpdateStatus = configurationTHRServices.updateStatusConfigurationTHR as jest.Mock;
  const mockGetDetail = configurationTHRServices.getConfigurationTHRDetail as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('harus memiliki state awal yang benar', () => {
    const { result } = renderHook(() => useApiConfigurationTHR());

    expect(result.current.configurations).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('harus mengambil daftar konfigurasi THR dengan sukses', async () => {
    const mockResponse = {
      data: {
        data: [
          {
            id: '1',
            length_of_service: '1 Tahun',
            description: 'THR 1 Bulan Gaji',
          },
        ],
        total: 1,
        per_page: 10,
      },
    };

    mockGetList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useApiConfigurationTHR());

    await act(async () => {
      await result.current.fetchConfigurationTHR();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.configurations).toHaveLength(1);
    expect(result.current.configurations[0].lengthOfService).toBe('1 Tahun');
    expect(mockGetList).toHaveBeenCalled();
  });

  it('harus menangani error saat gagal mengambil daftar', async () => {
    mockGetList.mockRejectedValue(new Error('Gagal fetch'));

    const { result } = renderHook(() => useApiConfigurationTHR());

    await act(async () => {
      await result.current.fetchConfigurationTHR();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Gagal fetch');
    expect(result.current.configurations).toEqual([]);
  });

  it('harus memperbarui konfigurasi THR dengan sukses', async () => {
    mockUpdate.mockResolvedValue({});

    const { result } = renderHook(() => useApiConfigurationTHR());

    const payload = {
      lengthOfService: '2 Tahun',
      description: 'THR 2x',
    };

    await act(async () => {
      await result.current.updateConfigurationTHR('1', payload);
    });

    expect(mockUpdate).toHaveBeenCalledWith('1', expect.any(FormData));
    expect(result.current.error).toBeNull();
  });

  it('harus memperbarui status konfigurasi THR dengan sukses', async () => {
    mockUpdateStatus.mockResolvedValue({});

    const { result } = renderHook(() => useApiConfigurationTHR());

    const payload = {
      isActive: true,
    };

    let success;
    await act(async () => {
      success = await result.current.updateStatusConfigurationTHR(payload);
    });

    expect(success).toBe(true);
    expect(mockUpdateStatus).toHaveBeenCalledWith(expect.any(FormData));
  });

  it('harus mengambil detail konfigurasi THR dengan sukses', async () => {
    const mockDetail = {
      data: {
        id: '1',
        length_of_service: '1 Tahun',
        description: 'Desc',
        is_active: 1,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
    };

    mockGetDetail.mockResolvedValue(mockDetail);

    const { result } = renderHook(() => useApiConfigurationTHR());

    let detail;
    await act(async () => {
      detail = await result.current.getConfigurationTHRDetail('1');
    });

    expect(detail).toEqual({
      id: '1',
      lengthOfService: '1 Tahun',
      description: 'Desc',
      isActive: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    });
  });

  it('harus mengubah parameter pagination, search, dan sort', () => {
    const { result } = renderHook(() => useApiConfigurationTHR());

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setPageSize(20);
    });
    expect(result.current.pageSize).toBe(20);

    act(() => {
      result.current.setSearch('cari');
    });
    expect(result.current.search).toBe('cari');

    act(() => {
      result.current.setSort('lengthOfService', 'desc');
    });
    expect(result.current.sortBy).toBe('lengthOfService');
    expect(result.current.sortOrder).toBe('desc');
  });
});

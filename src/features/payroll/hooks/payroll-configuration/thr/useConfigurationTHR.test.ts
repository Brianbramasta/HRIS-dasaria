import { renderHook, act } from '@testing-library/react';
import { useConfigurationTHR } from './useConfigurationTHR';
import { useApiConfigurationTHR } from '../../api/useApiConfigurationTHR';
import { useModal } from '@/hooks/useModal';

// Mock dependencies
jest.mock('../../api/useApiConfigurationTHR');
jest.mock('@/hooks/useModal');

describe('useConfigurationTHR', () => {
  const mockFetchConfigurationTHR = jest.fn();
  const mockGetConfigurationTHRDetail = jest.fn();
  const mockUpdateConfigurationTHR = jest.fn();
  const mockUpdateStatusConfigurationTHR = jest.fn();
  
  const mockOpenModal = jest.fn();
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup return values for mocks
    (useApiConfigurationTHR as jest.Mock).mockReturnValue({
      fetchConfigurationTHR: mockFetchConfigurationTHR,
      getConfigurationTHRDetail: mockGetConfigurationTHRDetail,
      updateConfigurationTHR: mockUpdateConfigurationTHR,
      updateStatusConfigurationTHR: mockUpdateStatusConfigurationTHR,
      configurations: [
        { id: '1', lengthOfService: '1 Tahun', description: 'Desc 1' },
        { id: '2', lengthOfService: '2 Tahun', description: 'Desc 2' }
      ],
      page: 1,
      pageSize: 10,
    });

    (useModal as jest.Mock).mockReturnValue({
      isOpen: false,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    });
  });

  it('harus memuat data konfigurasi saat pertama kali dijalankan', () => {
    renderHook(() => useConfigurationTHR());
    expect(mockFetchConfigurationTHR).toHaveBeenCalledTimes(1);
  });

  it('harus mengembalikan daftar baris (rows) dengan format yang benar', () => {
    const { result } = renderHook(() => useConfigurationTHR());
    
    expect(result.current.rows).toHaveLength(2);
    expect(result.current.rows[0]).toEqual({
      id: '1',
      no: 1,
      'Lama Kerja': '1 Tahun',
      'Deksripsi Umum': 'Desc 1',
      raw: expect.any(Object),
    });
  });

  it('harus membuka modal edit dan mengambil detail data', async () => {
    const detailData = { id: '1', lengthOfService: '1 Tahun Detail', description: 'Desc Detail' };
    mockGetConfigurationTHRDetail.mockResolvedValue(detailData);

    const { result } = renderHook(() => useConfigurationTHR());
    
    const itemToEdit = { id: '1', lengthOfService: '1 Tahun', description: 'Desc 1' };
    
    await act(async () => {
      await result.current.handleEditOpen(itemToEdit);
    });

    expect(result.current.detailLoading).toBe(false);
    expect(mockGetConfigurationTHRDetail).toHaveBeenCalledWith('1');
    expect(result.current.selected).toEqual({
        id: detailData.id,
        lengthOfService: detailData.lengthOfService,
        description: detailData.description
    });
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('harus menangani error saat mengambil detail data', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetConfigurationTHRDetail.mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useConfigurationTHR());
    
    const itemToEdit = { id: '1', lengthOfService: '1 Tahun', description: 'Desc 1' };
    
    await act(async () => {
      await result.current.handleEditOpen(itemToEdit);
    });

    expect(result.current.detailLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('harus menyimpan perubahan konfigurasi', async () => {
    const detailData = { id: '1', lengthOfService: '1 Tahun', description: 'Desc 1' };
    mockGetConfigurationTHRDetail.mockResolvedValue(detailData);

    const { result } = renderHook(() => useConfigurationTHR());

    // First open edit to set selected
    await act(async () => {
      await result.current.handleEditOpen({ id: '1', lengthOfService: '1 Tahun', description: 'Desc 1' });
    });

    const updateValues = { lamaKerja: '1.5 Tahun', deskripsiUmum: 'Updated Desc' };
    
    await act(async () => {
      await result.current.handleSave(updateValues);
    });

    expect(mockUpdateConfigurationTHR).toHaveBeenCalledWith('1', {
      lengthOfService: '1.5 Tahun',
      description: 'Updated Desc',
    });
    expect(mockFetchConfigurationTHR).toHaveBeenCalled(); // Should refresh data
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('tidak boleh menyimpan jika tidak ada item yang dipilih', async () => {
    const { result } = renderHook(() => useConfigurationTHR());
    
    await act(async () => {
      await result.current.handleSave({ lamaKerja: 'X', deskripsiUmum: 'Y' });
    });

    expect(mockUpdateConfigurationTHR).not.toHaveBeenCalled();
  });

  it('harus menutup modal dan mereset pilihan', () => {
    const { result } = renderHook(() => useConfigurationTHR());

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.selected).toBeNull();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('harus mengubah status aktif', async () => {
    const { result } = renderHook(() => useConfigurationTHR());

    await act(async () => {
      await result.current.handleToggleStatus(true);
    });

    expect(mockUpdateStatusConfigurationTHR).toHaveBeenCalledWith({ isActive: true });
    expect(mockFetchConfigurationTHR).toHaveBeenCalled();
  });
});

import { renderHook, waitFor } from '@testing-library/react';
import { usePTKPDropdown } from './usePTKPDropdown';
import { employeeMasterDataService } from '../../../services/EmployeeMasterData.service';

// Mock dependencies
jest.mock('../../../services/EmployeeMasterData.service', () => ({
  employeeMasterDataService: {
    getPTKPDropdown: jest.fn(),
  },
}));

describe('usePTKPDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seharusnya memiliki state awal yang benar', () => {
    const { result } = renderHook(() => usePTKPDropdown(false));
    expect(result.current.ptkpOptions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('seharusnya mengambil opsi PTKP saat isOpen bernilai true', async () => {
    const mockData = [
      { id: '1', code: 'TK/0', category: 'Tidak Kawin 0 Tanggungan' },
      { id: '2', code: 'K/0', category: 'Kawin 0 Tanggungan' },
    ];
    (employeeMasterDataService.getPTKPDropdown as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePTKPDropdown(true));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(employeeMasterDataService.getPTKPDropdown).toHaveBeenCalled();
    expect(result.current.ptkpOptions).toEqual([
      { value: '1', label: 'TK/0 - Tidak Kawin 0 Tanggungan' },
      { value: '2', label: 'K/0 - Kawin 0 Tanggungan' },
    ]);
  });

  it('seharusnya menangani error saat fetch gagal', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (employeeMasterDataService.getPTKPDropdown as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => usePTKPDropdown(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.ptkpOptions).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching PTKP options:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('tidak seharusnya memanggil API jika isOpen bernilai false', () => {
    renderHook(() => usePTKPDropdown(false));
    expect(employeeMasterDataService.getPTKPDropdown).not.toHaveBeenCalled();
  });

  it('seharusnya memanggil ulang API jika isOpen berubah dari false ke true', () => {
    const { rerender } = renderHook(({ isOpen }) => usePTKPDropdown(isOpen), {
      initialProps: { isOpen: false },
    });

    expect(employeeMasterDataService.getPTKPDropdown).not.toHaveBeenCalled();

    rerender({ isOpen: true });

    expect(employeeMasterDataService.getPTKPDropdown).toHaveBeenCalled();
  });
});

import { renderHook, waitFor, act } from '@testing-library/react';
import { useStep1Data } from './useStep1Data';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import * as useFormulirKaryawan from './useFormulirKaryawan';

// Mock store
jest.mock('@/features/employee/stores/useFormulirKaryawanStore');

// Mock helper functions
jest.mock('./useFormulirKaryawan', () => ({
  getReligionDropdownOptions: jest.fn(),
  getEducationDropdownOptions: jest.fn(),
}));

describe('useStep1Data', () => {
  const mockUpdateStep1 = jest.fn();
  const mockStep1Data = {
    namaLengkap: 'John Doe',
    nik: '1234567890',
    fotoProfil: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
      formData: { step1: mockStep1Data },
      updateStep1: mockUpdateStep1,
    });
  });

  it('seharusnya memuat opsi dropdown saat inisialisasi', async () => {
    const mockAgama = [{ label: 'Islam', value: '1' }];
    const mockPendidikan = [{ label: 'S1', value: '1' }];

    (useFormulirKaryawan.getReligionDropdownOptions as jest.Mock).mockResolvedValue(mockAgama);
    (useFormulirKaryawan.getEducationDropdownOptions as jest.Mock).mockResolvedValue(mockPendidikan);

    const { result } = renderHook(() => useStep1Data());

    await waitFor(() => {
      expect(result.current.agamaOptions).toEqual(mockAgama);
      expect(result.current.pendidikanOptions).toEqual(mockPendidikan);
    });
  });

  it('seharusnya mengembalikan data step1 dari store', () => {
    const { result } = renderHook(() => useStep1Data());
    expect(result.current.step1).toEqual(mockStep1Data);
  });

  it('seharusnya memanggil updateStep1 saat handleChange dipanggil', () => {
    const { result } = renderHook(() => useStep1Data());

    act(() => {
      result.current.handleChange('namaLengkap', 'Jane Doe');
    });

    expect(mockUpdateStep1).toHaveBeenCalledWith({ namaLengkap: 'Jane Doe' });
  });

  it('seharusnya menangani perubahan file foto profil', () => {
    const { result } = renderHook(() => useStep1Data());
    const file = new File(['dummy'], 'profile.png', { type: 'image/png' });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(mockUpdateStep1).toHaveBeenCalledWith({ fotoProfil: file });
  });

  it('seharusnya menangani perubahan file foto profil jika tidak ada file yang dipilih', () => {
    const { result } = renderHook(() => useStep1Data());
    const event = {
      target: {
        files: [],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(mockUpdateStep1).toHaveBeenCalledWith({ fotoProfil: null });
  });
});

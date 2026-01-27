import { renderHook, waitFor, act } from '@testing-library/react';
import { useStep2Data } from './useStep2Data';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import * as useFormulirKaryawan from './useFormulirKaryawan';

// Mock store
jest.mock('@/features/employee/stores/useFormulirKaryawanStore');

// Mock helper functions
jest.mock('./useFormulirKaryawan', () => ({
  getEducationDropdownOptions: jest.fn(),
}));

describe('useStep2Data', () => {
  const mockUpdateStep2 = jest.fn();
  const initialEducation = [
    {
      jenisPendidikan: 'formal',
      jenjang: 'S1',
      namaLembaga: 'Univ A',
    },
  ];
  const mockStep2Data = {
    education: initialEducation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
      formData: { step2: mockStep2Data },
      updateStep2: mockUpdateStep2,
    });
  });

  it('seharusnya memuat opsi pendidikan saat inisialisasi', async () => {
    const mockPendidikan = [{ label: 'S1', value: '1' }];
    (useFormulirKaryawan.getEducationDropdownOptions as jest.Mock).mockResolvedValue(mockPendidikan);

    const { result } = renderHook(() => useStep2Data());

    await waitFor(() => {
      expect(result.current.pendidikanTerakhir).toEqual(mockPendidikan);
    });
  });

  it('seharusnya menginisialisasi education jika kosong', () => {
    (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
      formData: { step2: { education: [] } },
      updateStep2: mockUpdateStep2,
    });

    renderHook(() => useStep2Data());

    expect(mockUpdateStep2).toHaveBeenCalledWith(
      expect.objectContaining({
        education: expect.arrayContaining([
          expect.objectContaining({ jenisPendidikan: 'formal' }),
        ]),
      })
    );
  });

  it('seharusnya menambahkan baris education baru', () => {
    const { result } = renderHook(() => useStep2Data());

    act(() => {
      result.current.addEducationRow();
    });

    const expectedEducation = [
      ...initialEducation,
      expect.objectContaining({
        jenisPendidikan: 'formal',
        jenjang: '',
        namaLembaga: '',
      }),
    ];

    expect(mockUpdateStep2).toHaveBeenCalledWith({
      education: expect.arrayContaining([
          ...initialEducation,
          expect.anything()
      ]),
    });
  });

  it('seharusnya menghapus baris education', () => {
    const { result } = renderHook(() => useStep2Data());

    act(() => {
      result.current.removeEducationRow(0);
    });

    expect(mockUpdateStep2).toHaveBeenCalledWith({ education: [] });
  });

  it('seharusnya memperbarui field education', () => {
    const { result } = renderHook(() => useStep2Data());

    act(() => {
      result.current.updateEducationField(0, 'namaLembaga', 'Univ B');
    });

    const expectedEducation = [
      { ...initialEducation[0], namaLembaga: 'Univ B' },
    ];

    expect(mockUpdateStep2).toHaveBeenCalledWith({ education: expectedEducation });
  });

  it('seharusnya menangani perubahan field umum', () => {
    const { result } = renderHook(() => useStep2Data());

    act(() => {
      result.current.handleChange('facebook', 'fb-user');
    });

    expect(mockUpdateStep2).toHaveBeenCalledWith({ facebook: 'fb-user' });
  });
});

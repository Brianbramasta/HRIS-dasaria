import { renderHook, act } from '@testing-library/react';
import { useCreateEmployee } from './useCreateEmployee';
import { useFormulirKaryawanStore } from '../../../stores/useFormulirKaryawanStore';
import { employeeMasterDataService } from '../../../services/EmployeeMasterData.service';
import { useAuthStore } from '../../../../auth/stores/AuthStore';

// Mock dependencies
jest.mock('../../../stores/useFormulirKaryawanStore');
jest.mock('../../../services/EmployeeMasterData.service', () => {
  const mockService = {
    createEmployee: jest.fn(),
    createEmployeeWithoutLogin: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockService,
    employeeMasterDataService: mockService,
  };
});
jest.mock('../../../../auth/stores/AuthStore');

describe('useCreateEmployee', () => {
  const mockSetLoading = jest.fn();
  const mockSetError = jest.fn();
  
  const mockFormData = {
    step1: {
      namaLengkap: 'John Doe',
      nik: '1234567890',
      email: 'john@example.com',
      // ... other fields
    },
    step2: {
      education: [
        { jenisPendidikan: 'formal', jenjang: 'S1', namaLembaga: 'Univ A' },
        { jenisPendidikan: 'non-formal', namaSertifikat: 'Cert A' },
      ],
      // ...
    },
    step3: {
      bank: 'Bank A',
      // ...
    },
    step3Employee: {
      company: 'Comp A',
      // ...
    },
    step4: {
      documents: [
        { tipeFile: '5', file: new File([''], 'doc.pdf') },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
      formData: mockFormData,
      setLoading: mockSetLoading,
      setError: mockSetError,
    });
  });

  it('seharusnya mengirim data menggunakan createEmployee jika terautentikasi', async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => selector({ isAuthenticated: true }));
    (employeeMasterDataService.createEmployee as jest.Mock).mockResolvedValue({ data: 'success' });

    const { result } = renderHook(() => useCreateEmployee());

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(employeeMasterDataService.createEmployee).toHaveBeenCalled();
    
    // Verify FormData content
    const fd = (employeeMasterDataService.createEmployee as jest.Mock).mock.calls[0][0] as FormData;
    expect(fd.get('full_name')).toBe('John Doe');
    expect(fd.get('national_id')).toBe('1234567890');
    expect(fd.get('education_formal_detail[0][institution_name]')).toBe('Univ A');
    
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('seharusnya mengirim data menggunakan createEmployeeWithoutLogin jika tidak terautentikasi', async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => selector({ isAuthenticated: false }));
    (employeeMasterDataService.createEmployeeWithoutLogin as jest.Mock).mockResolvedValue({ data: 'success' });

    const { result } = renderHook(() => useCreateEmployee());

    await act(async () => {
      await result.current.submit();
    });

    expect(employeeMasterDataService.createEmployeeWithoutLogin).toHaveBeenCalled();
  });

  it('seharusnya menangani error saat submit gagal', async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => selector({ isAuthenticated: true }));
    const error = new Error('Failed');
    (employeeMasterDataService.createEmployee as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useCreateEmployee());

    await expect(result.current.submit()).rejects.toThrow('Failed');

    expect(mockSetError).toHaveBeenCalledWith('Failed');
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });
});

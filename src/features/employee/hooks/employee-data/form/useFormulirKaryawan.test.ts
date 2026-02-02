import { renderHook, act } from '@testing-library/react';
import useFormulirKaryawan, {
  getReligionDropdownOptions,
  getEducationDropdownOptions,
  // ... import other helpers if needed
} from './useFormulirKaryawan';
import { useFormulirKaryawanStore } from '../../../stores/useFormulirKaryawanStore';
import { useAuthStore } from '../../../../auth/stores/AuthStore';
import { employeeMasterDataService } from '../../../services/EmployeeMasterData.service';
import useCreateEmployee from './useCreateEmployee';
import { addNotification } from '@/stores/notificationStore';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('../../../stores/useFormulirKaryawanStore');
jest.mock('../../../../auth/stores/AuthStore');
jest.mock('../../../services/EmployeeMasterData.service', () => ({
  employeeMasterDataService: {
    getReligionDropdown: jest.fn(),
    getEducationDropdown: jest.fn(),
  },
}));
jest.mock('./useCreateEmployee');
jest.mock('@/stores/notificationStore', () => ({
  addNotification: jest.fn(),
}));

describe('useFormulirKaryawan Helper Functions', () => {
  it('getReligionDropdownOptions memanggil service dengan benar', async () => {
    const mockData = [{ id: '1', name: 'Islam' }];
    (employeeMasterDataService.getReligionDropdown as jest.Mock).mockResolvedValue(mockData);
    
    const result = await getReligionDropdownOptions('query');
    expect(employeeMasterDataService.getReligionDropdown).toHaveBeenCalledWith('query');
    expect(result).toEqual([{ label: 'Islam', value: '1' }]);
  });

  it('getEducationDropdownOptions memanggil service dengan benar', async () => {
    const mockData = [{ id: '1', name: 'S1' }];
    (employeeMasterDataService.getEducationDropdown as jest.Mock).mockResolvedValue(mockData);

    const result = await getEducationDropdownOptions();
    expect(employeeMasterDataService.getEducationDropdown).toHaveBeenCalled();
    expect(result).toEqual([{ label: 'S1', value: '1' }]);
  });
});

describe('useFormulirKaryawan Hook', () => {
  const mockGoToNextStep = jest.fn();
  const mockGoToPreviousStep = jest.fn();
  const mockSubmit = jest.fn();
  const mockResetForm = jest.fn();
  const mockClearLocalStorage = jest.fn();
  const mockSetLoading = jest.fn();
  const mockSetError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
      currentStep: 0,
      formData: {},
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
      resetForm: mockResetForm,
      clearLocalStorage: mockClearLocalStorage,
      setLoading: mockSetLoading,
      setError: mockSetError,
      setTotalSteps: jest.fn(),
      totalSteps: 5,
    });
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ isAuthenticated: true });
    (useCreateEmployee as jest.Mock).mockReturnValue({ submit: mockSubmit });
    
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  it('handleNextStep memvalidasi form dan pindah ke step berikutnya', () => {
    const { result } = renderHook(() => useFormulirKaryawan());
    
    // Mock form validation
    const mockCheckValidity = jest.fn().mockReturnValue(true);
    const mockReportValidity = jest.fn().mockReturnValue(true);
    
    // Assign mock form ref
    Object.defineProperty(result.current.formRef, 'current', {
      value: {
        checkValidity: mockCheckValidity,
        reportValidity: mockReportValidity,
      },
      writable: true
    });

    mockGoToNextStep.mockReturnValue(true);

    act(() => {
      result.current.handleNextStep();
    });

    expect(mockReportValidity).toHaveBeenCalled();
    expect(mockGoToNextStep).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('handlePreviousStep pindah ke step sebelumnya', () => {
    const { result } = renderHook(() => useFormulirKaryawan());

    act(() => {
      result.current.handlePreviousStep();
    });

    expect(mockGoToPreviousStep).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('handleSubmit memanggil submit dan menangani kesuksesan (login)', async () => {
    const { result } = renderHook(() => useFormulirKaryawan());
    
    // Mock validation
    Object.defineProperty(result.current.formRef, 'current', {
      value: { reportValidity: () => true },
      writable: true
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSubmit).toHaveBeenCalled();
    expect(mockClearLocalStorage).toHaveBeenCalled();
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('handleSubmit menangani error', async () => {
    const { result } = renderHook(() => useFormulirKaryawan());
    
    // Mock validation
    Object.defineProperty(result.current.formRef, 'current', {
      value: { reportValidity: () => true },
      writable: true
    });

    mockSubmit.mockRejectedValue(new Error('Submit failed'));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockSetError).toHaveBeenCalledWith('Submit failed');
    expect(addNotification).toHaveBeenCalledWith(expect.objectContaining({ variant: 'error' }));
  });
});

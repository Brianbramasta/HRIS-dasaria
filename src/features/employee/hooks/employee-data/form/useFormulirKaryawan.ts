import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormulirKaryawanStore } from '../../../stores/useFormulirKaryawanStore';
import useCreateEmployee from './useCreateEmployee';
import { useAuthStore } from '../../../../auth/stores/AuthStore';
import { addNotification } from '@/stores/notificationStore';
import { employeeMasterDataService } from '../../../services/EmployeeMasterData.service';

export interface DropdownOption {
  label: string;
  value: string;
}


export const getReligionDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getReligionDropdown(search);
  console.log('Religion dropdown data:', data);
  return (data || []).map((r: any) => ({ label: r.name, value: r.id }));
};

export const getEducationDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getEducationDropdown(search);
  console.log('Education dropdown data:', data);
  return (data || []).map((e: any) => ({ label: e.name, value: e.id }));
}

export const getEmployeeCategoryDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getEmployeeCategoryDropdown(search);
  console.log('Employee Category dropdown data:', data);
  return (data || []).map((c: any) => ({ label: c.name, value: c.id }));
}

export const getBankDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getBankDropdown(search);
  console.log('Bank dropdown data:', data);
  return (data || []).map((b: any) => ({ label: b.name, value: b.id }));
}

export const getDocumentTypeDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getDocumentTypeDropdown(search);
  console.log('Document Type dropdown data:', data);
  return (data || []).map((d: any) => ({ label: d.name, value: d.id }));
}

export const getPositionLevelDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getPositionLevelDropdown(search);
  console.log('Position Level dropdown data:', data);
  return (data || []).map((p: any) => ({ label: p.name, value: p.id }));
}

export const getEmployeeStatusDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getEmployeeStatusDropdown(search);
  console.log('Employee Status dropdown data:', data);
  return (data || []).map((s: any) => ({ label: s.name, value: s.id }));
}

export interface UseFormulirKaryawanReturn {
  // Store states
  currentStep: number;
  formData: any;
  isLoading: boolean;
  error: string | null;
  totalSteps: number;
  isAuthenticated: boolean;
  
  // Modal states
  showSuccessModal: boolean;
  setShowSuccessModal: (show: boolean) => void;
  
  // Navigation handlers
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleSubmit: () => Promise<void>;
  handleBackToHome: () => void;
  handleBackToDataPage: () => void;
  
  // Render helper
  renderStep: () => React.ReactNode;
}

export const useFormulirKaryawan = (): UseFormulirKaryawanReturn => {
  const navigate = useNavigate();
  const {
    currentStep,
    formData,
    isLoading,
    error,
    goToNextStep,
    goToPreviousStep,
    resetForm,
    setLoading,
    setError,
    setTotalSteps,
    totalSteps,
    clearLocalStorage,
  } = useFormulirKaryawanStore();
  const { isAuthenticated } = useAuthStore((s) => ({ isAuthenticated: s.isAuthenticated }));

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { submit } = useCreateEmployee();

  const handleNextStep = useCallback(() => {
    if (goToNextStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [goToNextStep]);

  const handlePreviousStep = useCallback(() => {
    goToPreviousStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [goToPreviousStep]);

  // handleSubmit: bangun FormData via hook dan submit ke API employees
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await submit();

      // Hapus data dari localStorage setelah berhasil submit
      clearLocalStorage();

      if (isAuthenticated) {
        // Jika user login, redirect ke /data-karyawan dan tampilkan notification
        addNotification({
          variant: 'success',
          title: 'Data Karyawan ditambahkan !',
          description: 'Penambahan Data Karyawan Berhasil Dikonfirmasi',
          hideDuration: 5000,
        });
        navigate('/employee-data');
      } else {
        // Jika user tidak login, tampilkan success modal
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      
      // Handle validation errors (422 status)
      if (err?.errors && typeof err.errors === 'object') {
        // Format validation errors for display
        const errorMessages: string[] = [];
        Object.entries(err.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            console.log(`Field: ${field}, Messages: ${messages}`);
            messages.forEach((msg) => errorMessages.push(msg));
          }
        });
        
        const errorText = errorMessages.join(', ');
        setError(errorText);
        
        // Show notification for validation errors
        addNotification({
          variant: 'error',
          title: 'Validasi Gagal',
          description: errorText,
          hideDuration: 7000,
        });
      } else {
        // Handle general errors
        const errorMessage = err?.message || 'Gagal menyimpan data karyawan';
        setError(errorMessage);
        
        addNotification({
          variant: 'error',
          title: 'Gagal Menyimpan',
          description: errorMessage,
          hideDuration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [formData, setLoading, setError, submit, clearLocalStorage, isAuthenticated, navigate]);

  const handleBackToHome = useCallback(() => {
    resetForm();
    setShowSuccessModal(false);
    navigate('/data-karyawan');
  }, [resetForm, navigate]);

  const handleBackToDataPage = useCallback(() => {
    resetForm();
    navigate('/data-karyawan');
  }, [resetForm, navigate]);

  const renderStep = useCallback(() => {
    // Import step components dynamically to avoid circular dependencies
    // The actual JSX rendering will be done in the component
    // This function just returns the current step number and authentication status
    return null;
  }, [currentStep, isAuthenticated]);

  useEffect(() => {
    setTotalSteps(isAuthenticated ? 5 : 4);
  }, [isAuthenticated, setTotalSteps]);

  return {
    // Store states
    currentStep,
    formData,
    isLoading,
    error,
    totalSteps,
    isAuthenticated,
    
    // Modal states
    showSuccessModal,
    setShowSuccessModal,
    
    // Navigation handlers
    handleNextStep,
    handlePreviousStep,
    handleSubmit,
    handleBackToHome,
    handleBackToDataPage,
    
    // Render helper
    renderStep,
  };
};

export default useFormulirKaryawan;

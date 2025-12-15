import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import useCreateEmployee from './useCreateEmployee';
import { useAuthStore } from '../../../auth/stores/authStore';
import { addNotification } from '@/stores/notificationStore';

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
        navigate('/data-karyawan');
      } else {
        // Jika user tidak login, tampilkan success modal
        setShowSuccessModal(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menyimpan data karyawan';
      setError(errorMessage);
      console.error('Submit error:', err);
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

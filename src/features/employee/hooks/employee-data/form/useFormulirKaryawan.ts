import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormulirKaryawanStore } from '../../../stores/useFormulirKaryawanStore';
import useCreateEmployee from './useCreateEmployee';
import { useAuthStore } from '../../../../auth/stores/AuthStore';
import { addNotification } from '@/stores/notificationStore';
import { employeeMasterDataService } from '../../../services/EmployeeMasterData.service';
import { useApiEmployee } from '../../api/useApiEmployee';

export interface DropdownOption {
  label: string;
  value: string;
}


export const getReligionDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getReligionDropdown(search);
  //console.log('Religion dropdown data:', data);
  return (data || []).map((r: any) => ({ label: r.name, value: r.id }));
};

export const getEducationDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getEducationDropdown(search);
  //console.log('Education dropdown data:', data);
  return (data || []).map((e: any) => ({ label: e.name, value: e.id }));
}

export const getEmployeeCategoryDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getEmployeeCategoryDropdown(search);
  //console.log('Employee Category dropdown data:', data);
  return (data || []).map((c: any) => ({ label: c.name, value: c.id }));
}

export const getBankDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getBankDropdown(search);
  //console.log('Bank dropdown data:', data);
  return (data || []).map((b: any) => ({ label: b.name, value: b.id }));
}

export const getBpjsHealthTypeDropdownOptions = async (): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getBpjsHealthTypeDropdown();
  //console.log('BPJS Health Type dropdown data:', data);
  return (data || []).map((bpjs: any) => ({ label: bpjs.name, value: bpjs.id }));
}

export const getDocumentTypeDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getDocumentTypeDropdown(search);
  //console.log('Document Type dropdown data:', data);
  return (data || []).map((d: any) => ({ label: d.name, value: d.id }));
}

export const getPositionLevelDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getPositionLevelDropdown(search);
  //console.log('Position Level dropdown data:', data);
  return (data || []).map((p: any) => ({ label: p.name, value: p.id }));
}

export const getEmployeeStatusDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getEmployeeStatusDropdown(search);
  //console.log('Employee Status dropdown data:', data);
  return (data || []).map((s: any) => ({ label: s.name, value: s.id }));
}

export const getStructuralJobDropdownOptions = async (IdJabatanKepangkatan?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getStructuralJobDropdown(IdJabatanKepangkatan);
  //console.log('Structural Job dropdown data:', data);
  return (data || []).map((j: any) => ({ label: j.name, value: j.id }));
}

export const getUnitDropdownByDepartmentIdOptions = async (departmentId?: string, search?: string): Promise<DropdownOption[]> => {
  const data = await employeeMasterDataService.getUnitDropdownByDepartmentId(departmentId, search);
  //console.log('Unit dropdown data:', data);
  return (data || []).map((u: any) => ({ label: u.name ?? u.name, value: u.id }));
}



export const getFieldDocument = async (id?: string): Promise<any[]> => {
  const data = await employeeMasterDataService.getFieldDocument(id);
  return data;
}


export interface UseFormulirKaryawanReturn {
  // Store states
  currentStep: number;
  formData: any;
  isLoading: boolean;
  error: string | null;
  totalSteps: number;
  isAuthenticated: boolean;
  formRef: React.RefObject<HTMLFormElement | null>;
  
  // Modal states
  showSuccessModal: boolean;
  setShowSuccessModal: (show: boolean) => void;
  
  // Field validation states
  fieldErrors: { [key: string]: string };
  checkActiveLoading: boolean;
  
  // Navigation handlers
  handleNextStep: () => void;
  handleNextWithFileCheck: () => void;
  handleNextWithActiveCheck: () => Promise<void>;
  handlePreviousStep: () => void;
  handleSubmit: () => Promise<void>;
  handleBackToHome: () => void;
  handleBackToDataPage: () => void;
  handleBackWithConfirmation: () => void;
  resetForm: () => void;
  handleClearFieldError: (fieldName: string) => void;
  
  // Render helper
  renderStep: () => React.ReactNode;
}

export const useFormulirKaryawan = (): UseFormulirKaryawanReturn => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
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
  const { checkActiveEmployee, checkActiveLoading } = useApiEmployee();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const { submit } = useCreateEmployee();

  const validateRequiredFields = useCallback(() => {
    const form = formRef.current;
    if (!form) return true;
    return form.reportValidity();
  }, []);

  const handleNextStep = useCallback(() => {
    if (!validateRequiredFields()) return;
    if (goToNextStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [goToNextStep, validateRequiredFields]);

  const handlePreviousStep = useCallback(() => {
    goToPreviousStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [goToPreviousStep]);

  // Handle next step with file check
  const handleNextWithFileCheck = useCallback(() => {
    if (!validateRequiredFields()) return;
    
    // If no missing files, proceed with normal next step
    if (goToNextStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [validateRequiredFields, goToNextStep]);

  const handleBackToDataPage = useCallback(() => {
    resetForm();
    navigate('/employee-data');
  }, [resetForm, navigate]);

  // Custom handleNext function with active employee check for step 1
  const handleNextWithActiveCheck = useCallback(async () => {
    // Clear previous field errors
    setFieldErrors({});
    
    // If we're on step 1, check active employee first
    if (currentStep === 1) {
      const { email, nik } = formData.step1;
      
      // Validate required fields for API call
      if (!email || !nik) {
        // alert('Email dan NIK harus diisi sebelum melanjutkan');
        return;
      }

      try {
        await checkActiveEmployee({ email, national_id: nik });
        // If successful, proceed with normal next step
        handleNextWithFileCheck();
      } catch (error: any) {
        console.error('Error checking active employee:', error);
        
        // Handle 422 validation errors
        if (error?.errors && typeof error.errors === 'object') {
          const errors: { [key: string]: string } = {};
          
          Object.entries(error.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              // Map API field names to form field names
              let formFieldName = field;
              if (field === 'national_id') {
                formFieldName = 'nik';
              }
              
              // Take the first error message for each field
              errors[formFieldName] = messages[0];
            }
          });
          
          setFieldErrors(errors);
          
          // Show general message if there are errors
          if (error?.meta?.message) {
            // alert(error.meta.message);
          }
        } else {
          // Show generic error message for other types of errors
          alert('Terjadi kesalahan saat memvalidasi data karyawan. Silakan coba lagi.');
        }
      }
    } else {
      // For other steps, use normal next function
      handleNextWithFileCheck();
    }
  }, [currentStep, formData.step1, checkActiveEmployee, handleNextWithFileCheck]);

  // Clear field error function
  const handleClearFieldError = useCallback((fieldName: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Check for uploaded files
  const checkForUploadedFiles = useCallback(() => {
    // Check if foto profil is uploaded
    if (formData.step1.fotoProfil && formData.step1.fotoProfil instanceof File) {
      return true;
    }
    
    // Check if any documents are uploaded
    if (formData.step4.documents && Array.isArray(formData.step4.documents)) {
      return formData.step4.documents.some((doc: any) => doc.file && doc.file instanceof File);
    }
    
    return false;
  }, [formData]);

  // Handle back with confirmation
  const handleBackWithConfirmation = useCallback(() => {
    // Check if there are any files uploaded
    const hasFiles = checkForUploadedFiles();
    
    if (hasFiles) {
      const message = 'Apakah Anda yakin ingin pindah halaman? Progress file tidak akan tersimpan.';
      if (window.confirm(message)) {
        handleBackToDataPage();
      }
    } else {
      handleBackToDataPage();
    }
  }, [checkForUploadedFiles, handleBackToDataPage]);

  // Check for missing files (only Step 1 - foto profil)
  // const checkForMissingFiles = useCallback(() => {
  //   // Only check Step 1 (Personal Data) - foto profil
  //   if (!formData.step1.fotoProfil || formData.step1.fotoProfil === '') {
  //     return 1;
  //   }
    
  //   return 0; // No missing files
  // }, [formData]);

  // handleSubmit: bangun FormData via hook dan submit ke API employees
  const handleSubmit = useCallback(async () => {
    if (!validateRequiredFields()) return;
    
    // Check for missing files before submit (only Step 1)
    // const missingFileStep = checkForMissingFiles();
    // if (missingFileStep > 0) {
    //   const message = `File di Step ${missingFileStep} hilang. Silakan upload ulang file tersebut sebelum submit.`;
    //   if (window.confirm(message)) {
    //     // Redirect to the step with missing file
    //     const { setCurrentStep } = useFormulirKaryawanStore.getState();
    //     setCurrentStep(missingFileStep);
    //   }
    //   return;
    // }
    
    try {
      setLoading(true);
      setError(null);
      await submit();

      // Hapus data dari localStorage setelah berhasil submit
      clearLocalStorage();

      if (isAuthenticated) {
        // Jika user login, redirect ke /data-karyawan dan tampilkan notification
        // addNotification({
        //   variant: 'success',
        //   title: 'Data Karyawan ditambahkan !',
        //   description: 'Penambahan Data Karyawan Berhasil Dikonfirmasi',
        //   hideDuration: 5000,
        // });
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
        Object.entries(err.errors).forEach(([_field, messages]) => {
          if (Array.isArray(messages)) {
            //console.log(`Field: ${_field}, Messages: ${messages}`);
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
  }, [setLoading, setError, submit, clearLocalStorage, isAuthenticated, navigate, validateRequiredFields]);

  const handleBackToHome = useCallback(() => {
    resetForm();
    setShowSuccessModal(false);
    navigate('/employee-data');
  }, [resetForm, navigate]);

  const renderStep = useCallback(() => {
    // Import step components dynamically to avoid circular dependencies
    // The actual JSX rendering will be done in the component
    // This function just returns the current step number and authentication status
    return null;
  }, []);

  useEffect(() => {
    setTotalSteps(isAuthenticated ? 5 : 4);
  }, [isAuthenticated, setTotalSteps]);

  // Check localStorage and reset if no draft data exists
  useEffect(() => {
    const hasDraftData = localStorage.getItem('formulir_karyawan_draft');
    if (!hasDraftData) {
      resetForm();
    }
  }, [resetForm]);

  // Handle page navigation/refresh confirmation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent): string | void => {
      // Check if there are any files uploaded
      const hasFiles = checkForUploadedFiles();
      
      if (hasFiles) {
        const message = 'Apakah Anda yakin ingin pindah halaman? Progress file tidak akan tersimpan.';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData, checkForUploadedFiles]);

  return {
    // Store states
    currentStep,
    formData,
    isLoading,
    error,
    totalSteps,
    isAuthenticated,
    formRef,
    
    // Modal states
    showSuccessModal,
    setShowSuccessModal,
    
    // Field validation states
    fieldErrors,
    checkActiveLoading,
    
    // Navigation handlers
    handleNextStep,
    handleNextWithFileCheck,
    handleNextWithActiveCheck,
    handlePreviousStep,
    handleSubmit,
    handleBackToHome,
    handleBackToDataPage,
    handleBackWithConfirmation,
    resetForm,
    handleClearFieldError,
    
    // Render helper
    renderStep,
  };
};

export default useFormulirKaryawan;

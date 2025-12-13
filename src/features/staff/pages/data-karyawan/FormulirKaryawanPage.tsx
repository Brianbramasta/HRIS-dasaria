// Integrasi submit: gunakan hook useCreateEmployee untuk kirim FormData ke API employees
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import ProgressBarWithOutsideLabel from '../../../../components/ui/progressbar/ProgressBarWithOutsideLabel';
import Step01PersonalData from '../../components/FormSteps/Step01PersonalData';
import Step02EducationalBackground from '../../components/FormSteps/Step02EducationalBackground';
import Step03EmployeeData from '../../components/FormSteps/Step03EmployeeData';
import Step04SalaryBpjs from '../../components/FormSteps/Step04SalaryBpjs';
import Step05UploadDocument from '../../components/FormSteps/Step05UploadDocument';
import SuccessModal from '../../components/SuccessModal';
import Button from '../../../../components/ui/button/Button';
import useCreateEmployee from '../../hooks/useCreateEmployee';
import { ChevronLeft } from 'react-feather';
import { useAuthStore } from '../../../auth/stores/authStore';

const TITLES_WITH_LOGIN = [
  'Data Pribadi',
  'Riwayat Pendidikan & Media Sosial ',
  'Data Karyawan',
  'Gaji & BPJS',
  'Unggah Dokumen',
];
const TITLES_PUBLIC = [
  'Data Pribadi',
  'Riwayat Pendidikan & Media Sosial ',
  'Gaji & BPJS',
  'Unggah Dokumen',
];

export default function FormulirKaryawanPage() {
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

      // Show success modal
      setShowSuccessModal(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menyimpan data karyawan';
      setError(errorMessage);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  }, [formData, setLoading, setError, submit, clearLocalStorage]);

  const handleBackToHome = () => {
    resetForm();
    setShowSuccessModal(false);
    navigate('/staff/data-karyawan');
  };

  const handleBackToDataPage = () => {
    resetForm();
    navigate('/staff/data-karyawan');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step01PersonalData />;
      case 2:
        return <Step02EducationalBackground />;
      case 3:
        return isAuthenticated ? <Step03EmployeeData /> : <Step04SalaryBpjs />;
      case 4:
        return isAuthenticated ? <Step04SalaryBpjs /> : <Step05UploadDocument />;
      case 5:
        return <Step05UploadDocument />;
      default:
        return null;
    }
  };

  useEffect(() => {
    setTotalSteps(isAuthenticated ? 5 : 4);
  }, [isAuthenticated, setTotalSteps]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        {/* Page Title */}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
          {isAuthenticated ? 'Tambah Data Karyawan' : 'Form Pendaftaran Karyawan (Public)'}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-4">
            {/* Progress Bar */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Langkah {currentStep} dari {totalSteps}</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{(isAuthenticated ? TITLES_WITH_LOGIN : TITLES_PUBLIC)[currentStep - 1]}</h3>
            </div>
            <div className="w-1/2">
              <ProgressBarWithOutsideLabel percent={Math.round((currentStep / totalSteps) * 100)} />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Form Content */}
          <div className="mt-8">{renderStep()}</div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-end gap-4">
            {currentStep === 1 ? (
              <Button
                onClick={handleBackToDataPage}
                variant="custom"
                className="flex items-center gap-2 border border-[#007BFF] text-[#007BFF]"
              >
                Back to Home Page
              </Button>
            ) : (
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Sebelumnya
              </Button>
            )}

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                variant="primary"
              >
                {isLoading ? 'Menyimpan...' : 'Submit'}
              </Button>
            ) : (
              <Button
                onClick={handleNextStep}
                disabled={isLoading}
                variant="primary"
                className="flex items-center gap-2"
              >
                Next <span>→</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onBackToHome={handleBackToHome}
      />
    </div>
  );
}
  

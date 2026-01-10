import ProgressBarWithOutsideLabel from '../../../../components/ui/progressbar/ProgressBarWithOutsideLabel';
import Step01PersonalData from '../../components/form-steps/Step01PersonalData';
import Step02EducationalBackground from '../../components/form-steps/Step02EducationalBackground';
import Step03EmployeeData from '../../components/form-steps/Step03EmployeeData';
import Step04SalaryBpjs from '../../components/form-steps/Step04SalaryBpjs';
import Step05UploadDocument from '../../components/form-steps/Step05UploadDocument';
import SuccessModal from '../../components/SuccessModal';
import Button from '../../../../components/ui/button/Button';
// import { ChevronLeft } from 'react-feather';
import useFormulirKaryawan from '../../hooks/employee-data/form/useFormulirKaryawan';

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
  const {
    currentStep,
    isLoading,
    error,
    totalSteps,
    isAuthenticated,
    showSuccessModal,
    setShowSuccessModal,
    formRef,
    handleNextStep,
    handlePreviousStep,
    handleSubmit,
    handleBackToHome,
    handleBackToDataPage,
  } = useFormulirKaryawan();

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        {/* Page Title */}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
          {isAuthenticated ? 'Tambah Data Karyawan' : 'Form Pendaftaran Karyawan'}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-4">
            {/* Progress Bar */}
          <div className="flex flex-col items-start gap-4 md:gap-0 md:items-center md:justify-between md:flex-row">
            <div>
              <h5 className="text-sm text-gray-500 dark:text-gray-400">Langkah {currentStep} dari {totalSteps}</h5>
              <h3 className=" text-gray-900 dark:text-white">{(isAuthenticated ? TITLES_WITH_LOGIN : TITLES_PUBLIC)[currentStep - 1]}</h3>
            </div>
            <div className="w-full md:w-1/2">
              <ProgressBarWithOutsideLabel percent={Math.round((currentStep / totalSteps) * 100)} parentClass={'justify-end'} />
            </div>
          </div>
            <div  className="mt-4  text-gray-700 dark:text-gray-300 text-justify">Selamat datang! Silakan lengkapi data pribadi Anda untuk mempercepat proses pendaftaran. Kami menjamin kerahasiaan informasi Anda hanya akan digunakan untuk keperluan administrasi internal perusahaan.</div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
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
                  variant="custom"
                  className="flex items-center gap-2 text-[#007BFF]  border border-[#007BFF] font-medium "
                >
                  <span><svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.292786 7.37629C0.105315 7.18876 0 6.93445 0 6.66929C0 6.40412 0.105315 6.14982 0.292786 5.96229L5.94979 0.305288C6.04203 0.209778 6.15238 0.133596 6.27438 0.0811869C6.39639 0.0287779 6.52761 0.00119157 6.66039 3.77564e-05C6.79316 -0.00111606 6.92484 0.0241859 7.04774 0.0744668C7.17064 0.124748 7.28229 0.199001 7.37618 0.292893C7.47007 0.386786 7.54433 0.498438 7.59461 0.621334C7.64489 0.744231 7.67019 0.87591 7.66904 1.00869C7.66788 1.14147 7.6403 1.27269 7.58789 1.39469C7.53548 1.5167 7.4593 1.62704 7.36379 1.71929L3.41379 5.66929L16.6568 5.66929C16.922 5.66929 17.1764 5.77465 17.3639 5.96218C17.5514 6.14972 17.6568 6.40407 17.6568 6.66929C17.6568 6.9345 17.5514 7.18886 17.3639 7.37639C17.1764 7.56393 16.922 7.66929 16.6568 7.66929L3.41379 7.66929L7.36379 11.6193C7.54594 11.8079 7.64674 12.0605 7.64446 12.3227C7.64218 12.5849 7.53701 12.8357 7.3516 13.0211C7.1662 13.2065 6.91538 13.3117 6.65319 13.314C6.39099 13.3162 6.13839 13.2154 5.94979 13.0333L0.292786 7.37629Z" fill="#007BFF"/>
                  </svg>
                  </span>
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
                  Next <span><svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.3635 7.37629C17.5509 7.18876 17.6562 6.93445 17.6562 6.66929C17.6562 6.40412 17.5509 6.14982 17.3635 5.96229L11.7065 0.305288C11.6142 0.209778 11.5039 0.133596 11.3819 0.0811869C11.2599 0.0287779 11.1286 0.00119157 10.9959 3.77564e-05C10.8631 -0.00111606 10.7314 0.0241859 10.6085 0.0744668C10.4856 0.124748 10.374 0.199001 10.2801 0.292893C10.1862 0.386786 10.1119 0.498438 10.0616 0.621334C10.0114 0.744231 9.98606 0.87591 9.98721 1.00869C9.98837 1.14147 10.016 1.27269 10.0684 1.39469C10.1208 1.5167 10.197 1.62704 10.2925 1.71929L14.2425 5.66929L0.999464 5.66929C0.734247 5.66929 0.479893 5.77465 0.292356 5.96218C0.10482 6.14972 -0.000535965 6.40407 -0.000535965 6.66929C-0.000535965 6.9345 0.10482 7.18886 0.292356 7.37639C0.479893 7.56393 0.734247 7.66929 0.999464 7.66929L14.2425 7.66929L10.2925 11.6193C10.1103 11.8079 10.0095 12.0605 10.0118 12.3227C10.0141 12.5849 10.1192 12.8357 10.3046 13.0211C10.4901 13.2065 10.7409 13.3117 11.0031 13.314C11.2653 13.3162 11.5179 13.2154 11.7065 13.0333L17.3635 7.37629Z" fill="white"/>
</svg>
</span>
                </Button>
              )}
            </div>
          </form>
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
  

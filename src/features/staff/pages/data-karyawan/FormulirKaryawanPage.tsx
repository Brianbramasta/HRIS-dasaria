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
import { karyawanService } from '../../services/karyawanService';
import { ChevronLeft } from 'react-feather';
import { useAuthStore } from '../../../auth/stores/authStore';

const TITLES_WITH_LOGIN = [
  'Personal Data',
  'Educational Background & Media Sosial',
  'Data Karyawan',
  'Salary & BPJS',
  'Upload Dokumen',
];
const TITLES_PUBLIC = [
  'Personal Data',
  'Educational Background & Media Sosial',
  'Salary & BPJS',
  'Upload Dokumen',
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
  } = useFormulirKaryawanStore();
  const { isAuthenticated } = useAuthStore((s) => ({ isAuthenticated: s.isAuthenticated }));

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleNextStep = useCallback(() => {
    if (goToNextStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [goToNextStep]);

  const handlePreviousStep = useCallback(() => {
    goToPreviousStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [goToPreviousStep]);

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Transform form data ke format yang sesuai dengan CreateKaryawanDto
      const submitData = {
        // Personal Data
        name: formData.step1.namaLengkap,
        email: formData.step1.email,
        nik: formData.step1.nik,
        agama: formData.step1.agama,
        tempatLahir: formData.step1.tempatLahir,
        golDarah: formData.step1.golDarah,
        statusMenikah: formData.step1.statusMenikah,
        nomorTelepon: formData.step1.nomorTelepon,
        jumlahTanggungan: formData.step1.jumlahTanggungan,
        alamatDomisili: formData.step1.alamatDomisili,
        alamatKtp: formData.step1.alamatKtp,

        // Generate ID Karyawan (format: KRY-YYYYMMDD-XXXX)
        idKaryawan: `KRY-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        posisi: formData.step3Employee?.position || 'Staff',
        jabatan: formData.step3Employee?.jabatan || 'Karyawan',
        tanggalJoin: formData.step3Employee?.tanggalMasuk || new Date().toISOString().split('T')[0],
        tanggalBerakhir: formData.step3Employee?.tanggalAkhir || undefined,
        company: formData.step3Employee?.company || 'PT. Default',
        office: formData.step3Employee?.kantor || undefined,
        department: formData.step3Employee?.departemen || undefined,

        // Educational Background
        education: formData.step2.education,

        // Media Sosial
        facebook: formData.step2.facebook,
        xCom: formData.step2.xCom,
        linkedin: formData.step2.linkedin,
        instagram: formData.step2.instagram,
        akunSosialMediaTerdekat: formData.step2.akunSosialMediaTerdekat,
        noKontakDarurat: formData.step2.noKontakDarurat,
        namaNoKontakDarurat: formData.step2.namaNoKontakDarurat,
        hubunganKontakDarurat: formData.step2.hubunganKontakDarurat,

        // Salary
        bank: formData.step3.bank,
        namaAkunBank: formData.step3.namaAkunBank,
        noRekening: formData.step3.noRekening,
        npwp: formData.step3.npwp,

        // BPJS
        noBpjsKesehatan: formData.step3.noBpjsKesehatan,
        statusBpjsKesehatan: formData.step3.statusBpjsKesehatan,
        noBpjsKetenagakerjaan: formData.step3.noBpjsKetenagakerjaan,
        statusBpjsKetenagakerjaan: formData.step3.statusBpjsKetenagakerjaan,
        nominalBpjsTk: formData.step3.nominalBpjsTk,

        // Documents
        documents: formData.step4.documents?.map((doc) => ({
          tipeFile: doc.tipeFile,
          namaFile: doc.namaFile,
        })),
      };

      // Save to database
      await karyawanService.createKaryawan(submitData);

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
  }, [formData, setLoading, setError]);

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
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Form Pendaftaran Karyawan
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-4">
            {/* Progress Bar */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Step {currentStep} of {totalSteps}</p>
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
          <div className="mt-8 flex items-center justify-between gap-4">
            {currentStep === 1 ? (
              <Button
                onClick={handleBackToDataPage}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Back to Home Page
              </Button>
            ) : (
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Previous
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
  

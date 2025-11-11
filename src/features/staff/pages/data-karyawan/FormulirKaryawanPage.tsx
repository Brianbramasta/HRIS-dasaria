import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import ProgressBarWithOutsideLabel from '../../../../components/ui/progressbar/ProgressBarWithOutsideLabel';
import Step1PersonalData from '../../components/FormSteps/Step1PersonalData';
import Step2EducationalBackground from '../../components/FormSteps/Step2EducationalBackground';
import Step3SalaryBpjs from '../../components/FormSteps/Step3SalaryBpjs';
import Step4UploadDocument from '../../components/FormSteps/Step4UploadDocument';
import SuccessModal from '../../components/SuccessModal';
import Button from '../../../../components/ui/button/Button';
import { karyawanService } from '../../services/karyawanService';
import { ChevronLeft } from 'react-feather';

const STEP_TITLES = [
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
  } = useFormulirKaryawanStore();

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
        posisi: 'Staff', // Default value
        jabatan: 'Karyawan', // Default value
        tanggalJoin: new Date().toISOString().split('T')[0],
        company: 'PT. Default', // Default value

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
        return <Step1PersonalData />;
      case 2:
        return <Step2EducationalBackground />;
      case 3:
        return <Step3SalaryBpjs />;
      case 4:
        return <Step4UploadDocument />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Form Pendaftaran Karyawan
        </h1>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Progress Bar */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Step {currentStep} of 4</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{STEP_TITLES[currentStep - 1]}</h3>
            </div>
            <div className="w-1/2">
              <ProgressBarWithOutsideLabel percent={Math.round((currentStep / 4) * 100)} />
            </div>
          </div>

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

            {currentStep === 4 ? (
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

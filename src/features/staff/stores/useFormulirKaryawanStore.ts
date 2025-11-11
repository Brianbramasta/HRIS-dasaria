import { create } from 'zustand';
import {
  FormulirKaryawanData,
  PersonalDataFormData,
  Step2FormData,
  Step3FormData,
  Step4FormData,
  StepCompletionStatus,
} from '../types/FormulirKaryawan';

interface FormulirStore {
  // State
  currentStep: number;
  formData: FormulirKaryawanData;
  stepCompleted: StepCompletionStatus;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentStep: (step: number) => void;
  updateStep1: (data: Partial<PersonalDataFormData>) => void;
  updateStep2: (data: Partial<Step2FormData>) => void;
  updateStep3: (data: Partial<Step3FormData>) => void;
  updateStep4: (data: Partial<Step4FormData>) => void;
  markStepAsCompleted: (step: number) => void;
  goToNextStep: () => boolean;
  goToPreviousStep: () => void;
  resetForm: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isStepValid: (step: number) => boolean;
  getFormProgress: () => number;
}

const initialFormData: FormulirKaryawanData = {
  step1: {
    namaLengkap: '',
    email: '',
    nik: '',
    agama: '',
    tempatLahir: '',
    golDarah: '',
    tanggalLahir: '',
    pendidikanTerakhir: '',
    jenisKelamin: '',
    statusMenikah: '',
    nomorTelepon: '',
    jumlahTanggungan: '',
    alamatDomisili: '',
    alamatKtp: '',
  },
  step2: {
    education: [],
    facebook: '',
    xCom: '',
    linkedin: '',
    instagram: '',
    akunSosialMediaTerdekat: '',
    noKontakDarurat: '',
    namaNoKontakDarurat: '',
    hubunganKontakDarurat: '',
  },
  step3: {
    bank: '',
    namaAkunBank: '',
    noRekening: '',
    npwp: '',
    noBpjsKesehatan: '',
    statusBpjsKesehatan: '',
    noBpjsKetenagakerjaan: '',
    statusBpjsKetenagakerjaan: '',
    nominalBpjsTk: '',
  },
  step4: {
    documents: [],
  },
};

const initialStepCompleted: StepCompletionStatus = {
  step1: false,
  step2: false,
  step3: false,
  step4: false,
};

export const useFormulirKaryawanStore = create<FormulirStore>((set, get) => ({
  // Initial state
  currentStep: 1,
  formData: initialFormData,
  stepCompleted: initialStepCompleted,
  isLoading: false,
  error: null,

  // Actions
  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  updateStep1: (data) => {
    set((state) => ({
      formData: {
        ...state.formData,
        step1: {
          ...state.formData.step1,
          ...data,
        },
      },
    }));
  },

  updateStep2: (data) => {
    set((state) => ({
      formData: {
        ...state.formData,
        step2: {
          ...state.formData.step2,
          ...data,
        },
      },
    }));
  },

  updateStep3: (data) => {
    set((state) => ({
      formData: {
        ...state.formData,
        step3: {
          ...state.formData.step3,
          ...data,
        },
      },
    }));
  },

  updateStep4: (data) => {
    set((state) => ({
      formData: {
        ...state.formData,
        step4: {
          ...state.formData.step4,
          ...data,
        },
      },
    }));
  },

  markStepAsCompleted: (step) => {
    set((state) => {
      const stepKey = `step${step}` as keyof StepCompletionStatus;
      return {
        stepCompleted: {
          ...state.stepCompleted,
          [stepKey]: true,
        },
      };
    });
  },

  goToNextStep: () => {
    const { currentStep, isStepValid } = get();

    if (!isStepValid(currentStep)) {
      set({ error: `Harap lengkapi semua field di Step ${currentStep}` });
      return false;
    }

    if (currentStep < 4) {
      get().markStepAsCompleted(currentStep);
      set({ currentStep: currentStep + 1, error: null });
      return true;
    }

    return false;
  },

  goToPreviousStep: () => {
    const { currentStep } = get();

    if (currentStep > 1) {
      set({ currentStep: currentStep - 1, error: null });
    }
  },

  resetForm: () => {
    set({
      currentStep: 1,
      formData: initialFormData,
      stepCompleted: initialStepCompleted,
      isLoading: false,
      error: null,
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  isStepValid: (step) => {
    const { formData } = get();

    switch (step) {
      case 1:
        { const step1 = formData.step1;
        return !!(
          step1.namaLengkap &&
          step1.email &&
          step1.nik &&
          step1.agama &&
          step1.tempatLahir &&
          step1.golDarah &&
          step1.tanggalLahir &&
          step1.pendidikanTerakhir &&
          step1.jenisKelamin &&
          step1.statusMenikah &&
          step1.nomorTelepon &&
          step1.jumlahTanggungan &&
          step1.alamatDomisili &&
          step1.alamatKtp
        ); }

      case 2:
        { const step2 = formData.step2;
        return !!(
          step2.education &&
          step2.education.length > 0 &&
          step2.noKontakDarurat &&
          step2.namaNoKontakDarurat
        ); }

      case 3:
        { const step3 = formData.step3;
        return !!(
          step3.bank &&
          step3.namaAkunBank &&
          step3.noRekening &&
          step3.npwp &&
          step3.noBpjsKesehatan &&
          step3.statusBpjsKesehatan
        ); }

      case 4:
        { const step4 = formData.step4;
        return step4.documents && step4.documents.length > 0; }

      default:
        return false;
    }
  },

  getFormProgress: () => {
    const { stepCompleted } = get();
    const completedSteps = Object.values(stepCompleted).filter((v) => v).length;
    return Math.round((completedSteps / 4) * 100);
  },
}));

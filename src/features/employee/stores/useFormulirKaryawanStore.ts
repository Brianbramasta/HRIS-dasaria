import { create } from 'zustand';
import {
  FormulirKaryawanData,
  PersonalDataFormData,
  Step2FormData,
  Step3FormData,
  Step4FormData,
  StepCompletionStatus,
  EmployeeDataFormData,
} from '../types/FormEmployess';

// LocalStorage key untuk form data karyawan
const FORM_STORAGE_KEY = 'formulir_karyawan_draft';

interface FormulirStore {
  // State
  currentStep: number;
  totalSteps: number;
  formData: FormulirKaryawanData;
  stepCompleted: StepCompletionStatus;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentStep: (step: number) => void;
  setTotalSteps: (count: number) => void;
  updateStep1: (data: Partial<PersonalDataFormData>) => void;
  updateStep2: (data: Partial<Step2FormData>) => void;
  updateStep3: (data: Partial<Step3FormData>) => void;
  updateStep3Employee: (data: Partial<EmployeeDataFormData>) => void;
  updateStep4: (data: Partial<Step4FormData>) => void;
  markStepAsCompleted: (step: number) => void;
  goToNextStep: () => boolean;
  goToPreviousStep: () => void;
  resetForm: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isStepValid: (step: number) => boolean;
  getFormProgress: () => number;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  clearLocalStorage: () => void;
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
    fotoProfil: '',
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
  step3Employee: {
    // statusKaryawan: '',
    divisi: '',
    position: '',
    jabatan: '',
    jenjangJabatan: '',
    golongan: '',
    userAccess: '',
    grade: '',
    statusPayroll: '',
    kategoriKaryawan: '',
    tanggalMasuk: '',
    tanggalAkhir: '',
    company: '',
    kantor: '',
    direktorat: '',
    departemen: '',
    employmentStatus: '',
    // resignationStatus: '',
  },
  step3: {
    bank: '',
    namaAkunBank: '',
    noRekening: '',
    npwp: '',
    ptkpStatus: '',
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
  step5: false,
};

// Fungsi helper untuk menyimpan data ke localStorage
const saveToStorage = (data: any) => {
  try {
    // Convert File objects to serializable format
    const serializedData = JSON.stringify(data, (key, value) => {
      console.log('key, value', key, value);
      if (value instanceof File) {
        return {
          _isFile: true,
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: value.lastModified,
        };
      }
      return value;
    });
    localStorage.setItem(FORM_STORAGE_KEY, serializedData);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Fungsi helper untuk memuat data dari localStorage
const loadFromStorage = (): any | null => {
  try {
    const data = localStorage.getItem(FORM_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
};

// Fungsi helper untuk menghapus data dari localStorage
const clearStorage = () => {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const useFormulirKaryawanStore = create<FormulirStore>((set, get) => {
  // Load saved data from localStorage
  const savedData = loadFromStorage();
  
  return {
  // Initial state - gunakan data dari localStorage jika ada
  currentStep: savedData?.currentStep || 1,
  totalSteps: savedData?.totalSteps || 4,
  formData: savedData?.formData || initialFormData,
  stepCompleted: savedData?.stepCompleted || initialStepCompleted,
  isLoading: false,
  error: null,

  // Actions
  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  setTotalSteps: (count) => {
    set({ totalSteps: count });
  },

  updateStep1: (data) => {
    set((state) => {
      const newState = {
        formData: {
          ...state.formData,
          step1: {
            ...state.formData.step1,
            ...data,
          },
        },
      };
      // Simpan ke localStorage setiap update
      saveToStorage({ ...state, ...newState });
      return newState;
    });
  },

  updateStep2: (data) => {
    set((state) => {
      const newState = {
        formData: {
          ...state.formData,
          step2: {
            ...state.formData.step2,
            ...data,
          },
        },
      };
      // Simpan ke localStorage setiap update
      saveToStorage({ ...state, ...newState });
      return newState;
    });
  },

  updateStep3: (data) => {
    set((state) => {
      const newState = {
        formData: {
          ...state.formData,
          step3: {
            ...state.formData.step3,
            ...data,
          },
        },
      };
      // Simpan ke localStorage setiap update
      saveToStorage({ ...state, ...newState });
      return newState;
    });
  },

  updateStep3Employee: (data) => {
    console.log('updateStep3Employee', data);
    set((state) => {
      const newState = {
        formData: {
          ...state.formData,
          step3Employee: {
            ...state.formData.step3Employee,
            ...data,
          },
        },
      };
      // Simpan ke localStorage setiap update
      saveToStorage({ ...state, ...newState });
      return newState;
    });
  },

  updateStep4: (data) => {
    set((state) => {
      const newState = {
        formData: {
          ...state.formData,
          step4: {
            ...state.formData.step4,
            ...data,
          },
        },
      };
      // Simpan ke localStorage setiap update
      saveToStorage({ ...state, ...newState });
      return newState;
    });
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
    const { currentStep, isStepValid, totalSteps } = get();

    if (!isStepValid(currentStep)) {
      set({ error: `Harap lengkapi semua field di Step ${currentStep}` });
      return false;
    }

    if (currentStep < totalSteps) {
      get().markStepAsCompleted(currentStep);
      set((state) => {
        const newState = { currentStep: currentStep + 1, error: null };
        // Simpan ke localStorage setiap next step
        saveToStorage({ ...state, ...newState });
        return newState;
      });
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
    // Hapus data dari localStorage saat reset
    clearStorage();
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
    const { formData, totalSteps } = get();

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
          step1.alamatKtp &&
          step1.fotoProfil
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
        {
          if (totalSteps === 5) {
            const s = formData.step3Employee;
            console.log('step',s);
            return !!(
              
              s.position &&
              s.jabatan &&
              s.tanggalMasuk &&
              s.company
            );
          }
          const step3 = formData.step3;
          return !!(
            step3.bank &&
            step3.namaAkunBank &&
            step3.noRekening &&
            step3.npwp &&
            step3.noBpjsKesehatan &&
            step3.statusBpjsKesehatan
          );
        }

      case 4:
        {
          if (totalSteps === 5) {
            const step3 = formData.step3;
            return !!(
              step3.bank &&
              step3.namaAkunBank &&
              step3.noRekening &&
              step3.npwp &&
              step3.noBpjsKesehatan &&
              step3.statusBpjsKesehatan
            );
          }
          const step4 = formData.step4;
          return step4.documents && step4.documents.length > 0;
        }

      case 5:
        {
          const step4 = formData.step4;
          return step4.documents && step4.documents.length > 0;
        }

      default:
        return false;
    }
  },

  getFormProgress: () => {
    const { stepCompleted, totalSteps } = get();
    const completedSteps = Object.values(stepCompleted).slice(0, totalSteps).filter((v) => v).length;
    return Math.round((completedSteps / totalSteps) * 100);
  },

  // LocalStorage methods
  saveToLocalStorage: () => {
    const state = get();
    saveToStorage({
      currentStep: state.currentStep,
      totalSteps: state.totalSteps,
      formData: state.formData,
      stepCompleted: state.stepCompleted,
    });
  },

  loadFromLocalStorage: () => {
    const savedData = loadFromStorage();
    if (savedData) {
      set({
        currentStep: savedData.currentStep || 1,
        totalSteps: savedData.totalSteps || 4,
        formData: savedData.formData || initialFormData,
        stepCompleted: savedData.stepCompleted || initialStepCompleted,
      });
    }
  },

  clearLocalStorage: () => {
    clearStorage();
  },
};
});

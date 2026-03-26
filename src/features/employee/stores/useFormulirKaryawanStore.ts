import { create } from 'zustand';
import {
  FormulirKaryawanData,
  PersonalDataFormData,
  Step2FormData,
  Step3FormData,
  Step4FormData,
  StepCompletionStatus,
  EmployeeDataFormData,
} from '../types/FormEmployee';

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
    unit: '',
    employmentStatus: '',
    jabatanStruktural: '',
    // resignationStatus: '',
  },
  step3: {
    bank: '',
    namaAkunBank: '',
    noRekening: '',
    npwp: '',
    ptkpStatus: '',
    noBpjsKesehatan: '',
    tipeBpjsKesehatan: '',
    statusBpjsKesehatan: '',
    noBpjsKetenagakerjaan: '',
    statusBpjsKetenagakerjaan: '',
    nominalBpjsTk: '',
    nonFixAllowances: [{ id: '', amount: 0 }],
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

// Fungsi helper untuk menyimpan data ke localStorage (tanpa file)
const saveToStorage = (data: any) => {
  try {
    // Convert File objects to null (exclude from localStorage)
    const serializedData = JSON.stringify(data, (_key, value) => {
      // Exclude File objects from being saved to localStorage
      if (value instanceof File) {
        return null;
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
      const parsedData = JSON.parse(data);
      
      // Restore file fields to empty string since they're not saved in localStorage
      if (parsedData.formData) {
        if (parsedData.formData.step1) {
          parsedData.formData.step1.fotoProfil = '';
        }
        if (parsedData.formData.step4 && parsedData.formData.step4.documents) {
          // Reset document files but keep document structure
          parsedData.formData.step4.documents = parsedData.formData.step4.documents.map((doc: any) => ({
            ...doc,
            file: null
          }));
        }
      }
      
      return parsedData;
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
    //console.log('updateStep3Employee', data);
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

  isStepValid: (/*step*/) => {
    return true;
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

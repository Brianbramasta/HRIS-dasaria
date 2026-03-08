import { create } from 'zustand';
import { personalInformationService } from '@/features/employee/services/detail/PersonalInformationService';

interface PersonalInfoDetail {
  Personal_Data: any;
  Education_Data: any;
  Social_Media_Data: any;
  Employment_Position_Data: any;
  Salary_Data: any;
  BPJS_Data: any;
  Document_Data: any;
}

interface DetailDataKaryawanPersonalInfoState {
  detail: PersonalInfoDetail | null;
  loading: boolean;
  error: string | null;
  employeeId: string | null;
  fetchDetail: (employeeId: string) => Promise<void>;
  refetchDetail: (employeeId?: string) => Promise<void>;
  clearDetail: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDetail: (detail: PersonalInfoDetail | null) => void;
}

export const useDetailDataKaryawanPersonalInfo = create<DetailDataKaryawanPersonalInfoState>((set, get) => ({
  detail: null,
  loading: false,
  error: null,
  employeeId: null,

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setDetail: (detail: PersonalInfoDetail | null) => set({ detail }),

  fetchDetail: async (employeeId: string) => {
    const state = get();
    
    if (state.employeeId === employeeId && state.detail) {
      return;
    }

    set({ loading: true, error: null, employeeId });

    try {
      const res = await personalInformationService.getPersonalInformationData(employeeId);
      set({ 
        detail: res.data as PersonalInfoDetail, 
        loading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Gagal memuat detail karyawan',
        loading: false
      });
    }
  },

  refetchDetail: async (employeeId?: string) => {
    const state = get();
    const targetId = employeeId ?? state.employeeId;
    
    if (!targetId) return;

    set({ loading: true, error: null });

    try {
      const res = await personalInformationService.getPersonalInformationData(targetId);
      set({ 
        detail: res.data as PersonalInfoDetail, 
        loading: false,
        error: null,
        employeeId: targetId
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Gagal memuat detail karyawan',
        loading: false
      });
    }
  },

  clearDetail: () => {
    set({ 
      detail: null, 
      loading: false, 
      error: null, 
      employeeId: null 
    });
  },
}));

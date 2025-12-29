import create from 'zustand';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';
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
  fetchDetail: (employeeId: string) => Promise<void>;
  clearDetail: () => void;
}

export const useDetailDataKaryawanPersonalInfo = create<DetailDataKaryawanPersonalInfoState>(
  (set) => ({
    detail: null,
    loading: false,
    error: null,

    fetchDetail: async (employeeId: string) => {
      try {
        set({ loading: true, error: null });
        const res = await personalInformationService.getPersonalInformationData(employeeId);
        // console.log('res.data', res.data.Data_Social_Media[0]);
        set({ detail: res.data, loading: false });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Gagal memuat detail karyawan';
        set({ error: msg, loading: false });
      }
    },

    clearDetail: () => set({ detail: null, loading: false, error: null }),
  })
);

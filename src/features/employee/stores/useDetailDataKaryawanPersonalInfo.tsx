import create from 'zustand';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';

interface PersonalInfoDetail {
  Data_Pribadi: any;
  Data_Pendidikan: any;
  Data_Social_Media: any;
  Data_Employment_Posisi: any;
  Data_Keuangan: any;
  Data_BPJS: any;
  Data_Dokumen: any;
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
        const res = await employeeMasterDataService.getEmployeeDetailPersonal(employeeId);
        console.log('res.data', res.data.Data_Social_Media[0]);
        set({ detail: res.data, loading: false });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Gagal memuat detail karyawan';
        set({ error: msg, loading: false });
      }
    },

    clearDetail: () => set({ detail: null, loading: false, error: null }),
  })
);

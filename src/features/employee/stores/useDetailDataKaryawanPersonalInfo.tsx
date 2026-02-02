import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  refetchDetail: (employeeId?: string) => Promise<void>;
  clearDetail: () => void;
}

export const useDetailDataKaryawanPersonalInfo = (): DetailDataKaryawanPersonalInfoState => {
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['employee-personal-info', employeeId],
    queryFn: async () => {
      if (!employeeId) throw new Error('employeeId tidak tersedia');
      const res = await personalInformationService.getPersonalInformationData(employeeId);
      return res.data as PersonalInfoDetail;
    },
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000,
  });

  const fetchDetail = useCallback(async (id: string) => {
    setEmployeeId(id);
  }, []);

  const refetchDetail = useCallback(async (id?: string) => {
    const targetId = id ?? employeeId;
    if (!targetId) return;
    await queryClient.invalidateQueries({ queryKey: ['employee-personal-info', targetId] });
    await queryClient.refetchQueries({ queryKey: ['employee-personal-info', targetId] });
  }, [employeeId, queryClient]);

  const clearDetail = useCallback(() => {
    if (employeeId) {
      queryClient.removeQueries({ queryKey: ['employee-personal-info', employeeId] });
    }
    setEmployeeId(null);
  }, [employeeId, queryClient]);

  const state: DetailDataKaryawanPersonalInfoState = useMemo(
    () => ({
      detail: data ?? null,
      loading: isLoading || isFetching,
      error: error ? (error instanceof Error ? error.message : 'Gagal memuat detail karyawan') : null,
      fetchDetail,
      refetchDetail,
      clearDetail,
    }),
    [data, isLoading, isFetching, error, fetchDetail, refetchDetail, clearDetail]
  );

  return state;
};

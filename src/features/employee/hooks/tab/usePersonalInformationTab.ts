import { useEffect } from 'react';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

export function usePersonalInformationTab(employeeId: string) {
  const { detail, loading, error, fetchDetail } = useDetailDataKaryawanPersonalInfo();

  useEffect(() => {
    fetchDetail(employeeId);
  }, [employeeId, fetchDetail]);

  return { detail, loading, error };
}


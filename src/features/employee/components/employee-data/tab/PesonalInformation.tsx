import React from 'react';
import PersonalDataCard from '@/features/employee/components/employee-data/card/PersonalDataCard';
import EducationalBackgroundCard from '@/features/employee/components/employee-data/card/EducationalBackgroundCard';
import SocialEmergencyCard from '@/features/employee/components/employee-data/card/SocialEmergencyCard';
import EmployeeDataCard from '@/features/employee/components/employee-data/card/EmployeeDataCard';
import SalaryCard from '@/features/employee/components/employee-data/card/SalaryCard';
import BPJSCard from '@/features/employee/components/employee-data/card/BPJSCard';
import PersonalDocumentsCard from '@/features/employee/components/employee-data/card/PersonalDocumentsCard';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

interface Props {
  employeeId: string;
  isEditable: boolean;
}

export default function PesonalInformationTab({ employeeId }: Props) {
  const { detail, loading, error, fetchDetail } = useDetailDataKaryawanPersonalInfo();

  React.useEffect(() => {
    fetchDetail(employeeId);
  }, [employeeId, fetchDetail]);

  if (loading) {
    return <div className="p-4">Memuat detail…</div>;
  }
  if (error) {
    return <div className="p-4">{error}</div>;
  }
  if (!detail) {
    return <div className="p-4">Data tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      <PersonalDataCard data={detail.Data_Pribadi} />
      <EducationalBackgroundCard education={detail.Data_Pendidikan} />
      <SocialEmergencyCard personalInformation={detail.Data_Sosial_media} />
      <EmployeeDataCard data={detail.Data_Employment_Posisi} />
      <SalaryCard financeAndCompliance={detail.Data_Keuangan} />
      <BPJSCard financeAndCompliance={detail.Data_BPJS} />
      <PersonalDocumentsCard documents={detail.Data_Dokumen} />
    </div>
  );
}
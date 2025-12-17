import React from 'react';
import PersonalDataCard from '@/features/staff/components/dataKaryawan/card/PersonalDataCard';
import EducationalBackgroundCard from '@/features/staff/components/dataKaryawan/card/EducationalBackgroundCard';
import SocialEmergencyCard from '@/features/staff/components/dataKaryawan/card/SocialEmergencyCard';
import EmployeeDataCard from '@/features/staff/components/dataKaryawan/card/EmployeeDataCard';
import SalaryCard from '@/features/staff/components/dataKaryawan/card/SalaryCard';
import BPJSCard from '@/features/staff/components/dataKaryawan/card/BPJSCard';
import PersonalDocumentsCard from '@/features/staff/components/dataKaryawan/card/PersonalDocumentsCard';
import { useDetailDataKaryawanPersonalInfo } from '@/features/staff/stores/useDetailDataKaryawanPersonalInfo';

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
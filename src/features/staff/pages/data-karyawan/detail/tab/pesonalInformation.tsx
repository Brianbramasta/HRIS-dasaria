import type { Karyawan } from '@/features/staff/types/Karyawan';
import React from 'react';
import PersonalDataCard from '@/features/staff/components/dataKaryawan/card/PersonalDataCard';
import EducationalBackgroundCard from '@/features/staff/components/dataKaryawan/card/EducationalBackgroundCard';
import SocialEmergencyCard from '@/features/staff/components/dataKaryawan/card/SocialEmergencyCard';
import EmployeeDataCard from '@/features/staff/components/dataKaryawan/card/EmployeeDataCard';
import SalaryCard from '@/features/staff/components/dataKaryawan/card/SalaryCard';
import BPJSCard from '@/features/staff/components/dataKaryawan/card/BPJSCard';
import PersonalDocumentsCard from '@/features/staff/components/dataKaryawan/card/PersonalDocumentsCard';

interface Props {
  data: Karyawan;
  isEditable: boolean;
}

export default function PesonalInformationTab({ data }: Props) {
  return (
    <div className="space-y-6">
      <PersonalDataCard data={data} />
      <EducationalBackgroundCard />
      <SocialEmergencyCard />
      <EmployeeDataCard data={data} />
      <SalaryCard />
      <BPJSCard />
      <PersonalDocumentsCard />
    </div>
  );
}
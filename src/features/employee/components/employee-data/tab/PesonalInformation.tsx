import PersonalDataCard from '@/features/employee/components/employee-data/card/PersonalDataCard';
import EducationalBackgroundCard from '@/features/employee/components/employee-data/card/EducationalBackgroundCard';
import SocialEmergencyCard from '@/features/employee/components/employee-data/card/SocialEmergencyCard';
import EmployeeDataCard from '@/features/employee/components/employee-data/card/EmployeeDataCard';
import SalaryCard from '@/features/employee/components/employee-data/card/SalaryCard';
import BPJSCard from '@/features/employee/components/employee-data/card/BPJSCard';
import PersonalDocumentsCard from '@/features/employee/components/employee-data/card/PersonalDocumentsCard';
import { usePersonalInformationTab } from '@/features/employee/hooks/tab/usePersonalInformationTab';

interface Props {
  employeeId: string;
  isEditable: boolean;
}

export default function PesonalInformationTab({ employeeId }: Props) {
  const { detail, loading, error } = usePersonalInformationTab(employeeId);

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
      <PersonalDataCard data={detail.Personal_Data} employeeId={employeeId} />
      <EducationalBackgroundCard education={detail.Education_Data} />
      <SocialEmergencyCard personalInformation={detail.Social_Media_Data} />
      <EmployeeDataCard data={detail.Employment_Position_Data} />
      <SalaryCard salaryData={detail.Salary_Data} bpjsData={detail.BPJS_Data} />
      <BPJSCard salaryData={detail.Salary_Data} bpjsData={detail.BPJS_Data} />
      <PersonalDocumentsCard documents={detail.Document_Data} />
    </div>
  );
}

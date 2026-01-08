import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import SalaryBpjsModal from '@/features/employee/components/modals/employee-data/personal-information/SalaryBpjsModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import useBPJSCard from '@/features/employee/hooks/card/useBPJSCard';

interface Props {
  employeeId?: string;
  salaryData?: any; // Salary_Data from API response
  bpjsData?: any;  // BPJS_Data from API response
}

export default function BPJSCard({  salaryData, bpjsData }: Props) {
  const {
    isOpen,
    openModal,
    closeModal,
    employeeId,
    initialData,
    isComplete,
    updateSalaryData,
    updateBpjsData,
    loading,
  } = useBPJSCard(salaryData, bpjsData);

  return (
    <ExpandCard title="BPJS" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>No. BPJS Kesehatan</Label>
          <InputField value={bpjsData?.bpjs_health_number || ''} readonly={true} />
        </div>
        <div>
          <Label>Status BPJS Kesehatan</Label>
          <InputField value={bpjsData?.bpjs_health_status || ''} readonly={true} />
        </div>
        <div>
          <Label>No. BPJS Ketenagakerjaan</Label>
          <InputField value={bpjsData?.bpjs_employment_number || ''} readonly={true} />
        </div>
        <div>
          <Label>Status BPJS Ketenagakerjaan</Label>
          <InputField value={bpjsData?.bpjs_employment_status || ''} readonly={true} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" size="sm" onClick={openModal}>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

      <SalaryBpjsModal
        isOpen={isOpen}
        employeeId={employeeId}
        initialData={initialData}
        onClose={closeModal}
        onSubmitSalary={updateSalaryData}
        onSubmitBpjs={updateBpjsData}
        submitting={loading}
      />
    </ExpandCard>
  );
}

import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import SalaryBpjsModal, { type SalaryBpjsForm } from '@/features/employee/components/modals/employee-data/personal-information/SalaryBpjsModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import { usePersonalInformation } from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

interface Props {
  employeeId?: string;
  salaryData?: any; // Salary_Data from API response
  bpjsData?: any;  // BPJS_Data from API response
}

export default function BPJSCard({  salaryData, bpjsData }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const {detail} = useDetailDataKaryawanPersonalInfo();
    const employeeId = detail?.Personal_Data?.id;
  const { updateSalaryData, updateBpjsData, loading } = usePersonalInformation(employeeId);
  
  const initialData: SalaryBpjsForm = {
    gaji: '',
    bank: salaryData?.bank_id || '',
    noRekening: salaryData?.bank_account_number?.toString() || '',
    namaAkunBank: salaryData?.bank_account_holder || '',
    npwp: salaryData?.npwp || '',
    ptkpStatus: salaryData?.ptkp_id || '',
    noBpjsKS: bpjsData?.bpjs_health_number?.toString() || '',
    statusBpjsKS: bpjsData?.bpjs_health_status || '',
    noBpjsTK: bpjsData?.bpjs_employment_number?.toString() || '',
    statusBpjsTK: bpjsData?.bpjs_employment_status || '',
    nominalBpjsTK: '',
  };

  const isComplete = !!(
    bpjsData?.bpjs_health_number &&
    bpjsData?.bpjs_health_status &&
    bpjsData?.bpjs_employment_number &&
    bpjsData?.bpjs_employment_status
  );

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

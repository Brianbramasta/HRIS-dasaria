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

export default function SalaryCard({  salaryData, bpjsData }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const {detail} = useDetailDataKaryawanPersonalInfo();
    const employeeId = detail?.Personal_Data?.id;
  const { updateSalaryData, updateBpjsData, loading } = usePersonalInformation(employeeId);
  
  const initialData: SalaryBpjsForm = {
    gaji: '',
    bank: salaryData?.bank_id || '',
    namaAkunBank: salaryData?.bank_account_holder || '',
    noRekening: salaryData?.bank_account_number?.toString() || '',
    npwp: salaryData?.npwp || '',
    ptkpStatus: salaryData?.ptkp_id || '',
    noBpjsTK: bpjsData?.bpjs_employment_number?.toString() || '',
    statusBpjsTK: bpjsData?.bpjs_employment_status || '',
    noBpjsKS: bpjsData?.bpjs_health_number?.toString() || '',
    statusBpjsKS: bpjsData?.bpjs_health_status || '',
    nominalBpjsTK: '',
  };

  const isComplete = !!(
    salaryData?.bank_name &&
    salaryData?.bank_account_holder &&
    salaryData?.bank_account_number &&
    salaryData?.npwp &&
    bpjsData?.bpjs_employment_number &&
    bpjsData?.bpjs_employment_status &&
    bpjsData?.bpjs_health_number &&
    bpjsData?.bpjs_health_status
  );

  return (
    <ExpandCard title="Gaji" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="space-y-6">
        {/* Salary Section */}
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Bank</Label>
              <InputField value={salaryData?.bank_name || ''} readonly={true} />
            </div>
            <div>
              <Label>Nama Akun Bank</Label>
              <InputField value={salaryData?.bank_account_holder || ''} readonly={true} />
            </div>
            <div>
              <Label>No. Rekening</Label>
              <InputField value={salaryData?.bank_account_number || ''} readonly={true} />
            </div>
            <div>
              <Label>NPWP</Label>
              <InputField value={salaryData?.npwp || ''} readonly={true} />
            </div>
            <div>
              <Label>PTKP Status</Label>
              <InputField value={salaryData?.ptkp_category || salaryData?.ptkp_code || ''} readonly={true} />
            </div>
          </div>
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

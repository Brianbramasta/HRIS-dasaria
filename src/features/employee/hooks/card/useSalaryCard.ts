import { useModal } from '@/hooks/useModal';
import SalaryBpjsModal, { type SalaryBpjsForm } from '@/features/employee/components/modals/employee-data/personal-information/SalaryBpjsModal';
import { usePersonalInformation } from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

export default function useSalaryCard(salaryData?: any, bpjsData?: any) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const { detail } = useDetailDataKaryawanPersonalInfo();
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

  return {
    isOpen,
    openModal,
    closeModal,
    employeeId,
    initialData,
    isComplete,
    updateSalaryData,
    updateBpjsData,
    loading,
  };
}

import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import SalaryBpjsModal, { type SalaryBpjsForm } from '@/features/employee/components/modals/employee-data/personal-information/SalaryBpjsModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';

interface Props {
  financeAndCompliance: any; // API response from employee-master-data
}

export default function SalaryCard({ financeAndCompliance }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const initialData: SalaryBpjsForm = {
    gaji: '',
    bank: financeAndCompliance?.bank_name || '',
    namaAkunBank: financeAndCompliance?.bank_account_holder || '',
    noRekening: financeAndCompliance?.bank_account_number || '',
    npwp: financeAndCompliance?.npwp || '',
    ptkpStatus: financeAndCompliance?.ptkp_code || '',
  };
  const isComplete = !!financeAndCompliance?.bank_name &&
    !!financeAndCompliance?.bank_account_holder &&
    !!financeAndCompliance?.bank_account_number &&
    !!financeAndCompliance?.npwp;
  return (
    <ExpandCard title="Gaji" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* <div>
          <Label>Gaji</Label>
          <InputField value={''} readonly={true} />
        </div> */}
        <div className="md:col-span-2">
          <Label>Bank</Label>
          <InputField value={financeAndCompliance?.bank_name || ''} readonly={true} />
        </div>
        <div>
          <Label>Nama Akun Bank</Label>
          <InputField value={financeAndCompliance?.bank_account_holder || ''} readonly={true} />
        </div>
        <div>
          <Label>No. Rekening</Label>
          <InputField value={financeAndCompliance?.bank_account_number || ''} readonly={true} />
        </div>
        <div>
          <Label>NPWP</Label>
          <InputField value={financeAndCompliance?.npwp || ''} readonly={true} />
        </div>
        <div>
          <Label>PTKP Status</Label>
          <InputField value={financeAndCompliance?.ptkp_code || ''} readonly={true} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" size="sm" onClick={openModal}>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

      <SalaryBpjsModal
        isOpen={isOpen}
        initialData={initialData}
        onClose={closeModal}
        onSubmit={(payload) => {
          console.log('Save Salary', payload);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}

import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import SalaryBpjsModal, { type SalaryBpjsForm } from '@/features/staff/components/modals/dataKaryawan/PersonalInformation/SalaryBpjsModal';
import type { KaryawanDetailResponse } from '@/features/staff/services/karyawanService';

interface Props {
  financeAndCompliance: KaryawanDetailResponse['financeAndCompliance'];
}

export default function BPJSCard({ financeAndCompliance }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const initialData: SalaryBpjsForm = {
    gaji: '',
    bank: '',
    noRekening: '',
    namaAkunBank: '',
    npwp: '',
    ptkpStatus: '',
    noBpjsKS: financeAndCompliance.noBpjsKesehatan || '',
    statusBpjsKS: financeAndCompliance.statusBpjsKesehatan || '',
    noBpjsTK: financeAndCompliance.noBpjsKetenagakerjaan || '',
    statusBpjsTK: financeAndCompliance.statusBpjsKetenagakerjaan || '',
    nominalBpjsTK: financeAndCompliance.nominalBpjsTk || '',
  };
  return (
    <ExpandCard title="BPJS" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>No. BPJS Kesehatan</Label>
          <InputField value={financeAndCompliance.noBpjsKesehatan || ''} disabled={true} />
        </div>
        <div>
          <Label>Status BPJS Kesehatan</Label>
          <InputField value={financeAndCompliance.statusBpjsKesehatan || ''} disabled={true} />
        </div>
        <div>
          <Label>No. BPJS Ketenagakerjaan</Label>
          <InputField value={financeAndCompliance.noBpjsKetenagakerjaan || ''} disabled={true} />
        </div>
        <div>
          <Label>Status BPJS Ketenagakerjaan</Label>
          <InputField value={financeAndCompliance.statusBpjsKetenagakerjaan || ''} disabled={true} />
        </div>
        {/* <div>
          <Label>Nominal BPJS TK</Label>
          <InputField value={financeAndCompliance.nominalBpjsTk || ''} disabled={true} />
        </div> */}
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
          console.log('Save Salary & BPJS', payload);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}
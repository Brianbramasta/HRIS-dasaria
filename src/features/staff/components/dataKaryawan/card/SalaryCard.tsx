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

export default function SalaryCard({ financeAndCompliance }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const initialData: SalaryBpjsForm = {
    gaji: '',
    bank: financeAndCompliance.bank || '',
    namaAkunBank: financeAndCompliance.namaAkunBank || '',
    noRekening: financeAndCompliance.noRekening || '',
    npwp: financeAndCompliance.npwp || '',
    ptkpStatus: '',
  };
  return (
    <ExpandCard title="Gaji" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Gaji</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Bank</Label>
          <InputField value={financeAndCompliance.bank || ''} disabled={true} />
        </div>
        <div>
          <Label>Nama Akun Bank</Label>
          <InputField value={financeAndCompliance.namaAkunBank || ''} disabled={true} />
        </div>
        <div>
          <Label>No. Rekening</Label>
          <InputField value={financeAndCompliance.noRekening || ''} disabled={true} />
        </div>
        <div>
          <Label>NPWP</Label>
          <InputField value={financeAndCompliance.npwp || ''} disabled={true} />
        </div>
        <div>
          <Label>PTKP Status</Label>
          <InputField value={''} disabled={true} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={openModal}>
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
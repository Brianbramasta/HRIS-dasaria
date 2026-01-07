import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { BPJS_STATUS_OPTIONS, BPJS_TK_STATUS_OPTIONS } from '../../../../utils/EmployeeMappings';
import { useSalaryBpjsModal, SalaryBpjsForm } from '@/features/employee/hooks/modals/personal-information/useSalaryBpjsModal';
import { UpdateSalaryDataPayload, UpdateBpjsDataPayload } from '@/features/employee/types/detail/PersonalInformation';
export type { SalaryBpjsForm };
interface Props {
  isOpen: boolean;
  employeeId?: string;
  initialData?: SalaryBpjsForm | null;
  onClose: () => void;
  onSubmitSalary?: (employeeId: string, payload: UpdateSalaryDataPayload) => Promise<void>;
  onSubmitBpjs?: (employeeId: string, payload: UpdateBpjsDataPayload) => Promise<void>;
  submitting?: boolean;
}

const SalaryBpjsModal: React.FC<Props> = ({
  isOpen,
  employeeId = '',
  initialData,
  onClose,
  onSubmitSalary,
  onSubmitBpjs,
  submitting = false,
}) => {
  const { title, form, bankOptions, ptkpOptions, ptkpLoading, fetchPTKPOptions, handleInput, handleSubmit, isSubmitting } =
    useSalaryBpjsModal({ isOpen, employeeId, initialData, onClose, onSubmitSalary, onSubmitBpjs });

  const content = (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold">Salary</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Bank</Label>
            <Select 
              options={bankOptions} 
              defaultValue={form.bank || ''} 
              onChange={(v) => handleInput('bank', v)} 
              placeholder="Select"
            />
          </div>
          <div>
            <Label>No. Rekening</Label>
            <InputField 
              type='number'
              value={form.noRekening || ''} 
              onChange={(e) => handleInput('noRekening', e.target.value)} 
            />
          </div>
          <div>
            <Label>Nama Akun Bank</Label>
            <InputField 
              value={form.namaAkunBank || ''} 
              onChange={(e) => handleInput('namaAkunBank', e.target.value)} 
            />
          </div>
          <div>
            <Label>NPWP</Label>
            <InputField 
              type='number'
              value={form.npwp || ''} 
              onChange={(e) => handleInput('npwp', e.target.value)} 
            />
          </div>
          <div>
            <Label>PTKP Status</Label>
            <Select 
              options={ptkpOptions} 
              defaultValue={form.ptkpStatus || ''} 
              onChange={(v) => handleInput('ptkpStatus', v)} 
              placeholder={ptkpLoading ? "Loading..." : "Select PTKP Status"}
              onSearch={(query) => fetchPTKPOptions(query)}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold">BPJS</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label>No. BPJS Ketenagakerjaan</Label>
            <InputField 
              type='number'
              value={form.noBpjsTK || ''} 
              onChange={(e) => handleInput('noBpjsTK', e.target.value)} 
            />
          </div>
          <div>
            <Label>Status BPJS Ketenagakerjaan</Label>
            <Select 
              options={BPJS_TK_STATUS_OPTIONS} 
              defaultValue={form.statusBpjsTK || ''} 
              onChange={(v) => handleInput('statusBpjsTK', v)} 
              placeholder="Select"
            />
          </div>
          <div>
            <Label>No. BPJS Kesehatan</Label>
            <InputField 
              type='number'
              value={form.noBpjsKS || ''} 
              onChange={(e) => handleInput('noBpjsKS', e.target.value)} 
            />
          </div>
          <div>
            <Label>Status BPJS Kesehatan</Label>
            <Select 
              options={BPJS_STATUS_OPTIONS} 
              defaultValue={form.statusBpjsKS || ''} 
              onChange={(v) => handleInput('statusBpjsKS', v)} 
              placeholder="Select"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={isSubmitting || !!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default SalaryBpjsModal;

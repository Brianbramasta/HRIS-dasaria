import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import { BPJS_STATUS_OPTIONS, BPJS_TK_STATUS_OPTIONS } from '../../../../utils/EmployeeMappings';
import { useSalaryBpjsModal, SalaryBpjsForm } from '@/features/employee/hooks/modals/employee-data/personal-information/useSalaryBpjsModal';
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
        <h2 className="text-3xl font-bold text-start">{title}</h2>
        <p className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</p>
      </div>
      <div>
        <h3 className="text-xl text-[grey] font-semibold">Gaji</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <SelectField 
              label="Bank"
              options={bankOptions} 
              defaultValue={form.bank || ''} 
              onChange={(v) => handleInput('bank', v)} 
              placeholder="Select"
              required
            />
          </div>
          <div>
            <InputField 
              label="No. Rekening"
              type='number'
              value={form.noRekening || ''} 
              onChange={(e) => handleInput('noRekening', e.target.value)} 
              required
            />
          </div>
          <div>
            <InputField 
              label="Nama Akun Bank"
              value={form.namaAkunBank || ''} 
              onChange={(e) => handleInput('namaAkunBank', e.target.value)} 
              required
            />
          </div>
          <div>
            <InputField 
              label="NPWP"
              type='number'
              value={form.npwp || ''} 
              onChange={(e) => handleInput('npwp', e.target.value)} 
            />
          </div>
          <div>
            <SelectField 
              label="PTKP Status"
              options={ptkpOptions} 
              defaultValue={form.ptkpStatus || ''} 
              onChange={(v) => handleInput('ptkpStatus', v)} 
              placeholder={ptkpLoading ? "Loading..." : "Select PTKP Status"}
              onSearch={(query) => fetchPTKPOptions(query)}
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl text-[grey] font-semibold">BPJS</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <InputField 
              label="No. BPJS Ketenagakerjaan"
              type='number'
              value={form.noBpjsTK || ''} 
              onChange={(e) => handleInput('noBpjsTK', e.target.value)} 
            />
          </div>
          <div>
            <SelectField 
              label="Status BPJS Ketenagakerjaan"
              options={BPJS_TK_STATUS_OPTIONS} 
              defaultValue={form.statusBpjsTK || ''} 
              onChange={(v) => handleInput('statusBpjsTK', v)} 
              placeholder="Select"
            />
          </div>
          <div>
            <InputField 
              label="No. BPJS Kesehatan"
              type='number'
              value={form.noBpjsKS || ''} 
              onChange={(e) => handleInput('noBpjsKS', e.target.value)} 
            />
          </div>
          <div>
            <SelectField 
              label="Status BPJS Kesehatan"
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
      // title={title}
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

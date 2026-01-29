import { FC } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import { TemporarySalaryResponse } from '@/features/employee/types/dto/EmployeeSalaryType';
import { formatCurrency } from '@/utils/formatCurrency';
import { Plus, Trash2 } from 'react-feather';
import { useEditStoryPayrollModal } from '@/features/employee/hooks/modals/employee-data/story-payroll/useEditStoryPayrollModal';

interface EditStoryPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  data: TemporarySalaryResponse | null;
  onSuccess: () => void;
}

const EditStoryPayrollModal: FC<EditStoryPayrollModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    data,
  } = props;

  const {
    loading,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    accountHolder,
    setAccountHolder,
    npwp,
    setNpwp,
    nonFixAllowances,
    allowanceOptions,
    handleAddAllowance,
    handleRemoveAllowance,
    handleChangeAllowance,
    handleSubmit,
  } = useEditStoryPayrollModal(props);

  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gaji</h3>
      </div>

      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Informasi Penggajian */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">Informasi Penggajian</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="Bank" 
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="BCA"
            />
            
            <InputField
              label="No. Rekening"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
            <InputField
              label="Nama Akun Bank"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
            />
            <InputField
              label="NPWP"
              value={npwp}
              onChange={(e) => setNpwp(e.target.value)}
            />
            <InputField
              label="PTKP Status"
              value={data.ptkp_status || '-'}
              disabled
              className="bg-gray-100 dark:bg-gray-800 text-gray-500"
            />
            <InputField
              label="Gaji Bersih"
              value={formatCurrency(data.temporary_salary)}
              disabled
              className="bg-gray-100 dark:bg-gray-800 text-gray-500"
            />
          </div>
        </div>

        {/* Detail Gaji */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">Detail Gaji</h4>
          
          {/* Gaji Pokok */}
          <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-slate-500 px-4 py-2 rounded-t-lg">
              <span className="font-semibold text-white">Gaji Pokok</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
              <InputField
                label="Nominal Gaji Pokok"
                value={formatCurrency(data.basic_salary)}
                disabled
                className="bg-gray-200 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Tunjangan Tetap */}
          <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-green-700 px-4 py-2 rounded-t-lg">
              <span className="font-semibold text-white">Tunjangan Tetap</span>
            </div>
            <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2 bg-gray-50 dark:bg-gray-800/50">
              <InputField
                label="Tunjangan Jabatan"
                value={formatCurrency(data.position_allowance)}
                disabled
                className="bg-gray-200 dark:bg-gray-700"
              />
              <InputField
                label="Tunjangan Lama Kerja"
                value={formatCurrency(data.length_of_service_allowance)}
                disabled
                className="bg-gray-200 dark:bg-gray-700"
              />
               <InputField
                label="Tunjangan Pernikahan"
                value={formatCurrency(data.marital_allowance)}
                disabled
                className="bg-gray-200 dark:bg-gray-700"
              />
              {data.bpjs_allowance_details?.map((bpjs, idx) => (
                <InputField
                  key={idx}
                  label={bpjs.item}
                  value={formatCurrency(bpjs.value)}
                  disabled
                  className="bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          </div>

          {/* Potongan Tetap */}
          <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-red-700 px-4 py-2 rounded-t-lg">
              <span className="font-semibold text-white">Potongan Tetap</span>
            </div>
            <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2 bg-gray-50 dark:bg-gray-800/50">
              {data.bpjs_deduction_details?.map((deduction, idx) => (
                <InputField
                  key={idx}
                  label={deduction.item}
                  value={formatCurrency(deduction.value)}
                  disabled
                  className="bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          </div>

          {/* Tunjangan Tidak Tetap */}
          <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-green-700 px-4 py-2 rounded-t-lg flex justify-between items-center">
              <span className="font-semibold text-white">Tunjangan Tidak Tetap</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 space-y-3">
              {nonFixAllowances.map((item, index) => (
                <div key={index} className="flex items-end gap-3">
                  <div className="flex-1">
                    <SelectField
                      label="Jenis Tunjangan"
                      options={allowanceOptions}
                      defaultValue={item.id}
                      onChange={(val) => handleChangeAllowance(index, 'id', val)}
                      placeholder="Pilih Tunjangan"
                    />
                  </div>
                  <div className="flex-1">
                    <InputField
                      label="Nominal"
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleChangeAllowance(index, 'amount', Number(e.target.value))}
                      placeholder="Rp 0"
                    />
                  </div>
                   <div className="pb-1">
                    <Button
                        size="sm"
                        type='button'
                        variant="custom"
                        onClick={() => handleRemoveAllowance(index)}
                        className="h-[42px] w-[42px] p-0 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                        <Trash2 size={18} />
                    </Button>
                   </div>
                </div>
              ))}
              
               <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    variant="custom"
                    onClick={handleAddAllowance}
                    className="w-[42px] h-[42px] p-0 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
                  >
                    <Plus size={20} />
                  </Button>
               </div>
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={onClose}>
          Tutup
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </Modal>
  );
};

export default EditStoryPayrollModal;

import { FC } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import { EmployeeSalaryShowResponse } from '@/features/employee/types/dto/EmployeeSalaryType';
import { formatCurrency, parseCurrency } from '@/utils/formatCurrency';
import { Plus, Trash2 } from 'react-feather';
import { useEditStoryPayrollModal } from '@/features/employee/hooks/modals/employee-data/story-payroll/useEditStoryPayrollModal';

interface EditStoryPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  data: EmployeeSalaryShowResponse | null;
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
    bankOptions,
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
            <SelectField
              label="Bank" 
              options={bankOptions}
              defaultValue={bankName}
              onChange={(value) => setBankName(value)}
              placeholder="Pilih Bank"
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
              value={data?.data?.employee_information?.ptkp || '-'}
              disabled
              className="bg-gray-100 dark:bg-gray-800 text-gray-500"
            />
            <InputField
              label="Gaji Bersih"
              value={formatCurrency(data?.data?.payroll_information?.take_home_pay || 0)}
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
                value={formatCurrency(data?.data?.payroll_information?.basic_salary || 0)}
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
              {data?.data?.payroll_information?.allowances
                ?.filter(allowance => allowance.type === 'fixed')
                ?.map((allowance, idx) => (
                <InputField
                  key={idx}
                  label={allowance.name}
                  value={formatCurrency(allowance.amount)}
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
              {data?.data?.payroll_information?.deductions?.map((deduction, idx) => (
                <InputField
                  key={idx}
                  label={deduction.name}
                  value={formatCurrency(deduction.amount)}
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
            <div className="p-4  dark:bg-gray-800/50 space-y-3">
              {nonFixAllowances.map((item, index) => (
                <div key={index} className="flex items-end gap-3">
                  <div className="flex-1">
                    <SelectField
                      label="Jenis Tunjangan"
                      options={item.tr_id
                        ? allowanceOptions.filter(option => option.value === item.id)
                        : allowanceOptions.filter(option => 
                            !nonFixAllowances.some(allowance => allowance.id === option.value && allowance.id !== item.id)
                          )
                      }
                      defaultValue={item.id}
                      onChange={(val) => handleChangeAllowance(index, 'id', val)}
                      placeholder="Pilih Tunjangan"
                      disabled={!!item.tr_id}
                    />
                  </div>
                  <div className="flex-1">
                    <InputField
                      label="Nominal"
                      type="text"
                      value={formatCurrency(item.amount)}
                      onChange={(e) => handleChangeAllowance(index, 'amount', parseCurrency(e.target.value) || 0)}
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

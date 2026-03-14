import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import { useNewContract } from '@/features/employee/hooks/modals/contract-renewal/slice-component/useNewContract';
import { useApiPayrollPreview } from '@/features/employee/hooks/api/useApiPayrollPreview';
import { formatInputCurrency, formatCurrency, parseCurrency } from '@/utils/formatCurrency';
import { IconPlus as PlusIcon, IconHapus as TrashBinIcon } from '@/icons/components/icons';

interface NewContractData {
  new_change_type_id?: string;
  new_change_type_name?: string;
  new_employee_category_name?: string;
  new_company_name?: string;
  new_office_name?: string;
  new_directorate_name?: string;
  new_division_name?: string;
  new_department_name?: string;
  new_unit_name?: string;
  new_position_name?: string;
  new_job_title_name?: string;
  new_structural_position_name?: string;
  new_position_level_name?: string;
  new_grade?: string;
  new_basic_salary?: string | number;
  new_contract_document?: string;
  // Salary components
  new_gaji_pokok?: string | number;
  new_tunjangan_pernikahan?: string | number;
  new_tunjangan_jabatan?: string | number;
  new_tunjangan_lama_kerja?: string | number;
  new_tunjangan_diskresi?: Array<{ id: string; amount: number }>;
  new_gaji_bersih?: string | number;
}

interface NewContractProps {
  data?: NewContractData;
  isEditing?: boolean;
  onChange?: (field: string, value: any) => void;
}

export default function NewContract({
  data = {},
  isEditing = false,
  onChange,
}: NewContractProps) {
  console.log('🎨 NewContract rendering:', { data, isEditing });
  const { nonFixAllowanceOptions, fetchNonFixAllowanceDropdown } = useApiPayrollPreview();
  const {
    changeTypeOptions,
    companyOptions,
    officeOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    jobTitleOptions,
    positionOptions,
    kategoriKaryawanOptions,
    selectedGrade,
    positionLevelOptions,
    jabatanStrukturalOptions,
    unitOptions,
    isNonStaffOrMitraCategory,
    isStaffCategory,
    salaryLabel,
    setCompanySearch,
    setOfficeSearch,
    setDirectorateSearch,
    setDivisionSearch,
    setDepartmentSearch,
    setUnitSearch,
    setJobTitleSearch,
    setPositionSearch,
    setPositionLevelSearch,
    setEmployeeCategorySearch,
    handleInputChange,
    addNonFixAllowance,
    removeNonFixAllowance,
    updateNonFixAllowance,
  } = useNewContract({ data, isEditing, onChange });

  console.log('📋 Hook values:', { 
    isNonStaffOrMitraCategory, 
    isStaffCategory, 
    salaryLabel,
    categoryName: data?.new_employee_category_name 
  });

  return (
    <PayrollCard
      title="Kontrak Baru"
      headerColor="green"
      border={false}
    >
      <div className="space-y-6">
        {/* Row 1: Jenis Perubahan, Kategori Karyawan, Perusahaan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Jenis Perubahan"
            defaultValue={data?.new_change_type_id || ''}
            disabled={!isEditing}
            onChange={(value) => {
              handleInputChange('new_change_type_id', value);
              // Find and store label as well
              const selectedOption = changeTypeOptions.find(option => option.value === value);
              handleInputChange('new_change_type_name', selectedOption?.label || '');
            }}
            containerClassName="space-y-2"
            options={[
              { label: 'Pilih Jenis Perubahan', value: '' },
              ...changeTypeOptions
            ]}
          />
          <SelectField
            label="Kategori Karyawan"
            options={kategoriKaryawanOptions}
            defaultValue={data?.new_employee_category_name || ''}
            disabled={!isEditing}
            onChange={(value) => {
              handleInputChange('new_employee_category_name', value);
              // Fetch non-fix allowance options when category changes to Staff
              const selectedOption = kategoriKaryawanOptions.find(option => option.value === value);
              if (selectedOption?.label === 'Staff') {
                fetchNonFixAllowanceDropdown();
              }
            }}
            onSearch={setEmployeeCategorySearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Perusahaan"
            options={companyOptions}
            defaultValue={data?.new_company_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_company_name', value)}
            onSearch={setCompanySearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />

        {/* Row 2: Kantor, Direktorat, Divisi */}
          <SelectField
            label="Kantor"
            options={officeOptions.length > 0 ? officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]}
            defaultValue={data?.new_office_name || ''}
            disabled={!isEditing || officeOptions.length === 0}
            onChange={(value) => handleInputChange('new_office_name', value)}
            onSearch={setOfficeSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Direktorat"
            options={directorateOptions}
            defaultValue={data?.new_directorate_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_directorate_name', value)}
            onSearch={setDirectorateSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Divisi"
            options={divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]}
            defaultValue={data?.new_division_name || ''}
            disabled={!isEditing || divisionOptions.length === 0}
            onChange={(value) => handleInputChange('new_division_name', value)}
            onSearch={setDivisionSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />

        {/* Row 3: Departemen, Unit, Position */}
          <SelectField
            label="Departemen"
            options={departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
            defaultValue={data?.new_department_name || ''}
            disabled={!isEditing || departmentOptions.length === 0}
            onChange={(value) => handleInputChange('new_department_name', value)}
            onSearch={setDepartmentSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Unit"
            options={unitOptions.length > 0 ? unitOptions : [{ label: 'Pilih departemen terlebih dahulu', value: '' }]}
            defaultValue={data?.new_unit_name || ''}
            disabled={!isEditing || unitOptions.length === 0}
            onChange={(value) => handleInputChange('new_unit_name', value)}
            onSearch={setUnitSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Position"
            options={positionOptions}
            defaultValue={data?.new_position_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_position_name', value)}
            onSearch={setPositionSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />

        {/* Row 4: Jabatan Kepangkatan, Jabatan Struktural, Jenjang Jabatan */}
          <SelectField
            label="Jabatan Kepangkatan"
            options={jobTitleOptions}
            defaultValue={data?.new_job_title_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_job_title_name', value)}
            onSearch={setJobTitleSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Jabatan Struktural"
            options={jabatanStrukturalOptions}
            defaultValue={data?.new_structural_position_name || ''}
            disabled={!isEditing || !data?.new_job_title_name}
            onChange={(value) => handleInputChange('new_structural_position_name', value)}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Jenjang Jabatan"
            options={positionLevelOptions}
            defaultValue={data?.new_position_level_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_position_level_name', value)}
            onSearch={setPositionLevelSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />

        {/* Row 5: Golongan, Gaji Pokok */}
          <InputField
            label="Golongan"
            value={selectedGrade || data?.new_grade || ''}
            disabled
            onChange={(e) => handleInputChange('new_grade', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label={salaryLabel}
            type="text"
            value={formatInputCurrency(String(data?.new_gaji_pokok || ''))}
            disabled={!isEditing}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, '');
              handleInputChange('new_gaji_pokok', cleaned);
            }}
            containerClassName="space-y-2"
          />

        {/* Row 6: Tunjangan Pernikahan, Tunjangan Jabatan */}
          {!isNonStaffOrMitraCategory && (
            <>
              
              <InputField
                label="Tunjangan Jabatan"
                type="text"
                value={formatInputCurrency(String(data?.new_tunjangan_jabatan || ''))}
                disabled={!isEditing}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange('new_tunjangan_jabatan', cleaned);
                }}
                containerClassName="space-y-2"
              />
            </>
          )}

        {/* Row 7: Tunjangan Lama Kerja */}
          {!isNonStaffOrMitraCategory && (
            <InputField
              label="Tunjangan Lama Kerja"
              type="text"
              value={formatInputCurrency(String(data?.new_tunjangan_lama_kerja || ''))}
              disabled={!isEditing}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '');
                handleInputChange('new_tunjangan_lama_kerja', cleaned);
              }}
              containerClassName="space-y-2"
            />
          )}

        {/* Row 8: Tunjangan Diskresi (Dynamic) */}
          {!isNonStaffOrMitraCategory  && (
            <div className="md:col-span-2">
              <div className="space-y-4">
                {(data?.new_tunjangan_diskresi || [{ id: '', amount: 0 }]).map((allowance, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-6">
                      <SelectField
                        label="Jenis Tunjangan Diskresi"
                        options={nonFixAllowanceOptions
                          .map((opt: any) => ({ 
                            value: opt.id, 
                            label: opt.allowance_name 
                          }))
                          .filter(option => 
                            !(data?.new_tunjangan_diskresi || []).some((otherAllowance, otherIndex) => 
                              otherAllowance.id === option.value && otherIndex !== index
                            )
                          )
                        }
                        defaultValue={allowance.id}
                        onChange={(value) => updateNonFixAllowance(index, 'id', value)}
                        placeholder="Pilih Tunjangan Tidak Tetap"
                        disabled={!isEditing}
                        containerClassName="space-y-2"
                      />
                    </div>
                    <div className="md:col-span-6 flex items-end gap-2">
                      <div className="flex-1">
                        <InputField
                          label="Nominal"
                          value={formatCurrency(Number(allowance.amount) || 0)}
                          onChange={(e) => updateNonFixAllowance(index, 'amount', parseCurrency(e.target.value) || 0)}
                          placeholder="Rp 0"
                          disabled={!isEditing}
                          containerClassName="space-y-2"
                        />
                      </div>
                      <div>
                        {!isEditing ? null : (index === (data?.new_tunjangan_diskresi || [{ id: '', amount: 0 }]).length - 1 ? (
                          <button
                            className="p-2.5 rounded-lg bg-success-500 hover:bg-success-600 text-white w-11 h-11 flex items-center justify-center"
                            onClick={addNonFixAllowance}
                            type="button"
                          >
                            <PlusIcon />
                          </button>
                        ) : (
                          <button
                            className="p-2.5 rounded-lg bg-error-500 hover:bg-error-600 text-white w-11 h-11 flex items-center justify-center"
                            onClick={() => removeNonFixAllowance(index)}
                            type="button"
                          >
                            <TrashBinIcon color="white" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!isNonStaffOrMitraCategory && (
          <InputField
                label="Tunjangan Pernikahan"
                type="text"
                value={formatInputCurrency(String(data?.new_tunjangan_pernikahan || ''))}
                disabled={!isEditing}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange('new_tunjangan_pernikahan', cleaned);
                }}
                containerClassName="space-y-2"
              />
          )}

        {/* Row 9: Gaji Bersih */}
          <InputField
            label="Gaji Bersih"
            type="text"
            value={formatInputCurrency(String(data?.new_gaji_bersih || ''))}
            disabled={!isEditing}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, '');
              handleInputChange('new_gaji_bersih', cleaned);
            }}
            containerClassName="space-y-2"
          />
        </div>

      </div>
    </PayrollCard>
  );
}

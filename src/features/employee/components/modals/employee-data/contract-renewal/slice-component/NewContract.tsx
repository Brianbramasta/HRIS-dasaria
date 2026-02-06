import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import { useNewContract } from '@/features/employee/hooks/modals/contract-renewal/slice-component/useNewContract';
import { formatInputCurrency } from '@/utils/formatCurrency';

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
  } = useNewContract({ data, isEditing, onChange });

  return (
    <PayrollCard
      title="Kontrak Baru"
      headerColor="green"
      border={false}
    >
      <div className="space-y-6">
        {/* Row 1: Jenis Perubahan, Kategori Karyawan, Perusahaan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Jenis Perubahan"
            defaultValue={data?.new_change_type_id || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_change_type_id', value)}
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
            onChange={(value) => handleInputChange('new_employee_category_name', value)}
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
        </div>

        {/* Row 2: Kantor, Direktorat, Divisi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Row 3: Departemen, Unit, Position */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Row 4: Jabatan Kepangkatan, Jabatan Struktural, Jenjang Jabatan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Row 5: Golongan, GAJI BERSIH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Golongan"
            value={selectedGrade || data?.new_grade || ''}
            disabled
            onChange={(e) => handleInputChange('new_grade', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="GAJI BERSIH"
            type="text"
            value={formatInputCurrency(String(data?.new_basic_salary || ''))}
            disabled={!isEditing}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, '');
              handleInputChange('new_basic_salary', cleaned);
            }}
            containerClassName="space-y-2"
          />
        </div>

      </div>
    </PayrollCard>
  );
}

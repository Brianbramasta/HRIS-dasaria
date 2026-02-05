import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';

interface NewContractData {
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
  const handleInputChange = (field: string, value: any) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <PayrollCard
      title="Kontrak Baru"
      headerColor="green"
      border={false}
    >
      <div className="space-y-6">
        {/* Row 1: Jenis Perubahan, Kategori Karyawan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Jenis Perubahan"
            defaultValue={data?.new_change_type_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_change_type_name', value)}
            containerClassName="space-y-2"
            options={[
              { label: 'Pilih Jenis Perubahan', value: '' },
              { label: 'Promosi', value: 'Promosi' },
              { label: 'Demosi', value: 'Demosi' },
              { label: 'Transfer', value: 'Transfer' },
            ]}
          />
          <InputField
            label="Kategori Karyawan"
            value={data?.new_employee_category_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_employee_category_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 2: Perusahaan, Kantor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Perusahaan"
            value={data?.new_company_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_company_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Kantor"
            value={data?.new_office_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_office_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 3: Direktorat, Divisi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Direktorat"
            value={data?.new_directorate_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_directorate_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Divisi"
            value={data?.new_division_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_division_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 4: Departemen, Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Departemen"
            value={data?.new_department_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_department_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Unit"
            value={data?.new_unit_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_unit_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 5: Position, Jabatan Kepangkatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Position"
            value={data?.new_position_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_position_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Jabatan Kepangkatan"
            value={data?.new_job_title_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_job_title_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 6: Jabatan Struktural, Jenjang Jabatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Jabatan Struktural"
            value={data?.new_structural_position_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_structural_position_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Jenjang Jabatan"
            value={data?.new_position_level_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_position_level_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 7: Golongan, GAJI BERSIH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Golongan"
            value={data?.new_grade || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_grade', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="GAJI BERSIH"
            type="number"
            value={data?.new_basic_salary || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_basic_salary', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

      </div>
    </PayrollCard>
  );
}

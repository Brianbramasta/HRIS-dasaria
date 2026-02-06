import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import { formatInputCurrency } from '@/utils/formatCurrency';

interface OldContractData {
  change_type_name?: string;
  company_name?: string;
  office_name?: string;
  directorate_name?: string;
  division_name?: string;
  department_name?: string;
  unit_name?: string;
  position_name?: string;
  job_title_name?: string;
  structural_position_name?: string;
  position_level_name?: string;
  grade?: string;
  basic_salary?: string | number;
  employee_category_name?: string;
  old_contract_document?: string;
}

interface OldContractProps {
  data?: OldContractData;
  isEditing?: boolean;
  onChange?: (field: string, value: any) => void;
}

export default function OldContract({
  data = {},
  isEditing = false,
  onChange,
}: OldContractProps) {
  const handleInputChange = (field: string, value: any) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <PayrollCard
      title="Kontrak Lama"
      headerColor="green"
      border={false}
    >
      <div className="space-y-6">
        {/* Row 1: Kategori Karyawan, Perusahaan, Kantor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Kategori Karyawan"
            value={data?.employee_category_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('employee_category_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Perusahaan"
            value={data?.company_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('company_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Kantor"
            value={data?.office_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('office_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 2: Direktorat, Divisi, Departemen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Direktorat"
            value={data?.directorate_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('directorate_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Divisi"
            value={data?.division_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('division_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Departemen"
            value={data?.department_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('department_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 3: Unit, Position, Jabatan Kepangkatan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Unit"
            value={data?.unit_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('unit_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Position"
            value={data?.position_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('position_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Jabatan Kepangkatan"
            value={data?.job_title_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('job_title_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 4: Jabatan Struktural, Jenjang Jabatan, Golongan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Jabatan Struktural"
            value={data?.structural_position_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('structural_position_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Jenjang Jabatan"
            value={data?.position_level_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('position_level_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Golongan"
            value={data?.grade || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('grade', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 5: GAJI BERSIH (full width) */}
        <div className="grid grid-cols-1 gap-4">
          <InputField
            label="GAJI BERSIH"
            type="text"
            value={formatInputCurrency(String(data?.basic_salary || ''))}
            disabled={!isEditing}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, '');
              handleInputChange('basic_salary', cleaned);
            }}
            containerClassName="space-y-2"
          />
        </div>

      </div>
    </PayrollCard>
  );
}

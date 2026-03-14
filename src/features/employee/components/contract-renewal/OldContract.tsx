import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import { formatInputCurrency, formatCurrency, parseCurrency } from '@/utils/formatCurrency';
import SelectField from '@/components/shared/field/SelectField';
import { useMemo } from 'react';

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
  // Salary components
  gaji_pokok?: string | number;
  tunjangan_pernikahan?: string | number;
  tunjangan_jabatan?: string | number;
  tunjangan_lama_kerja?: string | number;
  tunjangan_diskresi?: Array<{ id: string; amount: number }>;
  gaji_bersih?: string | number;
}

interface OldContractProps {
  data?: OldContractData;
  isEditing?: boolean;
  onChange?: (field: string, value: any) => void;
  kategoriKaryawanOptions?: any[];
}

export default function OldContract({
  data = {},
  isEditing = false,
  onChange,
  kategoriKaryawanOptions = [],
}: OldContractProps) {
  const handleInputChange = (field: string, value: any) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  // Category checking logic
  const isNonStaffOrMitraCategory = useMemo(() => {
    // Try to find category name from ID using kategoriKaryawanOptions
    // If options are empty, use direct string comparison
    let categoryName: string | undefined;
    
    if (kategoriKaryawanOptions && kategoriKaryawanOptions.length > 0) {
      const categoryOption = kategoriKaryawanOptions.find(option => option.value === data?.employee_category_name);
      categoryName = categoryOption?.label?.toLowerCase();
    } else {
      // Fallback: use direct comparison if options are not available
      categoryName = data?.employee_category_name?.toLowerCase();
    }
    
    const result = categoryName?.includes('mitra') || categoryName?.includes('non staff') || categoryName === 'non-staff';
    return result;
  }, [data?.employee_category_name, kategoriKaryawanOptions]);

  // Dynamic salary label logic
  const salaryLabel = useMemo(() => {
    // Try to find category name from ID using kategoriKaryawanOptions
    // If options are empty, use direct string comparison
    let categoryName: string | undefined;
    
    if (kategoriKaryawanOptions && kategoriKaryawanOptions.length > 0) {
      const categoryOption = kategoriKaryawanOptions.find(option => option.value === data?.employee_category_name);
      categoryName = categoryOption?.label;
    } else {
      // Fallback: use direct comparison if options are not available
      categoryName = data?.employee_category_name;
    }
    
    let label = 'Gaji Pokok';
    if (categoryName?.toLowerCase() === 'non-staff' || categoryName?.toLowerCase()?.includes('non staff')) label = 'Uang Saku';
    if (categoryName?.toLowerCase() === 'mitra' || categoryName?.toLowerCase()?.includes('mitra')) label = 'Fee';
    return label;
  }, [data?.employee_category_name, kategoriKaryawanOptions]);

  return (
    <PayrollCard
      title="Kontrak Lama"
      headerColor="green"
      border={false}
    >
      <div className="space-y-6">
        {/* Row 1: Kategori Karyawan, Perusahaan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Row 2: Kantor, Direktorat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Kantor"
            value={data?.office_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('office_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Direktorat"
            value={data?.directorate_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('directorate_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 3: Divisi, Departemen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Row 4: Unit, Position */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Row 5: Jabatan Kepangkatan, Jabatan Struktural */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Jabatan Kepangkatan"
            value={data?.job_title_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('job_title_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Jabatan Struktural"
            value={data?.structural_position_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('structural_position_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 6: Jenjang Jabatan, Golongan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Row 7: Gaji Pokok, Tunjangan Pernikahan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={salaryLabel}
            type="text"
            value={formatInputCurrency(String(data?.gaji_pokok || ''))}
            disabled={!isEditing}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, '');
              handleInputChange('gaji_pokok', cleaned);
            }}
            containerClassName="space-y-2"
          />
          {!isNonStaffOrMitraCategory && (
            <InputField
              label="Tunjangan Pernikahan"
              type="text"
              value={formatInputCurrency(String(data?.tunjangan_pernikahan || ''))}
              disabled={!isEditing}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '');
                handleInputChange('tunjangan_pernikahan', cleaned);
              }}
              containerClassName="space-y-2"
            />
          )}
        </div>

        {/* Row 8: Tunjangan Jabatan, Tunjangan Lama Kerja */}
        {!isNonStaffOrMitraCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Tunjangan Jabatan"
              type="text"
              value={formatInputCurrency(String(data?.tunjangan_jabatan || ''))}
              disabled={!isEditing}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '');
                handleInputChange('tunjangan_jabatan', cleaned);
              }}
              containerClassName="space-y-2"
            />
            <InputField
              label="Tunjangan Lama Kerja"
              type="text"
              value={formatInputCurrency(String(data?.tunjangan_lama_kerja || ''))}
              disabled={!isEditing}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '');
                handleInputChange('tunjangan_lama_kerja', cleaned);
              }}
              containerClassName="space-y-2"
            />
          </div>
        )}

        {/* Row 9: Tunjangan Diskresi (Dynamic) */}
        {!isNonStaffOrMitraCategory && (
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-4">
              {data?.tunjangan_diskresi && data.tunjangan_diskresi.length > 0 ? (
                data.tunjangan_diskresi.map((allowance, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-6">
                      <SelectField
                        label="Jenis Tunjangan Diskresi"
                        options={[]} // TODO: Add diskresi options
                        defaultValue={allowance.id}
                        onChange={(value) => handleInputChange(`tunjangan_diskresi.${index}.id`, value)}
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
                          onChange={(e) => handleInputChange(`tunjangan_diskresi.${index}.amount`, parseCurrency(e.target.value) || 0)}
                          placeholder="Rp 0"
                          disabled={!isEditing}
                          containerClassName="space-y-2"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        )}

        {/* Row 10: Gaji Bersih (full width) */}
        <div className="grid grid-cols-1 gap-4">
          <InputField
            label="Gaji Bersih"
            type="text"
            value={formatInputCurrency(String(data?.gaji_bersih || ''))}
            disabled={!isEditing}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, '');
              handleInputChange('gaji_bersih', cleaned);
            }}
            containerClassName="space-y-2"
          />
        </div>

      </div>
    </PayrollCard>
  );
}

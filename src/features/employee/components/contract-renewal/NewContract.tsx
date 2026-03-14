import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import { formatInputCurrency, formatCurrency, parseCurrency } from '@/utils/formatCurrency';
import { useMemo } from 'react';

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
  kategoriKaryawanOptions?: any[];
}

export default function NewContract({
  data = {},
  isEditing = false,
  onChange,
  kategoriKaryawanOptions = [],
}: NewContractProps) {
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
      const categoryOption = kategoriKaryawanOptions.find(option => option.value === data?.new_employee_category_name);
      categoryName = categoryOption?.label?.toLowerCase();
    } else {
      // Fallback: use direct comparison if options are not available
      categoryName = data?.new_employee_category_name?.toLowerCase();
    }
    
    const result = categoryName?.includes('mitra') || categoryName?.includes('non staff') || categoryName === 'non-staff';
    return result;
  }, [data?.new_employee_category_name, kategoriKaryawanOptions]);

  // Dynamic salary label logic
  const salaryLabel = useMemo(() => {
    // Try to find category name from ID using kategoriKaryawanOptions
    // If options are empty, use direct string comparison
    let categoryName: string | undefined;
    
    if (kategoriKaryawanOptions && kategoriKaryawanOptions.length > 0) {
      const categoryOption = kategoriKaryawanOptions.find(option => option.value === data?.new_employee_category_name);
      categoryName = categoryOption?.label;
    } else {
      // Fallback: use direct comparison if options are not available
      categoryName = data?.new_employee_category_name;
    }
    
    let label = 'Gaji Pokok';
    if (categoryName?.toLowerCase() === 'non-staff' || categoryName?.toLowerCase()?.includes('non staff')) label = 'Uang Saku';
    if (categoryName?.toLowerCase() === 'mitra' || categoryName?.toLowerCase()?.includes('mitra')) label = 'Fee';
    return label;
  }, [data?.new_employee_category_name, kategoriKaryawanOptions]);

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

        {/* Row 6: Jabatan Struktural, Jenjang Jabatan, Golongan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <InputField
            label="Golongan"
            value={data?.new_grade || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_grade', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 7: Gaji Pokok, Tunjangan Pernikahan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Row 8: Tunjangan Jabatan, Tunjangan Lama Kerja */}
        {!isNonStaffOrMitraCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        )}

        {/* Row 9: Tunjangan Diskresi (Dynamic) */}
        {!isNonStaffOrMitraCategory && (
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-4">
              {data?.new_tunjangan_diskresi && data.new_tunjangan_diskresi.length > 0 ? (
                data.new_tunjangan_diskresi.map((allowance, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-6">
                      <SelectField
                        label="Jenis Tunjangan Diskresi"
                        options={[]} // TODO: Add diskresi options
                        defaultValue={allowance.id}
                        onChange={(value) => handleInputChange(`new_tunjangan_diskresi.${index}.id`, value)}
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
                          onChange={(e) => handleInputChange(`new_tunjangan_diskresi.${index}.amount`, parseCurrency(e.target.value) || 0)}
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

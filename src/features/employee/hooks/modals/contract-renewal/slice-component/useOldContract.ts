import { useMemo } from 'react';

type Params = {
  data?: {
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
  };
  isEditing?: boolean;
  onChange?: (field: string, value: any) => void;
  kategoriKaryawanOptions?: any[];
};

export function useOldContract({ data = {}, isEditing = false, onChange, kategoriKaryawanOptions = [] }: Params) {
  const handleInputChange = (field: string, value: any) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  // Category checking logic
  const isNonStaffOrMitraCategory = useMemo(() => {
    // Find category name from ID using kategoriKaryawanOptions
    const categoryOption = kategoriKaryawanOptions.find(option => option.value === data?.employee_category_name);
    const categoryName = categoryOption?.label?.toLowerCase();
    const result = categoryName?.includes('mitra') || categoryName?.includes('non staff') || categoryName === 'non-staff';
    return result;
  }, [data?.employee_category_name, kategoriKaryawanOptions]);

  const isStaffCategory = useMemo(() => {
    // Find category name from ID using kategoriKaryawanOptions
    const categoryOption = kategoriKaryawanOptions.find(option => option.value === data?.employee_category_name);
    const categoryName = categoryOption?.label?.toLowerCase();
    const result = categoryName?.includes('staff') || categoryName === 'staff';
    return result;
  }, [data?.employee_category_name, kategoriKaryawanOptions]);

  // Dynamic salary label logic
  const salaryLabel = useMemo(() => {
    // Find category name from ID using kategoriKaryawanOptions
    const categoryOption = kategoriKaryawanOptions.find(option => option.value === data?.employee_category_name);
    const categoryName = categoryOption?.label;
    let label = 'Gaji Pokok';
    if (categoryName?.toLowerCase() === 'non-staff' || categoryName?.toLowerCase().includes('non staff')) label = 'Uang Saku';
    if (categoryName?.toLowerCase() === 'mitra' || categoryName?.toLowerCase().includes('mitra')) label = 'Fee';
    return label;
  }, [data?.employee_category_name, kategoriKaryawanOptions]);

  
  return {
    isEditing,
    data,
    isNonStaffOrMitraCategory,
    isStaffCategory,
    salaryLabel,
    handleInputChange,
  };
}

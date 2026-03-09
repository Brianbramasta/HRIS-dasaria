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
  };
  isEditing?: boolean;
  onChange?: (field: string, value: any) => void;
};

export function useOldContract({ data = {}, isEditing = false, onChange }: Params) {
  const handleInputChange = (field: string, value: any) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return {
    isEditing,
    data,
    handleInputChange,
  };
}

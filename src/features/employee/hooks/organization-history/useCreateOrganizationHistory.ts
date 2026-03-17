import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApiOrganizationChange } from '@/features/employee/hooks/api/useApiOrganizationChange';
import { useEditOrganizationHistoryModal } from '@/features/employee/hooks/modals/organization-history/useEditOrganizationHistoryModal';
import { useApiPayrollPreview } from '@/features/employee/hooks/api/useApiPayrollPreview';
import { payrollPreviewService } from '@/features/employee/services/PayrollPreviewService';
import { formatIndonesianToISO, formatDateToISO } from '@/utils/formatDate';

export const useCreateOrganizationHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isFromAtasan = searchParams.get('mode') === 'atasan';

  // API Hook
  const {
    storeOrganizationChange,
    fetchOrganizationChangesByEmployee,
  } = useApiOrganizationChange();

  // Modal state for add mode
  const addState = useEditOrganizationHistoryModal({ isOpen: true, initialData: null });

  // Local state
  const [detailForm, setDetailForm] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nonFixAllowances, setNonFixAllowances] = useState<Array<{ id: string; amount: number }>>([{ id: '', amount: 0 }]);
  const [salaryFields, setSalaryFields] = useState({
    gaji_pokok: '',
    tunjangan_pernikahan: '',
    tunjangan_jabatan: '',
    tunjangan_lama_kerja: '',
    gaji_bersih: '',
  });
  const [prevSalaryFields, setPrevSalaryFields] = useState({
    gaji_pokok: '',
    tunjangan_pernikahan: '',
    tunjangan_jabatan: '',
    tunjangan_lama_kerja: '',
    gaji_bersih: '',
  });
  const [maritalStatus, setMaritalStatus] = useState<string>('Tidak Menikah');
  const [dependents, setDependents] = useState<number>(0);

  // API Hooks
  const { nonFixAllowanceOptions, fetchNonFixAllowanceDropdown } = useApiPayrollPreview();

  // Computed values
  const title = 'Tambah Perubahan Organisasi';
  const disableAll = false;
  const infoSalaryLabel = 'Gaji Pokok';

  // Category checks
  const isNonStaffOrMitraCategory = useMemo(() => {
    if (!detailForm.employee_category_id) return false;
    const categoryOption = addState.kategoriKaryawanOptions.find(
      (option) => String(option.value) === String(detailForm.employee_category_id),
    );
    const categoryName = categoryOption?.label?.toLowerCase();
    return (
      categoryName?.includes('mitra') ||
      categoryName?.includes('non staff') ||
      categoryName === 'non-staff'
    );
  }, [detailForm.employee_category_id, addState.kategoriKaryawanOptions]);

  const isStaffCategory = useMemo(() => {
    if (!detailForm.employee_category_id) return false;
    const categoryOption = addState.kategoriKaryawanOptions.find(
      (option) => String(option.value) === String(detailForm.employee_category_id),
    );
    const categoryName = categoryOption?.label?.toLowerCase();
    return categoryName?.includes('staff') || categoryName === 'staff';
  }, [detailForm.employee_category_id, addState.kategoriKaryawanOptions]);

  // Dynamic salary label logic
  const salaryLabel = useMemo(() => {
    const categoryOption = addState.kategoriKaryawanOptions.find(
      (option) => String(option.value) === String(detailForm.employee_category_id),
    );
    const categoryName = categoryOption?.label;
    let label = 'Gaji Pokok';
    if (
      categoryName?.toLowerCase() === 'non-staff' ||
      categoryName?.toLowerCase().includes('non staff')
    )
      label = 'Uang Saku';
    if (
      categoryName?.toLowerCase() === 'mitra' ||
      categoryName?.toLowerCase().includes('mitra')
    )
      label = 'Fee';
    return label;
  }, [detailForm.employee_category_id, addState.kategoriKaryawanOptions]);

  // Diskresi options for dropdown
  const diskresiOptions = useMemo(() => 
    (nonFixAllowanceOptions || []).map((opt: any) => ({
      label: opt.allowance_name,
      value: opt.id,
    })), [nonFixAllowanceOptions]);

  // Fetch non-fix allowance dropdown when component renders or category is staff
  useEffect(() => {
    fetchNonFixAllowanceDropdown();
  }, [fetchNonFixAllowanceDropdown]);

  useEffect(() => {
    if (isStaffCategory) {
      fetchNonFixAllowanceDropdown();
    }
  }, [isStaffCategory, fetchNonFixAllowanceDropdown]);

  // Payroll preview effect: trigger when IDs are filled
  useEffect(() => {
    const fetchPayrollPreview = async () => {
      // Only run when these three mandatory IDs are present
      if (
        !detailForm.job_title_id ||
        !detailForm.position_level_id ||
        !detailForm.employee_category_id
      )
        return;

      try {
        const params = {
          job_title_id: detailForm.job_title_id,
          Position_level_id: detailForm.position_level_id,
          employee_categories_id: detailForm.employee_category_id || '',
          category: maritalStatus, // Dynamic from employee data
          dependents: Number(dependents) || 0, // Dynamic from employee data
        };

        const res = await payrollPreviewService.getPreviewPayroll(params);
        const pp = res.data;

        setSalaryFields((prev) => ({
          ...prev,
          gaji_pokok: String(pp.basic_salary || 0),
          tunjangan_jabatan: String(pp.position_allowance || 0),
          tunjangan_pernikahan: String(pp.marital_allowance || 0),
          tunjangan_lama_kerja: String(pp.length_of_service_allowance || 0),
        }));
      } catch (err) {
        console.error('Failed to fetch payroll preview', err);
      }
    };

    fetchPayrollPreview();
  }, [
    detailForm.job_title_id,
    detailForm.position_level_id,
    detailForm.employee_category_id,
    maritalStatus,
    dependents,
  ]);

  // Calculate Gaji Bersih when salary components change
  useEffect(() => {
    if (!salaryFields.gaji_pokok) return; // wait for basic salary to be calculated

    // Calculate total tunjangan diskresi
    const totalTunjanganDiskresi = nonFixAllowances
      .filter(item => item.id && item.amount > 0)
      .reduce((total, item) => total + (item.amount || 0), 0);

    const gajiBersih =
      Number(salaryFields.gaji_pokok || 0) +
      Number(salaryFields.tunjangan_lama_kerja || 0) +
      Number(salaryFields.tunjangan_pernikahan || 0) +
      Number(salaryFields.tunjangan_jabatan || 0) +
      totalTunjanganDiskresi;

    setSalaryFields((prev) => ({ ...prev, gaji_bersih: String(gajiBersih) }));
  }, [
    salaryFields.gaji_pokok,
    salaryFields.tunjangan_lama_kerja,
    salaryFields.tunjangan_pernikahan,
    salaryFields.tunjangan_jabatan,
    nonFixAllowances,
  ]);

  // Event handlers
  const handleInput = useCallback((field: string, value: any) => {
    setDetailForm((prev: any) => {
      const next = { ...prev, [field]: value };
      
      // Store change_type_name when change_type_id is selected
      if (field === 'change_type_id') {
        const selectedOption = addState.changeTypeOptions.find(opt => String(opt.value) === String(value));
        next.change_type_name = selectedOption?.label || '';
      }
      
      // Cascading logic: reset children when parent changes
      if (field === 'company_id') {
        next.office_id = '';
      }
      if (field === 'directorate_id') {
        next.division_id = '';
        next.department_id = '';
        next.unit_id = '';
      }
      if (field === 'division_id') {
        next.department_id = '';
        next.unit_id = '';
      }
      if (field === 'department_id') {
        next.unit_id = '';
      }
      if (field === 'job_title_id') {
        next.structural_job_id = '';
      }
      
      return next;
    });
    
    // Also update the state in the modal hook to trigger its effects (like cascading selects)
    if (addState.setForm) {
      addState.setForm((prev: any) => {
        const next = { ...prev, [field]: value };
        
        // Cascading logic for modal hook state
        if (field === 'company_id') {
          next.office_id = '';
        }
        if (field === 'directorate_id') {
          next.division_id = '';
          next.department_id = '';
          next.unit_id = '';
        }
        if (field === 'division_id') {
          next.department_id = '';
          next.unit_id = '';
        }
        if (field === 'department_id') {
          next.unit_id = '';
        }
        if (field === 'job_title_id') {
          next.structural_job_id = '';
        }
        
        return next;
      });
    }
  }, [addState.setForm, addState.changeTypeOptions]);

  const handleNIPChange = useCallback(async (nip: string) => {
    setDetailForm((prev: any) => ({ ...prev, nip }));
    
    if (!nip) return;
    
    try {
      // Fetch employee data by NIP using the hook action
      const employeeData = await fetchOrganizationChangesByEmployee(nip);
      
      if (employeeData) {
        const data = employeeData;
        // Update marital_status and dependents for payroll calculation
        const newMaritalStatus = data.marital_status || "Tidak Menikah";
        const newDependents = Number(data.dependents) || 0;
        
        setMaritalStatus(newMaritalStatus);
        setDependents(newDependents);
        
        // Populate Informasi Karyawan fields from previous_position
        const prev = data.previous_position;
        setDetailForm((prevForm: any) => ({
          ...prevForm,
          employee_id: data.employee_id,
          nama: data.employee_name,
          // Previous position info for "Informasi Karyawan" section
          prev_employee_category: prev.employee_category,
          prev_employee_category_id: prev.employee_category_id,
          prev_company: prev.company,
          prev_office: prev.office, 
          prev_directorate: prev.directorate,
          prev_division: prev.division,
          prev_department: prev.department,
          prev_unit: prev.unit,
          prev_position: prev.position,
          prev_rank_position: prev.rank_position,
          prev_structural_position: prev.structural_position,
          prev_position_level: prev.position_level,
          prev_golongan: prev.grade,
          prev_tunjangan_dekresi_id: prev.tunjangan_dekresi?.[0]?.id || '',
          prev_tunjangan_dekresi_amount: prev.tunjangan_dekresi?.[0]?.amount || 0,

          // Initialize new position fields with current values to trigger payrollpreview if needed
          // or just to provide a starting point for the user.
          // Based on user request to "fetch payrollpreview juga", we set these:
          job_title_id: prev.rank_position_id || '', 
          position_level_id: prev.position_level_id || '',
          employee_category_id: prev.employee_category_id || '',
        }));
        
        // Update salary fields for "Informasi Karyawan" with data from previous_position
        const calculatedTakeHomePay = Number(prev.gaji_pokok || 0) + 
          Number(prev.tunjangan_pernikahan || 0) + 
          Number(prev.tunjangan_jabatan || 0) + 
          Number(prev.tunjangan_lama_kerja || 0) + 
          (prev.tunjangan_dekresi?.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0) || 0);
        
        setPrevSalaryFields({
          gaji_pokok: String(prev.gaji_pokok || 0),
          tunjangan_pernikahan: String(prev.tunjangan_pernikahan || 0),
          tunjangan_jabatan: String(prev.tunjangan_jabatan || 0),
          tunjangan_lama_kerja: String(prev.tunjangan_lama_kerja || 0),
          gaji_bersih: String(calculatedTakeHomePay),
        });
        
        // Reset new salary fields
        setSalaryFields({
          gaji_pokok: '',
          tunjangan_pernikahan: '',
          tunjangan_jabatan: '',
          tunjangan_lama_kerja: '',
          gaji_bersih: '',
        });
        
        // Set non-fix allowances for old data if needed (UI only shows first one)
        if (prev.tunjangan_dekresi && prev.tunjangan_dekresi.length > 0) {
          // This will be used for "Informasi Karyawan" UI
          // For "Detail Perubahan" we keep it empty or initialize it
          setNonFixAllowances([{ id: '', amount: 0 }]);
        } else {
          setNonFixAllowances([{ id: '', amount: 0 }]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch employee data:', error);
    }
  }, [fetchOrganizationChangesByEmployee]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Robustly find change_type_name
      let changeTypeName = detailForm.change_type_name || '';
      if (!changeTypeName && detailForm.change_type_id) {
        const selectedOption = addState.changeTypeOptions.find(
          (opt) => String(opt.value) === String(detailForm.change_type_id)
        );
        changeTypeName = selectedOption?.label || '';
      }

      // Format effective_date to yyyy-mm-dd using utility
      let formattedDate = detailForm.efektif_date || '';
      if (formattedDate) {
        // If it's dd/mm/yyyy
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(formattedDate)) {
          formattedDate = formatDateToISO(formattedDate);
        } 
        // If it's Indonesian format DD Month YYYY
        else if (/[a-zA-Z]/.test(formattedDate)) {
          formattedDate = formatIndonesianToISO(formattedDate);
        }
        // If it's already YYYY-MM-DD (ISO), it stays as is
      }

      const payload = {
        employee_id: detailForm.employee_id,
        org_change_type: isFromAtasan ? 'recomendation' : 'hr',
        change_type_id: detailForm.change_type_id,
        change_type_name: changeTypeName,
        effective_date: formattedDate,
        employee_category_id: detailForm.employee_category_id,
        company_id: detailForm.company_id,
        position_level_id: detailForm.position_level_id,
        office_id: detailForm.office_id,
        directorate_id: detailForm.directorate_id,
        division_id: detailForm.division_id,
        department_id: detailForm.department_id,
        job_title_id: detailForm.job_title_id,
        structural_job_id: detailForm.structural_job_id,
        position_id: detailForm.position_id,
        unit_id: detailForm.unit_id,
        non_fix_allowance: nonFixAllowances.filter(item => item.id && item.amount > 0).map(item => ({
          id: item.id,
          non_fix_allowance_id: item.id,
          allowance_name: '',
          amount: item.amount
        })),
        gaji_pokok: Number(salaryFields.gaji_pokok) || 0,
        tunjangan_pernikahan: Number(salaryFields.tunjangan_pernikahan) || 0,
        tunjangan_jabatan: Number(salaryFields.tunjangan_jabatan) || 0,
        tunjangan_lama_kerja: Number(salaryFields.tunjangan_lama_kerja) || 0,
        gaji_bersih: Number(salaryFields.gaji_bersih) || 0,
        reason: detailForm.reason,
        decree_file: addState.form.skFile || undefined,
        adendum_file: addState.form.adendumFile || undefined,
        recommended_by: undefined,
        created_by: undefined,
      };

      const success = await storeOrganizationChange(payload);
      if (success) {
        navigate('/organization-history');
      }
    } catch (error) {
      console.error('Error creating organization change:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [detailForm, nonFixAllowances, storeOrganizationChange, navigate, salaryFields, addState.form]);

  const addNonFixAllowance = useCallback(() => {
    setNonFixAllowances(prev => [...prev, { id: '', amount: 0 }]);
  }, []);

  const removeNonFixAllowance = useCallback((index: number) => {
    setNonFixAllowances(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateNonFixAllowance = useCallback((index: number, field: string, value: any) => {
    setNonFixAllowances(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  }, []);

  return {
    navigate,
    addState,
    detailForm,
    isSubmitting,
    nonFixAllowances,
    salaryFields,
    prevSalaryFields,
    title,
    disableAll,
    infoSalaryLabel,
    isNonStaffOrMitraCategory,
    isStaffCategory,
    salaryLabel,
    diskresiOptions,
    isFromAtasan,
    handleInput,
    handleNIPChange,
    handleSubmit,
    addNonFixAllowance,
    removeNonFixAllowance,
    updateNonFixAllowance,
    setSalaryFields,
  };
};

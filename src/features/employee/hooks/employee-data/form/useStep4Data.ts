import { useState, useEffect, useMemo } from 'react';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import { getBankDropdownOptions, getEmployeeCategoryDropdownOptions, getBpjsHealthTypeDropdownOptions } from './useFormulirKaryawan';
import { useAuthStore } from '@/features/auth/stores/AuthStore';
import { useApiPayrollPreview } from '../../api/useApiPayrollPreview';
import { NonFixAllowancePayload, PreviewPayrollQueryParams } from '../../../types/dto/PayrollPreviewType';

// digunakan di form 4
export const useStep4Data = (isOpen?: boolean) => {
  const [bankOptions, setBankOptions] = useState<any[]>([]);
  const [categoriKaryawanOptions, setCategoriKaryawanOptions] = useState<any[]>([]);
  const [bpjsHealthTypeOptions, setBpjsHealthTypeOptions] = useState<any[]>([]);
  const { formData, updateStep3 } = useFormulirKaryawanStore();
  const step3 = formData.step3;
  const step1 = formData.step1;
  const step3Employee = formData.step3Employee;

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // API Hooks
  const {
    fetchPreviewPayroll,
    fetchNonFixAllowanceDropdown,
    previewData,
    nonFixAllowanceOptions,
  } = useApiPayrollPreview();

  // State for Non-Fixed Allowances
  const nonFixAllowances = step3.nonFixAllowances || [{ id: '', amount: 0 }];

  useEffect(() => {
    if (isOpen === false) return;
    
    let mounted = true;
    getBankDropdownOptions().then((opts:any) => { if (mounted) setBankOptions(opts); }).catch(() => {});
    getEmployeeCategoryDropdownOptions().then((opts:any) => { if (mounted) setCategoriKaryawanOptions(opts); }).catch(() => {});
    getBpjsHealthTypeDropdownOptions().then((opts:any) => { if (mounted) setBpjsHealthTypeOptions(opts); }).catch(() => {});
    return () => { mounted = false; };
  }, [isOpen]);

  // Fetch Non-Fix Allowance Dropdown
  useEffect(() => {
    if (isAuthenticated && isOpen !== false) {
      fetchNonFixAllowanceDropdown();
    }
  }, [fetchNonFixAllowanceDropdown, isAuthenticated, isOpen]);

  // Fetch Payroll Preview
  useEffect(() => {
    if (isOpen === false) return;

    const { statusMenikah, jumlahTanggungan } = step1;
    const { jenjangJabatan, jabatan, kategoriKaryawan } = step3Employee;

    if (statusMenikah) {
      const params: PreviewPayrollQueryParams = {
        Position_level_id: jenjangJabatan || '',
        category: statusMenikah,
        dependents: Number(jumlahTanggungan) || 0,
        job_title_id: jabatan || '',
        employee_categories_id: kategoriKaryawan || '',
      };
      console.log(params, ' params');
      fetchPreviewPayroll(params);
    }
  }, [
    step1.statusMenikah,
    step1.jumlahTanggungan,
    step3Employee.jenjangJabatan,
    step3Employee.jabatan,
    step3Employee.kategoriKaryawan,
    fetchPreviewPayroll,
    isOpen
  ]);

  // Store ptkpId in form data when preview data is available
  useEffect(() => {
    if (previewData?.ptkpId) {
      updateStep3({ ptkpStatus: previewData.ptkpId } as any);
    }
  }, [previewData?.ptkpId, updateStep3]);

  // Calculate Net Salary Manually
  const netSalary = useMemo(() => {
    const base = previewData?.salary ?? 0;
    //console.log('step3Employee.kategoriKaryawan:', step3Employee?.kategoriKaryawan, 'base salary:', base);
    const category = categoriKaryawanOptions.find((opt: any) => opt.value === step3Employee.kategoriKaryawan);
    //console.log('category:', category);

    const additional = category?.label === 'Staff' ? nonFixAllowances.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) : 0;
    
    return base + additional;
  }, [previewData?.salary, nonFixAllowances, categoriKaryawanOptions, step3Employee.kategoriKaryawan]);

  const handleChange = (field: string, value: string) => {
    updateStep3({ [field]: value } as any);
  };

  // Handlers for Non-Fix Allowances
  const addNonFixAllowance = () => {
    const newAllowances = [...nonFixAllowances, { id: '', amount: 0 }];
    updateStep3({ nonFixAllowances: newAllowances } as any);
  };

  const removeNonFixAllowance = (index: number) => {
    const newAllowances = [...nonFixAllowances];
    newAllowances.splice(index, 1);
    updateStep3({ nonFixAllowances: newAllowances } as any);
  };

  const updateNonFixAllowance = (index: number, field: keyof NonFixAllowancePayload, value: any) => {
    const newAllowances = [...nonFixAllowances];
    newAllowances[index] = { ...newAllowances[index], [field]: value };
    updateStep3({ nonFixAllowances: newAllowances } as any);
  };

  return { 
    bankOptions,
    categoriKaryawanOptions,
    bpjsHealthTypeOptions,
    step3,
    step1,
    step3Employee,
    isAuthenticated,
    previewData,
    nonFixAllowanceOptions,
    nonFixAllowances,
    netSalary,
    handleChange,
    addNonFixAllowance,
    removeNonFixAllowance,
    updateNonFixAllowance
  };
};

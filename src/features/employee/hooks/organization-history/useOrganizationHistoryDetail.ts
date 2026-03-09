import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOrganizationChange } from '@/features/employee/hooks/organization-history/useOrganizationChange';
import { useEditOrganizationHistoryModal } from '@/features/employee/hooks/modals/organization-history/useEditOrganizationHistoryModal';
import type { OrganizationChangeForm } from '@/features/employee/hooks/modals/organization-history/useEditOrganizationHistoryModal';
import { Karyawan } from '@/features/employee/types/dto/EmployeeType';

export function useOrganizationHistoryDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '';
  const mode = searchParams.get('mode') || '';
  const isAddMode = mode === 'add' || !id;

  const baseTitle = useMemo(() => 'Detail Perubahan Organisasi', []);

  const addState = useEditOrganizationHistoryModal({ isOpen: isAddMode, initialData: null });
  const { getDetail, createOrganizationChange, isSubmitting } = useOrganizationChange({ autoFetch: false });

  const [detailForm, setDetailForm] = useState<OrganizationChangeForm>({});
  const [displayForm, setDisplayForm] = useState<any>({});
  const [currentEmployee, setCurrentEmployee] = useState<Karyawan | null>(null);
  const [status, setStatus] = useState<string>('');

  const [nonFixAllowances, setNonFixAllowances] = useState<Array<{ id: string; amount: number }>>([{ id: '', amount: 0 }]);
  const [salaryFields, setSalaryFields] = useState({
    gaji_pokok: '',
    tunjangan_pernikahan: '',
    tunjangan_jabatan: '',
    tunjangan_lama_kerja: '',
    gaji_bersih: '',
  });

  useEffect(() => {
    const loadDetail = async () => {
      if (isAddMode) return;
      if (!id) return;
      const data = await getDetail(id);
      if (!data) return;
      const raw = data as any;

      const mapped: OrganizationChangeForm = {
        id: data.id,
        employee_id: data.employee_id || data.nip,
        nama: raw.name || '',
        nip: data.nip,
        change_type_id: data.change_type_id,
        efektif_date: data.efektif_date,
        company_id: data.new_company_id || '',
        office_id: data.new_office_id || '',
        directorate_id: data.new_directorate_id || '',
        division_id: data.new_division_id || '',
        department_id: data.new_department_id || '',
        position_id: data.new_position_id || '',
        job_title_id: data.new_job_title_id || '',
        structural_job_id: raw.new_structural_job_id || '',
        position_level_id: data.new_position_level_id || '',
        employee_category_id: data.new_employee_category_id || '',
        reason: data.reason,
        decree_file: data.decree_file || '',
        unit_id: raw.new_unit_id || '',
        previous_salary: raw.previous_salary || 0,
        new_salary: raw.new_salary || 0,
      };

      setDetailForm(mapped);
      setStatus(data.status);

      setDisplayForm({
        change_type_name: raw.change_type_name || '-',
        employee_category_name: raw.new_employee_category_name || '-',
        company_name: raw.new_company_name || '-',
        office_name: raw.new_office_name || '-',
        directorate_name: raw.new_directorate_name || '-',
        division_name: raw.new_division_name || '-',
        department_name: raw.new_department_name || '-',
        unit_name: raw.new_unit_name || '-',
        position_name: raw.new_position_name || '-',
        job_title_name: raw.new_job_title_name || '-',
        structural_job_name: raw.new_structural_job_name || '-',
        position_level_name: raw.new_position_level_name || '-',
        golongan: '-',
        previous_salary: raw.previous_salary || 0,
        new_salary: raw.new_salary || 0,
      });

      setCurrentEmployee({
        id: raw.employee_id || raw.nip,
        full_name: raw.name,
        employee_category: raw.previous_employee_category_name || '-',
        company_name: raw.previous_company_name || '-',
        office_name: raw.previous_office_name || '-',
        directorate_name: raw.previous_directorate_name || '-',
        division_name: raw.previous_division_name || '-',
        department_name: raw.previous_department_name || '-',
        unit: raw.previous_unit_name || '-',
        position_name: raw.previous_position_name || '-',
        job_title_name: raw.previous_job_title_name || '-',
        structural_job: raw.previous_structural_job_name || '-',
        position_level: raw.previous_position_level_name || '-',
        grade: '-',
      } as any);
    };

    loadDetail();
  }, [id, getDetail, isAddMode]);

  const title = useMemo(() => {
    return isAddMode ? 'Tambah Organisasi' : baseTitle;
  }, [isAddMode, baseTitle]);

  const form = isAddMode ? addState.form : detailForm;
  const detailDisplayForm = isAddMode ? null : displayForm;
  const selectedEmployee = isAddMode ? addState.currentEmployee : currentEmployee;

  const handleDetailInput = useCallback((key: keyof OrganizationChangeForm, value: any) => {
    setDetailForm((prev) => ({ ...prev, [key]: value }));
  }, []);
  const handleInput = isAddMode ? addState.handleInput : handleDetailInput;

  const disableAll = !isAddMode;

  const currency = useCallback((val?: number) => {
    return val ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val) : '';
  }, []);

  const diskresiOptions = useMemo(
    () => [
      { label: 'Tunjangan Profesional', value: 'tunjangan_profesional' },
      { label: 'Tunjangan Tidak Tetap', value: 'tunjangan_tidak_tetap' },
    ],
    []
  );

  const getCategoryLabel = useMemo(() => {
    if (isAddMode) {
      if (!(form as any)?.employee_category_id || !addState.kategoriKaryawanOptions?.length) return null;
      const selected = addState.kategoriKaryawanOptions.find((opt: any) => opt.value === (form as any).employee_category_id);
      return selected?.label || null;
    }
    return (detailDisplayForm as any)?.employee_category_name || null;
  }, [isAddMode, form, addState.kategoriKaryawanOptions, detailDisplayForm]);

  const isStaffCategory = getCategoryLabel === 'Staff';
  const isStaffCurrentEmployee = (selectedEmployee as any)?.employee_category === 'Staff';
  const isNonStaffOrMitraCategory = getCategoryLabel === 'Non-Staff' || getCategoryLabel === 'Mitra';

  const infoEmployeeCategory = (selectedEmployee as any)?.employee_category || null;
  const isNonStaffOrMitraInfoEmployee = infoEmployeeCategory === 'Non-Staff' || infoEmployeeCategory === 'Mitra';

  const infoSalaryLabel = useMemo(() => {
    if (infoEmployeeCategory === 'Non-Staff') return 'Uang Saku';
    if (infoEmployeeCategory === 'Mitra') return 'Fee';
    return 'Gaji Pokok';
  }, [infoEmployeeCategory]);

  const salaryLabel = useMemo(() => {
    if (getCategoryLabel === 'Non-Staff') return 'Uang Saku';
    if (getCategoryLabel === 'Mitra') return 'Fee';
    return 'Gaji Pokok';
  }, [getCategoryLabel]);

  const addNonFixAllowance = useCallback(() => {
    setNonFixAllowances((prev) => [...prev, { id: '', amount: 0 }]);
  }, []);

  const removeNonFixAllowance = useCallback((index: number) => {
    setNonFixAllowances((prev) => prev.filter((_v, i) => i !== index));
  }, []);

  const updateNonFixAllowance = useCallback((index: number, key: 'id' | 'amount', value: any) => {
    setNonFixAllowances((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isAddMode) return;
    const payload = {
      employee_id: (form as any)?.employee_id || '',
      change_type_id: (form as any)?.change_type_id || '',
      efektif_date: (form as any)?.efektif_date || '',
      reason: (form as any)?.reason || '',
      company_id: (form as any)?.company_id || '',
      office_id: (form as any)?.office_id || '',
      directorate_id: (form as any)?.directorate_id || '',
      division_id: (form as any)?.division_id || '',
      department_id: (form as any)?.department_id || '',
      job_title_id: (form as any)?.job_title_id || '',
      structural_job_id: (form as any)?.structural_job_id || '',
      position_id: (form as any)?.position_id || '',
      position_level_id: (form as any)?.position_level_id || '',
      employee_category_id: (form as any)?.employee_category_id || '',
      unit_id: (form as any)?.unit_id || '',
      decree_file: (form as any)?.skFile ?? null,
      approved_by: 'di approve manual tanpa login ',
      recommended_by: 'di approve manual tanpa login ',
    };
    const ok = await createOrganizationChange(null, payload as any);
    if (ok) navigate(-1);
  }, [createOrganizationChange, form, isAddMode, navigate]);

  return {
    id,
    mode,
    isAddMode,
    title,
    form,
    displayForm: detailDisplayForm,
    currentEmployee: selectedEmployee,
    handleInput,
    status,
    disableAll,
    currency,
    diskresiOptions,
    getCategoryLabel,
    isStaffCategory,
    isStaffCurrentEmployee,
    isNonStaffOrMitraCategory,
    infoEmployeeCategory,
    isNonStaffOrMitraInfoEmployee,
    infoSalaryLabel,
    salaryLabel,
    nonFixAllowances,
    salaryFields,
    setSalaryFields,
    addNonFixAllowance,
    removeNonFixAllowance,
    updateNonFixAllowance,
    handleSubmit,
    isSubmitting,
    addState,
    navigate,
  };
}

export default useOrganizationHistoryDetail;

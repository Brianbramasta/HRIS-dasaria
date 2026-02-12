import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOrganizationChange } from '@/features/employee/hooks/organization-history/useOrganizationChange';
import type { OrganizationChangeForm } from '@/features/employee/hooks/modals/organization-history/useEditOrganizationHistoryModal';
import { Karyawan } from '@/features/employee/types/dto/EmployeeType';

type Params = {
  id: string;
};

export function useOrganizationHistoryDetail({ id }: Params) {
  const title = useMemo(() => 'Detail Perubahan Organisasi', []);
  const { getDetail } = useOrganizationChange({ autoFetch: false });

  const [form, setForm] = useState<OrganizationChangeForm>({});
  const [displayForm, setDisplayForm] = useState<any>({});
  const [currentEmployee, setCurrentEmployee] = useState<Karyawan | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const loadDetail = async () => {
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
      setForm(mapped);
      setStatus(data.status);

      // Map display values (names) from the response
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

      // Map current employee data
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
  }, [id, getDetail]);

  const handleInput = useCallback((key: keyof OrganizationChangeForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  return {
    title,
    form,
    displayForm,
    currentEmployee,
    handleInput,
    status,
  };
}

export default useOrganizationHistoryDetail;

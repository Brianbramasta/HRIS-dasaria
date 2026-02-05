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

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      const data = await getDetail(id);
      if (!data) return;
      const raw = data as any;
      
      const mapped: OrganizationChangeForm = {
        id: data.id,
        employee_id: data.employee_id,
        nama: raw.employee?.full_name || raw.full_name || '',
        nip: data.employee_id,
        change_type_id: data.change_type_id,
        efektif_date: data.efektif_date,
        company_id: data.company_id,
        office_id: data.office_id,
        directorate_id: data.directorate_id,
        division_id: data.division_id,
        department_id: data.department_id,
        position_id: data.position_id,
        job_title_id: data.job_title_id,
        structural_job_id: raw.structural_job_id || '',
        position_level_id: data.position_level_id,
        employee_category_id: data.employee_category_id,
        reason: data.reason,
        decree_file: data.decree_file || '',
        unit_id: raw.unit_id || '',
      };
      setForm(mapped);

      // Map display values (names) from the response
      // Assuming the API returns nested objects or name fields
      setDisplayForm({
        change_type_name: raw.change_type?.name || raw.jenis_perubahan || '-',
        employee_category_name: raw.employee_category?.name || raw.kategori_karyawan_baru || '-',
        company_name: raw.company?.name || raw.perusahaan_baru || '-',
        office_name: raw.office?.name || raw.kantor_baru || '-',
        directorate_name: raw.directorate?.name || raw.direktorat_baru || '-',
        division_name: raw.division?.name || raw.divisi_baru || '-',
        department_name: raw.department?.name || raw.departemen_baru || '-',
        unit_name: raw.unit?.name || raw.unit_baru || '-',
        position_name: raw.position?.name || raw.posisi_baru || '-',
        job_title_name: raw.job_title?.name || raw.jabatan_baru || '-',
        structural_job_name: raw.structural_job?.name || raw.jabatan_struktural_baru || '-',
        position_level_name: raw.position_level?.name || raw.jenjang_jabatan_baru || '-',
        golongan: raw.job_title?.grade || raw.grade || '-',
      });

      // Map current employee data if available in response
      if (raw.employee) {
          setCurrentEmployee(raw.employee);
      } else {
          // Fallback or partial mapping
          setCurrentEmployee({
              id: raw.employee_id,
              full_name: raw.full_name,
          } as any);
      }
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
  };
}

export default useOrganizationHistoryDetail;

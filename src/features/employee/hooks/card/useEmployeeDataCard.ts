import { useMemo } from 'react';
import { useModal } from '@/hooks/useModal';
import { useParams } from 'react-router-dom';
import { type EmployeeDataForm } from '@/features/employee/components/modals/employee-data/personal-information/EmployeeDataModal';
import usePersonalInformation from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';

export default function useEmployeeDataCard(data: any) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const { id } = useParams<{ id: string }>();
  const { updateEmploymentPosition } = usePersonalInformation(id);

  const initialForm: EmployeeDataForm = useMemo(() => {
    return {
      company_id: data?.company_id || '',
      office_id: data?.office_id || '',
      directorate_id: data?.directorate_id || '',
      division_id: data?.division_id || '',
      department_id: data?.department_id || '',
      position_id: data?.position_id || '',
      job_title_id: data?.job_title_id || '',
      start_date: data?.start_date || '',
      end_date: data?.end_date || '',
      golongan: data?.grade || '',
      employment_status_id: data?.employment_status_id || '',
      employment_status: data?.employment_status || '',
      payroll_status: data?.payroll_status || '',
      employee_category_id: data?.employee_category_id || '',
      position_level_id: data?.position_level_id || '',
    };
  }, [data]);

  const isComplete = useMemo(() => {
    return !!(
      data?.company_name &&
      data?.department_name &&
      data?.start_date &&
      data?.office_name &&
      data?.employment_status &&
      data?.payroll_status &&
      data?.employee_category &&
      data?.position_level
    );
  }, [data]);

  const isEditHidden = useMemo(() => {
    const base = initialForm || {};
    const values = Object.values(base || {});
    const allEmpty = values.length === 0 || values.every((v) => v === undefined || v === null || v === '');
    const requiredKeys: Array<keyof EmployeeDataForm> = [
      'employment_status_id',
      'start_date',
      'company_id',
      'office_id',
      'directorate_id',
      'division_id',
      'department_id',
      'position_id',
      'job_title_id',
      'position_level_id',
      'employee_category_id',
    ];
    const missingRequired = requiredKeys.some((k) => {
      const v = (base as any)?.[k];
      return v === undefined || v === null || v === '';
    });
    return base?.employment_status === 'Aktif' || allEmpty || !missingRequired;
  }, [initialForm]);

  const handleSubmit = async (payload: EmployeeDataForm) => {
    if (!id) return;
    await updateEmploymentPosition(id || '', payload);
    closeModal();
  };

  return {
    isOpen,
    openModal,
    closeModal,
    initialForm,
    isComplete,
    isEditHidden,
    handleSubmit,
  };
}

import { useMemo } from 'react';
import { useModal } from '@/hooks/useModal';
import { useParams } from 'react-router-dom';
import { type EmployeeDataForm } from '@/features/employee/components/modals/employee-data/personal-information/EmployeeDataModal';
import usePersonalInformation from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';
import { addNotification } from '@/stores/notificationStore';

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
    
    const requiredFields = [
      { value: payload.employee_category_id, label: 'Kategori Karyawan' },
      { value: payload.employment_status_id, label: 'Status Karyawan' },
      { value: payload.start_date, label: 'Tanggal Masuk' },
      { value: payload.company_id, label: 'Perusahaan' },
      { value: payload.office_id, label: 'Kantor' },
      { value: payload.directorate_id, label: 'Direktorat' },
      { value: payload.division_id, label: 'Divisi' },
      { value: payload.department_id, label: 'Departemen' },
      { value: payload.position_id, label: 'Position' },
      { value: payload.job_title_id, label: 'Jabatan' },
      { value: payload.position_level_id, label: 'Jenjang Jabatan' },
      { value: payload.payroll_status, label: 'Status PayRoll' },
    ];
    const emptyFields = requiredFields.filter((field) => !field.value);

    if (emptyFields.length > 0) {
      addNotification({
        variant: 'error',
        title: 'Gagal Menyimpan!',
        description: `Mohon lengkapi data berikut: ${emptyFields.map((f) => f.label).join(', ')}`,
      });
      return;
    }
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

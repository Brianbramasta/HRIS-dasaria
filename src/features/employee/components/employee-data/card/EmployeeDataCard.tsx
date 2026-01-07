import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import EmployeeDataModal, { type EmployeeDataForm } from '@/features/employee/components/modals/employee-data/personal-information/EmployeeDataModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import usePersonalInformation from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';

interface Props {
  data: any; // API response from employee-master-data (Employment_Position_Data)
}

export default function EmployeeDataCard({ data }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const { id } = useParams<{ id: string }>();
  const { updateEmploymentPosition } = usePersonalInformation(id);

  // Dokumentasi: Mapping response Employment_Position_Data -> form payload API
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
      // 'payroll_status',
    ];
    const missingRequired = requiredKeys.some((k) => {
      const v = (base as any)?.[k];
      return v === undefined || v === null || v === '';
    });

    return base?.employment_status === 'Aktif' || allEmpty || !missingRequired;
  }, [initialForm]);

  return (
    <ExpandCard title="Data Karyawan" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label>Status Karyawan</Label>
            <InputField value={data?.employment_status || ''} readonly={true} />
          </div>
          <div>
            <Label>Tanggal Masuk</Label>
            <InputField type="date" value={data?.start_date || ''} readonly={true} />
          </div>
          <div>
            <Label>Tanggal Akhir</Label>
            <InputField type="date" value={data?.end_date || ''} readonly={true} />
          </div>
          <div>
            <Label>Perusahaan</Label>
            <InputField value={data?.company_name || ''} readonly={true} />
          </div>
          <div>
            <Label>Kantor</Label>
            <InputField value={data?.office_name || ''} readonly={true} />
          </div>
          <div>
            <Label>Direktorat</Label>
            <InputField value={data?.directorate_name || ''} readonly={true} />
          </div>
          <div>
            <Label>Divisi</Label>
            <InputField value={data?.division_name || ''} readonly={true} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Departemen</Label>
            <InputField value={data?.department_name || ''} readonly={true} />
          </div>
          <div>
            <Label>Position</Label>
            <InputField value={data?.position_name || ''} readonly={true} />
          </div>
          <div>
            <Label>Jabatan</Label>
            <InputField value={data?.job_title_name || ''} readonly={true} />
          </div>
          <div>
            <Label>Jenjang Jabatan</Label>
            <InputField value={data?.position_level || ''} readonly={true} />
          </div>
          <div>
            <Label>Golongan</Label>
            <InputField value={data?.grade || ''} readonly={true} />
          </div>
          <div>
            <Label>Status PayRoll</Label>
            <InputField value={data?.payroll_status || ''} readonly={true} />
          </div>
          <div>
            <Label>Kategori Karyawan</Label>
            <InputField value={data?.employee_category || ''} readonly={true} />
          </div>
        </div>
      </div>

      {!isEditHidden && (
        <div className="mt-4 flex justify-end">
          <Button variant="primary" size="sm" onClick={openModal}>
            <Edit2 size={16} className="mr-2" /> Edit
          </Button>
        </div>
      )}
      <EmployeeDataModal
        isOpen={isOpen}
        initialData={initialForm}
        onClose={closeModal}
        onSubmit={async (payload) => {
          if (!id) {
            console.error('Employee ID is missing');
            return;
          }
          try {
            await updateEmploymentPosition(id || '', payload);
            console.log('Save Employee Data', payload);
            closeModal();
          } catch (error) {
            console.error('Error updating employment position:', error);
          }
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}

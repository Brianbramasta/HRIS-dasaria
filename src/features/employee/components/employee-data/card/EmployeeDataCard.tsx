import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import EmployeeDataModal, { type EmployeeDataForm } from '@/features/employee/components/modals/employee-data/personal-information/EmployeeDataModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import { useMemo } from 'react';

interface Props {
  data: any; // API response from employee-master-data (Employment_Position_Data)
}

export default function EmployeeDataCard({ data }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);

  // Transform API data ke format modal dengan mapping yang benar
  const initialForm: EmployeeDataForm = useMemo(() => {
    return {
      company: data?.company_name || '',
      company_id: data?.company_id || '',
      kantor: data?.office_name || '',
      kantor_id: data?.office_id || '',
      direktorat: data?.directorate_name || '',
      direktorat_id: data?.directorate_id || '',
      divisi: data?.division_name || '',
      divisi_id: data?.division_id || '',
      departemen: data?.department_name || '',
      departemen_id: data?.department_id || '',
      position: data?.position_name || '',
      position_id: data?.position_id || '',
      jabatan: data?.job_title_name || '',
      jabatan_id: data?.job_title_id || '',
      tanggalMasuk: data?.start_date || '',
      tanggalAkhir: data?.end_date || '',
      golongan: data?.grade || '',
      statusKaryawan: data?.employment_status || '',
      statusPayroll: data?.payroll_status || '',
      userAccess: data?.user_access || '',
      kategoriKaryawan: data?.employee_category || '',
      kategori_karyawan_id: data?.employee_category_id || '',
      jenjangJabatan: data?.position_level || '',
      jenjang_jabatan_id: data?.position_level_id || '',
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

    {/* tanyakan rafi rulenya */}
      {data?.employment_status !== 'Aktif' && (
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
        onSubmit={(payload) => {
          console.log('Save Employee Data', payload);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}

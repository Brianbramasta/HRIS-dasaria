import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import EmployeeDataModal, { type EmployeeDataForm } from '@/features/staff/components/modals/dataKaryawan/PersonalInformation/EmployeeDataModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';

interface Props {
  data: any; // API response from employee-master-data
}

export default function EmployeeDataCard({ data }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);

  const initialForm: EmployeeDataForm = {
    company: data?.company_name || '',
    departemen: data?.department_name || '',
    divisi: data?.division_name || '',
    direktorate: data?.directorate_name || '',
    office: data?.office_name || '',
    position: data?.position_level || '',
    jabatan: data?.job_title_name || '',
    joinDate: data?.start_date || '',
    endDate: data?.end_date || '',
    grade: data?.grade || '',
    statusKaryawan: data?.employment_status || '',
    statusPayroll: data?.payroll_status || '',
    userAccess: data?.user_access || '',
    kategoriKaryawan: data?.employee_category || '',
  };

  const isComplete = !!data?.company_name &&
    !!data?.department_name &&
    !!data?.start_date &&
    !!data?.office_name &&
    !!data?.employment_status &&
    !!data?.payroll_status &&
    !!data?.employee_category &&
    !!data?.position_level;

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
          <div>
            <Label>Departemen</Label>
            <InputField value={data?.department_name || ''} readonly={true} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Position</Label>
            <InputField value={data?.position_level || ''} readonly={true} />
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
            <Label>Hak Akses Pengguna</Label>
            <InputField value={data?.user_access || ''} readonly={true} />
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

      <div className="mt-4 flex justify-end">
        <Button variant="primary" size="sm" onClick={openModal}>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

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

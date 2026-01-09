import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import EmployeeDataModal from '@/features/employee/components/modals/employee-data/personal-information/EmployeeDataModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import useEmployeeDataCard from '@/features/employee/hooks/card/useEmployeeDataCard';

interface Props {
  data: any; // API response from employee-master-data (Employment_Position_Data)
}

export default function EmployeeDataCard({ data }: Props) {
  const {
    isOpen,
    openModal,
    closeModal,
    initialForm,
    isComplete,
    isEditHidden,
    handleSubmit,
  } = useEmployeeDataCard(data);

  return (
    <ExpandCard title="Data Karyawan" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label>Kategori Karyawan</Label>
            <InputField value={data?.employee_category || ''} readonly={true} />
          </div>
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
         
        </div>
        <div className="space-y-4">
           <div>
            <Label>Divisi</Label>
            <InputField value={data?.division_name || ''} readonly={true} />
          </div>
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
          
        </div>
      </div>

      {!isEditHidden && (
        <div className="mt-4 flex justify-end">
          <Button variant="primary" size="sm" onClick={openModal} className='w-full md:w-auto flex items-center justify-center'>
            <Edit2 size={16} className="mr-2" /> Edit
          </Button>
        </div>
      )}
      <EmployeeDataModal
        isOpen={isOpen}
        initialData={initialForm}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitting={false}
      />
    </ExpandCard>
  );
}

import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import EmployeeDataModal, { type EmployeeDataForm } from '@/features/staff/components/modals/dataKaryawan/PersonalInformation/EmployeeDataModal';
import type { KaryawanDetailResponse } from '@/features/staff/services/karyawanService';

interface Props {
  data: KaryawanDetailResponse['karyawan'];
}

export default function EmployeeDataCard({ data }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);

  const initialForm: EmployeeDataForm = {
    company: data.company || '',
    departemen: data.department || '',
    divisi: (data as any)?.divisi || '',
    direktorate: (data as any)?.direktorat || '',
    office: data.office || '',
    position: data.posisi || '',
    jabatan: data.jabatan || '',
    joinDate: data.tanggalJoin || '',
    endDate: data.tanggalBerakhir || '',
    grade: (data as any)?.grade || '',
    statusKaryawan: (data as any)?.status || '',
    statusPayroll: (data as any)?.statusPayroll || '',
    userAccess: 'Employee',
    kategoriKaryawan: (data as any)?.kategori || '',
  };

  return (
    <ExpandCard title="Data Karyawan" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>ID Karyawan</Label>
          <InputField value={data.idKaryawan || ''} disabled={true} />
        </div>
        <div>
          <Label>Posisi</Label>
          <InputField value={data.posisi || ''} disabled={true} />
        </div>
        <div>
          <Label>Jabatan</Label>
          <InputField value={data.jabatan || ''} disabled={true} />
        </div>
        <div>
          <Label>Company</Label>
          <InputField value={data.company || ''} disabled={true} />
        </div>
        <div>
          <Label>Departemen</Label>
          <InputField value={data.department || ''} disabled={true} />
        </div>
        <div>
          <Label>Office</Label>
          <InputField value={data.office || ''} disabled={true} />
        </div>
        <div>
          <Label>Tanggal Join</Label>
          <InputField type="date" value={data.tanggalJoin || ''} disabled={true} />
        </div>
        <div>
          <Label>Tanggal Berakhir</Label>
          <InputField type="date" value={data.tanggalBerakhir || ''} disabled={true} />
        </div>
        <div>
          <Label>Status Karyawan</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'tetap', label: 'Karyawan Tetap' },
                { value: 'kontrak', label: 'Karyawan Kontrak' },
                { value: 'magang', label: 'Magang' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label>User Access</Label>
          <InputField value={'Employee'} disabled={true} />
        </div>
        <div>
          <Label>Grade</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'D1', label: 'D1' },
                { value: 'D2', label: 'D2' },
                { value: 'D3', label: 'D3' },
                { value: 'D5', label: 'D5' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label>Status Payroll</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'aktif', label: 'Aktif' },
                { value: 'nonaktif', label: 'Nonaktif' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label>Kategori Karyawan</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'staff', label: 'Staff' },
                { value: 'manager', label: 'Manager' },
                { value: 'direktur', label: 'Direktur' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label>Direktorat</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'sdm', label: 'SDM' },
                { value: 'keu', label: 'Keuangan' },
                { value: 'ops', label: 'Operasional' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label>Divisi</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'hr', label: 'HR' },
                { value: 'it', label: 'IT' },
                { value: 'marketing', label: 'Marketing' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={openModal}>
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
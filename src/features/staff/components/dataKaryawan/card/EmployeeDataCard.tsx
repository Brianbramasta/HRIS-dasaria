import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import EmployeeDataModal, { type EmployeeDataForm } from '@/features/staff/components/modals/dataKaryawan/PersonalInformation/EmployeeDataModal';
import type { KaryawanDetailResponse } from '@/features/staff/services/karyawanService';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';

const JENJANG_JABATAN_OPTIONS = [
  { label: 'Junior', value: 'junior' },
  { label: 'Middle', value: 'middle' },
  { label: 'Senior', value: 'senior' },
];

const GOLONGAN_OPTIONS = [
  { label: 'I', value: 'I' },
  { label: 'II', value: 'II' },
  { label: 'III', value: 'III' },
  { label: 'IV', value: 'IV' },
];

const HAK_AKSES_OPTIONS = [
  { label: 'HR/Admin', value: 'hr/admin' },
  { label: 'Employee', value: 'employee' },
  { label: 'Staff', value: 'staff' },
];

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
  const anyData = data as any;
  const isComplete = !!data.company &&
    !!data.department &&
    !!data.posisi &&
    !!data.jabatan &&
    !!data.tanggalJoin &&
    !!data.office &&
    !!anyData?.direktorat &&
    !!anyData?.divisi &&
    !!anyData?.grade &&
    !!anyData?.status &&
    !!anyData?.statusPayroll &&
    !!anyData?.kategori;

  return (
    <ExpandCard title="Data Karyawan" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label>Status Karyawan</Label>
            <div className="pointer-events-none ">
              <Select
                options={[
                  { label: 'Aktif', value: 'aktif' },
                  { label: 'Cuti', value: 'cuti' },
                  { label: 'Nonaktif', value: 'nonaktif' },
                ]}
                onChange={() => {}}
                defaultValue={(data as any)?.status || ''}
                required={false}
              />
            </div>
          </div>
          <div>
            <Label>Tanggal Masuk</Label>
            <InputField type="date" value={data.tanggalJoin || ''} readonly={true} />
          </div>
          <div>
            <Label>Tanggal Akhir</Label>
            <InputField type="date" value={data.tanggalBerakhir || ''} readonly={true} />
          </div>
          <div>
            <Label>Perusahaan</Label>
            <InputField value={data.company || ''} readonly={true} />
          </div>
          <div>
            <Label>Kantor</Label>
            <InputField value={data.office || ''} readonly={true} />
          </div>
          <div>
            <Label>Direktorat</Label>
            <InputField value={(data as any)?.direktorat || ''} readonly={true} />
          </div>
          <div>
            <Label>Divisi</Label>
            <InputField value={(data as any)?.divisi || ''} readonly={true} />
          </div>
          <div>
            <Label>Departemen</Label>
            <InputField value={data.department || ''} readonly={true} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Position</Label>
            <InputField value={data.posisi || ''} readonly={true} />
          </div>
          <div>
            <Label>Jabatan</Label>
            <InputField value={data.jabatan || ''} readonly={true} />
          </div>
          <div>
            <Label>Jenjang Jabatan</Label>
            <div className="pointer-events-none ">
              <Select
                options={JENJANG_JABATAN_OPTIONS}
                onChange={() => {}}
                defaultValue={(data as any)?.jenjangJabatan || ''}
                required={false}
              />
            </div>
          </div>
          <div>
            <Label>Golongan</Label>
            <div className="pointer-events-none ">
              <Select
                options={GOLONGAN_OPTIONS}
                onChange={() => {}}
                defaultValue={(data as any)?.golongan || ''}
                required={false}
              />
            </div>
          </div>
          <div>
            <Label>Hak Akses Pengguna</Label>
            <div className="pointer-events-none ">
              <Select
                options={HAK_AKSES_OPTIONS}
                onChange={() => {}}
                defaultValue={(data as any)?.userAccess || 'employee'}
                required={false}
              />
            </div>
          </div>
          <div>
            <Label>Status PayRoll</Label>
            <div className="pointer-events-none ">
              <Select
                options={[
                  { value: 'Tetap', label: 'Tetap' },
                  { value: 'Kontrak', label: 'Kontrak' },
                ]}
                onChange={() => {}}
                defaultValue={(data as any)?.statusPayroll || ''}
                required={false}
              />
            </div>
          </div>
          <div>
            <Label>Kategori Karyawan</Label>
            <div className="pointer-events-none ">
              <Select
                options={[
                  { value: 'Staff', label: 'Staff' },
                  { value: 'Manager', label: 'Manager' },
                  { value: 'Direktur', label: 'Direktur' },
                ]}
                onChange={() => {}}
                defaultValue={(data as any)?.kategori || ''}
                required={false}
              />
            </div>
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

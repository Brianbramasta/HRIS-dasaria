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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label>Status Karyawan</Label>
            <div className="pointer-events-none opacity-60">
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
            <InputField type="date" value={data.tanggalJoin || ''} disabled={true} />
          </div>
          <div>
            <Label>Tanggal Akhir</Label>
            <InputField type="date" value={data.tanggalBerakhir || ''} disabled={true} />
          </div>
          <div>
            <Label>Perusahaan</Label>
            <InputField value={data.company || ''} disabled={true} />
          </div>
          <div>
            <Label>Kantor</Label>
            <InputField value={data.office || ''} disabled={true} />
          </div>
          <div>
            <Label>Direktorat</Label>
            <InputField value={(data as any)?.direktorat || ''} disabled={true} />
          </div>
          <div>
            <Label>Divisi</Label>
            <InputField value={(data as any)?.divisi || ''} disabled={true} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Departemen</Label>
            <InputField value={data.department || ''} disabled={true} />
          </div>
          <div>
            <Label>Position</Label>
            <InputField value={data.posisi || ''} disabled={true} />
          </div>
          <div>
            <Label>Jabatan</Label>
            <InputField value={data.jabatan || ''} disabled={true} />
          </div>
          <div>
            <Label>Tingkat</Label>
            <div className="pointer-events-none opacity-60">
              <Select
                options={[
                  { value: 'D1', label: 'D1' },
                  { value: 'D2', label: 'D2' },
                  { value: 'D3', label: 'D3' },
                  { value: 'D4', label: 'D4' },
                  { value: 'D5', label: 'D5' },
                ]}
                onChange={() => {}}
                defaultValue={(data as any)?.grade || ''}
                required={false}
              />
            </div>
          </div>
          <div>
            <Label>Status Penggajian</Label>
            <div className="pointer-events-none opacity-60">
              <Select
                options={[
                  { value: 'Aktif', label: 'Aktif' },
                  { value: 'Nonaktif', label: 'Nonaktif' },
                ]}
                onChange={() => {}}
                defaultValue={(data as any)?.statusPayroll || ''}
                required={false}
              />
            </div>
          </div>
          <div>
            <Label>Kategori Karyawan</Label>
            <div className="pointer-events-none opacity-60">
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

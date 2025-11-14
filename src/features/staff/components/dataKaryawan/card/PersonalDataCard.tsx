import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import PersonalDataModal, { type PersonalDataForm } from '@/features/staff/components/dataKaryawan/modals/dataKaryawan/PersonalInformation/PersonalDataModal';
import type { Karyawan } from '@/features/staff/types/Karyawan';

interface Props {
  data: Karyawan;
}

export default function PersonalDataCard({ data }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);

  const initialForm: PersonalDataForm = {
    idKaryawan: (data as any)?.idKaryawan || '',
    namaLengkap: data.name || '',
    email: data.email || '',
  };

  return (
    <ExpandCard title="Personal Data" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="namaLengkap">Nama Lengkap</Label>
          <InputField id="namaLengkap" value={data.name} disabled={true} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <InputField id="email" type="email" value={data.email} disabled={true} />
        </div>
        <div>
          <Label htmlFor="nik">NIK</Label>
          <InputField id="nik" placeholder="-" disabled={true} />
        </div>
        <div>
          <Label htmlFor="agama">Agama</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'islam', label: 'Islam' },
                { value: 'kristen', label: 'Kristen' },
                { value: 'katolik', label: 'Katolik' },
                { value: 'hindu', label: 'Hindu' },
                { value: 'buddha', label: 'Buddha' },
                { value: 'konghucu', label: 'Konghucu' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="tempatLahir">Tempat Lahir</Label>
          <InputField id="tempatLahir" value={''} disabled={true} />
        </div>
        <div>
          <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
          <InputField id="tanggalLahir" type="date" value={''} disabled={true} />
        </div>
        <div>
          <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'perempuan', label: 'Perempuan' },
                { value: 'laki-laki', label: 'Laki-laki' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="golDarah">Gol. Darah</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'AB', label: 'AB' },
                { value: 'O', label: 'O' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="pendidikanTerakhir">Pendidikan Terakhir</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'sd', label: 'SD' },
                { value: 'smp', label: 'SMP' },
                { value: 'sma', label: 'SMA/SMK' },
                { value: 'd3', label: 'D3' },
                { value: 's1', label: 'S1' },
                { value: 's2', label: 'S2' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="statusMenikah">Status Menikah</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'belum', label: 'Belum Menikah' },
                { value: 'menikah', label: 'Menikah' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="nomorTelepon">Nomor Telepon</Label>
          <InputField id="nomorTelepon" value={''} disabled={true} />
        </div>
        <div>
          <Label htmlFor="jumlahTanggungan">Jumlah Tanggungan sesuai KK</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: '0', label: '0' },
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4+' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="alamatDomisili">Alamat Domisili</Label>
          <TextArea value={''} disabled={true} rows={3} />
        </div>
        <div>
          <Label htmlFor="alamatKtp">Alamat KTP</Label>
          <TextArea value={''} disabled={true} rows={3} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={openModal}>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

      <PersonalDataModal
        isOpen={isOpen}
        initialData={initialForm}
        onClose={closeModal}
        onSubmit={(payload) => {
          console.log('Save Personal Data', payload);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}
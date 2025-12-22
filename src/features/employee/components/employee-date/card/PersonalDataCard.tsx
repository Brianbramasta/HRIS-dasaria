import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import PersonalDataModal, { type PersonalDataForm } from '@/features/employee/components/modals/employee-data/personal-information/PersonalDataModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';

interface Props {
  data: any; // API response from employee-master-data
}

export default function PersonalDataCard({ data }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);

  const initialForm: PersonalDataForm = {
    idKaryawan: data?.id || '',
    namaLengkap: data?.full_name || '',
    email: data?.email || '',
  };

  const isComplete = !!data?.id &&
    !!data?.full_name &&
    !!data?.email &&
    !!data?.national_id &&
    !!data?.birth_place &&
    !!data?.birth_date &&
    !!data?.gender &&
    !!data?.phone_number &&
    !!data?.current_address &&
    !!data?.religion &&
    !!data?.marital_status &&
    !!data?.ktp_address;

  return (
    <ExpandCard title="Data Pribadi" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="idKaryawan">NIP</Label>
            <InputField id="idKaryawan" value={data?.id || ''} readonly={true} />
          </div>
          <div>
            <Label htmlFor="namaLengkap">Nama Lengkap</Label>
            <InputField id="namaLengkap" value={data?.full_name || ''} readonly={true} />
          </div>
          <div>
            <Label htmlFor="nik">NIK</Label>
            <InputField id="nik" value={data?.national_id || ''} readonly={true} />
          </div>
          <div>
            <Label htmlFor="tempatLahir">Tempat Lahir</Label>
            <InputField id="tempatLahir" value={data?.birth_place || ''} readonly={true} />
          </div>
          <div>
            <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
            <InputField id="tanggalLahir" type="date" value={data?.birth_date || ''} readonly={true} />
          </div>
          <div>
            <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
            <div className="pointer-events-none opacity-60">
              <InputField id="jenisKelamin" value={data?.gender || ''} readonly={true} />
            </div>
          </div>
          <div>
            <Label htmlFor="nomorTelepon">Nomor Telepon</Label>
            <InputField id="nomorTelepon" value={data?.phone_number || ''} readonly={true} />
          </div>
          <div>
            <Label htmlFor="alamatDomisili">Alamat Domisili</Label>
            <TextArea value={data?.current_address || ''} disabled={true} rows={3} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <InputField id="email" type="email" value={data?.email || ''} readonly={true} />
          </div>
          <div>
            <Label htmlFor="agama">Agama</Label>
            <div className="pointer-events-none opacity-60">
              <InputField id="agama" value={data?.religion || ''} readonly={true} />
            </div>
          </div>
          <div>
            <Label htmlFor="golDarah">Gol. Darah</Label>
            <div className="pointer-events-none opacity-60">
              <InputField id="golDarah" value={data?.blood_type || ''} readonly={true} />
            </div>
          </div>
          <div>
            <Label htmlFor="pendidikanTerakhir">Pendidikan Terakhir</Label>
            <div className="pointer-events-none opacity-60">
              <InputField id="pendidikanTerakhir" value={data?.last_education || ''} readonly={true} />
            </div>
          </div>
          <div>
            <Label htmlFor="statusMenikah">Status Menikah</Label>
            <div className="pointer-events-none opacity-60">
              <InputField id="statusMenikah" value={data?.marital_status || ''} readonly={true} />
            </div>
          </div>
          <div>
            <Label htmlFor="jumlahTanggungan">Jumlah Tanggungan sesuai KK</Label>
            <div className="pointer-events-none opacity-60">
              <InputField id="jumlahTanggungan" value={data?.household_dependents || ''} readonly={true} />
            </div>
          </div>
          <div>
            <Label htmlFor="alamatKtp">Alamat KTP</Label>
            <TextArea value={data?.ktp_address || ''} disabled={true} rows={3} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" size="sm" onClick={openModal}>
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

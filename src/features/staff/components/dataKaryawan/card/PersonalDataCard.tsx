import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
// import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import PersonalDataModal, { type PersonalDataForm } from '@/features/staff/components/modals/dataKaryawan/PersonalInformation/PersonalDataModal';
import type { KaryawanDetailResponse } from '@/features/staff/services/karyawanService';

interface Props {
  data: KaryawanDetailResponse['karyawan'];
  personalInformation: KaryawanDetailResponse['personalInformation'];
}

export default function PersonalDataCard({ data, personalInformation }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);

  const initialForm: PersonalDataForm = {
    idKaryawan: data.idKaryawan || '',
    namaLengkap: data.name || '',
    email: data.email || '',
  };

  return (
    <ExpandCard title="Personal Data" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="namaLengkap">Nama Lengkap</Label>
          <InputField id="namaLengkap" value={data.name || ''} disabled={true} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <InputField id="email" type="email" value={data.email || ''} disabled={true} />
        </div>
        <div>
          <Label htmlFor="nik">NIK</Label>
          <InputField id="nik" value={personalInformation.nik || ''} disabled={true} />
        </div>
        <div>
          <Label htmlFor="agama">Agama</Label>
          <div className="pointer-events-none opacity-60">
            <InputField id="agama" value={personalInformation.agama || ''} disabled={true} />
          </div>
        </div>
        <div>
          <Label htmlFor="tempatLahir">Tempat Lahir</Label>
          <InputField id="tempatLahir" value={personalInformation.tempatLahir || ''} disabled={true} />
        </div>
        <div>
          <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
          <InputField id="tanggalLahir" type="date" value={personalInformation.tanggalLahir || ''} disabled={true} />
        </div>
        <div>
          <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
          <div className="pointer-events-none opacity-60">
            <InputField id="jenisKelamin" value={personalInformation.jenisKelamin || ''} disabled={true} />
          </div>
        </div>
        <div>
          <Label htmlFor="golDarah">Gol. Darah</Label>
          <div className="pointer-events-none opacity-60">
            <InputField id="golDarah" value={''} disabled={true} />
          </div>
        </div>
        <div>
          <Label htmlFor="pendidikanTerakhir">Pendidikan Terakhir</Label>
          <div className="pointer-events-none opacity-60">
            <InputField id="pendidikanTerakhir" value={''} disabled={true} />
          </div>
        </div>
        <div>
          <Label htmlFor="statusMenikah">Status Menikah</Label>
          <div className="pointer-events-none opacity-60">
            <InputField id="statusMenikah" value={personalInformation.statusMenikah || ''} disabled={true} />
          </div>
        </div>
        <div>
          <Label htmlFor="nomorTelepon">Nomor Telepon</Label>
          <InputField id="nomorTelepon" value={personalInformation.nomorTelepon || ''} disabled={true} />
        </div>
        <div>
          <Label htmlFor="jumlahTanggungan">Jumlah Tanggungan sesuai KK</Label>
          <div className="pointer-events-none opacity-60">
            <InputField id="jumlahTanggungan" value={''} disabled={true} />
          </div>
        </div>
        <div>
          <Label htmlFor="alamatDomisili">Alamat Domisili</Label>
          <TextArea value={personalInformation.alamatDomisili || ''} disabled={true} rows={3} />
        </div>
        <div>
          <Label htmlFor="alamatKtp">Alamat KTP</Label>
          <TextArea value={personalInformation.alamatKTP || ''} disabled={true} rows={3} />
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
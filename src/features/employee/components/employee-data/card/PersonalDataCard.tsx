import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import PersonalDataModal from '@/features/employee/components/modals/employee-data/personal-information/PersonalDataModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import usePersonalDataCard from '@/features/employee/hooks/card/usePersonalDataCard';
interface Props {
  data: any; // API response from employee-master-data
  employeeId: string; // ID karyawan untuk API call
}

export default function PersonalDataCard({ data, employeeId }: Props) {
  const {
    isOpen,
    openModal,
    handleCloseModal,
    loading,
    error,
    initialForm,
    isComplete,
    handleSubmitPersonalData,
  } = usePersonalDataCard(data, employeeId);

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
              <InputField id="jumlahTanggungan" value={data?.household_dependents || '0'} readonly={true} />
            </div>
          </div>
          <div>
            <Label htmlFor="alamatKtp">Alamat KTP</Label>
            <TextArea value={data?.ktp_address || ''} disabled={true} rows={3} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" size="sm" onClick={openModal} className='w-full md:w-auto flex items-center justify-center'>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

      {/* Show error if exists */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <PersonalDataModal
        isOpen={isOpen}
        initialData={initialForm}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPersonalData}
        submitting={loading}
        employeeId={employeeId}
      />
    </ExpandCard>
  );
}

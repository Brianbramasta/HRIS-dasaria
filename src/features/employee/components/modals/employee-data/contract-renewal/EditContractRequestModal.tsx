import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import useEditContractRequestModal from '@/features/employee/hooks/modals/employee-data/contract-renewal/useEditContractRequestModal';

interface EditPengajuanKontrakModalProps {
  isOpen: boolean;
  onClose: () => void;
  kontrakData?: {
    idKaryawan: string;
    pengguna: string;
    jenisPerubahan: string;
    perusahaan: string;
    kantor: string;
    direktorat: string;
    divisi: string;
    departemen: string;
    position: string;
    jabatan: string;
    golongan: string;
    jenjangJabatan: string;
    gajiPokok: string;
    kategoriKaryawan: string;
  };
  onSuccess?: () => void;
}

export default function EditPengajuanKontrakModal({
  isOpen,
  onClose,
  kontrakData,
  onSuccess,
}: EditPengajuanKontrakModalProps) {
  const {
    jenisPerubahanOptions,
    perusahaanOptions,
    kantorOptions,
    direktoratOptions,
    divisiOptions,
    departemenOptions,
    positionOptions,
    jabatanOptions,
    jenjangJabatanOptions,
    kategoriKaryawanOptions,
    jenisPerubahan,
    setJenisPerubahan,
    perusahaan,
    setPerusahaan,
    kantor,
    setKantor,
    direktorat,
    setDirektorat,
    divisi,
    setDivisi,
    position,
    setPosition,
    jabatan,
    setJabatan,
    jenjangJabatan,
    setJenjangJabatan,
    kategoriKaryawan,
    setKategoriKaryawan,
    submitting,
    handleSubmit,
  } = useEditContractRequestModal({ kontrakData, onClose, onSuccess });

  return (
    <ModalAddEdit
      title="Detail Data Karyawan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-4xl"
      content={
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIP</label>
              <Input type="text" value={kontrakData?.idKaryawan} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
              <Input type="text" value={kontrakData?.pengguna} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Perubahan</label>
              <Select
                options={jenisPerubahanOptions}
                defaultValue={jenisPerubahan}
                onChange={setJenisPerubahan}
                placeholder="Pilih Jenis Perubahan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Perusahaan</label>
              <Select
                options={perusahaanOptions}
                defaultValue={perusahaan}
                onChange={setPerusahaan}
                placeholder="Pilih Perusahaan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kantor</label>
              <Select
                options={kantorOptions}
                defaultValue={kantor}
                onChange={setKantor}
                placeholder="Pilih Kantor"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Direktorat</label>
              <Select
                options={direktoratOptions}
                defaultValue={direktorat}
                onChange={setDirektorat}
                placeholder="Pilih Direktorat"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Divisi</label>
              <Select
                options={divisiOptions}
                defaultValue={divisi}
                onChange={setDivisi}
                placeholder="Pilih Divisi"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departemen</label>
              <Select
                options={departemenOptions}
                defaultValue={kontrakData?.departemen}
                onChange={() => {}}
                placeholder="Pilih Departemen"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
              <Select
                options={positionOptions}
                defaultValue={position}
                onChange={setPosition}
                placeholder="Pilih Position"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jabatan</label>
              <Select
                options={jabatanOptions}
                defaultValue={jabatan}
                onChange={setJabatan}
                placeholder="Pilih Jabatan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Golongan</label>
              <Input type="text" value={kontrakData?.golongan} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenjang Jabatan</label>
              <Select
                options={jenjangJabatanOptions}
                defaultValue={jenjangJabatan}
                onChange={setJenjangJabatan}
                placeholder="Pilih Jenjang Jabatan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gaji Pokok</label>
              <Input type="text" value={kontrakData?.gajiPokok} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kategori Karyawan</label>
              <Select
                options={kategoriKaryawanOptions}
                defaultValue={kategoriKaryawan}
                onChange={setKategoriKaryawan}
                placeholder="Pilih Kategori Karyawan"
              />
            </div>
          </div>
        </>
      }
    />
  );
}

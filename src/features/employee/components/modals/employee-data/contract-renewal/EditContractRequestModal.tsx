import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import useEditContractRequestModal from '@/features/employee/hooks/modals/employee-data/contract-renewal/useEditContractRequestModal';
import { useState } from 'react';

interface EditPengajuanKontrakModalProps {
  isOpen: boolean;
  onClose: () => void;
  kontrakData?: {
    idKaryawan: string;
    pengguna: string;
    jenisPerubahan: string;
    jenisPerubahanId?: string;
    perusahaan: string;
    perusahaanId?: string;
    kantor: string;
    kantorId?: string;
    direktorat: string;
    direktoratId?: string;
    divisi: string;
    divisiId?: string;
    departemen: string;
    departemenBaruId?: string;
    position: string;
    positionId?: string;
    jabatan: string;
    jabatanId?: string;
    golongan: string;
    jenjangJabatan: string;
    jenjangJabatanId?: string;
    gajiPokok: string;
    kategoriKaryawan: string;
    kategoriKaryawanId?: string;
    unitId?: string;
    structuralPositionId?: string;
  };
  onSuccess?: () => void;
  onSubmit: (data: FormData) => Promise<boolean>;
}

export default function EditPengajuanKontrakModal({
  isOpen,
  onClose,
  kontrakData,
  onSuccess,
  onSubmit,
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
    // submitting: hookSubmitting,
    // handleSubmit: hookHandleSubmit,
  } = useEditContractRequestModal({ kontrakData, onClose, onSuccess });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();

      // Helper to append if value exists
      // Prioritize using the ID if the selected value matches the initial value (assuming no change)
      // or if we had a way to map back to ID.
      // Since we don't have IDs for the hardcoded options, we'll try to use the initial ID if available.
      
      if (jenisPerubahan) {
        const val = (jenisPerubahan === kontrakData?.jenisPerubahan && kontrakData?.jenisPerubahanId) 
          ? kontrakData.jenisPerubahanId 
          : jenisPerubahan; // Fallback to sending value (might fail if API needs ID)
        formData.append('change_type_id', val);
      }

      if (perusahaan) {
        const val = (perusahaan === kontrakData?.perusahaan && kontrakData?.perusahaanId)
          ? kontrakData.perusahaanId
          : perusahaan;
        formData.append('company_id', val);
      }

      if (kantor) {
        const val = (kantor === kontrakData?.kantor && kontrakData?.kantorId)
          ? kontrakData.kantorId
          : kantor;
        formData.append('office_id', val);
      }

      if (direktorat) {
        const val = (direktorat === kontrakData?.direktorat && kontrakData?.direktoratId)
          ? kontrakData.direktoratId
          : direktorat;
        formData.append('directorate_id', val);
      }

      if (divisi) {
        const val = (divisi === kontrakData?.divisi && kontrakData?.divisiId)
          ? kontrakData.divisiId
          : divisi;
        formData.append('division_id', val);
      }
      
      // Department seems not selectable in UI (onChange={() => {}}), so use initial
      if (kontrakData?.departemenBaruId) {
        formData.append('department_id', kontrakData.departemenBaruId);
      }

      if (position) {
         const val = (position === kontrakData?.position && kontrakData?.positionId)
          ? kontrakData.positionId
          : position;
        formData.append('position_id', val);
      }

      if (jabatan) {
        // rank_position maps to job_title_id usually? Or job_title_id maps to Jabatan?
        // Assuming jabatan -> job_title_id (rank_position)
        const val = (jabatan === kontrakData?.jabatan && kontrakData?.jabatanId)
          ? kontrakData.jabatanId
          : jabatan;
        formData.append('job_title_id', val);
      }

      if (jenjangJabatan) {
         const val = (jenjangJabatan === kontrakData?.jenjangJabatan && kontrakData?.jenjangJabatanId)
          ? kontrakData.jenjangJabatanId
          : jenjangJabatan;
        formData.append('position_level_id', val);
      }

      if (kategoriKaryawan) {
         const val = (kategoriKaryawan === kontrakData?.kategoriKaryawan && kontrakData?.kategoriKaryawanId)
          ? kontrakData.kategoriKaryawanId
          : kategoriKaryawan;
        formData.append('employee_category_id', val);
      }
      
      if (kontrakData?.unitId) {
        formData.append('unit_id', kontrakData.unitId);
      }
      
      if (kontrakData?.structuralPositionId) {
        formData.append('structural_job_id', kontrakData.structuralPositionId);
      }
      
      // Salary
      if (kontrakData?.gajiPokok) {
        formData.append('salary', kontrakData.gajiPokok);
      }

      const success = await onSubmit(formData);
      if (success) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Failed to submit contract request', error);
    } finally {
      setSubmitting(false);
    }
  };

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

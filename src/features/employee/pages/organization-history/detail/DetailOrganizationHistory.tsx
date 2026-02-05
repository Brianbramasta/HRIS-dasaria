import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import PayrollCard from '@/features/payroll/components/cards/Cards';
import useOrganizationHistoryDetail from '@/features/employee/hooks/organization-history/useOrganizationHistoryDetail';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import Button from '@/components/ui/button/Button';
import LinkPreview from '@/components/shared/form/LinkPreview';
import Label from '@/components/form/Label';
import { IconPencil } from '@/icons/components/icons';
import EditRiwayatOrganisasiModal from '@/features/employee/components/modals/organization-history/EditOrganizationHistoryModal';

const DetailOrganizationHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '';
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {}, []);

  const {
    title,
    form,
    displayForm,
    currentEmployee,
    handleInput,
    status,
  } = useOrganizationHistoryDetail({ id });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>

      <PayrollCard title="Informasi Karyawan" headerColor="slate" border={false}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <InputField
              label="NIP"
              required
              value={form.nip || ''}
              disabled
              placeholder="Pilih NIP"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField label="Pengguna" placeholder="Otomatis" value={currentEmployee?.full_name || form.nama || ''} disabled />
          </div>
          <div>
            <InputField label="Kategori Karyawan" placeholder="Otomatis" value={currentEmployee?.employee_category || ''} disabled />
          </div>
          <div>
            <InputField label="Perusahaan" placeholder="Otomatis" value={currentEmployee?.company_name || ''} disabled />
          </div>
          <div>
            <InputField label="Kantor" placeholder="Otomatis" value={currentEmployee?.office_name || ''} disabled />
          </div>
          <div>
            <InputField label="Direktorat" placeholder="Otomatis" value={currentEmployee?.directorate_name || ''} disabled />
          </div>
          <div>
            <InputField label="Divisi" placeholder="Otomatis" value={currentEmployee?.division_name || ''} disabled />
          </div>
          <div>
            <InputField label="Departemen" placeholder="Otomatis" value={currentEmployee?.department_name || ''} disabled />
          </div>
          <div>
            <InputField label="Unit" placeholder="Otomatis" value={currentEmployee?.unit || ''} disabled />
          </div>
          <div>
            <InputField label="Posisi" placeholder="Otomatis" value={currentEmployee?.position_name || ''} disabled />
          </div>
          <div>
            <InputField label="Jabatan Kepangkatan" placeholder="Otomatis" value={currentEmployee?.job_title_name || ''} disabled />
          </div>
          <div>
            <InputField label="Jabatan Struktural" placeholder="Otomatis" value={currentEmployee?.structural_job || ''} disabled />
          </div>
          <div>
            <InputField label="Jenjang Jabatan" placeholder="Otomatis" value={currentEmployee?.position_level || ''} disabled />
          </div>
          <div>
            <InputField label="Golongan" placeholder="Otomatis" value={currentEmployee?.grade || ''} disabled />
          </div>
          <div>
            <InputField label="Gaji Bersih" placeholder="Otomatis" value="" disabled />
          </div>
        </div>
      </PayrollCard>

      <PayrollCard title="Detail Perubahan" headerColor="green" border={false}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <InputField
              label="Jenis Perubahan"
              required
              value={displayForm?.change_type_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              id="effectiveDateDetail"
              label="Tanggal Efektif"
              required
              value={form.efektif_date || ''}
              placeholder="— (masih aktif)"
              onChange={() => {}}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Kategori Karyawan"
              required
              value={displayForm?.employee_category_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              label="Perusahaan"
              required
              value={displayForm?.company_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              label="Kantor"
              required
              value={displayForm?.office_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              label="Direktorat"
              required
              value={displayForm?.directorate_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              label="Divisi"
              required
              value={displayForm?.division_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              label="Departemen"
              required
              value={displayForm?.department_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              label="Unit"
              value={displayForm?.unit_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              label="Posisi"
              required
              value={displayForm?.position_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              label="Jabatan Kepangkatan"
              required
              value={displayForm?.job_title_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              label="Jabatan Struktural"
              required
              value={displayForm?.structural_job_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              label="Jenjang Jabatan"
              required
              value={displayForm?.position_level_name || ''}
              disabled
              placeholder="Select"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField
              label="Golongan"
              required
              value={displayForm?.golongan || ''}
              disabled
              placeholder="Otomatis dari Jabatan"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField label="Gaji Bersih" placeholder="Otomatis" disabled value="" />
          </div>
          <div className="col-span-1 md:col-span-3">
            {/* <InputField label="Sk Perubahan" placeholder="Otomatis" disabled value={form.decree_file || ''} /> */}
            <div className="mt-2 w-full">
            <Label>Sk Perubahan</Label>
              <LinkPreview url={form.decree_file || ''} label="Lihat Detail" disabled={!form.decree_file} />
            </div>
          </div>
          <div className="col-span-1 md:col-span-3">
            <TextAreaField
              label="Alasan Perubahan"
              required
              placeholder="Masukkan alasan perubahan"
              value={form.reason || ''}
              onChange={(e) => handleInput('reason', e)}
              disabled
              rows={4}
            />
          </div>
          <div className="col-span-1 md:col-span-3 flex justify-end">
            {status === 'Rekomendasi' && (
              <Button
                variant="custom"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                onClick={() => setIsEditModalOpen(true)}
              >
                <IconPencil color="white" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </PayrollCard>

      <EditRiwayatOrganisasiModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={form}
        onSubmit={() => {
          // TODO: Implement update logic
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
};

export default DetailOrganizationHistoryPage;

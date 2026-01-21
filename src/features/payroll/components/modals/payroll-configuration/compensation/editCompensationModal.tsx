// Dokumentasi: Modal Edit Kompensasi
// Tujuan: Menyediakan form edit dengan field Level Jabatan (Select), Kategori (Select),
// Nominal General, Nominal Junior, Nominal Middle, Nominal Senior. Menggunakan wrapper ModalAddEdit.
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import SelectField from '@/components/shared/field/SelectField';
import InputField from '@/components/shared/field/InputField';
import { useEditCompensationModal } from '@/features/payroll/hooks/modals/payroll-configuration/compensation/useEditCompensationModal';

export type EditKompensasiForm = {
  levelJabatan?: string;
  kategori?: string;
  general?: string;
  junior?: string;
  middle?: string;
  senior?: string;
};

interface Props {
  isOpen: boolean;
  initialData?: EditKompensasiForm | null;
  onClose: () => void;
  onSubmit: (data: EditKompensasiForm) => void;
  submitting?: boolean;
}

const EditKompensasiModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const { title, form, handleInput, setNominal, KATEGORI_OPTIONS, handleSubmit } =
    useEditCompensationModal({
      isOpen,
      initialData,
      onClose,
      onSubmit,
    });

  const isGeneralFilled = !!form.general;
  const isLevelFilled = !!form.junior || !!form.middle || !!form.senior;

  const content = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InputField
          label="Level Jabatan"
          value={form.levelJabatan || ''}
          onChange={(e) => handleInput('levelJabatan', e.target.value)}
          placeholder="Nyesuain struktur Organisasi"
          readonly
        />

        <InputField
          label="Jabatan Struktural"
          value={form.jabatanStruktural || ''}
          placeholder="Nyesuain struktur Organisasi"
          readonly
        />

        <SelectField
          label="Kategori"
          options={KATEGORI_OPTIONS}
          defaultValue={form.kategori || ''}
          onChange={(v) => handleInput('kategori', v)}
          placeholder="Gaji Pokok / Uang Saku"
        />

        <InputField
          label="Nominal General"
          placeholder="-"
          value={form.general || ''}
          onChange={(e) => setNominal('general', e.target.value)}
          disabled={isLevelFilled}
        />
        <InputField
          label="Nominal Junior"
          placeholder="-"
          value={form.junior || ''}
          onChange={(e) => setNominal('junior', e.target.value)}
          disabled={isGeneralFilled}
        />
        <InputField
          label="Nominal Middle"
          placeholder="-"
          value={form.middle || ''}
          onChange={(e) => setNominal('middle', e.target.value)}
          disabled={isGeneralFilled}
        />
        <div className='md:col-span-2'>
          <InputField
          label="Nominal Senior"
          placeholder="-"
          value={form.senior || ''}
          onChange={(e) => setNominal('senior', e.target.value)}
          disabled={isGeneralFilled}
        />
        </div>
        
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">* Harap skema nominal yang diisi bersifat eksklusif (pilih salah satu: Nominal General, ATAU Nominal Junior/Middle/Senior).</p>
    </div>
  );

  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={!!submitting}
      maxWidth="max-w-3xl"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default EditKompensasiModal;

// Dokumentasi: Modal Edit Kompensasi
// Tujuan: Menyediakan form edit dengan field Level Jabatan (Select), Kategori (Select),
// Nominal General, Nominal Junior, Nominal Middle, Nominal Senior. Menggunakan wrapper ModalAddEdit.
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Input from '@/components/form/input/InputField';
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
  const { title, form, handleInput, setNominal, LEVEL_JABATAN_OPTIONS, KATEGORI_OPTIONS, handleSubmit } =
    useEditCompensationModal({
      isOpen,
      initialData,
      onClose,
      onSubmit,
    });

  const content = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label>Level Jabatan</Label>
          <Select options={LEVEL_JABATAN_OPTIONS} defaultValue={form.levelJabatan || ''} onChange={(v) => handleInput('levelJabatan', v)} placeholder="Nyesuain struktur Organisasi" />
        </div>
        <div>
          <Label>Kategori</Label>
          <Select options={KATEGORI_OPTIONS} defaultValue={form.kategori || ''} onChange={(v) => handleInput('kategori', v)} placeholder="Gaji Pokok / Uang Saku" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label>Nominal General</Label>
          <Input placeholder="-" value={form.general || ''} onChange={(e) => setNominal('general', e.target.value)} />
        </div>
        <div>
          <Label>Nominal Junior</Label>
          <Input placeholder="-" value={form.junior || ''} onChange={(e) => setNominal('junior', e.target.value)} />
        </div>
        <div>
          <Label>Nominal Middle</Label>
          <Input placeholder="-" value={form.middle || ''} onChange={(e) => setNominal('middle', e.target.value)} />
        </div>
        <div>
          <Label>Nominal Senior</Label>
          <Input placeholder="-" value={form.senior || ''} onChange={(e) => setNominal('senior', e.target.value)} />
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

// Dokumentasi: Modal Edit Kompensasi
// Tujuan: Menyediakan form edit dengan field Level Jabatan (Select), Kategori (Select),
// Nominal General, Nominal Junior, Nominal Middle, Nominal Senior. Menggunakan wrapper ModalAddEdit.
import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Input from '@/components/form/input/InputField';

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

// Dokumentasi: Utility format angka ribuan Indonesia (titik). Membersihkan input ke angka terlebih dahulu.
const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const LEVEL_JABATAN_OPTIONS = [
  { value: 'Direktur', label: 'Direktur' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Supervisor', label: 'Supervisor' },
  { value: 'Senior Officer', label: 'Senior Officer' },
  { value: 'Officer', label: 'Officer' },
  { value: 'Entry Level', label: 'Entry Level' },
  { value: 'Under Staff - Internship', label: 'Under Staff - Internship' },
  { value: 'Under Staff - PKL', label: 'Under Staff - PKL' },
];

const KATEGORI_OPTIONS = [
  { value: 'Gaji Pokok', label: 'Gaji Pokok' },
  { value: 'Uang Saku', label: 'Uang Saku' },
];

// Dokumentasi: Komponen utama modal edit kompensasi
const EditKompensasiModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const [form, setForm] = useState<EditKompensasiForm>({});
  const title = useMemo(() => 'Edit Kompensasi', []);

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData, isOpen]);

  const handleInput = (key: keyof EditKompensasiForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setNominal = (key: keyof EditKompensasiForm, rawValue: string) => {
    setForm((prev) => ({ ...prev, [key]: formatRupiah(rawValue) }));
  };

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
      handleSubmit={() => onSubmit(form)}
      submitting={!!submitting}
      maxWidth="max-w-3xl"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default EditKompensasiModal;


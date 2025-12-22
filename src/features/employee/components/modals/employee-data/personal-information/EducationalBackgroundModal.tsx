// Refactor modal: mendukung Pendidikan Formal & Non-Formal, memindahkan input sosial ke modal terpisah
import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import DatePicker from '@/components/form/date-picker';
import FileInput from '@/components/form/input/FileInput';
import { Plus, Trash2 } from 'react-feather';
import type { EducationItem as EducationItemType } from '@/features/employee/types/FormEmployess';

// Tipe form lokal untuk modal pendidikan (tanpa media sosial)
export type EducationModalForm = {
  education: EducationItemType[];
};

interface Props {
  isOpen: boolean;
  initialData?: EducationModalForm | null;
  onClose: () => void;
  onSubmit: (data: EducationModalForm) => void;
  submitting?: boolean;
}

const JENJANG_OPTIONS = [
  { label: 'SD/MI', value: 'SD' },
  { label: 'SMP/MTs', value: 'SMP' },
  { label: 'SMA/SMK/MA', value: 'SMA' },
  { label: 'Diploma (D3)', value: 'D3' },
  { label: 'Sarjana (S1)', value: 'S1' },
  { label: 'Magister (S2)', value: 'S2' },
  { label: 'Doktor (S3)', value: 'S3' },
];

const JENIS_PENDIDIKAN_OPTIONS = [
  { label: 'Pendidikan Formal', value: 'formal' },
  { label: 'Pendidikan Non-Formal', value: 'non-formal' },
];

// Default satu baris data pendidikan
const defaultEduRow: EducationItemType = {
  jenisPendidikan: 'formal',
  jenjang: '',
  namaLembaga: '',
  gelar: '',
  nilaiPendidikan: '',
  jurusanKeahlian: '',
  tahunLulus: '',
  // Non-formal
  namaSertifikat: '',
  organisasiPenerbit: '',
  tanggalPenerbitan: '',
  tanggalKedaluwarsa: '',
  idKredensial: '',
};

const emptyForm: EducationModalForm = {
  education: [defaultEduRow],
};

// Komponen utama modal pendidikan
const EducationalBackgroundModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  // State form pendidikan
  const [form, setForm] = useState<EducationModalForm>(emptyForm);
  const title = useMemo(() => 'Edit Riwayat Pendidikan', []);

  // Inisialisasi data ketika modal dibuka/initialData berubah
  useEffect(() => {
    const base = initialData ? { ...emptyForm, ...initialData } : emptyForm;
    const ensuredEducation = Array.isArray(base.education) && base.education.length > 0 ? base.education : [defaultEduRow];
    setForm({ ...base, education: ensuredEducation });
  }, [initialData, isOpen]);

  // Handler update field pendidikan per baris
  const updateEducationField = (index: number, field: keyof EducationItemType, value: any) => {
    setForm((prev) => {
      const next = [...prev.education];
      next[index] = { ...next[index], [field]: value } as EducationItemType;
      return { ...prev, education: next };
    });
  };

  // Tambah baris pendidikan
  const addEducationRow = () => {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { ...defaultEduRow }],
    }));
  };

  // Hapus baris pendidikan
  const removeEducationRow = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  // Konten modal: pilihan jenis + field kondisional
  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-start">{title}</h2>
        <h4 className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</h4>
      </div>

      <div>
        <h3 className="text-2xl text-grey-200 font-semibold">Riwayat Pendidikan</h3>
        <div className="space-y-6">
          {form.education.map((edu, idx) => (
            <div className="flex gap-4" key={idx}>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end flex-1">
                {/* Jenis Pendidikan */}
                <div className="md:col-span-5">
                  <Label>Jenis Pendidikan</Label>
                  <Select
                    options={JENIS_PENDIDIKAN_OPTIONS}
                    defaultValue={edu.jenisPendidikan ?? 'formal'}
                    onChange={(value) => updateEducationField(idx, 'jenisPendidikan', value)}
                    placeholder="Pilih jenis"
                  />
                </div>
                <div className="md:col-span-1 flex md:justify-end items-end">
                  {idx === 0 ? (
                    <button
                      type="button"
                      onClick={addEducationRow}
                      className="h-10 w-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center"
                      title="Tambah Pendidikan"
                    >
                      <Plus size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeEducationRow(idx)}
                      className="h-10 w-10 rounded-lg bg-red-600 text-white flex items-center justify-center"
                      title="Hapus Pendidikan"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {/* Field Formal */}
                {(edu.jenisPendidikan ?? 'formal') === 'formal' && (
                  <>
                    <div className="md:col-span-2">
                      <Label>Jenjang</Label>
                      <Select
                        options={JENJANG_OPTIONS}
                        defaultValue={edu.jenjang}
                        onChange={(value) => updateEducationField(idx, 'jenjang', value)}
                        placeholder="Select"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Nama Lembaga</Label>
                      <InputField
                        placeholder="Masukkan nama lembaga"
                        value={edu.namaLembaga}
                        onChange={(e) => updateEducationField(idx, 'namaLembaga', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Gelar</Label>
                      <InputField
                        placeholder="Masukkan gelar"
                        value={edu.gelar}
                        onChange={(e) => updateEducationField(idx, 'gelar', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Nilai Pendidikan Terakhir</Label>
                      <InputField
                        placeholder="Masukkan nilai"
                        value={edu.nilaiPendidikan}
                        onChange={(e) => updateEducationField(idx, 'nilaiPendidikan', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Jurusan / Keahlian</Label>
                      <InputField
                        placeholder="Masukkan jurusan/keahlian"
                        value={edu.jurusanKeahlian}
                        onChange={(e) => updateEducationField(idx, 'jurusanKeahlian', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Tahun Lulus</Label>
                      <InputField
                        placeholder="Masukkan tahun lulus"
                        value={edu.tahunLulus}
                        onChange={(e) => updateEducationField(idx, 'tahunLulus', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Field Non-Formal */}
                {edu.jenisPendidikan === 'non-formal' && (
                  <>
                    <div className="md:col-span-2">
                      <Label>Nama Sertifikat</Label>
                      <InputField
                        placeholder="Masukkan nama sertifikat"
                        value={edu.namaSertifikat || ''}
                        onChange={(e) => updateEducationField(idx, 'namaSertifikat', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Organisasi penerbit</Label>
                      <InputField
                        placeholder="Masukkan organisasi penerbit"
                        value={edu.organisasiPenerbit || ''}
                        onChange={(e) => updateEducationField(idx, 'organisasiPenerbit', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <DatePicker
                        id={`tanggalPenerbitan-${idx}`}
                        label="Tanggal penerbitan"
                        placeholder="Pilih tanggal"
                        defaultDate={edu.tanggalPenerbitan || ''}
                        onChange={(_d, dateStr) => updateEducationField(idx, 'tanggalPenerbitan', dateStr)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <DatePicker
                        id={`tanggalKedaluwarsa-${idx}`}
                        label="Tanggal Kedaluwarsa"
                        placeholder="Pilih tanggal"
                        defaultDate={edu.tanggalKedaluwarsa || ''}
                        onChange={(_d, dateStr) => updateEducationField(idx, 'tanggalKedaluwarsa', dateStr)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>ID Kredensial</Label>
                      <InputField
                        placeholder="Masukkan ID kredensial"
                        value={edu.idKredensial || ''}
                        onChange={(e) => updateEducationField(idx, 'idKredensial', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Upload file</Label>
                      <FileInput onChange={(e) => updateEducationField(idx, 'fileSertifikat', e.target.files?.[0])} />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render modal
  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => onSubmit(form)}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default EducationalBackgroundModal;

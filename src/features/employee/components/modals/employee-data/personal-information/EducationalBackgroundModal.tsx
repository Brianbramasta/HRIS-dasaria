// Refactor modal: mendukung Pendidikan Formal & Non-Formal, memindahkan input sosial ke modal terpisah
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import DatePicker from '@/components/form/date-picker';
import FileInput from '@/components/form/input/FileInput';
import { Trash2 } from 'react-feather';
import { JENIS_PENDIDIKAN_OPTIONS } from '@/features/employee/utils/EmployeeMappings';
import Button from '@/components/ui/button/Button';
import { IconPlus } from '@/icons/components/icons';
import { useEducationalBackgroundModal, EducationModalForm } from '@/features/employee/hooks/modals/employee-data/personal-information/useEducationalBackgroundModal';
export type { EducationModalForm };

interface Props {
  isOpen: boolean;
  initialData?: EducationModalForm | null;
  onClose: () => void;
  onSubmit: (data: EducationModalForm) => void;
  submitting?: boolean;
}

const EducationalBackgroundModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const { title, form, pendidikanOptions, updateEducationField, addEducationRow, removeEducationRow } =
    useEducationalBackgroundModal({ isOpen, initialData });

  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-start">{title}</h2>
        <p className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</p>
      </div>

      <div>
        <h3 className="text-2xl text-[grey] font-semibold">Riwayat Pendidikan</h3>
        <div className="space-y-6">
          {form.education.map((edu, idx) => (
            <div className="flex gap-4" key={idx}>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end flex-1">
                {/* Jenis Pendidikan */}
                <div className="md:col-span-6 flex w-full gap-5">
                  <div className="w-full">
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
                      <Button
                        onClick={addEducationRow}
                        variant="custom"
                        size="custom"
                        className="bg-emerald-500 text-white ring-1 ring-inset ring-emerald-500 hover:bg-emerald-600 h-10 w-10 p-0 flex items-center justify-center"
                        aria-label="Tambah Pendidikan"
                      >
                        <IconPlus size={24} />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => removeEducationRow(idx)}
                        variant="custom"
                        size="custom"
                        className="bg-red-500 text-white ring-1 ring-inset ring-red-500 hover:bg-red-600 h-10 w-10 p-0 flex items-center justify-center"
                        aria-label="Hapus Pendidikan"
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Field Formal */}
                {(edu.jenisPendidikan ?? 'formal') === 'formal' && (
                  <>
                    <div className="md:col-span-2">
                      <Label>Jenjang</Label>
                      <Select
                        options={pendidikanOptions}
                        defaultValue={edu.jenjang}
                        onChange={(value) => updateEducationField(idx, 'jenjang', value)}
                        placeholder="Select"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Nama Lembaga</Label>
                      <InputField
                        placeholder="Masukkan nama lembaga"
                        value={edu.namaLembaga}
                        onChange={(e) => updateEducationField(idx, 'namaLembaga', e.target.value)}
                        required
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
                        type="number"
                        placeholder="Masukkan nilai"
                        value={edu.nilaiPendidikan}
                        onChange={(e) => updateEducationField(idx, 'nilaiPendidikan', e.target.value)}
                        required
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
                        type="number"
                        placeholder="Masukkan tahun lulus"
                        value={edu.tahunLulus}
                        onChange={(e) => updateEducationField(idx, 'tahunLulus', e.target.value)}
                        required
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
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Organisasi penerbit</Label>
                      <InputField
                        placeholder="Masukkan organisasi penerbit"
                        value={edu.organisasiPenerbit || ''}
                        onChange={(e) => updateEducationField(idx, 'organisasiPenerbit', e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <DatePicker
                        id={`tanggalPenerbitan-${idx}`}
                        label="Tanggal penerbitan"
                        placeholder="Pilih tanggal"
                        defaultDate={edu.tanggalPenerbitan || ''}
                        onChange={(_d, dateStr) => updateEducationField(idx, 'tanggalPenerbitan', dateStr)}
                        required
                        
                      />
                    </div>
                    <div className="md:col-span-2">
                      <DatePicker
                        id={`tanggalKedaluwarsa-${idx}`}
                        label="Tanggal Kedaluwarsa"
                        placeholder="Pilih tanggal"
                        defaultDate={edu.tanggalKedaluwarsa || ''}
                        onChange={(_d, dateStr) => updateEducationField(idx, 'tanggalKedaluwarsa', dateStr)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>ID Kredensial</Label>
                      <InputField
                        placeholder="Masukkan ID kredensial"
                        value={edu.idKredensial || ''}
                        onChange={(e) => updateEducationField(idx, 'idKredensial', e.target.value)}
                        required
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

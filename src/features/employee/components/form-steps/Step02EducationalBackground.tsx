// Refactor Step 2: Tambahkan pilihan jenis pendidikan (Formal/Non-Formal)
// dan tampilkan field secara kondisional termasuk DatePicker & FileInput.
import React from 'react';
import InputField from '../../../../components/shared/field/InputField';
import SelectField from '../../../../components/shared/field/SelectField';
import Label from '../../../../components/form/Label';
import Button from '../../../../components/ui/button/Button';
import { Trash2 } from 'react-feather';
import { IconPlus as Plus } from '@/icons/components/icons';
import { EducationItem } from '../../types/FormEmployee';
import DateField from '../../../../components/shared/field/DateField';
import FIleField from '../../../../components/shared/field/FIleField';
import { JENIS_PENDIDIKAN_OPTIONS } from '../../utils/EmployeeMappings';
import { useStep2Data } from '../../hooks/employee-data/form/useFromStep';



export const Step02EducationalBackground: React.FC = () => {
  
  const { pendidikanTerakhir, addEducationRow, removeEducationRow, updateEducationField, handleChange, step2 } = useStep2Data();
  

  // fetching moved to `useStep2Data` hook

 

  

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">Riwayat Pendidikan</h4>

        <div className="space-y-4">
          {(step2.education || []).map((edu: EducationItem, index: number) => (
            <div className="flex gap-4" key={index}>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end flex-1">
                {/* Jenis Pendidikan */}
                <div className="md:col-span-6 flex w-full gap-5">
                    <div className="w-full">
                        <SelectField
                          label="Jenis Pendidikan"
                          options={JENIS_PENDIDIKAN_OPTIONS}
                          defaultValue={edu.jenisPendidikan ?? 'formal'}
                          onChange={(value) => updateEducationField(index, 'jenisPendidikan', value)}
                          placeholder="Pilih jenis"
                        />
                      </div>
                      <div className="md:col-span-1 flex md:justify-end items-end">
                      {index === ((step2.education?.length ?? 0) - 1) ? (
                        <Button
                          onClick={addEducationRow}
                          variant="custom"
                          size="custom"
                          className="bg-emerald-500 text-white ring-1 ring-inset ring-emerald-500 hover:bg-emerald-600 h-10 w-10 p-0 flex items-center justify-center"
                          aria-label="Tambah Pendidikan"
                        >
                          <Plus size={24} />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => removeEducationRow(index)}
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
                

                {/* Formal Fields */}
                {(
                  edu.jenisPendidikan ?? 'formal'
                ) === 'formal' && (
                  <>
                    <div className="md:col-span-2">
                      <SelectField
                        label="Jenjang"
                        options={pendidikanTerakhir}
                        defaultValue={edu.jenjang}
                        onChange={(value) => updateEducationField(index, 'jenjang', value)}
                        placeholder="Select"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputField
                        id={`namaLembaga-${index}`}
                        label="Nama Lembaga"
                        placeholder="Masukkan nama lembaga"
                        value={edu.namaLembaga}
                        onChange={(e) => updateEducationField(index, 'namaLembaga', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputField
                        id={`gelar-${index}`}
                        label="Gelar"
                        placeholder="Masukkan gelar"
                        value={edu.gelar}
                        onChange={(e) => updateEducationField(index, 'gelar', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputField
                        id={`nilaiPendidikan-${index}`}
                        label="Nilai Pendidikan Terakhir"
                        type="number"
                        placeholder="Masukkan nilai"
                        value={edu.nilaiPendidikan}
                        onChange={(e) => updateEducationField(index, 'nilaiPendidikan', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputField
                        id={`jurusanKeahlian-${index}`}
                        label="Jurusan / Keahlian"
                        placeholder="Masukkan jurusan/keahlian"
                        value={edu.jurusanKeahlian}
                        onChange={(e) => updateEducationField(index, 'jurusanKeahlian', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputField
                        type="number"
                        id={`tahunLulus-${index}`}
                        label="Tahun Lulus"
                        placeholder="Masukkan tahun lulus"
                        value={edu.tahunLulus}
                        onChange={(e) => updateEducationField(index, 'tahunLulus', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Non-Formal Fields */}
                {edu.jenisPendidikan === 'non-formal' && (
                  <>
                    <div className="md:col-span-2">
                      <InputField
                        id={`namaSertifikat-${index}`}
                        label="Nama Sertifikat"
                        placeholder="Masukkan nama sertifikat"
                        value={edu.namaSertifikat || ''}
                        onChange={(e) => updateEducationField(index, 'namaSertifikat', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputField
                        id={`organisasiPenerbit-${index}`}
                        label="Organisasi penerbit"
                        placeholder="Masukkan organisasi penerbit"
                        value={edu.organisasiPenerbit || ''}
                        onChange={(e) => updateEducationField(index, 'organisasiPenerbit', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <DateField
                        id={`tanggalPenerbitan-${index}`}
                        label="Tanggal penerbitan"
                        placeholder="Pilih tanggal"
                        defaultDate={edu.tanggalPenerbitan || ''}
                        onChange={(_dates, dateStr) => updateEducationField(index, 'tanggalPenerbitan', dateStr)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <DateField
                        id={`tanggalKedaluwarsa-${index}`}
                        label="Tanggal Kedaluwarsa"
                        placeholder="Pilih tanggal"
                        defaultDate={edu.tanggalKedaluwarsa || ''}
                        onChange={(_dates, dateStr) => updateEducationField(index, 'tanggalKedaluwarsa', dateStr)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputField
                        id={`idKredensial-${index}`}
                        label="ID Kredensial"
                        placeholder="Masukkan ID kredensial"
                        value={edu.idKredensial || ''}
                        onChange={(e) => updateEducationField(index, 'idKredensial', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <FIleField
                        label="Upload file"
                        onChange={(e) => updateEducationField(index, 'fileSertifikat', e.target.files?.[0])}
                      />
                    </div>
                  </>
                )}
              </div>
              
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">Media Sosial & Kontak Darurat</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputField
              id="facebook"
              label="Facebook"
              placeholder="https://www.facebook.com/"
              value={step2.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
            />
          </div>

          <div>
            <InputField
              id="xCom"
              label="X.com"
              placeholder="https://x.com/"
              value={step2.xCom}
              onChange={(e) => handleChange('xCom', e.target.value)}
            />
          </div>

          <div>
            <InputField
              id="linkedin"
              label="LinkedIn"
              placeholder="https://www.linkedin.com/"
              value={step2.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
            />
          </div>

          <div>
            <InputField
              id="instagram"
              label="Instagram"
              placeholder="https://instagram.com/"
              value={step2.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
            />
          </div>

          <div>
            <InputField
              id="akunSosialMediaTerdekat"
              label="Akun Sosial Media Orang Terdekat"
              placeholder="https://www.linkedin.com/"
              value={step2.akunSosialMediaTerdekat}
              onChange={(e) => handleChange('akunSosialMediaTerdekat', e.target.value)}
            />
          </div>

          <div>
            <InputField
              id="noKontakDarurat"
              label="No. Kontak Darurat"
              type="number"
              placeholder="+62"
              value={step2.noKontakDarurat}
              onChange={(e) => handleChange('noKontakDarurat', e.target.value)}
              required
            />
          </div>

          <div>
            <InputField
              id="namaNoKontakDarurat"
              label="Nama No. Kontak Darurat"
              placeholder="Masukkan nama"
              value={step2.namaNoKontakDarurat}
              onChange={(e) => handleChange('namaNoKontakDarurat', e.target.value)}
              required
            />
          </div>

          <div>
            <InputField
              id="hubunganKontakDarurat"
              label="Hubungan dengan Kontak Darurat"
              placeholder="Masukkan hubungan"
              value={step2.hubunganKontakDarurat}
              onChange={(e) => handleChange('hubunganKontakDarurat', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step02EducationalBackground;

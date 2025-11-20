import React, { useEffect } from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import Input from '../../../../components/form/input/InputField';
import Select from '../../../../components/form/Select';
import Label from '../../../../components/form/Label';
import Button from '../../../../components/ui/button/Button';
import { Trash2, Plus } from 'react-feather';
import { EducationItem } from '../../types/FormulirKaryawan';

const JENJANG_OPTIONS = [
  { label: 'SD/MI', value: 'SD' },
  { label: 'SMP/MTs', value: 'SMP' },
  { label: 'SMA/SMK/MA', value: 'SMA' },
  { label: 'Diploma (D3)', value: 'D3' },
  { label: 'Sarjana (S1)', value: 'S1' },
  { label: 'Magister (S2)', value: 'S2' },
  { label: 'Doktor (S3)', value: 'S3' },
];


export const Step02EducationalBackground: React.FC = () => {
  const { formData, updateStep2 } = useFormulirKaryawanStore();
  const step2 = formData.step2;

  useEffect(() => {
    if (!step2.education || step2.education.length === 0) {
      updateStep2({
        education: [
          { jenjang: '', namaLembaga: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' },
        ],
      });
    }
  }, [step2.education, updateStep2]);

  const addEducationRow = () => {
    const education = step2.education || [];
    updateStep2({
      education: [
        ...education,
        { jenjang: '', namaLembaga: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' },
      ],
    });
  };

  const removeEducationRow = (index: number) => {
    const education = step2.education || [];
    updateStep2({ education: education.filter((_, i) => i !== index) });
  };

  const updateEducationField = (
    index: number,
    field: keyof EducationItem,
    value: string,
  ) => {
    const education = step2.education || [];
    const next = education.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    updateStep2({ education: next });
  };

  const handleChange = (field: string, value: string) => {
    updateStep2({ [field]: value } as any);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Riwayat Pendidikan</h3>

        <div className="space-y-4">
          {(step2.education || []).map((edu, index) => (
            <>
            <div className="flex gap-4">
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-1">
                  <Label>Jenjang</Label>
                  <Select
                    options={JENJANG_OPTIONS}
                    defaultValue={edu.jenjang}
                    onChange={(value) => updateEducationField(index, 'jenjang', value)}
                    placeholder="Select"
                  />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor={`namaLembaga-${index}`}>Nama Lembaga</Label>
                  <Input
                    id={`namaLembaga-${index}`}
                    placeholder="Masukkan nama lembaga"
                    value={edu.namaLembaga}
                    onChange={(e) => updateEducationField(index, 'namaLembaga', e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-1">
                  <Label htmlFor={`nilaiPendidikan-${index}`}>Nilai Pendidikan Terakhir</Label>
                  <Input
                    id={`nilaiPendidikan-${index}`}
                    placeholder="Masukkan nilai"
                    value={edu.nilaiPendidikan}
                    onChange={(e) => updateEducationField(index, 'nilaiPendidikan', e.target.value)}
                  />
                </div>

                <div className="md:col-span-1">
                  <Label htmlFor={`jurusanKeahlian-${index}`}>Jurusan / Keahlian</Label>
                  <Input
                    id={`jurusanKeahlian-${index}`}
                    placeholder="Masukkan jurusan/keahlian"
                    value={edu.jurusanKeahlian}
                    onChange={(e) => updateEducationField(index, 'jurusanKeahlian', e.target.value)}
                  />
                </div>

                <div className="md:col-span-1">
                  <Label htmlFor={`tahunLulus-${index}`}>Tahun Lulus</Label>
                  <Input
                    id={`tahunLulus-${index}`}
                    placeholder="Masukkan tahun lulus"
                    value={edu.tahunLulus}
                    onChange={(e) => updateEducationField(index, 'tahunLulus', e.target.value)}
                  />
                </div>
              </div>
                <div className="md:col-span-1 flex md:justify-end items-end">
                  {index === 0 ? (
                    <Button
                      onClick={addEducationRow}
                      variant="custom"
                      size="sm"
                      className="bg-emerald-500 text-white ring-1 ring-inset ring-emerald-500 hover:bg-emerald-600 h-10 w-10 p-0 flex items-center justify-center"
                      aria-label="Tambah Pendidikan"
                    >
                      <Plus size={18} />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => removeEducationRow(index)}
                      variant="custom"
                      size="sm"
                      className="bg-red-500 text-white ring-1 ring-inset ring-red-500 hover:bg-red-600 h-10 w-10 p-0 flex items-center justify-center"
                      aria-label="Hapus Pendidikan"
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
            </div>
            </>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Media Sosial & Kontak Darurat</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              placeholder="https://www.facebook.com/"
              value={step2.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="xCom">X.com</Label>
            <Input
              id="xCom"
              placeholder="https://x.com/"
              value={step2.xCom}
              onChange={(e) => handleChange('xCom', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              placeholder="https://www.linkedin.com/"
              value={step2.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/"
              value={step2.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="akunSosialMediaTerdekat">Akun Sosial Media Orang Terdekat</Label>
            <Input
              id="akunSosialMediaTerdekat"
              placeholder="https://www.linkedin.com/"
              value={step2.akunSosialMediaTerdekat}
              onChange={(e) => handleChange('akunSosialMediaTerdekat', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="noKontakDarurat">No. Kontak Darurat</Label>
            <Input
              id="noKontakDarurat"
              placeholder="+62"
              value={step2.noKontakDarurat}
              onChange={(e) => handleChange('noKontakDarurat', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="namaNoKontakDarurat">Nama No. Kontak Darurat</Label>
            <Input
              id="namaNoKontakDarurat"
              placeholder="Masukkan nama"
              value={step2.namaNoKontakDarurat}
              onChange={(e) => handleChange('namaNoKontakDarurat', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="hubunganKontakDarurat">Hubungan dengan Kontak Darurat</Label>
            <Input
              id="hubunganKontakDarurat"
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

import React, { useState } from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import Input from '../../../../components/form/input/InputField';
import Select from '../../../../components/form/Select';
import Label from '../../../../components/form/Label';
import Button from '../../../../components/ui/button/Button';
import { Trash2, Plus } from 'react-feather';
import { EducationItem } from '../../types/FormulirKaryawan';

const LEMBAGA_OPTIONS = [
  { label: 'SD/MI', value: 'sd' },
  { label: 'SMP/MTs', value: 'smp' },
  { label: 'SMA/SMK/MA', value: 'sma' },
  { label: 'Diploma (D3)', value: 'd3' },
  { label: 'Sarjana (S1)', value: 's1' },
  { label: 'Magister (S2)', value: 's2' },
  { label: 'Doktor (S3)', value: 's3' },
];

const JURUSAN_OPTIONS = [
  { label: 'Teknik Informatika', value: 'teknik_informatika' },
  { label: 'Administrasi Bisnis', value: 'administrasi_bisnis' },
  { label: 'Akuntansi', value: 'akuntansi' },
  { label: 'Manajemen', value: 'manajemen' },
  { label: 'Hukum', value: 'hukum' },
  { label: 'Pendidikan', value: 'pendidikan' },
  { label: 'Lainnya', value: 'lainnya' },
];

export const Step2EducationalBackground: React.FC = () => {
  const { formData, updateStep2 } = useFormulirKaryawanStore();
  const step2 = formData.step2;
  const [newEducation, setNewEducation] = useState<EducationItem>({
    namaLembaga: '',
    nilaiPendidikan: '',
    jurusanKeahlian: '',
    tahunLulus: '',
  });

  const handleAddEducation = () => {
    if (
      newEducation.namaLembaga &&
      newEducation.nilaiPendidikan &&
      newEducation.jurusanKeahlian &&
      newEducation.tahunLulus
    ) {
      const education = step2.education || [];
      updateStep2({
        education: [...education, newEducation],
      });
      setNewEducation({
        namaLembaga: '',
        nilaiPendidikan: '',
        jurusanKeahlian: '',
        tahunLulus: '',
      });
    }
  };

  const handleRemoveEducation = (index: number) => {
    const education = step2.education || [];
    updateStep2({
      education: education.filter((_, i) => i !== index),
    });
  };

  const handleChange = (field: string, value: string) => {
    updateStep2({ [field]: value } as any);
  };

  return (
    <div className="space-y-6">
      {/* Educational Background Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Educational Background
        </h3>

        <div className="space-y-4">
          {/* Add Education Form */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nama Lembaga</Label>
                <Select
                  options={LEMBAGA_OPTIONS}
                  defaultValue={newEducation.namaLembaga}
                  onChange={(value) =>
                    setNewEducation({
                      ...newEducation,
                      namaLembaga: value,
                    })
                  }
                  placeholder="Select"
                />
              </div>

              <div>
                <Label htmlFor="nilaiPendidikan">Nilai Pendidikan Terakhir</Label>
                <Input
                  id="nilaiPendidikan"
                  placeholder="Masukkan nilai"
                  value={newEducation.nilaiPendidikan}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      nilaiPendidikan: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Jurusan / Keahlian</Label>
                <Select
                  options={JURUSAN_OPTIONS}
                  defaultValue={newEducation.jurusanKeahlian}
                  onChange={(value) =>
                    setNewEducation({
                      ...newEducation,
                      jurusanKeahlian: value,
                    })
                  }
                  placeholder="Select"
                />
              </div>

              <div>
                <Label htmlFor="tahunLulus">Tahun Lulus</Label>
                <Input
                  id="tahunLulus"
                  placeholder="Masukkan tahun lulus"
                  value={newEducation.tahunLulus}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      tahunLulus: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleAddEducation}
              variant="primary"
              size="sm"
              className="mt-4 flex items-center gap-2"
            >
              <Plus size={16} />
              Tambah Pendidikan
            </Button>
          </div>

          {/* Education List */}
          {(step2.education || []).length > 0 && (
            <div className="space-y-2">
              {step2.education.map((edu, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {edu.namaLembaga} - {edu.jurusanKeahlian}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nilai: {edu.nilaiPendidikan} | Tahun: {edu.tahunLulus}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveEducation(index)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Media Sosial & Kontak Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Media Sosial & Kontak Darurat
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Facebook */}
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              placeholder="https://www.facebook.com/"
              value={step2.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
            />
          </div>

          {/* X.com */}
          <div>
            <Label htmlFor="xCom">X.com</Label>
            <Input
              id="xCom"
              placeholder="https://x.com/"
              value={step2.xCom}
              onChange={(e) => handleChange('xCom', e.target.value)}
            />
          </div>

          {/* LinkedIn */}
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              placeholder="https://www.linkedin.com/"
              value={step2.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
            />
          </div>

          {/* Instagram */}
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/"
              value={step2.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
            />
          </div>

          {/* Akun Sosial Media Orang Terdekat */}
          <div>
            <Label htmlFor="akunSosialMediaTerdekat">Akun Sosial Media Orang Terdekat</Label>
            <Input
              id="akunSosialMediaTerdekat"
              placeholder="https://www.linkedin.com/"
              value={step2.akunSosialMediaTerdekat}
              onChange={(e) => handleChange('akunSosialMediaTerdekat', e.target.value)}
            />
          </div>

          {/* No. Kontak Darurat */}
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

          {/* Nama No. Kontak Darurat */}
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

          {/* Hubungan dengan Kontak Darurat */}
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

export default Step2EducationalBackground;

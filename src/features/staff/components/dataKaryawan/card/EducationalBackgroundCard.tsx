import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
// Card: tampilkan pendidikan Formal & Non-Formal, modal pendidikan tanpa media sosial
import EducationalBackgroundModal, { type EducationModalForm } from '@/features/staff/components/modals/dataKaryawan/PersonalInformation/EducationalBackgroundModal';
import type { KaryawanDetailResponse } from '@/features/staff/services/karyawanService';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';

interface Props {
  education: KaryawanDetailResponse['education'];
}

// Komponen utama kartu Riwayat Pendidikan
export default function EducationalBackgroundCard({ education }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  // Data awal untuk modal pendidikan (tanpa input media sosial)
  const initialData: EducationModalForm = {
    education: [{ jenjang: '', namaLembaga: '', gelar: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' }],
  };
  const isComplete = Array.isArray(education) && education.length > 0 && education.every((e: any) =>
    !!e?.jenjang && !!e?.namaLembaga && !!e?.nilaiPendidikan && !!e?.jurusanKeahlian && !!e?.tahunLulus
  );
  const defaultEducation: Array<Record<string, any>> = [
    {
      jenjang: 'S1',
      namaLembaga: 'Universitas Brawijaya',
      gelar: 'S.KOM',
      nilaiPendidikan: '4.0',
      jurusanKeahlian: 'Manajemen',
      tahunLulus: '2020',
    },
    {
      jenjang: 'S1',
      namaLembaga: 'Universitas Brawijaya',
      gelar: 'S.KOM',
      nilaiPendidikan: '4.0',
      jurusanKeahlian: 'Manajemen',
      tahunLulus: '2020',
    },
  ];
  // Data dummy untuk Pendidikan Non-Formal
  const defaultNonFormalEducation: Array<Record<string, any>> = [
    {
      jenisPendidikan: 'non-formal',
      namaSertifikat: 'Certified Scrum Master',
      organisasiPenerbit: 'Scrum Alliance',
      tanggalPenerbitan: '2023-06-10',
      tanggalKedaluwarsa: '2025-06-10',
      idKredensial: 'CSM-123456',
      filePath: 'sertifikat-scrum.pdf',
    },
    {
      jenisPendidikan: 'non-formal',
      namaSertifikat: 'Professional Data Analyst',
      organisasiPenerbit: 'Coursera',
      tanggalPenerbitan: '2022-04-21',
      tanggalKedaluwarsa: '2026-04-21',
      idKredensial: 'PDA-987654',
      filePath: 'sertifikat-data-analyst.pdf',
    },
  ];
  const displayEducation = Array.isArray(education) && education.length > 0 ? education : defaultEducation;
  // Kelompokkan ke Formal & Non-Formal (default backend belum kirim jenis, anggap formal)
  const formalItems = (displayEducation || []).filter((it: any) => (it?.jenisPendidikan ?? 'formal') !== 'non-formal');
  const nonFormalFiltered = (displayEducation || []).filter((it: any) => it?.jenisPendidikan === 'non-formal');
  const nonFormalItems = nonFormalFiltered.length > 0 ? nonFormalFiltered : defaultNonFormalEducation;
  return (
    <ExpandCard title="Riwayat Pendidikan" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      {/* Pendidikan Formal */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold">Pendidikan Formal</h4>
        {formalItems.map((item, idx) => {
          const anyItem = item as unknown as Record<string, any>;
          return (
            <div key={idx} className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>Jenjang</Label>
                <InputField value={(anyItem.jenjang || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Nama Lembaga</Label>
                <InputField value={(item?.namaLembaga || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Gelar</Label>
                <InputField value={(anyItem.gelar || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Nilai Pendidikan Terakhir</Label>
                <InputField value={(item?.nilaiPendidikan || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Jurusan / Keahlian</Label>
                <InputField value={(item?.jurusanKeahlian || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Tahun Lulus</Label>
                <InputField value={(item?.tahunLulus || '') as string} readonly={true} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Pendidikan Non-Formal */}
      {nonFormalItems.length > 0 && (
        <div className="mt-8 space-y-6">
          <h4 className="text-lg font-semibold">Pendidikan Non-Formal</h4>
          {nonFormalItems.map((item, idx) => (
            <div key={`nonformal-${idx}`} className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>Nama Sertifikat</Label>
                <InputField value={((item as any)?.namaSertifikat || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Organisasi penerbit</Label>
                <InputField value={((item as any)?.organisasiPenerbit || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Tanggal penerbitan</Label>
                <InputField value={((item as any)?.tanggalPenerbitan || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Tanggal Kedaluwarsa</Label>
                <InputField value={((item as any)?.tanggalKedaluwarsa || '') as string} readonly={true} />
              </div>
              <div>
                <Label>ID Kredensial</Label>
                <InputField value={((item as any)?.idKredensial || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Upload file</Label>
                <InputField value={(((item as any)?.fileSertifikat?.name) || (item as any)?.filePath || '') as string} readonly={true} />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <Button variant="primary" size="sm" onClick={openModal}>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

      <EducationalBackgroundModal
        isOpen={isOpen}
        initialData={initialData}
        onClose={closeModal}
        onSubmit={(payload) => {
          // Simpan perubahan pendidikan (formal & non-formal)
          console.log('Save Education', payload);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}

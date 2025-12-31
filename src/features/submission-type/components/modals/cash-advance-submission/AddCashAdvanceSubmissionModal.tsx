// Dokumentasi: Modal "Pengajuan Kasbon"
// - Menggunakan wrapper `ModalAddEdit` untuk struktur modal umum
// - Field: Id Karyawan, Nama Lengkap, Departemen, Posisi, Gaji Pokok, Tanggal Pengajuan (DatePicker),
//   Jenis Kasbon (Select), Nominal Kasbon (maks 25% dari gaji pokok), Periode Cicilan (Select),
//   Nominal Cicilan (otomatis), Surat Persetujuan Atasan (FileInput), Dokumen Pendukung (FileInput multiple), Keterangan (TextArea)
// - Validasi: Nominal Kasbon dibatasi 25% dari Gaji Pokok; Nominal Cicilan dihitung otomatis dari periode
import React, { useMemo, useState, useEffect } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import DatePicker from '@/components/form/date-picker';
import FileInput from '@/components/form/input/FileInput';
import TextArea from '@/components/form/input/TextArea';
import PopupBerhasil from '../../shared/modals/SuccessModal';
import Alert from '@/components/ui/alert/Alert';

export type PengajuanKasbonForm = {
  idKaryawan: string;
  namaLengkap: string;
  departemen: string;
  posisi: string;
  gajiPokok: number;
  tanggalPengajuan: string; // format d/m/Y dari flatpickr
  jenisKasbon: string;
  nominalKasbon: number;
  periodeCicilan: string; // menyimpan angka bulan sebagai string, misal '3', '6', '12'
  nominalCicilan: number;
  suratPersetujuanAtasan?: File | null;
  dokumenPendukung?: File[];
  keterangan: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<PengajuanKasbonForm> | null;
  onSave?: (values: PengajuanKasbonForm) => void;
}

// Dokumentasi: Komponen utama modal pengajuan kasbon dengan state lokal dan perhitungan otomatis
const AddPengajuanKasbonModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave }) => {
  const jenisKasbonOptions = useMemo(() => [
    { value: 'Darurat', label: 'Darurat' },
    { value: 'Keperluan Pribadi', label: 'Keperluan Pribadi' },
    { value: 'Medis/Kesehatan', label: 'Medis/Kesehatan' },
    { value: 'Lainnya', label: 'Lainnya' },
  ], []);

  const periodeOptions = useMemo(() => [
    { value: '3', label: '3 Bulan' },
    { value: '6', label: '6 Bulan' },
    { value: '12', label: '12 Bulan' },
  ], []);

  const initial: PengajuanKasbonForm = useMemo(() => ({
    idKaryawan: defaultValues?.idKaryawan ?? '',
    namaLengkap: defaultValues?.namaLengkap ?? '',
    departemen: defaultValues?.departemen ?? '',
    posisi: defaultValues?.posisi ?? '',
    gajiPokok: defaultValues?.gajiPokok ?? 0,
    tanggalPengajuan: defaultValues?.tanggalPengajuan ?? '',
    jenisKasbon: defaultValues?.jenisKasbon ?? '',
    nominalKasbon: defaultValues?.nominalKasbon ?? 0,
    periodeCicilan: defaultValues?.periodeCicilan ?? '',
    nominalCicilan: defaultValues?.nominalCicilan ?? 0,
    suratPersetujuanAtasan: defaultValues?.suratPersetujuanAtasan ?? null,
    dokumenPendukung: defaultValues?.dokumenPendukung ?? [],
    keterangan: defaultValues?.keterangan ?? '',
  }), [defaultValues]);

  const [form, setForm] = useState<PengajuanKasbonForm>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [isOpen, initial]);

  const setField = (key: keyof PengajuanKasbonForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Dokumentasi: Menjamin nominal kasbon <= 25% dari gaji pokok dan menghitung cicilan otomatis
  useEffect(() => {
    const maxKasbon = (form.gajiPokok || 0) * 0.25;
    let nominalKasbon = form.nominalKasbon || 0;
    if (nominalKasbon > maxKasbon) {
      nominalKasbon = Math.floor(maxKasbon);
    }
    const periode = parseInt(form.periodeCicilan || '0', 10);
    const nominalCicilan = periode > 0 ? Math.ceil(nominalKasbon / periode) : 0;
    setForm((prev) => ({ ...prev, nominalKasbon, nominalCicilan }));
  }, [form.gajiPokok, form.nominalKasbon, form.periodeCicilan]);

  // Dokumentasi: Validasi untuk memeriksa apakah form memenuhi syarat dan ketentuan
  const isFormValid = useMemo(() => {
    return (
      form.tanggalPengajuan &&
      form.jenisKasbon &&
      form.nominalKasbon > 0 &&
      form.periodeCicilan &&
      form.suratPersetujuanAtasan &&
      form.keterangan.trim() !== ''
    );
  }, [form]);

  const content = (
    <div className="space-y-6">
    <h2 className="text-3xl font-bold text-start mb-4">Pengajuan Kasbon</h2>
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        {/* Dokumentasi: Konten ketentuan pengajuan kasbon diperbarui sesuai permintaan */}
        <p>Ketentuan Pengajuan Kasbon :</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Harap melapirkan dokumen yang diminta, yaitu: <span className="font-semibold">Surat Persetujuan Atasan</span> dan <span className="font-semibold">Surat Dokumen Pendukung</span>.</li>
          <li>Hanya format JPG dan PDF yang diperbolehkan. Ukuran maksimum masing-masing dokumen <span className="font-semibold">10MB</span>.</li>
          <li>Contoh <span className="font-semibold">Surat Persetujuan Atasan</span> bisa {' '}
          <a href="#" className="text-brand-600 underline">klik disini</a>.</li>
        </ul>
        {/* <p>
          Contoh <span className="font-semibold">Surat Persetujuan Atasan</span> bisa klik{' '}
          <a href="#" className="text-brand-600 underline">disini</a>.
        </p> */}
      </div>
      
      {/* Dokumentasi: Alert error ditampilkan jika form tidak memenuhi syarat */}
      {!isFormValid ? (
        <Alert
          variant="error"
          title="Mohon maaf anda belum memenuhi Syarat dan Ketentuan untuk melakukan pengajuan kasbon."
          message=""
        />
      ):(<> <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label>NIP</Label>
          <Input placeholder="Masukkan NIP" value={form.idKaryawan} onChange={(e) => setField('idKaryawan', e.target.value)} disabled/>
        </div>
        <div>
          <Label>Nama Lengkap</Label>
          <Input placeholder="Masukkan nama lengkap" value={form.namaLengkap} onChange={(e) => setField('namaLengkap', e.target.value)} disabled/>
        </div>
        <div>
          <Label>Departemen</Label>
          <Input placeholder="Masukkan departemen" value={form.departemen} onChange={(e) => setField('departemen', e.target.value)} disabled/>
        </div>
        <div>
          <Label>Posisi</Label>
          <Input placeholder="Masukkan posisi" value={form.posisi} onChange={(e) => setField('posisi', e.target.value)} disabled/>
        </div>
        <div>
          <Label>Gaji Pokok</Label>
          <Input type="number" placeholder="Masukkan gaji pokok" value={form.gajiPokok || ''} onChange={(e) => setField('gajiPokok', parseInt(e.target.value || '0', 10))} disabled/>
        </div>
        <div>
          <DatePicker id="tanggal-pengajuan-kasbon" label="Tanggal Pengajuan" placeholder="Pilih tanggal" onChange={(_, dateStr) => setField('tanggalPengajuan', dateStr)} />
        </div>
        <div>
          <Label>Jenis Kasbon</Label>
          <Select options={jenisKasbonOptions} placeholder="Select" defaultValue={form.jenisKasbon} onChange={(v) => setField('jenisKasbon', v)} />
        </div>
        <div>
          <Label>Nominal Kasbon <span className="text-xs text-gray-500">(maksimal 25% dari gaji pokok)</span></Label>
          <Input type="number" placeholder="Inputan" value={form.nominalKasbon || ''} onChange={(e) => setField('nominalKasbon', parseInt(e.target.value || '0', 10))} />
        </div>
        <div>
          <Label>Periode Cicilan</Label>
          <Select options={periodeOptions} placeholder="Pilihan Menyesuaikan sisa kontrak" defaultValue={form.periodeCicilan} onChange={(v) => setField('periodeCicilan', v)} />
        </div>
        <div>
          <Label>Nominal Cicilan</Label>
          <Input type="number" placeholder="Otomatis" value={form.nominalCicilan || ''} readonly />
        </div>
        <div>
          <Label>Surat Persetujuan Atasan</Label>
          <FileInput onChange={(e) => setField('suratPersetujuanAtasan', e.target.files?.[0] || null)} />
        </div>
        <div>
          <Label>Unggah Dokumen Pendukung (Opsional)</Label>
          <FileInput multiple onChange={(e) => setField('dokumenPendukung', e.target.files ? Array.from(e.target.files) : [])} />
        </div>
      </div>
      <div>
        <Label>Keterangan</Label>
        <TextArea placeholder="Berikan alasan mendetail..." value={form.keterangan} onChange={(value) => setField('keterangan', value)} rows={4} />
      </div></>)}
     
    </div>
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (onSave) onSave(form);
      onClose();
      // Show success popup after closing the main modal
      setTimeout(() => setShowSuccessPopup(true), 300);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <>
      <ModalAddEdit
      //   title={'Pengajuan Kasbon'}
        isOpen={isOpen}
        onClose={onClose}
        content={content}
        handleSubmit={handleSubmit}
        submitting={submitting}
        maxWidth="max-w-4xl"
        confirmTitleButton="Submit"
        closeTitleButton="Tutup"
      />
      <PopupBerhasil
        isOpen={showSuccessPopup}
        onClose={handleCloseSuccessPopup}
        title="Pengajuan Kasbon Berhasil Dikirim"
        description='"Terima kasih, pengajuan Kasbon Anda telah berhasil dikirim dan kini Menunggu Persetujuan. Jika pengajuan diterima maka akan dikonfirmasi Secepatnya oleh HR."'
      />
    </>
  );
};

export default AddPengajuanKasbonModal;


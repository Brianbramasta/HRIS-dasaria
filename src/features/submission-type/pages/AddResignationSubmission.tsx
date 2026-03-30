// Dokumentasi: Halaman "Pengunduran Diri"
// - Menggunakan form langsung tanpa modal wrapper
// - Field disabled: Nomor/Id Karyawan, Nama Lengkap, Perusahaan, Direktorat, Divisi, Departement, Posisi
// - Field aktif: Tanggal Pengajuan (DatePicker), Alasan Pengunduran Diri (TextArea), Surat Pengunduran Diri (FileInput)
// - Submit akan mengirim seluruh nilai form dan menampilkan popup sukses
import React from 'react';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import DatePicker from '@/components/form/date-picker';
import TextArea from '@/components/form/input/TextArea';
import FileInput from '@/components/shared/form/FileInput';
import PopupBerhasil from '../components/shared/modals/SuccessModal';
import { useAddResignationSubmission } from '@/features/submission-type/hooks/resignation-submission/useAddResignationSubmission';
import { useNavigate } from 'react-router';

const AddResignationSubmission: React.FC = () => {
  const navigate = useNavigate();
  const { form, submitting, showSuccessPopup, setField, handleSubmit, handleCloseSuccessPopup } =
    useAddResignationSubmission({ 
      isOpen: true, 
      onClose: () => navigate('/submission-types'),
      onSave: undefined 
    });

  const handleSuccessClose = () => {
    handleCloseSuccessPopup();
    navigate('/submission-types');
  };

  return (
    <>
      <div className="p-6">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-start mb-4">Pengunduran Diri</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {/* Dokumentasi: Konten ketentuan pengunduran diri diperbarui sesuai permintaan */}
            <p>Ketentuan Unggah Dokumen:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Harap menyerahkan dokumen wajib yang diminta, yaitu: <span className="font-semibold">Surat Pengunduran Diri</span>, <span className="font-semibold">Surat Keterangan Bebas Hutang</span> dan <span className="font-semibold">Surat Keterangan Bebas Aset Perusahaan</span>.</li>
              <li>Hanya format JPG dan PDF yang diperbolehkan. Ukuran maksimum masing-masing dokumen <span className="font-semibold">10MB</span>.</li>
              <li>Contoh <span className="font-semibold">SURAT PENGUNDURAN DIRI</span> bisa{' '} 
              <a href="#" className="text-brand-600 underline">klik disini</a>.</li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>NIP</Label>
              <Input placeholder="-" value={form.idKaryawan} disabled />
            </div>
            <div>
              <Label>Nama Lengkap</Label>
              <Input placeholder="-" value={form.namaLengkap} disabled />
            </div>
            <div>
              <Label>Perusahaan</Label>
              <Input placeholder="-" value={form.perusahaan} disabled />
            </div>
            <div>
              <Label>Direktorat</Label>
              <Input placeholder="-" value={form.direktorat} disabled />
            </div>
            <div>
              <Label>Divisi</Label>
              <Input placeholder="-" value={form.divisi} disabled />
            </div>
            <div>
              <Label>Departement</Label>
              <Input placeholder="-" value={form.departement} disabled />
            </div>
            <div>
              <Label>Posisi</Label>
              <Input placeholder="-" value={form.posisi} disabled />
            </div>
            <div>
              <DatePicker id="tanggal-pengajuan-resign" label="Tanggal Pengajuan" placeholder="Pilih tanggal" onChange={(_, dateStr) => setField('tanggalPengajuan', dateStr)} />
            </div>
          </div>

          <div>
            <Label>Alasan Pengunduran diri</Label>
            <TextArea placeholder="Tuliskan alasan secara mendetail..." value={form.alasan} onChange={(v) => setField('alasan', v)} rows={5} />
          </div>

          <div>
            <Label>Surat Pengunduran Diri</Label>
            <FileInput skFileName={form.suratPengunduranDiri ? form.suratPengunduranDiri.name : ''} onChange={(e) => setField('suratPengunduranDiri', e.target.files?.[0] || null)} isLabel={false} />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/submission-types')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50"
            >
              {submitting ? 'Mengirim...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      <PopupBerhasil
        isOpen={showSuccessPopup}
        onClose={handleSuccessClose}
        title="Pengajuan Pengunduran Diri Berhasil Dikirim"
        description='"Terima kasih, pengajuan pengunduran diri Anda telah berhasil dikirim. Dokumen Anda kini sedang menunggu peninjauan dan persetujuan dari HRD. Anda akan dihubungi oleh tim HR kami mengenai langkah selanjutnya."'
      />
    </>
  );
};

export default AddResignationSubmission;
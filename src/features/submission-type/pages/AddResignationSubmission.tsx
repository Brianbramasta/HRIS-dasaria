// Dokumentasi: Halaman "Pengunduran Diri"
// - Menggunakan form langsung tanpa modal wrapper
// - Field disabled: Nomor/Id Karyawan, Nama Lengkap, Perusahaan, Direktorat, Divisi, Departement, Posisi
// - Field aktif: Tanggal Pengajuan (DatePicker), Alasan Pengunduran Diri (TextArea), Surat Pengunduran Diri (FileInput)
// - Submit akan mengirim seluruh nilai form dan menampilkan popup sukses
import React, { useEffect, useState } from 'react';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import FIleField from '@/components/shared/field/FIleField';
import DatePicker from '@/components/form/date-picker';
import PopupBerhasil from '../components/shared/modals/SuccessModal';
import { useAddResignationSubmission } from '@/features/submission-type/hooks/resignation-submission/useAddResignationSubmission';
import { useSearchParams } from 'react-router';
import { useApiSubmissionType } from '@/features/submission-type/hooks/api/useApiSubmissionType';

const AddResignationSubmission: React.FC = () => {
  const { form, setField } =
    useAddResignationSubmission({ 
      isOpen: true, 
      onClose: () => window.location.href = '/submission-types',
      onSave: undefined 
    });

  const { fetchSelfServiceResignation, selfServiceResignationInfo, updateResignationDetail } = useApiSubmissionType();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      fetchSelfServiceResignation(token);
    }
  }, [token, fetchSelfServiceResignation]);

  useEffect(() => {
    if (selfServiceResignationInfo) {
      // Populate form with self-service data
      setField('idKaryawan', selfServiceResignationInfo.nip || '');
      setField('namaLengkap', selfServiceResignationInfo.full_name || '');
      setField('perusahaan', selfServiceResignationInfo.company_name || '');
      setField('direktorat', selfServiceResignationInfo.directorate_name || '');
      setField('divisi', selfServiceResignationInfo.division_name || '');
      setField('departement', selfServiceResignationInfo.department_name || '');
      setField('posisi', selfServiceResignationInfo.position_name || '');
      setField('tanggalPengajuan', selfServiceResignationInfo.tangal_pengajuan || '');
    }
  }, [selfServiceResignationInfo]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      console.error('No token found');
      return;
    }
    
    console.log('Form state saat submit:', {
      suratPengunduranDiri: form.suratPengunduranDiri,
      suratKomitmenPelunasan: form.suratKomitmenPelunasan,
      alasan: form.alasan
    });
    
    setIsSubmitting(true);
    try {
      const payload: any = {
        resignation_reason: form.alasan,
      };
      
      if (form.suratKomitmenPelunasan) {
        payload.letter_of_commitment = form.suratKomitmenPelunasan;
      }
      
      if (form.suratPengunduranDiri) {
        payload.document_lampiran = form.suratPengunduranDiri;
      }
      
      console.log('Payload yang akan dikirim:', payload);
      
      const success = await updateResignationDetail(token, payload);
      if (success) {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Failed to submit resignation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = '/submission-types';
  };

  return (
    <>
      <div className="p-6">
        <form id="resignation-form" onSubmit={handleFormSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-start mb-4">Pengunduran Diri</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p className="font-semibold">Ketentuan Pengajuan Pengunduran Diri</p>
            <ul className="list-disc ml-5 space-y-2">
              <li>Harap melampirkan dokumen Surat Pengunduran Diri dengan template <span className="font-semibold"><a href="https://docs.google.com/document/d/12qhK_EnSgxFvrOvKe0w9mrTTWPTqJHlc/edit?usp=sharing&ouid=110001047973938417860&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">sesuai tautan berikut.</a></span>{' '}
              
              </li>
              {selfServiceResignationInfo?.status_kasbon && (
                <li>Harap melampirkan dokumen Komitmen Pelunasan Kasbon dengan template <span className="font-semibold"><a href="https://docs.google.com/document/d/1f9_IC1hI1Ag0mJ6TVAZdggM_W7DsFmdhXJYnULdBLdY/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">sesuai tautan berikut.</a></span>{' '}
                
                </li>
              )} 
              <li>Dokumen wajib berformat PDF dengan ukuran maksimal 10 MB.</li>
              <li>Jika pengajuan pengunduran diri Anda disetujui, berikut panduan Exit Clearance yang perlu Anda lakukan ke depannya. Silakan akses dengan{' '}
              <a href="https://docs.google.com/document/d/1wPLRFsx8WeBlYzwvmKuM-0Yipkg8P8j4-rjT88rUYJs/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline font-semibold">klik disini</a>.
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="NIP"
              placeholder="-"
              value={form.idKaryawan}
              disabled
            />
            <InputField
              label="Nama Lengkap"
              placeholder="-"
              value={form.namaLengkap}
              disabled
            />
            <InputField
              label="Perusahaan"
              placeholder="-"
              value={form.perusahaan}
              disabled
            />
            <InputField
              label="Direktorat"
              placeholder="-"
              value={form.direktorat}
              disabled
            />
            <InputField
              label="Divisi"
              placeholder="-"
              value={form.divisi}
              disabled
            />
            <InputField
              label="Departement"
              placeholder="-"
              value={form.departement}
              disabled
            />
            <InputField
              label="Posisi"
              placeholder="-"
              value={form.posisi}
              disabled
            />
            <div>
              <DatePicker id="tanggal-pengajuan-resign" label="Tanggal Pengajuan" placeholder="Pilih tanggal" defaultDate={form.tanggalPengajuan} disabled />
            </div>
            <FIleField
              label="Surat Pengunduran Diri"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField('suratPengunduranDiri', e.target.files?.[0] || null)}
              acceptedFormats={['application/pdf']}
              required
              aria-required="true"
            />
            {selfServiceResignationInfo?.status_kasbon && (
              <FIleField
                label="Surat Komitmen Pelunasan"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField('suratKomitmenPelunasan', e.target.files?.[0] || null)}
                acceptedFormats={['application/pdf']}
                required
                aria-required="true"
              />
          )}
          </div>

          
          
          

          <TextAreaField
            label="Alasan Pengunduran diri"
            placeholder="Tuliskan alasan secara mendetail..."
            value={form.alasan}
            onChange={(v) => setField('alasan', v)}
            rows={5}
            required
            aria-required="true"
          />

          

          <div className="flex justify-end space-x-3">
            {/* <button
              type="button"
              onClick={() => window.location.href = '/submission-types'}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Tutup
            </button> */}
            <button
              type="submit"
              form="resignation-form"
              disabled={isSubmitting}
              className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      <PopupBerhasil
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Pengajuan Pengunduran Diri Berhasil Dikirim"
        description='"Terima kasih, pengajuan pengunduran diri Anda telah berhasil dikirim. Dokumen Anda kini sedang menunggu peninjauan dan persetujuan dari HRD. Anda akan dihubungi oleh tim HR kami mengenai langkah selanjutnya."'
      />
    </>
  );
};

export default AddResignationSubmission;
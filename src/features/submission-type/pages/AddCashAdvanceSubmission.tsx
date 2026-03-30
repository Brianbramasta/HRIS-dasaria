// Dokumentasi: Halaman "Pengajuan Kasbon"
// - Menggunakan form langsung tanpa modal wrapper
// - Field: Id Karyawan, Nama Lengkap, Departemen, Posisi, Gaji Pokok, Tanggal Pengajuan (DatePicker),
//   Jenis Kasbon (Select), Nominal Kasbon (maks 25% dari gaji pokok), Periode Cicilan (Select),
//   Nominal Cicilan (otomatis), Surat Persetujuan Atasan (FileInput), Dokumen Pendukung (FileInput multiple), Keterangan (TextArea)
// - Validasi: Nominal Kasbon dibatasi 25% dari Gaji Pokok; Nominal Cicilan dihitung otomatis dari periode
import React, { useEffect, useMemo, useState } from 'react';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import DatePicker from '@/components/form/date-picker';
import FileInput from '@/components/form/input/FileInput';
import TextArea from '@/components/form/input/TextArea';
import PopupBerhasil from '../components/shared/modals/SuccessModal';
import Alert from '@/components/ui/alert/Alert';
import { useAddCashAdvanceSubmission } from '@/features/submission-type/hooks/cash-advance-submission/useAddCashAdvanceSubmission';
import { useApiSubmissionType } from '@/features/submission-type/hooks/api/useApiSubmissionType';
import { formatCurrency, parseCurrency } from '@/utils/formatCurrency';
import { useNavigate, useSearchParams } from 'react-router';

const AddCashAdvanceSubmission: React.FC = () => {
  const navigate = useNavigate();
  const {
    periodeOptions,
    form,
    submitting,
    setField,
    isFormValid,
  } = useAddCashAdvanceSubmission({ 
    isOpen: true, 
    onClose: () => navigate('/submission-types'),
    onSave: undefined 
  });

  const { loanTypes, fetchLoanTypes, fetchSelfServiceLoan, selfServiceLoanInfo, updateLoanDetail } = useApiSubmissionType();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    fetchLoanTypes();
  }, [fetchLoanTypes]);

  useEffect(() => {
    if (token) {
      fetchSelfServiceLoan(token);
    }
  }, [token, fetchSelfServiceLoan]);

  useEffect(() => {
    if (selfServiceLoanInfo) {
      // Populate form with self-service data
      setField('idKaryawan', selfServiceLoanInfo.nip || '');
      setField('namaLengkap', selfServiceLoanInfo.full_name || '');
      setField('departemen', selfServiceLoanInfo.department_name || '');
      setField('posisi', selfServiceLoanInfo.position_name || '');
      setField('gajiPokok', selfServiceLoanInfo.basic_salary || 0);
      setField('tanggalPengajuan', selfServiceLoanInfo.tanggal_pengajuan || '');
    }
  }, [selfServiceLoanInfo, setField]);

  const jenisKasbonOptionsFromApi = useMemo(
    () => loanTypes.map((t) => ({ value: t.id, label: t.name })),
    [loanTypes]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormSubmit = async () => {
    if (!token) {
      console.error('No token found');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        loan_type_id: form.jenisKasbon || '',
        nominal_loan: form.nominalKasbon || 0,
        loan_period: form.periodeCicilan || '',
        loan_description: form.keterangan || '',
        supervisor_approval_file: form.suratPersetujuanAtasan || null,
        supporting_documents: form.dokumenPendukung?.[0] || null,
      };
      
      const success = await updateLoanDetail(token, payload);
      if (success) {
        navigate('/submission-types');
        setTimeout(() => setShowSuccess(true), 300);
      }
    } catch (error) {
      console.error('Failed to submit loan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/submission-types');
  };

  return (
    <>
      <div className="p-6">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-start mb-4">Pengajuan Kasbon</h2>
          <div className="mb-6 rounded-lg bg-[#BCBCBC80] bg-opacity-50 p-4 ">
            <p className="text-center text-sm font-medium">Limit Kasbon Tersedia</p>
            <p className="text-center text-2xl font-bold text-blue-700">Rp.2.000.000</p>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {/* Dokumentasi: Konten ketentuan pengajuan kasbon diperbarui sesuai permintaan */}
            <p>Ketentuan Pengajuan Kasbon :</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Harap melapirkan dokumen yang diminta, yaitu: <span className="font-semibold">Surat Persetujuan Atasan</span> dan <span className="font-semibold">Surat Dokumen Pendukung</span>.</li>
              <li>Hanya format JPG dan PDF yang diperbolehkan. Ukuran maksimum masing-masing dokumen <span className="font-semibold">10MB</span>.</li>
              <li>Contoh <span className="font-semibold">Surat Persetujuan Atasan</span> bisa {' '}
              <a href="#" className="text-brand-600 underline">klik disini</a>.</li>
            </ul>
          </div>
          
          {/* Dokumentasi: Alert error ditampilkan jika form tidak memenuhi syarat */}
          {!isFormValid ? (
            <Alert
              variant="error"
              title="Mohon maaf anda belum memenuhi Syarat dan Ketentuan untuk melakukan pengajuan kasbon."
              message=""
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  <Input placeholder="Masukkan gaji pokok" value={formatCurrency(form.gajiPokok || 0)} onChange={(e) => setField('gajiPokok', parseCurrency(e.target.value) || 0)} disabled/>
                </div>
                <div>
                  <DatePicker id="tanggal-pengajuan-kasbon" label="Tanggal Pengajuan" placeholder="Pilih tanggal" defaultDate={form.tanggalPengajuan} disabled />
                </div>
                <div>
                  <Label>Jenis Kasbon</Label>
                  <Select options={jenisKasbonOptionsFromApi} placeholder="Select" defaultValue={form.jenisKasbon} onChange={(v) => setField('jenisKasbon', v)} />
                </div>
                <div>
                  <Label>Nominal Kasbon <span className="text-xs text-gray-500">(maksimal 25% dari gaji pokok)</span></Label>
                  <Input placeholder="Inputan" value={formatCurrency(form.nominalKasbon || 0)} onChange={(e) => setField('nominalKasbon', parseCurrency(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Periode Cicilan</Label>
                  <Select options={periodeOptions} placeholder="Pilihan Menyesuaikan sisa kontrak" defaultValue={form.periodeCicilan} onChange={(v) => setField('periodeCicilan', v)} />
                </div>
                <div>
                  <Label>Surat Persetujuan Atasan</Label>
                  <FileInput onChange={(e) => setField('suratPersetujuanAtasan', e.target.files?.[0] || null)} />
                </div>
                <div className='col-span-2'>
                  <Label>Unggah Dokumen Pendukung (Opsional)</Label>
                  <FileInput multiple onChange={(e) => setField('dokumenPendukung', e.target.files ? Array.from(e.target.files) : [])} />
                </div>
              </div>
              <div>
                <Label>Keterangan</Label>
                <TextArea placeholder="Berikan alasan mendetail..." value={form.keterangan} onChange={(value) => setField('keterangan', value)} rows={4} />
              </div>
            </>
          )}

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
              onClick={handleFormSubmit}
              disabled={submitting || !isFormValid || isSubmitting}
              className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      <PopupBerhasil
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Pengajuan Kasbon Berhasil Dikirim"
        description='"Terima kasih, pengajuan Kasbon Anda telah berhasil dikirim dan kini Menunggu Persetujuan. Jika pengajuan diterima maka akan dikonfirmasi Secepatnya oleh HR."'
      />
    </>
  );
};

export default AddCashAdvanceSubmission;
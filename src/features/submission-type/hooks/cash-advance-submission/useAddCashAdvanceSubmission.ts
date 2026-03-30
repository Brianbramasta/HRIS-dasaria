import { useEffect, useMemo, useState } from 'react';

export type PengajuanKasbonForm = {
  idKaryawan: string;
  namaLengkap: string;
  departemen: string;
  posisi: string;
  gajiPokok: number;
  tanggalPengajuan: string;
  jenisKasbon: string;
  nominalKasbon: number;
  periodeCicilan: string;
  nominalCicilan: number;
  suratPersetujuanAtasan?: File | null;
  dokumenPendukung?: File[];
  keterangan: string;
};

export interface UseAddCashAdvanceSubmissionParams {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<PengajuanKasbonForm> | null;
  onSave?: (values: PengajuanKasbonForm) => boolean | Promise<boolean>;
  limitLoan?: number;
}

export function useAddCashAdvanceSubmission({
  isOpen,
  onClose,
  defaultValues,
  onSave,
  limitLoan,
}: UseAddCashAdvanceSubmissionParams) {
  const jenisKasbonOptions = useMemo(
    () => [
      { value: 'Darurat', label: 'Darurat' },
      { value: 'Keperluan Pribadi', label: 'Keperluan Pribadi' },
      { value: 'Medis/Kesehatan', label: 'Medis/Kesehatan' },
      { value: 'Lainnya', label: 'Lainnya' },
    ],
    [],
  );

  const periodeOptions = useMemo(
    () => [
      { value: '3', label: '3 Bulan' },
      { value: '6', label: '6 Bulan' },
      // { value: '12', label: '12 Bulan' },
    ],
    [],
  );

  const initial: PengajuanKasbonForm = useMemo(
    () => ({
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
    }),
    [defaultValues],
  );

  const [form, setForm] = useState<PengajuanKasbonForm>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [isOpen, initial]);

  const setField = (key: keyof PengajuanKasbonForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    // Use limitLoan if available, otherwise fallback to 25% of gaji pokok
    const maxKasbon = limitLoan || 0;
    console.log('maxKasbon', maxKasbon)
    let nominalKasbon = form.nominalKasbon || 0;
    
    // Auto-adjust nominalKasbon if it exceeds the limit
    if (nominalKasbon > maxKasbon) {
      nominalKasbon = Math.floor(maxKasbon);
    }
    
    // Calculate periode cicilan: Nominal kasbon / limitLoan, round up
    let periodeCicilan = '';
    if (maxKasbon > 0 && nominalKasbon > 0) {
      const calculatedPeriode = Math.ceil(nominalKasbon / ((form.gajiPokok || 0) * 0.25));
      periodeCicilan = calculatedPeriode.toString();
    }
    console.log('periode  cicilan', periodeCicilan)
    
    const periode = parseInt(periodeCicilan || '0', 10);
    const nominalCicilan = periode > 0 ? Math.ceil(nominalKasbon / periode) : 0;
    
    setForm((prev) => ({ ...prev, nominalKasbon, periodeCicilan, nominalCicilan }));
  }, [form.gajiPokok, form.nominalKasbon, limitLoan]);

  const isFormValid = useMemo(() => {
    // be:sesuikan jika api sudah ada/jadi
    return true
    return (
      !!form.tanggalPengajuan &&
      !!form.jenisKasbon &&
      form.nominalKasbon > 0 &&
      !!form.periodeCicilan &&
      !!form.suratPersetujuanAtasan &&
      form.keterangan.trim() !== ''
    );
  }, [form]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const ok = onSave ? await onSave(form) : false;
      if (ok) {
        onClose();
        setTimeout(() => setShowSuccessPopup(true), 300);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return {
    jenisKasbonOptions,
    periodeOptions,
    form,
    submitting,
    showSuccessPopup,
    setField,
    isFormValid,
    handleSubmit,
    handleCloseSuccessPopup,
  };
}


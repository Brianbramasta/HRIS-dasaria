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
  onSave?: (values: PengajuanKasbonForm) => void;
}

export function useAddCashAdvanceSubmission({
  isOpen,
  onClose,
  defaultValues,
  onSave,
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
      { value: '12', label: '12 Bulan' },
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
    const maxKasbon = (form.gajiPokok || 0) * 0.25;
    let nominalKasbon = form.nominalKasbon || 0;
    if (nominalKasbon > maxKasbon) {
      nominalKasbon = Math.floor(maxKasbon);
    }
    const periode = parseInt(form.periodeCicilan || '0', 10);
    const nominalCicilan = periode > 0 ? Math.ceil(nominalKasbon / periode) : 0;
    setForm((prev) => ({ ...prev, nominalKasbon, nominalCicilan }));
  }, [form.gajiPokok, form.nominalKasbon, form.periodeCicilan]);

  const isFormValid = useMemo(() => {
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
      if (onSave) onSave(form);
      onClose();
      setTimeout(() => setShowSuccessPopup(true), 300);
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


import { useEffect, useMemo, useState } from 'react';

export type PengunduranDiriForm = {
  idKaryawan: string;
  namaLengkap: string;
  perusahaan: string;
  direktorat: string;
  divisi: string;
  departement: string;
  posisi: string;
  tanggalPengajuan: string;
  alasan: string;
  suratPengunduranDiri?: File | null;
};

export interface UseAddResignationSubmissionParams {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<PengunduranDiriForm> | null;
  onSave?: (values: PengunduranDiriForm) => void;
}

export function useAddResignationSubmission({
  isOpen,
  onClose,
  defaultValues,
  onSave,
}: UseAddResignationSubmissionParams) {
  const initial: PengunduranDiriForm = useMemo(
    () => ({
      idKaryawan: defaultValues?.idKaryawan ?? '',
      namaLengkap: defaultValues?.namaLengkap ?? '',
      perusahaan: defaultValues?.perusahaan ?? '',
      direktorat: defaultValues?.direktorat ?? '',
      divisi: defaultValues?.divisi ?? '',
      departement: defaultValues?.departement ?? '',
      posisi: defaultValues?.posisi ?? '',
      tanggalPengajuan: defaultValues?.tanggalPengajuan ?? '',
      alasan: defaultValues?.alasan ?? '',
      suratPengunduranDiri: defaultValues?.suratPengunduranDiri ?? null,
    }),
    [defaultValues],
  );

  const [form, setForm] = useState<PengunduranDiriForm>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [isOpen, initial]);

  const setField = (key: keyof PengunduranDiriForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
    form,
    submitting,
    showSuccessPopup,
    setField,
    handleSubmit,
    handleCloseSuccessPopup,
  };
}


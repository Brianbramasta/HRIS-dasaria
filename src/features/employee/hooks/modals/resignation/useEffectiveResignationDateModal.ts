import { useEffect, useState } from 'react';
import { formatDateToIndonesian } from '@/utils/formatDate';

type UseEffectiveResignationDateModalParams = {
  isOpen: boolean;
  onSubmit: (tanggalEfektif: string, deskripsi: string) => void;
};

type UseEffectiveResignationDateModalReturn = {
  tanggalEfektif: string;
  tanggalEfektifIso: string;
  deskripsi: string;
  setDeskripsi: (value: string) => void;
  handleDateChange: (selectedDates: Date[]) => void;
  handleSubmit: () => void;
};

export function useEffectiveResignationDateModal({
  isOpen,
  onSubmit,
}: UseEffectiveResignationDateModalParams): UseEffectiveResignationDateModalReturn {
  const [tanggalEfektif, setTanggalEfektif] = useState('');
  const [tanggalEfektifIso, setTanggalEfektifIso] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTanggalEfektif('');
      setTanggalEfektifIso('');
      setDeskripsi('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!tanggalEfektifIso.trim()) {
      return;
    }
    onSubmit(tanggalEfektifIso, deskripsi);
  };

  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0) {
      const date = selectedDates[0];
      const yyyy = String(date.getFullYear());
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const iso = `${yyyy}-${mm}-${dd}`;
      setTanggalEfektifIso(iso);
      setTanggalEfektif(formatDateToIndonesian(iso) || iso);
    }
  };

  return {
    tanggalEfektif,
    tanggalEfektifIso,
    deskripsi,
    setDeskripsi,
    handleDateChange,
    handleSubmit,
  };
}

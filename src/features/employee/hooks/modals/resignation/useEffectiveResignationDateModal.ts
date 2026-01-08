import { useEffect, useState } from 'react';

type UseEffectiveResignationDateModalParams = {
  isOpen: boolean;
  onSubmit: (tanggalEfektif: string, deskripsi: string) => void;
};

type UseEffectiveResignationDateModalReturn = {
  tanggalEfektif: string;
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
  const [deskripsi, setDeskripsi] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTanggalEfektif('');
      setDeskripsi('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!tanggalEfektif.trim()) {
      return;
    }
    onSubmit(tanggalEfektif, deskripsi);
  };

  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0) {
      const date = selectedDates[0];
      const formatted = date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      setTanggalEfektif(formatted);
    }
  };

  return {
    tanggalEfektif,
    deskripsi,
    setDeskripsi,
    handleDateChange,
    handleSubmit,
  };
}

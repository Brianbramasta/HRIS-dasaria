import { useState } from 'react';

interface Params {
  onClose: () => void;
  onSubmit?: (alasanPenolakan: string) => Promise<void>;
}

export default function useRejectionConfirmationKontrakModal({ onClose, onSubmit }: Params) {
  const [alasanPenolakan, setAlasanPenolakan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!alasanPenolakan.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(alasanPenolakan);
      }
      setAlasanPenolakan('');
      onClose();
    } catch (error) {
      console.error('Error submitting rejection:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setAlasanPenolakan('');
    onClose();
  };

  return {
    alasanPenolakan,
    setAlasanPenolakan,
    submitting,
    handleSubmit,
    handleClose,
  };
}


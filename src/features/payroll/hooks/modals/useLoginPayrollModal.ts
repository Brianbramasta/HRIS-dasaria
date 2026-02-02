import { useState } from 'react';
import { useLoginPayrollModalStore } from '@/features/payroll/store/useLoginPayrollModalStore';

export type LoginPayrollFormValues = {
  password: string;
  error: string;
};

interface UseLoginPayrollModalParams {
  onSubmit?: (password: string) => void | Promise<void>;
}

export const useLoginPayrollModal = ({
  onSubmit,
}: UseLoginPayrollModalParams = {}) => {
  const { isOpen, closeModal, setPayrollSession } = useLoginPayrollModalStore();
  const [form, setForm] = useState<LoginPayrollFormValues>({
    password: '',
    error: '',
  });
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof LoginPayrollFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePasswordSubmit = async (password: string) => {
    try {
      // Panggil onSubmit jika ada
      if (onSubmit) {
        await onSubmit(password);
      }

      // Jika berhasil, simpan dummy session ke store
      setPayrollSession({
        token: `payroll_session_${Date.now()}`,
        createdAt: Date.now(),
      });

      // Tutup modal
      closeModal();
    } catch (err) {
      // Error akan dihandle oleh handleSubmit
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.password.trim()) {
      setField('error', 'Password is required');
      return;
    }

    try {
      setField('error', '');
      setLoading(true);

      await handlePasswordSubmit(form.password);

      // Reset form after successful submission
      setForm({ password: '', error: '' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setField('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setForm({ password: '', error: '' });
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    form,
    setField,
    handleSubmit,
    handleClose,
    loading,
  };
};

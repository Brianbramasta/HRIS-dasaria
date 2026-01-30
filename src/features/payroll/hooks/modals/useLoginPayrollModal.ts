import { useState } from 'react';

export type LoginPayrollFormValues = {
  password: string;
  error: string;
};

interface UseLoginPayrollModalParams {
  onSubmit?: (password: string) => void | Promise<void>;
  onClose?: () => void;
}

export const useLoginPayrollModal = ({
  onSubmit,
  onClose,
}: UseLoginPayrollModalParams) => {
  const [form, setForm] = useState<LoginPayrollFormValues>({
    password: '',
    error: '',
  });
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof LoginPayrollFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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

      if (onSubmit) {
        await onSubmit(form.password);
      }

      // Reset form after successful submission
      setForm({ password: '', error: '' });
      onClose?.();
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
    onClose?.();
  };

  return {
    form,
    setField,
    handleSubmit,
    handleClose,
    loading,
  };
};

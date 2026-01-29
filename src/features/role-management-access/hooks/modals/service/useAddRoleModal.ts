import { useEffect, useState } from 'react';

export interface FormValues {
  idKaryawan: string;
  nama: string;
  role: string;
  departemen: string;
  email: string;
  password: string;
}

const emptyForm: FormValues = {
  idKaryawan: '',
  nama: '',
  role: '',
  departemen: '',
  email: '',
  password: '',
};

export function useAddRoleModal(
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (values: FormValues) => void
) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormValues>(emptyForm);

  const handleEmployeeChange = (value: string) => {
    setForm((prev) => ({ ...prev, idKaryawan: value }));
    if (value) {
      setForm((prev) => ({
        ...prev,
        idKaryawan: value,
        nama: 'Nama dari ID ' + value,
        role: 'Staff',
        departemen: 'IT Department',
        email: 'user@example.com',
      }));
    } else {
      setForm(emptyForm);
    }
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
    setForm(emptyForm);
    setShowPassword(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setForm(emptyForm);
      setShowPassword(false);
    }
  }, [isOpen]);

  return {
    showPassword,
    setShowPassword,
    form,
    setForm,
    handleEmployeeChange,
    handleSubmit,
  };
}

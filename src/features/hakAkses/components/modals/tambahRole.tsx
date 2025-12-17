import React, { useState, useEffect } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { EyeCloseIcon, EyeIcon } from '@/icons/index';

interface FormValues {
  idKaryawan: string;
  nama: string;
  role: string;
  departemen: string;
  email: string;
  password: string;
}

interface TambahRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  employeeOptions?: { value: string; label: string }[];
}

const TambahRoleModal: React.FC<TambahRoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employeeOptions = [],
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormValues>({
    idKaryawan: '',
    nama: '',
    role: '',
    departemen: '',
    email: '',
    password: '',
  });

  // Mock data untuk demo - dalam implementasi nyata akan diambil dari API berdasarkan idKaryawan
  const handleEmployeeChange = (value: string) => {
    setForm((prev) => ({ ...prev, idKaryawan: value }));
    
    // Simulasi auto-fill data karyawan
    // Dalam implementasi nyata, panggil API untuk mendapatkan detail karyawan
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
      setForm({
        idKaryawan: '',
        nama: '',
        role: '',
        departemen: '',
        email: '',
        password: '',
      });
    }
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
    // Reset form
    setForm({
      idKaryawan: '',
      nama: '',
      role: '',
      departemen: '',
      email: '',
      password: '',
    });
    setShowPassword(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setForm({
        idKaryawan: '',
        nama: '',
        role: '',
        departemen: '',
        email: '',
        password: '',
      });
      setShowPassword(false);
    }
  }, [isOpen]);

  const content = (
    <div className="space-y-5 grid grid-cols-1 md:grid-cols-2 gap-2">
      <div>
        <Label>Id Karyawan</Label>
        <Select
          options={employeeOptions}
          placeholder="Pilih ID Karyawan"
          onChange={handleEmployeeChange}
          defaultValue={form.idKaryawan}
          required
        />
      </div>

      <div>
        <Label>Nama</Label>
        <Input
          type="text"
          placeholder="Otomatis dari ID"
          value={form.nama}
          readonly
          disabled
        />
      </div>

      <div>
        <Label>Role</Label>
        <Input
          type="text"
          placeholder="Otomatis dari ID"
          value={form.role}
          readonly
          disabled
        />
      </div>

      <div>
        <Label>Departemen</Label>
        <Input
          type="text"
          placeholder="Otomatis dari ID"
          value={form.departemen}
          readonly
          disabled
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="text"
          placeholder="Otomatis dari ID"
          value={form.email}
          readonly
          disabled
        />
      </div>

      <div>
        <Label>Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Masukan Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
          >
            {showPassword ? (
              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            ) : (
              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title="Tambah Super Admin"
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={false}
      maxWidth="max-w-2xl"
      confirmTitleButton="Simpan"
      closeTitleButton="Tutup"
    />
  );
};

export default TambahRoleModal;

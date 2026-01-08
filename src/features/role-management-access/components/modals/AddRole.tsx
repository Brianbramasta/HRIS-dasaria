import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { EyeCloseIcon, EyeIcon } from '@/icons/index';
import { useAddRoleModal, FormValues } from '@/features/role-management-access/hooks/modals/useAddRoleModal';

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
  const {
    showPassword,
    setShowPassword,
    form,
    setForm,
    handleEmployeeChange,
    handleSubmit,
  } = useAddRoleModal(isOpen, onClose, onSubmit);

  const content = (
    <div className="space-y-5 grid grid-cols-1 md:grid-cols-2 gap-2">
      <div>
        <Label>NIP</Label>
        <Select
          options={employeeOptions}
          placeholder="Pilih NIP"
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

import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import { EyeCloseIcon, EyeIcon } from '@/icons/index';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import { useAddRoleModal, FormValues } from '@/features/role-management-access/hooks/modals/service/useAddRoleModal';

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
        <SelectField
          label="NIP"
          options={employeeOptions}
          placeholder="Pilih NIP"
          onChange={handleEmployeeChange}
          defaultValue={form.idKaryawan}
          required
        />
      </div>

      <div>
        <InputField
          label="Nama"
          type="text"
          placeholder="Otomatis dari ID"
          value={form.nama}
          readonly
          disabled
        />
      </div>

      <div>
        <InputField
          label="Role"
          type="text"
          placeholder="Otomatis dari ID"
          value={form.role}
          readonly
          disabled
        />
      </div>

      <div>
        <InputField
          label="Departemen"
          type="text"
          placeholder="Otomatis dari ID"
          value={form.departemen}
          readonly
          disabled
        />
      </div>

      <div>
        <InputField
          label="Email"
          type="text"
          placeholder="Otomatis dari ID"
          value={form.email}
          readonly
          disabled
        />
      </div>

      <div>
        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Masukan Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              )}
            </button>
          }
        />
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

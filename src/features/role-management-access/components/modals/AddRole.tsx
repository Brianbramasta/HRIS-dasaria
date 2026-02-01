import React, { useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import { CopyIcon } from '@/icons/index';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import Switch from '@/components/form/switch/Switch';
import { useAddRoleModal, FormValues } from '@/features/role-management-access/hooks/modals/service/useAddRoleModal';
import Label from '@/components/form/Label';

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
  const [isPenggajianActive, setIsPenggajianActive] = useState(false);
  const {
    form,
    setForm,
    handleEmployeeChange,
    handleSubmit,
  } = useAddRoleModal(isOpen, onClose, onSubmit);

  // Generate random password
  const generateRandomPassword = (fieldName: 'password' | 'passwordPenggajian') => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setForm((prev) => ({ ...prev, [fieldName]: result }));
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const content = (
    <div className="space-y-5 grid grid-cols-1 md:grid-cols-2 gap-2">
      <div className="md:col-span-2 flex items-center justify-between gap-3">
        <Label>Akses Penggajian</Label>
        <Switch
        label=''
          defaultChecked={isPenggajianActive}
          onChange={(checked) => setIsPenggajianActive(checked)}
        />
      </div>
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
          type="password"
          placeholder="Masukan Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
          suffix={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => generateRandomPassword('password')}
                className="cursor-pointer"
                title="Generate random password"
              >
                <svg className="fill-gray-500 dark:fill-gray-400 size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4m0 12v4M2 12h4m12 0h4M5.64 5.64l2.83 2.83m5.06 5.06l2.83 2.83M5.64 18.36l2.83-2.83m5.06-5.06l2.83-2.83" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(form.password)}
                className="cursor-pointer"
                title="Copy to clipboard"
              >
                <CopyIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              </button>
            </div>
          }
        />
      </div>

      

      {isPenggajianActive && (
        <div className='md:col-span-2 '>
          <InputField
            label="Password Penggajian"
            type="password"
            placeholder="Masukan Password Penggajian"
            value={form.passwordPenggajian || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, passwordPenggajian: e.target.value }))}
            suffix={
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => generateRandomPassword('passwordPenggajian')}
                  className="cursor-pointer"
                  title="Generate random password"
                >
                  <svg className="fill-gray-500 dark:fill-gray-400 size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4m0 12v4M2 12h4m12 0h4M5.64 5.64l2.83 2.83m5.06 5.06l2.83 2.83M5.64 18.36l2.83-2.83m5.06-5.06l2.83-2.83" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(form.passwordPenggajian || '')}
                  className="cursor-pointer"
                  title="Copy to clipboard"
                >
                  <CopyIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                </button>
              </div>
            }
          />
        </div>
      )}
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

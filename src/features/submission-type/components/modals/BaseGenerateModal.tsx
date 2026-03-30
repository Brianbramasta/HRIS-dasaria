import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import SelectField from '@/components/shared/field/SelectField';
import InputField from '@/components/form/input/InputField';
import DateField from '@/components/shared/field/DateField';
import Label from '@/components/form/Label';

interface BaseGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitting: boolean;
  title: string;
  showWarning?: boolean;
}

const BaseGenerateModal: React.FC<BaseGenerateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  title,
  showWarning = false
}) => {
  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={onSubmit}
      submitting={submitting}
      confirmTitleButton="Generate Form"
      closeTitleButton="Tutup"
      maxWidth="max-w-2xl"
      content={
        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <SelectField
              label="Nomer/NIP"
              placeholder="Pilih NIP"
              required
              options={[]}
              onChange={() => {}}
            />
          </div>

          <div>
            <Label htmlFor="namaLengkap">Nama Lengkap</Label>
            <InputField
              id="namaLengkap"
              name="namaLengkap"
              placeholder="Nama Lengkap"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="perusahaan">Perusahaan</Label>
            <InputField
              id="perusahaan"
              name="perusahaan"
              placeholder="Perusahaan"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="direktorat">Direktorat</Label>
            <InputField
              id="direktorat"
              name="direktorat"
              placeholder="Direktorat"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="divisi">Divisi</Label>
            <InputField
              id="divisi"
              name="divisi"
              placeholder="Divisi"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="departement">Departement</Label>
            <InputField
              id="departement"
              name="departement"
              placeholder="Departement"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="posisi">Posisi</Label>
            <InputField
              id="posisi"
              name="posisi"
              placeholder="Posisi"
              disabled
            />
          </div>

          <div>
            <DateField
              label="Tanggal Pengajuan"
              id="tanggalPengajuan"
              placeholder="28 Januari 1999"
              disabled
            />
          </div>

          {showWarning && (
            <div className="col-span-2 text-sm text-amber-600 mt-4">
              *Untuk NIP yang muncul hanya karyawan yang sudah memenuhi persyaratan pengajuan kasbon.
            </div>
          )}
        </div>
      }
    />
  );
};

export default BaseGenerateModal;
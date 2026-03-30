import React, { useEffect, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import SelectField from '@/components/shared/field/SelectField';
import InputField from '@/components/form/input/InputField';
import DateField from '@/components/shared/field/DateField';
import Label from '@/components/form/Label';
import { useOrganizationChange } from '@/features/employee/hooks/organization-history/useOrganizationChange';
import { useApiSubmissionType } from '../../hooks/api/useApiSubmissionType';

interface BaseGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
  submitting: boolean;
  title: string;
  showWarning?: boolean;
  submissionType: string;
}

const BaseGenerateModal: React.FC<BaseGenerateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  submitting,
  title,
  showWarning = false,
  submissionType
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [submissionDate, setSubmissionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const { employeeOptions, fetchEmployeeOptions } = useOrganizationChange();
  const { popupDetail, fetchPopupDetail, resetDetail, storeSubmission, fetchIndex } = useApiSubmissionType();

  useEffect(() => {
    if (isOpen) {
      fetchEmployeeOptions();
      setSubmissionDate(new Date().toISOString().split('T')[0]);
    } else {
      resetDetail();
      setSelectedEmployeeId('');
    }
  }, [isOpen, fetchEmployeeOptions, resetDetail]);

  const handleEmployeeSelect = (value: string) => {
    setSelectedEmployeeId(value);
    if (value) {
      fetchPopupDetail(value);
    }
  };

  const handleSubmit = async () => {
    if (selectedEmployeeId && submissionType) {
      const payload = {
        submission: submissionType,
        tanggal_pengajuan: submissionDate
      };
      
      const token = await storeSubmission(selectedEmployeeId, payload);
      if (token) {
        await fetchIndex();
        onSuccess(token);
      }
    }
  };

  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
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
              options={employeeOptions}
              onChange={handleEmployeeSelect}
              defaultValue={selectedEmployeeId}
            />
          </div>

          <div>
            <Label htmlFor="namaLengkap">Nama Lengkap</Label>
            <InputField
              id="namaLengkap"
              name="namaLengkap"
              placeholder="Nama Lengkap"
              disabled
              value={popupDetail?.full_name || ''}
            />
          </div>

          <div>
            <Label htmlFor="perusahaan">Perusahaan</Label>
            <InputField
              id="perusahaan"
              name="perusahaan"
              placeholder="Perusahaan"
              disabled
              value={popupDetail?.company_name || ''}
            />
          </div>

          <div>
            <Label htmlFor="direktorat">Direktorat</Label>
            <InputField
              id="direktorat"
              name="direktorat"
              placeholder="Direktorat"
              disabled
              value={popupDetail?.directorate_name || ''}
            />
          </div>

          <div>
            <Label htmlFor="divisi">Divisi</Label>
            <InputField
              id="divisi"
              name="divisi"
              placeholder="Divisi"
              disabled
              value={popupDetail?.division_name || ''}
            />
          </div>

          <div>
            <Label htmlFor="departement">Departement</Label>
            <InputField
              id="departement"
              name="departement"
              placeholder="Departement"
              disabled
              value={popupDetail?.department_name || ''}
            />
          </div>

          <div>
            <Label htmlFor="posisi">Posisi</Label>
            <InputField
              id="posisi"
              name="posisi"
              placeholder="Posisi"
              disabled
              value={popupDetail?.position_name || ''}
            />
          </div>

          <div>
            <DateField
              label="Tanggal Pengajuan"
              id="tanggalPengajuan"
              placeholder="28 Januari 1999"
              disabled
              defaultDate={submissionDate}
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
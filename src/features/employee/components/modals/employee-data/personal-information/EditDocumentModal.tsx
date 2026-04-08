import React, { useState, useEffect } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import FileInput from '@/components/shared/form/FileInput';
import { setSkFile } from '@/stores/fileStore';

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: number;
    jenisFile?: string;
    tipeFile?: string;
    catatan?: string;
    fileUrl?: string;
  };
  onSubmit: (data: any) => void;
  submitting?: boolean;
}

export default function EditDocumentModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  submitting = false
}: EditDocumentModalProps) {
  const [formData, setFormData] = useState({
    jenisFile: initialData?.jenisFile || '',
    tipeFile: initialData?.tipeFile || '',
    catatan: initialData?.catatan || '',
    file: null as File | null
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        jenisFile: initialData.jenisFile || '',
        tipeFile: initialData.tipeFile || '',
        catatan: initialData.catatan || '',
        file: null as File | null
      });
    }
  }, [initialData]);

  // Reset form data when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        jenisFile: '',
        tipeFile: '',
        catatan: '',
        file: null as File | null
      });
      // Clear the file store to remove file preview
      setSkFile(undefined);
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      file
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      file_type_id: initialData?.id,
      document: formData.file,
      note: formData.catatan
    });
  };

  const content = (
    <div className="space-y-4">
      <InputField
        label="Jenis File"
        value={formData.jenisFile}
        onChange={(e) => handleInputChange('jenisFile', e.target.value)}
        placeholder="Masukkan jenis file"
        disabled
      />

      <InputField
        label="Tipe File"
        value={formData.tipeFile}
        onChange={(e) => handleInputChange('tipeFile', e.target.value)}
        placeholder="Masukkan tipe file"
        disabled
      />

      <TextAreaField
        label="Catatan"
        value={formData.catatan}
        onChange={(value) => handleInputChange('catatan', value)}
        placeholder="Masukkan catatan"
        rows={3}
      />

      <FileInput
        label="Unggah File SK"
        onChange={handleFileChange}
        acceptedFormats={['application/pdf']}
        dragText="Letakkan File ke Sini"
        formatText="Hanya menerima format PDF"
        browseText="Pilih File"
      />
    </div>
  );

  return (
    <ModalAddEdit
      title="Edit Dokumen"
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-md"
      confirmTitleButton="Simpan"
      closeTitleButton="Batal"
      titleAlign="center"
    />
  );
}
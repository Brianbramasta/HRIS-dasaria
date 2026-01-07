import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import FileInput from '@/components/form/input/FileInput';
import { usePersonalDocumentsModal, DocumentRow, PersonalDocumentsForm } from '@/features/employee/hooks/modals/personal-information/usePersonalDocumentsModal';

interface Props {
  isOpen: boolean;
  initialData?: { rows: DocumentRow[] } | null;
  onClose: () => void;
  onSubmit: (data: PersonalDocumentsForm) => void;
  submitting?: boolean;
}

const PersonalDocumentsModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const { title, loadingFields, personalDocuments, legalDocuments, fileMap, handleFileChange, handleSubmit } =
    usePersonalDocumentsModal({ isOpen, initialData, onSubmit });

  const renderDocumentField = (doc: any) => {
    const currentFile = fileMap[doc.id];
    return (
      <div key={doc.id} className="w-full">
        <Label className="mb-2 block">
          Upload {doc.document_name}
          {doc.is_mandatory === 1 ? null : (
            <span className="text-gray-400 ml-1 font-normal text-sm">(opsional)</span>
          )}
        </Label>
        <div className="relative">
          <FileInput 
            multiple={false} 
            onChange={(e) => handleFileChange(doc.id, e)} 
          />
          {currentFile?.fileName && (
            <p className="text-xs text-green-600 mt-1 truncate">
              {currentFile.file ? 'File baru: ' : 'File saat ini: '} {currentFile.fileName}
            </p>
          )}
        </div>
      </div>
    );
  };

  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-start">{title}</h2>
        <h4 className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</h4>
      </div>
      
      {loadingFields ? (
        <div className="text-center py-8 text-gray-500">Memuat konfigurasi dokumen...</div>
      ) : (
        <>
          {personalDocuments.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">Berkas / Dokumen Karyawan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {personalDocuments.map(renderDocumentField)}
              </div>
            </div>
          )}

          {legalDocuments.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">Berkas / Dokumen Legal</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {legalDocuments.map(renderDocumentField)}
              </div>
            </div>
          )}

          {personalDocuments.length === 0 && legalDocuments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada dokumen yang perlu diunggah untuk kategori karyawan ini.
            </div>
          )}
        </>
      )}

      {/* <div className="mt-8 flex justify-end gap-3">
         <Button variant="secondary" onClick={onClose}>Tutup</Button>
         <Button variant="primary" onClick={handleSubmit} disabled={loadingFields || submitting}>Simpan Perubahan</Button>
      </div> */}
    </div>
  );

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default PersonalDocumentsModal;

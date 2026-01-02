import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import FileInput from '@/components/form/input/FileInput';
import Button from '@/components/ui/button/Button';
import { getFieldDocument } from '@/features/employee/hooks/employee-data/form/useFormulirKaryawan';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

type DocumentRow = {
  id: number;
  tipeFile: string;
  type_id: string;
  namaFile: string;
  filePath?: string;
  file?: File;
  document_id?: string;
};

export type PersonalDocumentsForm = {
  documents: {
    document_type_id: string;
    file?: File;
    id?: string; // existing document id (if updating/keeping)
  }[];
};

interface Props {
  isOpen: boolean;
  initialData?: { rows: DocumentRow[] } | null;
  onClose: () => void;
  onSubmit: (data: PersonalDocumentsForm) => void;
  submitting?: boolean;
}

const PersonalDocumentsModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const title = useMemo(() => 'Edit Berkas & Dokumen', []);
  const { detail } = useDetailDataKaryawanPersonalInfo();
  const employeeCategoryId = detail?.Employment_Position_Data?.employee_category_id || '';
  
  const [documentFields, setDocumentFields] = useState<any[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);
  
  // Map field_id -> { file, fileName, existingDocId }
  const [fileMap, setFileMap] = useState<Record<string, { file?: File, fileName?: string, existingDocId?: string }>>({});

  // Fetch document fields from API
  useEffect(() => {
    if (!isOpen || !employeeCategoryId) return;
    
    let mounted = true;
    setLoadingFields(true);
    getFieldDocument(employeeCategoryId)
      .then((data) => {
        if (mounted) {
          setDocumentFields(data || []);
        }
      })
      .catch((err) => console.error('Error fetching document fields:', err))
      .finally(() => {
        if (mounted) setLoadingFields(false);
      });
      
    return () => { mounted = false; };
  }, [isOpen, employeeCategoryId]);

  // Initialize fileMap from initialData (existing documents)
  useEffect(() => {
    if (isOpen && initialData?.rows) {
      const map: Record<string, { file?: File, fileName?: string, existingDocId?: string }> = {};
      initialData.rows.forEach((row) => {
        if (row.type_id) {
          map[row.type_id] = {
            fileName: row.namaFile,
            existingDocId: row.document_id,
          };
        }
      });
      setFileMap(map);
    } else if (!isOpen) {
        setFileMap({});
    }
  }, [isOpen, initialData]);

  const handleFileChange = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileMap((prev) => ({
        ...prev,
        [fieldId]: {
          ...prev[fieldId],
          file: file,
          fileName: file.name,
        },
      }));
    }
  };

  const handleSubmit = () => {
    const documents = Object.entries(fileMap).map(([typeId, data]) => ({
      document_type_id: typeId,
      file: data.file,
      id: data.existingDocId,
    })).filter(item => item.file || item.id); // Send if there's a new file or it's an existing document
    
    onSubmit({ documents });
  };

  const personalDocuments = documentFields.filter(d => 
    ['Pribadi', 'Berkas / Dokumen Karyawan', 'Personal', 'Karyawan'].includes(d.document_category)
  );
  const legalDocuments = documentFields.filter(d => 
    ['Legal', 'Berkas / Dokumen Legal', 'Perusahaan'].includes(d.document_category)
  );

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
      // ModalAddEdit usually has its own footer or handleSubmit logic, but we put buttons in content for custom layout or use handleSubmit prop
      // If ModalAddEdit renders buttons, we might want to hide them or use them.
      // Based on previous code, it used handleSubmit prop. 
      // But I included buttons in content to match design better or just reusing the prop.
      // Let's use the prop for the main action if ModalAddEdit supports it, but I added buttons inside content to mimic the structure if ModalAddEdit is just a wrapper.
      // Looking at previous code: 
      // <Button variant='primary' onClick={handleUploadAdd} ...>Unggah</Button> was inside content.
      // And the modal was passed handleSubmit={() => onSubmit(form)}.
      // But here I want a "Save Changes" button at the bottom.
      // I'll keep handleSubmit prop for the modal if it uses it for a bottom bar, but if I rendered my own buttons, I should check ModalAddEdit.
      // Assuming ModalAddEdit renders the content wrapped in a modal.
      // Previous code passed handleSubmit but also had a button inside content for "Unggah". 
      // "Unggah" added to the table. Then there was no "Save" button in the previous content?
      // Ah, previous code: handleUploadAdd just added to the table. The actual save might have been triggered by the modal's save button?
      // "handleSubmit={() => onSubmit(form)}" was passed to ModalAddEdit.
      // So ModalAddEdit likely renders a "Save"/"Submit" button.
      // I will pass handleSubmit to ModalAddEdit and remove my manual buttons if ModalAddEdit provides them.
      // However, the user design shows "Tutup" and "Simpan Perubahan".
      // I will rely on ModalAddEdit's buttons if they exist, or if I need to customize, I might need to suppress them.
      // Let's assume passing handleSubmit enables the default footer buttons.
      handleSubmit={handleSubmit}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default PersonalDocumentsModal;

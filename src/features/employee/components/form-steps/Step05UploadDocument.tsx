import React from 'react';
import FIleField from '../../../../components/shared/field/FIleField';
import { useStep5Data } from '../../hooks/employee-data/form/useFromStep';

export const Step05UploadDocument: React.FC = () => {
  
  const { personalDocuments, legalDocuments, loading, handleFileChange, renderDocumentField } = useStep5Data();

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Memuat data dokumen...</div>;
  }

  const renderDocumentFieldJSX = (doc: any) => {
    const fieldConfig = renderDocumentField(doc);
    
    return (
      <div key={doc.id} className="w-full">
        <div className="relative">
          <FIleField
            label={
              <>
                Upload {doc.document_name}
              </>
            }
            infoText={doc.description}
            multiple={false}
            acceptedFormats={fieldConfig.acceptedFormats}
            onChange={(e) => handleFileChange(doc.id, e)}
            onInfoClick={fieldConfig.handleInfoClick}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {personalDocuments.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">Berkas / Dokumen Karyawan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personalDocuments.map(renderDocumentFieldJSX)}
          </div>
        </div>
      )}

      {legalDocuments.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">Berkas / Dokumen Legal</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {legalDocuments.map(renderDocumentFieldJSX)}
          </div>
        </div>
      )}

      {personalDocuments.length === 0 && legalDocuments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada dokumen yang perlu diunggah untuk kategori karyawan ini.
        </div>
      )}
    </div>
  );
};

export default Step05UploadDocument;

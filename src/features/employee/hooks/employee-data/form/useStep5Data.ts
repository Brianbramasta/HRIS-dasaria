import { useState, useEffect } from 'react';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import { getFieldDocument } from './useFormulirKaryawan';
import { DocumentItem } from '../../../types/FormEmployee';
import { useAuthStore } from '../../../../auth/stores/AuthStore';

// digunakan di form 5
export const useStep5Data = () => {
  const { formData, updateStep4 } = useFormulirKaryawanStore();
  const { isAuthenticated } = useAuthStore();
  const step3 = formData.step3Employee;
  const step4 = formData.step4;
  const categoryId = step3.kategoriKaryawan;

  const [documentFields, setDocumentFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      // console.warn('useStep5Data: No categoryId found (step3Employee.kategoriKaryawan is empty). Cannot fetch documents.');
      return;
    }
    
   
    
    let mounted = true;
    setLoading(true);
    //console.log(`useStep5Data: Fetching documents for categoryId: ${categoryId}`);
    
    getFieldDocument(isAuthenticated ? categoryId : '')
      .then((data) => {
        if (mounted) {
           //console.log('useStep5Data: Documents fetched:', data);
           setDocumentFields(data || []);
        }
      })
      .catch((err) => console.error('useStep5Data: Error fetching document fields:', err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
      
    return () => { mounted = false; };
  }, [categoryId, isAuthenticated]);

  const handleFileChange = (fieldId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const documents = step4.documents || [];
    
    const existingIndex = documents.findIndex((doc: DocumentItem) => doc.tipeFile === fieldId);
    
    let newDocuments = [...documents];
    
    if (file) {
      const newDoc: DocumentItem = {
        tipeFile: fieldId,
        namaFile: file.name,
        file: file,
        filePath: URL.createObjectURL(file),
      };
      
      if (existingIndex >= 0) {
        newDocuments[existingIndex] = newDoc;
      } else {
        newDocuments.push(newDoc);
      }
    } else {
      if (existingIndex >= 0) {
        newDocuments = newDocuments.filter((_, idx) => idx !== existingIndex);
      }
    }
    
    updateStep4({ documents: newDocuments });
  };

  // Filter documents based on category
  // Accommodate potential variations in API response strings
  const personalDocuments = documentFields.filter(d => 
    ['Pribadi', 'Berkas / Dokumen Karyawan', 'Personal', 'Karyawan'].includes(d.document_category)
  );
  const legalDocuments = documentFields.filter(d => 
    ['Legal', 'Berkas / Dokumen Legal', 'Perusahaan'].includes(d.document_category)
  );

  const getFileForField = (fieldId: string) => {
    return step4.documents?.find((doc: DocumentItem) => doc.tipeFile === fieldId);
  };

  return {
    personalDocuments,
    legalDocuments,
    loading,
    handleFileChange,
    getFileForField
  };
};

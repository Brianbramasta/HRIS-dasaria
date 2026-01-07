import { useEffect, useMemo, useState } from 'react';
import { getFieldDocument } from '@/features/employee/hooks/employee-data/form/useFormulirKaryawan';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

export type DocumentRow = {
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
    employee_document_id: string;
    file?: File;
    id?: string;
  }[];
};

type Params = {
  isOpen: boolean;
  initialData?: { rows: DocumentRow[] } | null;
  onSubmit: (data: PersonalDocumentsForm) => void;
};

export function usePersonalDocumentsModal({ isOpen, initialData, onSubmit }: Params) {
  const title = useMemo(() => 'Edit Berkas & Dokumen', []);
  const { detail } = useDetailDataKaryawanPersonalInfo();
  const employeeCategoryId = detail?.Employment_Position_Data?.employee_category_id || '';

  const [documentFields, setDocumentFields] = useState<any[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [fileMap, setFileMap] = useState<Record<string, { file?: File; fileName?: string; existingDocId?: string }>>({});

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
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoadingFields(false);
      });
    return () => {
      mounted = false;
    };
  }, [isOpen, employeeCategoryId]);

  useEffect(() => {
    if (isOpen && initialData?.rows) {
      const map: Record<string, { file?: File; fileName?: string; existingDocId?: string }> = {};
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
    const documents = Object.entries(fileMap)
      .map(([typeId, data]) => ({
        employee_document_id: typeId,
        file: data.file,
        id: data.existingDocId,
      }))
      .filter((item) => item.file || item.id);
    onSubmit({ documents });
  };

  const personalDocuments = documentFields.filter((d) =>
    ['Pribadi', 'Berkas / Dokumen Karyawan', 'Personal', 'Karyawan'].includes(d.document_category)
  );
  const legalDocuments = documentFields.filter((d) => ['Legal', 'Berkas / Dokumen Legal', 'Perusahaan'].includes(d.document_category));

  return {
    title,
    loadingFields,
    personalDocuments,
    legalDocuments,
    fileMap,
    handleFileChange,
    handleSubmit,
  };
}
